from __future__ import annotations

from typing import Annotated

from fastmcp import Context
from pydantic import Field

from .._mcp import mcp
from ..api import get_api_client


@mcp.tool()
async def kick_get_channel_rewards(
    ctx: Context = None,
) -> dict:
    """List all channel point rewards for the authenticated broadcaster's channel.

    Returns up to 15 rewards (enabled and disabled).

    ## Return Format
    {"success": bool, "rewards": list[{"id": str, "title": str, "cost": int, ...}]}

    ## Examples
    await kick_get_channel_rewards()
    """
    try:
        client = get_api_client()
        result = await client.get("/channels/rewards")
        return {
            "success": True,
            "message": f"Found {len(result.get('data', []))} reward(s).",
            "rewards": result.get("data", []),
        }
    except Exception as e:
        return {"success": False, "error": str(e)}


@mcp.tool()
async def kick_create_channel_reward(
    title: Annotated[str, Field(description="Reward title (max 50 chars).", max_length=50)],
    cost: Annotated[int, Field(description="Channel point cost (minimum 1).", ge=1)],
    description: Annotated[str | None, Field(description="Reward description (max 200 chars).", max_length=200)] = None,
    background_color: Annotated[str | None, Field(description="Hex background color (e.g. '#00e701').")] = "#00e701",
    is_enabled: Annotated[bool, Field(description="Whether the reward is enabled.")] = True,
    is_user_input_required: Annotated[bool, Field(description="Whether user input is required.")] = False,
    should_redemptions_skip_request_queue: Annotated[bool, Field(description="Skip approval queue.")] = False,
    ctx: Context = None,
) -> dict:
    """Create a new channel point reward for the authenticated broadcaster.

    Maximum 15 rewards per channel (including disabled). Only the creating
    app can manage the reward later.

    ## Return Format
    {"success": bool, "reward": {...}}

    ## Examples
    await kick_create_channel_reward(title="Play a game", cost=500)
    await kick_create_channel_reward(title="Say hi!", cost=100, description="I'll say hi on stream")
    """
    try:
        body = {
            "title": title,
            "cost": cost,
            "background_color": background_color,
            "is_enabled": is_enabled,
            "is_user_input_required": is_user_input_required,
            "should_redemptions_skip_request_queue": should_redemptions_skip_request_queue,
        }
        if description is not None:
            body["description"] = description

        client = get_api_client()
        result = await client.post("/channels/rewards", json=body)
        return {
            "success": True,
            "message": f"Reward '{title}' created.",
            "reward": result.get("data"),
        }
    except Exception as e:
        return {"success": False, "error": str(e)}


@mcp.tool()
async def kick_update_channel_reward(
    reward_id: Annotated[str, Field(description="ULID of the reward to update.")],
    title: Annotated[str | None, Field(description="New title (max 50 chars).", max_length=50)] = None,
    cost: Annotated[int | None, Field(description="New point cost.", ge=1)] = None,
    description: Annotated[str | None, Field(description="New description (max 200 chars).", max_length=200)] = None,
    background_color: Annotated[str | None, Field(description="New hex background color.")] = None,
    is_enabled: Annotated[bool | None, Field(description="Enable or disable the reward.")] = None,
    is_paused: Annotated[bool | None, Field(description="Pause or unpause the reward.")] = None,
    is_user_input_required: Annotated[bool | None, Field(description="Require user input.")] = None,
    should_redemptions_skip_request_queue: Annotated[bool | None, Field(description="Skip approval queue.")] = None,
    ctx: Context = None,
) -> dict:
    """Update an existing channel point reward.

    Only the app that created the reward can update it.

    ## Return Format
    {"success": bool, "reward": {...}}

    ## Examples
    await kick_update_channel_reward(reward_id="01ABCDEF...", cost=1000)
    await kick_update_channel_reward(reward_id="01ABCDEF...", is_enabled=False)
    """
    try:
        body = {}
        if title is not None:
            body["title"] = title
        if cost is not None:
            body["cost"] = cost
        if description is not None:
            body["description"] = description
        if background_color is not None:
            body["background_color"] = background_color
        if is_enabled is not None:
            body["is_enabled"] = is_enabled
        if is_paused is not None:
            body["is_paused"] = is_paused
        if is_user_input_required is not None:
            body["is_user_input_required"] = is_user_input_required
        if should_redemptions_skip_request_queue is not None:
            body["should_redemptions_skip_request_queue"] = should_redemptions_skip_request_queue

        if not body:
            return {"success": False, "error": "At least one field to update is required."}

        client = get_api_client()
        result = await client.patch(f"/channels/rewards/{reward_id}", json=body)
        return {
            "success": True,
            "message": "Reward updated.",
            "reward": result.get("data"),
        }
    except Exception as e:
        return {"success": False, "error": str(e)}


