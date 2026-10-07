from __future__ import annotations

import logging

import httpx

from ..config import get_settings

logger = logging.getLogger("kick-mcp")


class KickAPIClient:
    """Async HTTP client for the Kick.com Public API."""

    def __init__(self) -> None:
        settings = get_settings()
        self.api_base = settings.api_base_url
        self.oauth_base = settings.oauth_base_url
        self.timeout = settings.timeout
        self._access_token: str | None = None
        self._client: httpx.AsyncClient | None = None
        self._token_expires_at: float | None = None

    async def _ensure_token(self) -> str:
        """Return a valid Bearer token, acquiring one if needed."""
        if self._access_token:
            return self._access_token

        settings = get_settings()

        # Pre-configured token takes precedence
        if settings.access_token:
            self._access_token = settings.access_token
            return self._access_token

        # App Access Token via OAuth 2.1 client_credentials
        if settings.client_id and settings.client_secret:
            async with httpx.AsyncClient() as oauth_client:
                resp = await oauth_client.post(
                    f"{self.oauth_base}/oauth/token",
                    data={
                        "grant_type": "client_credentials",
                        "client_id": settings.client_id,
                        "client_secret": settings.client_secret,
                    },
                )
                resp.raise_for_status()
                body = resp.json()
                self._access_token = body["access_token"]
                return self._access_token

        raise RuntimeError(
            "No Kick API credentials configured. "
            "Set KICK_MCP_CLIENT_ID + KICK_MCP_CLIENT_SECRET "
            "or KICK_MCP_ACCESS_TOKEN in .env"
        )

    async def _get_client(self) -> httpx.AsyncClient:
        if self._client is None:
            token = await self._ensure_token()
            self._client = httpx.AsyncClient(
                base_url=self.api_base,
                headers={"Authorization": f"Bearer {token}"},
                timeout=self.timeout,
            )
        return self._client

    async def get(self, path: str, params: dict | None = None) -> dict:
        c = await self._get_client()
        resp = await c.get(f"/public/v1{path}", params=params)
        resp.raise_for_status()
        return resp.json()

    async def get_v2(self, path: str, params: dict | None = None) -> dict:
        c = await self._get_client()
        resp = await c.get(f"/public/v2{path}", params=params)
        resp.raise_for_status()
        return resp.json()

    async def post(self, path: str, json: dict | None = None) -> dict:
        c = await self._get_client()
        resp = await c.post(f"/public/v1{path}", json=json)
        resp.raise_for_status()
        if resp.status_code == 204:
            return {"success": True}
        return resp.json()

    async def patch(self, path: str, json: dict | None = None) -> dict:
        c = await self._get_client()
        resp = await c.patch(f"/public/v1{path}", json=json)
        if resp.status_code == 204:
            return {"success": True}
        resp.raise_for_status()
        return resp.json()

    async def delete(self, path: str, json: dict | None = None) -> dict:
        c = await self._get_client()
        resp = await c.request("DELETE", f"/public/v1{path}", json=json)
        if resp.status_code == 204:
            return {"success": True, "message": "Deleted successfully"}
        resp.raise_for_status()
        return resp.json()

    async def close(self) -> None:
        if self._client:
            await self._client.aclose()
            self._client = None


_api_client: KickAPIClient | None = None


def get_api_client() -> KickAPIClient:
    global _api_client
    if _api_client is None:
        _api_client = KickAPIClient()
    return _api_client
