from __future__ import annotations

from typing import Annotated

from fastmcp import Context
from pydantic import Field

from .._mcp import mcp
from ..api import get_api_client


@mcp.tool()
async def kick_get_livestreams(
    broadcaster_user_id: Annotated[
        list[int] | None, Field(description="Filter by broadcaster user IDs (up to 50).")
    ] = None,
    category_id: Annotated[int | None, Field(description="Filter by category ID.")] = None,
    language: Annotated[str | None, Field(description="Filter by language code (e.g. 'en').")] = None,
    limit: Annotated[int, Field(description="Max results (1-100).", ge=1, le=100)] = 25,
    sort: Annotated[
        str | None, Field(description="Sort by viewer_count or started_at.", pattern="^(viewer_count|started_at)$")
    ] = "viewer_count",
    ctx: Context = None,
) -> dict:
    """Query live streams on Kick with optional filters.

    Returns stream title, viewer count, category, language, and more.
    Use broadcaster_user_id to check specific streamers, or leave empty to browse.

    ## Return Format
    {"success": bool, "livestreams": list, "total_count": int | None}

    ## Examples
    await kick_get_livestreams()
    await kick_get_livestreams(category_id=1, limit=10)
    await kick_get_livestreams(language="en", sort="started_at")
    """
    try:
        params: dict = {}
        if broadcaster_user_id:
            params["broadcaster_user_id"] = broadcaster_user_id
        if category_id is not None:
            params["category_id"] = category_id
        if language:
            params["language"] = language
        if limit:
            params["limit"] = limit
        if sort:
            params["sort"] = sort

        client = get_api_client()
        result = await client.get("/livestreams", params=params)
        return {
            "success": True,
            "message": f"Found {len(result.get('data', []))} live stream(s).",
            "livestreams": result.get("data", []),
        }
    except Exception as e:
        return {"success": False, "error": str(e)}


@mcp.tool()
async def kick_get_livestream_stats(
    ctx: Context = None,
) -> dict:
    """Get total live stream count on Kick.

    ## Return Format
    {"success": bool, "total_count": int}

    ## Examples
    await kick_get_livestream_stats()
    """
    try:
        client = get_api_client()
        result = await client.get("/livestreams/stats")
        return {
            "success": True,
            "total_count": result.get("data", {}).get("total_count", 0),
        }
    except Exception as e:
        return {"success": False, "error": str(e)}
