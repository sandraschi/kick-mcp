from __future__ import annotations

from typing import Annotated

from fastmcp import Context
from pydantic import Field

from .._mcp import mcp
from ..api import get_api_client


@mcp.tool()
async def kick_get_channels(
    broadcaster_user_id: Annotated[
        list[int] | None, Field(description="List of broadcaster user IDs (up to 50). Not mixable with slugs.")
    ] = None,
    slug: Annotated[
        list[str] | None, Field(description="List of channel slugs (up to 50, max 25 chars). Not mixable with IDs.")
    ] = None,
    ctx: Context = None,
) -> dict:
    """Get channel information for one or more Kick broadcasters.

    Returns stream status, category, title, subscriber counts, and more.
    If no params provided, returns info for the currently authenticated user.

    ## Return Format
    {"success": bool, "channels": list[{"broadcaster_user_id": int, "slug": str, "stream_title": str, ...}]}

    ## Examples
    await kick_get_channels()
    await kick_get_channels(broadcaster_user_id=[12345])
    await kick_get_channels(slug=["shroud"])
    """
    try:
        params = {}
        if broadcaster_user_id:
            params["broadcaster_user_id"] = broadcaster_user_id
        if slug:
            params["slug"] = slug
        client = get_api_client()
        result = await client.get("/channels", params=params)
        return {
            "success": True,
            "message": f"Found {len(result.get('data', []))} channel(s).",
            "channels": result.get("data", []),
        }
    except Exception as e:
        return {"success": False, "error": str(e)}


@mcp.tool()
async def kick_update_channel(
    stream_title: Annotated[str | None, Field(description="New stream title.")] = None,
    category_id: Annotated[int | None, Field(description="New category ID for the stream.")] = None,
    custom_tags: Annotated[list[str] | None, Field(description="Up to 10 custom tags.")] = None,
    ctx: Context = None,
) -> dict:
    """Update the authenticated broadcaster's livestream metadata.

    At least one field (title, category, tags) must be provided.
    Requires the channel:write scope.

    ## Return Format
    {"success": bool, "message": str}

    ## Examples
    await kick_update_channel(stream_title="Hello from MCP!")
    await kick_update_channel(stream_title="New title", category_id=123, custom_tags=["funny", "gaming"])
    """
    try:
        body = {}
        if stream_title is not None:
            body["stream_title"] = stream_title
        if category_id is not None:
            body["category_id"] = category_id
        if custom_tags is not None:
            body["custom_tags"] = custom_tags
        if not body:
            return {"success": False, "error": "At least one field (title, category_id, custom_tags) is required."}
        client = get_api_client()
        await client.patch("/channels", json=body)
        return {
            "success": True,
            "message": "Channel updated successfully.",
        }
    except Exception as e:
        return {"success": False, "error": str(e)}


@mcp.tool()
async def kick_get_stream_key(
    ctx: Context = None,
) -> dict:
    """Get the authenticated broadcaster's stream URL and stream key.

    Requires the streamkey:read scope.

    ## Return Format
    {"success": bool, "stream_key": {"url": str, "key": str}}

    ## Examples
    await kick_get_stream_key()
    """
    try:
        client = get_api_client()
        result = await client.get("/stream-key")
        return {
            "success": True,
            "message": "Stream key retrieved.",
            "stream_key": result.get("data"),
        }
    except Exception as e:
        return {"success": False, "error": str(e)}
