"""Bootstrap module: creates the FastMCP instance without importing tools.

This exists solely to break the circular import between server.py and tools/
(tools need to import mcp for @mcp.tool() decorator, server.py needs to import tools).
"""

import logging
import os

from fastmcp import FastMCP
from fastmcp.server import create_proxy

logger = logging.getLogger("kick-mcp")

DESCRIPTION = """Kick.com MCP Server - control livestreams, chat, moderation, channel rewards, and more.

## Authentication
Set up OAuth 2.1 credentials (KICK_MCP_CLIENT_ID + KICK_MCP_CLIENT_SECRET) or a direct
Bearer token (KICK_MCP_ACCESS_TOKEN) in your .env file.

## Tool Categories
- **Discovery**: Browse categories and live streams
- **Channels**: Get/update channel info, stream keys
- **Chat**: Send and delete chat messages
- **Moderation**: Ban/unban users
- **Rewards**: Manage channel point rewards and redemptions
- **Kicks**: View gifting leaderboards
- **Events**: Manage webhook subscriptions
"""

mcp = FastMCP(
    "kick-mcp",
    version="0.1.0",
    instructions=DESCRIPTION,
)

_bridge_proxies = []
bridge_urls = os.getenv("MCP_BRIDGE_URLS", "")
if bridge_urls:
    for url in bridge_urls.split(","):
        url = url.strip()
        if url:
            try:
                mcp.add_provider(create_proxy(url))
                _bridge_proxies.append(url)
            except Exception:
                pass


@mcp.resource("resource://kick/api-summary")
def get_api_summary() -> str:
    """Discoverable summary of the Kick API capabilities."""
    return """The Kick Public API provides access to:
- Categories (gaming/activity categories with viewer counts)
- Channels (stream info, metadata, stream keys)
- Livestreams (live stream directory with filters)
- Chat (send/delete messages)
- Channel Rewards (channel points system)
- Moderation (ban/unban/timeout users)
- Kicks Leaderboard (gifting rankings)
- Events/Webhooks (subscribe to channel events)
"""
