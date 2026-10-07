# MCP Server

## Transports

The server supports three transports:

| Flag | Transport | Use Case |
|------|-----------|----------|
| `--stdio` | STDIO (JSON-RPC) | MCP clients (Cursor, Claude Desktop) |
| `--http` | Streamable HTTP | Web apps, REST clients |
| `--sse` | SSE (legacy) | Legacy MCP clients |

## CLI Usage

```bash
# STDIO mode (for MCP clients)
uv run -m kick_mcp --stdio

# HTTP mode
uv run -m kick_mcp --http --port 10968

# SSE mode
uv run -m kick_mcp --sse --port 10968
```

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `KICK_MCP_CLIENT_ID` | — | OAuth 2.1 client ID |
| `KICK_MCP_CLIENT_SECRET` | — | OAuth 2.1 client secret |
| `KICK_MCP_ACCESS_TOKEN` | — | Direct Bearer token |
| `KICK_MCP_HOST` | `127.0.0.1` | Bind address |
| `KICK_MCP_PORT` | `10968` | HTTP/SSE port |
| `KICK_MCP_TRANSPORT` | `stdio` | Default transport |
| `KICK_MCP_API_BASE_URL` | `https://api.kick.com` | Kick API base |
| `KICK_MCP_OAUTH_BASE_URL` | `https://id.kick.com` | OAuth server |
| `KICK_MCP_TIMEOUT` | `30` | HTTP timeout (s) |

## Tools

| Tool | Description | Auth |
|------|-------------|------|
| `kick_get_categories` | Search/list streaming categories | Public |
| `kick_get_category` | Get category details + viewer count | Public |
| `kick_get_channels` | Get channel info by IDs or slugs | Public |
| `kick_update_channel` | Update stream title/category/tags | user |
| `kick_get_stream_key` | Get stream URL and key | user |
| `kick_get_livestreams` | Query live streams with filters | Public |
| `kick_get_livestream_stats` | Total live stream count | Public |
| `kick_get_users` | Get user profiles | Public |
| `kick_send_chat_message` | Send chat message (bot or user) | user |
| `kick_delete_chat_message` | Delete a chat message | user |
| `kick_get_channel_rewards` | List channel point rewards | user |
| `kick_create_channel_reward` | Create a channel point reward | user |
| `kick_update_channel_reward` | Update a channel point reward | user |
| `kick_delete_channel_reward` | Delete a channel point reward | user |
| `kick_get_channel_reward_redemptions` | List reward redemptions | user |
| `kick_accept_channel_reward_redemption` | Accept pending redemptions | user |
| `kick_reject_channel_reward_redemption` | Reject pending redemptions | user |
| `kick_ban_user` | Ban/timeout user from chat | user |
| `kick_unban_user` | Unban user from chat | user |
| `kick_get_leaderboard` | Get Kicks gifting leaderboard | user |
| `kick_get_event_subscriptions` | List webhook subscriptions | user |
