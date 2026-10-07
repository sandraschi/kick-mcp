from __future__ import annotations

from typing import Annotated

from fastmcp import Context
from pydantic import Field

from .._mcp import mcp
from ..api import get_api_client


@mcp.tool()
async def kick_get_categories(
    query: Annotated[str | None, Field(description="Search query for category names.")] = None,
    limit: Annotated[int, Field(description="Max results (1-1000).", ge=1, le=1000)] = 25,
    cursor: Annotated[str | None, Field(description="Pagination cursor from a previous response.")] = None,
    ctx: Context = None,
) -> dict:
    """Search and list Kick streaming categories (games/activities).

    Use this to discover what categories streamers are broadcasting under.
    Supports pagination - pass the next_cursor from a response to get more.

    ## Return Format
    {"success": bool, "categories": list, "pagination": {"next_cursor": str | None}}

    ## Examples
    await kick_get_categories()
    await kick_get_categories(query="gaming", limit=10)
    """
    try:
        params = {"limit": limit}
        if query:
            params["name"] = query
        if cursor:
            params["cursor"] = cursor
        client = get_api_client()
        result = await client.get_v2("/categories", params=params)
        return {
            "success": True,
            "message": f"Found {len(result.get('data', []))} categories.",
            "categories": result.get("data", []),
            "pagination": result.get("pagination"),
        }
    except Exception as e:
        return {"success": False, "error": str(e)}


@mcp.tool()
async def kick_get_category(
    category_id: Annotated[int, Field(description="Numeric category ID to fetch.")],
    ctx: Context = None,
) -> dict:
    """Get details for a single Kick category by ID.

    Includes viewer_count for live streams in that category.

    ## Return Format
    {"success": bool, "category": {"id": int, "name": str, "tags": list[str], "thumbnail": str, "viewer_count": int}}

    ## Examples
    await kick_get_category(1)
    """
    try:
        client = get_api_client()
        result = await client.get(f"/categories/{category_id}")
        return {
            "success": True,
            "message": f"Category: {result['data']['name']}",
            "category": result.get("data"),
        }
    except Exception as e:
        return {"success": False, "error": str(e)}
