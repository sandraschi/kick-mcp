from __future__ import annotations

from typing import Annotated

from fastmcp import Context
from pydantic import Field

from .._mcp import mcp
from ..api import get_api_client


@mcp.tool()
async def kick_get_users(
    user_ids: Annotated[
        list[int] | None, Field(description="User IDs to fetch. If empty, returns the authenticated user.")
    ] = None,
    ctx: Context = None,
) -> dict:
    """Get Kick user profile information.

    Returns user ID, display name, email, and profile picture.
    If no IDs provided, returns the currently authenticated user's info.

    ## Return Format
    {"success": bool, "users": list[{"user_id": int, "name": str, "email": str, "profile_picture": str}]}

    ## Examples
    await kick_get_users()
    await kick_get_users(user_ids=[12345, 67890])
    """
    try:
        params = {}
        if user_ids:
            params["id"] = user_ids

        client = get_api_client()
        result = await client.get("/users", params=params)
        return {
            "success": True,
            "message": f"Found {len(result.get('data', []))} user(s).",
            "users": result.get("data", []),
        }
    except Exception as e:
        return {"success": False, "error": str(e)}
