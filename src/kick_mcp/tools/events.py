from __future__ import annotations

from fastmcp import Context

from .._mcp import mcp
from ..api import get_api_client


@mcp.tool()
async def kick_get_event_subscriptions(
    ctx: Context = None,
) -> dict:
    """List all current event/webhook subscriptions for the authenticated app.

    Shows which channel events are currently being listened to via webhooks.

    ## Return Format
    {"success": bool, "subscriptions": list}

    ## Examples
    await kick_get_event_subscriptions()
    """
    try:
        client = get_api_client()
        result = await client.get("/events/subscriptions")
        return {
            "success": True,
            "message": "Found event subscriptions.",
            "subscriptions": result.get("data", []),
        }
    except Exception as e:
        return {"success": False, "error": str(e)}