@mcp.tool()
async def kick_delete_channel_reward(
    reward_id: Annotated[str, Field(description="ULID of the reward to delete.")],
    ctx: Context = None,
) -> dict:
    """Delete a channel point reward.

    Only the app that created the reward can delete it.

    ## Return Format
    {"success": bool, "message": str}

    ## Examples
    await kick_delete_channel_reward(reward_id="01ABCDEF...")
    """
    try:
        client = get_api_client()
        await client.delete(f"/channels/rewards/{reward_id}")
        return {"success": True, "message": "Reward deleted."}
    except Exception as e:
        return {"success": False, "error": str(e)}


@mcp.tool()
async def kick_get_channel_reward_redemptions(
    reward_id: Annotated[str | None, Field(description="Optional: filter by reward ULID.")] = None,
    status: Annotated[
        str | None, Field(description="Filter by status.", pattern="^(pending|accepted|rejected)$")
    ] = "pending",
    cursor: Annotated[str | None, Field(description="Pagination cursor from a previous response.")] = None,
    ctx: Context = None,
) -> dict:
    """Get channel point reward redemptions for the authenticated broadcaster.

    Returns redemptions grouped by reward, with pagination support.

    ## Return Format
    {"success": bool, "redemptions": list, "pagination": {"next_cursor": str | None}}

    ## Examples
    await kick_get_channel_reward_redemptions()
    await kick_get_channel_reward_redemptions(status="accepted")
    """
    try:
        params: dict = {}
        if reward_id:
            params["reward_id"] = reward_id
        if status:
            params["status"] = status
        if cursor:
            params["cursor"] = cursor

        client = get_api_client()
        result = await client.get("/channels/rewards/redemptions", params=params)
        return {
            "success": True,
            "message": "Found redemptions.",
            "redemptions": result.get("data", []),
            "pagination": result.get("pagination"),
        }
    except Exception as e:
        return {"success": False, "error": str(e)}


@mcp.tool()
async def kick_accept_channel_reward_redemption(
    redemption_ids: Annotated[
        list[str],
        Field(description="Redemption ULIDs to accept (max 25, must be unique).", min_length=1, max_length=25),
    ],
    ctx: Context = None,
) -> dict:
    """Accept pending channel point reward redemptions.

    Max 25 redemptions per request. Returns any that failed.

    ## Return Format
    {"success": bool, "failed": list | None, "message": str}

    ## Examples
    await kick_accept_channel_reward_redemption(redemption_ids=["01ABCDEF..."])
    """
    try:
        body = {"ids": redemption_ids}
        client = get_api_client()
        result = await client.post("/channels/rewards/redemptions/accept", json=body)
        failed = result.get("data", [])
        if failed:
            return {
                "success": True,
                "message": f"{len(redemption_ids) - len(failed)} accepted, {len(failed)} failed.",
                "failed": failed,
            }
        return {
            "success": True,
            "message": f"All {len(redemption_ids)} redemption(s) accepted.",
        }
    except Exception as e:
        return {"success": False, "error": str(e)}


@mcp.tool()
async def kick_reject_channel_reward_redemption(
    redemption_ids: Annotated[
        list[str],
        Field(description="Redemption ULIDs to reject (max 25, must be unique).", min_length=1, max_length=25),
    ],
    ctx: Context = None,
) -> dict:
    """Reject pending channel point reward redemptions.

    Max 25 redemptions per request. Returns any that failed.

    ## Return Format
    {"success": bool, "failed": list | None, "message": str}

    ## Examples
    await kick_reject_channel_reward_redemption(redemption_ids=["01ABCDEF..."])
    """
    try:
        body = {"ids": redemption_ids}
        client = get_api_client()
        result = await client.post("/channels/rewards/redemptions/reject", json=body)
        failed = result.get("data", [])
        if failed:
            return {
                "success": True,
                "message": f"{len(redemption_ids) - len(failed)} rejected, {len(failed)} failed.",
                "failed": failed,
            }
        return {
            "success": True,
            "message": f"All {len(redemption_ids)} redemption(s) rejected.",
        }
    except Exception as e:
        return {"success": False, "error": str(e)}
