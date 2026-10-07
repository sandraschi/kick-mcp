from __future__ import annotations

from typing import Annotated

from fastmcp import Context
from pydantic import Field

from .._mcp import mcp
from ..api import get_api_client


@mcp.tool()
async def kick_send_chat_message(
    content: Annotated[str, Field(description="Message content (max 500 characters).", max_length=500)],
    type: Annotated[str, Field(description="Sender type.", pattern="^(user|bot)$")] = "bot",
    broadcaster_user_id: Annotated[
        int | None, Field(description="Target broadcaster ID (required for user type, ignored for bot).")
    ] = None,
    reply_to_message_id: Annotated[str | None, Field(description="ID of a message to reply to.")] = None,
    ctx: Context = None,
) -> dict:
    """Post a chat message to a Kick channel.

    Send as a bot (default) or as a user. Bot messages always go to the channel
    attached to your token. User messages require broadcaster_user_id.

    ## Return Format
    {"success": bool, "message_id": str | None}

    ## Examples
    await kick_send_chat_message(content="Hello chat!")
    await kick_send_chat_message(content="Hi!", type="user", broadcaster_user_id=12345)
    """
    try:
        body = {
            "content": content,
            "type": type,
        }
        if broadcaster_user_id is not None:
            body["broadcaster_user_id"] = broadcaster_user_id
        if reply_to_message_id:
            body["reply_to_message_id"] = reply_to_message_id

        client = get_api_client()
        result = await client.post("/chat", json=body)
        data = result.get("data", {})
        return {
            "success": data.get("is_sent", False),
            "message": "Message sent." if data.get("is_sent") else "Message was not sent.",
            "message_id": data.get("message_id"),
        }
    except Exception as e:
        return {"success": False, "error": str(e)}


@mcp.tool()
async def kick_delete_chat_message(
    message_id: Annotated[str, Field(description="UUID of the chat message to delete.")],
    ctx: Context = None,
) -> dict:
    """Delete a chat message from a Kick channel.

    Requires the moderation:chat_message:manage scope.

    ## Return Format
    {"success": bool, "message": str}

    ## Examples
    await kick_delete_chat_message(message_id="550e8400-e29b-41d4-a716-446655440000")
    """
    try:
        client = get_api_client()
        await client.delete(f"/chat/{message_id}")
        return {"success": True, "message": "Chat message deleted."}
    except Exception as e:
        return {"success": False, "error": str(e)}
