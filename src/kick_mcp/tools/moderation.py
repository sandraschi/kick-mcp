from __future__ import annotations

from typing import Annotated

from fastmcp import Context
from pydantic import Field

from .._mcp import mcp
from ..api import get_api_client


@mcp.tool()
async def kick_ban_user(
    broadcaster_user_id: Annotated[int, Field(description="ID of the broadcaster whose chat to ban from.")],
    user_id: Annotated[int, Field(description="ID of the user to ban.")],
    reason: Annotated[str | None, Field(description="Reason for the ban (max 100 chars).", max_length=100)] = None,
    duration_minutes: Annotated[
        int | None, Field(description="Timeout in minutes (omit for permanent ban).", ge=1, le=10080)
    ] = None,
    ctx: Context = None,
) -> dict:
    """Ban or timeout a user from a broadcaster's chat room.

    Omit duration for a permanent ban. Include it for a timed timeout (1-10080 min).
    Requires the moderation:ban scope.

    ## Return Format
    {"success": bool, "message": str}

    ## Examples
    await kick_ban_user(broadcaster_user_id=123, user_id=456, reason="Spam")
    await kick_ban_user(broadcaster_user_id=123, user_id=456, duration_minutes=60)
    """
    try:
        body = {
            "broadcaster_user_id": broadcaster_user_id,
            "user_id": user_id,
        }
        if reason:
            body["reason"] = reason
        if duration_minutes is not None:
            body["duration"] = duration_minutes

        client = get_api_client()
        await client.post("/moderation/bans", json=body)
        label = f"timed out ({duration_minutes} min)" if duration_minutes else "banned"
        return {"success": True, "message": f"User {label} successfully."}
    except Exception as e:
        return {"success": False, "error": str(e)}


@mcp.tool()
async def kick_unban_user(
    broadcaster_user_id: Annotated[int, Field(description="ID of the broadcaster whose chat to unban from.")],
    user_id: Annotated[int, Field(description="ID of the user to unban.")],
    ctx: Context = None,
) -> dict:
    """Unban or remove a timeout from a user in a broadcaster's chat.

    Requires the moderation:ban scope.

    ## Return Format
    {"success": bool, "message": str}

    ## Examples
    await kick_unban_user(broadcaster_user_id=123, user_id=456)
    """
    try:
        body = {
            "broadcaster_user_id": broadcaster_user_id,
            "user_id": user_id,
        }
        client = get_api_client()
        await client.delete("/moderation/bans", json=body)
        return {"success": True, "message": "User unbanned successfully."}
    except Exception as e:
        return {"success": False, "error": str(e)}
