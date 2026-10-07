from __future__ import annotations

from typing import Annotated

from fastmcp import Context
from pydantic import Field

from .._mcp import mcp
from ..api import get_api_client


@mcp.tool()
async def kick_get_leaderboard(
    top: Annotated[int, Field(description="Number of top entries to return (1-100).", ge=1, le=100)] = 10,
    ctx: Context = None,
) -> dict:
    """Get the Kicks leaderboard for the authenticated broadcaster.

    Returns week, month, and lifetime rankings with gifter usernames and amounts.

    ## Return Format
    {"success": bool, "leaderboard": {"week": list, "month": list, "lifetime": list}}

    ## Examples
    await kick_get_leaderboard()
    await kick_get_leaderboard(top=25)
    """
    try:
        client = get_api_client()
        result = await client.get("/kicks/leaderboard", params={"top": top})
        return {
            "success": True,
            "message": "Leaderboard retrieved.",
            "leaderboard": result.get("data"),
        }
    except Exception as e:
        return {"success": False, "error": str(e)}
