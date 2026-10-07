# kick-mcp User Guide

Kick.com livestream management — categories, channels, livestreams, chat, moderation, channel point rewards, redemptions, leaderboards, events, and users. Control your streaming presence entirely through AI agent interactions.

## Table of Contents

1. Installation
2. Getting Kick API Credentials
3. Quick Start
4. Tutorials (16 walkthroughs)
5. API Reference
6. Authentication Reference
7. Configuration Reference
8. Troubleshooting
9. FAQ

---

## Installation

### Prerequisites
- Python 3.11 or higher
- A Kick.com developer account
- Kick.com OAuth 2.1 client credentials or access token

### Quick Start

```bash
# Clone and enter the repository
git clone https://github.com/sandraschi/kick-mcp.git
cd kick-mcp

# Create your .env file with Kick API credentials
echo "KICK_MCP_CLIENT_ID=your_client_id_here" > .env
echo "KICK_MCP_CLIENT_SECRET=your_client_secret_here" >> .env

# Install all dependencies
uv sync

# Run in stdio mode (default — for Cursor, Claude Desktop)
uv run python -m kick_mcp

# For HTTP transport
uv run python -m kick_mcp --http --port 10968

# For SSE transport (legacy)
uv run python -m kick_mcp --sse --port 10968
```

### MCPB Bundle Installation

```bash
mcpb install kick-mcp-v0.1.0.mcpb
```

## Getting Kick API Credentials

1. Go to https://developer.kick.com/
2. Sign in with your Kick account
3. Click "Create Application"
4. Fill in the application details:
   - Name: "kick-mcp" (or any name)
   - Description: Brief description of your use case
   - Redirect URI: Not needed for MCP (use `http://localhost`)
5. Once created, you will receive:
   - **Client ID**: A public identifier for your app
   - **Client Secret**: A confidential secret (store securely)
6. Optionally generate a long-lived Access Token in the developer dashboard

### Environment Setup

Create your `.env` file using one of these methods:

**Option A: Client Credentials (recommended)**
```
KICK_MCP_CLIENT_ID=your_client_id
KICK_MCP_CLIENT_SECRET=your_client_secret
```

**Option B: Direct Access Token**
```
KICK_MCP_ACCESS_TOKEN=your_long_lived_token
```

## Tutorials

### Tutorial 1: Browse Streaming Categories

Discover what categories are available and which are popular:

```
kick_get_categories(limit=10)
```

This returns the top categories by viewer count. Each category includes an ID, name, tags, thumbnail URL, and live viewer count. Use the category ID to filter streams later.

### Tutorial 2: Search for a Specific Category

```
kick_get_categories(query="gaming", limit=5)
kick_get_categories(query="music", limit=5)
```

### Tutorial 3: Get Category Details

```
kick_get_category(category_id=1)
```

### Tutorial 4: Get Your Channel Info

```
kick_get_channels()
```

Returns your channel's stream status, title, category, subscriber count, and other metadata.

### Tutorial 5: Look Up Any Channel

```
kick_get_channels(slug=["shroud"])
kick_get_channels(broadcaster_user_id=[12345])
```

### Tutorial 6: Update Your Stream Title

```
kick_update_channel(stream_title="Hello from MCP — AI-powered streaming!")
```

### Tutorial 7: Full Stream Configuration

Set title, category, and tags in one call:

```
kick_update_channel(
  stream_title="Weekend Chill Stream",
  category_id=123,
  custom_tags=["chill", "gaming", "community"]
)
```

### Tutorial 8: Get Your Stream Key

```
kick_get_stream_key()
```

Returns your RTMP URL and stream key for use in OBS Studio.

### Tutorial 9: Send Chat Messages

```
# Simple bot message to your own channel
kick_send_chat_message(content="Hello chat! Hello from MCP!")

# Reply to a message
kick_send_chat_message(
  content="Great question!",
  reply_to_message_id="550e8400-e29b-41d4-a716-446655440000"
)

# Send as user to another broadcaster's channel
kick_send_chat_message(
  content="Awesome stream!",
  type="user",
  broadcaster_user_id=12345
)
```

### Tutorial 10: Delete a Chat Message

```
kick_delete_chat_message(message_id="550e8400-e29b-41d4-a716-446655440000")
```

### Tutorial 11: Browse Live Streams

```
# Top streams by viewer count
kick_get_livestreams(limit=10, sort="viewer_count")

# Recent streams
kick_get_livestreams(limit=10, sort="started_at")

# Filter by category
kick_get_livestreams(category_id=1, language="en", limit=5)

# Check specific streamers
kick_get_livestreams(broadcaster_user_id=[12345, 67890])
```

### Tutorial 12: Get Live Stream Stats

```
kick_get_livestream_stats()
```

Returns the total number of active live streams on Kick.

### Tutorial 13: Moderate Users

Ban a spammer permanently:

```
kick_ban_user(broadcaster_user_id=123, user_id=456, reason="Spamming chat links")
```

Timeout for 1 hour:

```
kick_ban_user(broadcaster_user_id=123, user_id=456, reason="Please be respectful", duration_minutes=60)
```

Unban:

```
kick_unban_user(broadcaster_user_id=123, user_id=456)
```

### Tutorial 14: Manage Channel Points Rewards

Create rewards:

```
kick_create_channel_reward(
  title="Play a Game with Me",
  cost=500,
  description="I'll play a game of your choice on stream",
  is_enabled=true
)
```

List, update, and delete:

```
kick_get_channel_rewards()
kick_update_channel_reward(reward_id="01ABCDEF...", cost=1000)
kick_delete_channel_reward(reward_id="01ABCDEF...")
```

### Tutorial 15: Handle Reward Redemptions

View pending and process them:

```
kick_get_channel_reward_redemptions(status="pending")
kick_accept_channel_reward_redemption(redemption_ids=["01ABCDEF..."])
kick_reject_channel_reward_redemption(redemption_ids=["01ABCDEF..."])
```

### Tutorial 16: View Leaderboard and Users

```
# Top Kicks gifters
kick_get_leaderboard(top=10)

# Your profile
kick_get_users()

# Specific users
kick_get_users(user_ids=[12345, 67890])

# Event subscriptions
kick_get_event_subscriptions()
```

## API Reference

| Tool | Kick API Endpoint | Method | Required Scope |
|------|-------------------|--------|----------------|
| kick_get_categories | /public/v2/categories | GET | None |
| kick_get_category | /public/v1/categories/{id} | GET | None |
| kick_get_channels | /public/v1/channels | GET | None |
| kick_update_channel | /public/v1/channels | PATCH | channel:write |
| kick_get_stream_key | /public/v1/stream-key | GET | streamkey:read |
| kick_send_chat_message | /public/v1/chat | POST | chat:write |
| kick_delete_chat_message | /public/v1/chat/{id} | DELETE | moderation:chat_message:manage |
| kick_get_livestreams | /public/v1/livestreams | GET | None |
| kick_get_livestream_stats | /public/v1/livestreams/stats | GET | None |
| kick_ban_user | /public/v1/moderation/bans | POST | moderation:ban |
| kick_unban_user | /public/v1/moderation/bans | DELETE | moderation:ban |
| kick_get_channel_rewards | /public/v1/channels/rewards | GET | None |
| kick_create_channel_reward | /public/v1/channels/rewards | POST | channel:write |
| kick_update_channel_reward | /public/v1/channels/rewards/{id} | PATCH | channel:write |
| kick_delete_channel_reward | /public/v1/channels/rewards/{id} | DELETE | channel:write |
| kick_get_channel_reward_redemptions | /public/v1/channels/rewards/redemptions | GET | None |
| kick_accept_channel_reward_redemption | /public/v1/channels/rewards/redemptions/accept | POST | channel:write |
| kick_reject_channel_reward_redemption | /public/v1/channels/rewards/redemptions/reject | POST | channel:write |
| kick_get_leaderboard | /public/v1/kicks/leaderboard | GET | None |
| kick_get_event_subscriptions | /public/v1/events/subscriptions | GET | None |
| kick_get_users | /public/v1/users | GET | None |

## Authentication Reference

The server supports two authentication methods:

1. **OAuth 2.1 Client Credentials** (recommended): The server automatically obtains an App Access Token by exchanging your Client ID and Client Secret at `https://id.kick.com/oauth/token`. The token is cached for the session.

2. **Direct Bearer Token**: A pre-generated token set via `KICK_MCP_ACCESS_TOKEN`. Takes precedence over OAuth credentials if both are set.

**Scopes required by tool category:**
- Channel management: `channel:write`
- Stream key: `streamkey:read`
- Chat: `chat:write`
- Moderation: `moderation:ban`, `moderation:chat_message:manage`
- Rewards: `channel:write` (for create/update/delete)

## Configuration Reference

| Variable | Default | Description |
|----------|---------|-------------|
| KICK_MCP_CLIENT_ID | "" | OAuth 2.1 client ID |
| KICK_MCP_CLIENT_SECRET | "" | OAuth 2.1 client secret |
| KICK_MCP_ACCESS_TOKEN | "" | Direct Bearer token |
| KICK_MCP_HOST | 127.0.0.1 | HTTP bind |
| KICK_MCP_PORT | 10968 | HTTP/SSE port |
| KICK_MCP_TRANSPORT | stdio | Transport mode |
| KICK_MCP_TIMEOUT | 30 | HTTP timeout (s) |

## Troubleshooting

| Problem | Likely Cause | Solution |
|---------|-------------|----------|
| "No Kick API credentials" | .env not configured | Set KICK_MCP_CLIENT_ID + SECRET or KICK_MCP_ACCESS_TOKEN |
| 401 Unauthorized | Token expired or invalid | Regenerate credentials in Kick Developer portal |
| 403 Forbidden | Missing OAuth scope | Add required scope to your app in Kick Developer |
| 404 Not Found | Wrong entity ID | Verify category_id, user_id, reward_id |
| 429 Rate Limited | Too many requests | Implement exponential backoff |
| Chat message not sent | Invalid type/user_id | Use "bot" for own channel or "user" with broadcaster_user_id |
| Ban fails | User already banned | Use kick_unban_user first |
| Reward update fails | Not the creating app | Only the creating app can edit |
| kick_get_channels empty | No auth context | Pass broadcaster_user_id or slug explicitly |
| kick_get_categories returns empty | No results matching query | Broaden search or remove query |

## Kick API Version Notes

The Kick Public API is under active development. Some endpoints use API v1 and others use v2:

- **v2** (`/public/v2`): Categories listing (`kick_get_categories`) — supports search and pagination
- **v1** (`/public/v1`): All other endpoints — channels, livestreams, chat, moderation, rewards, users, events, leaderboard

The API base URL is `https://api.kick.com`. The OAuth token endpoint is at `https://id.kick.com/oauth/token`.

## HTTP Mode Deployment

```bash
# Start with HTTP streamable transport
uv run python -m kick_mcp --http --port 10968

# Start with SSE transport (legacy)
uv run python -m kick_mcp --sse --port 10968

# Custom bind address
uv run python -m kick_mcp --http --host 0.0.0.0 --port 10968
```

No health endpoint is exposed in HTTP mode. The server handles MCP protocol requests only.

## Docker Deployment

```dockerfile
FROM python:3.12-slim
RUN pip install uv
WORKDIR /app
COPY . .
RUN uv sync
# Run with HTTP transport
CMD ["uv", "run", "python", "-m", "kick_mcp", "--http", "--port", "10968"]
```

## OAuth Token Lifecycle

When using `KICK_MCP_CLIENT_ID` and `KICK_MCP_CLIENT_SECRET`:

1. On first tool call, the server POSTs to `https://id.kick.com/oauth/token` with `grant_type=client_credentials`
2. Kick returns an `access_token` (typically valid for 1 hour)
3. The token is cached in memory for the server's lifetime
4. All subsequent API calls use this Bearer token
5. If the API returns 401, the server clears the cached token and retries the OAuth flow

When using `KICK_MCP_ACCESS_TOKEN`:
1. The token is used directly without OAuth
2. If it expires, the server must be restarted with a new token

## Integration with Streaming Software

The `kick_get_stream_key` tool returns an RTMP URL and stream key. Use these in OBS Studio:

1. Open OBS Studio
2. Go to Settings > Stream
3. Service: Custom
4. Server: (paste the URL from `kick_get_stream_key`)
5. Stream Key: (paste the key from `kick_get_stream_key`)
6. Apply and Start Streaming

The stream key is sensitive — keep it confidential. Anyone with your stream key can stream to your channel.

## Moderation Best Practices

### Progressive Moderation

1. **Warning**: Send a chat message asking the user to stop
2. **Short timeout**: `ban_user(duration_minutes=10)` for minor infractions
3. **Long timeout**: `ban_user(duration_minutes=1440)` for serious infractions
4. **Permanent ban**: `ban_user` without duration for repeat offenders

### Chat Management

- Moderation messages should be sent as `type="bot"` to distinguish them from user messages
- Keep ban reasons professional and factual
- Document moderation actions with the reason field for audit trails

## Reward Management Best Practices

### Creating Engaging Rewards

- Mix cheap rewards (50-200 points) for frequent engagement and expensive rewards (1000+) for special interactions
- Use `is_user_input_required=true` for interactive rewards (song requests, questions)
- Use `should_redemptions_skip_request_queue=true` for instant-gratification rewards (sound effects, alerts)
- Set distinct background colors to make rewards visually distinct on stream

### Managing Redemptions

- Check pending redemptions regularly during streams
- Batch-accept similar redemptions together (up to 25 per call)
- Reject inappropriate redemptions with clear messaging to the user

## API Rate Limiting

The Kick Public API enforces rate limits. Best practices:
- Implement exponential backoff between retries (1s, 2s, 4s, 8s)
- Avoid polling endpoints more than once every 5 seconds
- Batch operations where possible (e.g., process 25 redemptions at once)
- Rate limit errors return HTTP 429 with no additional detail

## Troubleshooting — Extended

| Problem | Likely Cause | Solution |
|---------|-------------|----------|
| "No Kick API credentials configured" | Missing .env file | Create .env with KICK_MCP_CLIENT_ID + KICK_MCP_CLIENT_SECRET |
| "401 Unauthorized" on every call | Token expired or invalid | Check credentials in Kick Developer portal, regenerate if needed |
| "403 Forbidden" on kick_update_channel | Missing channel:write scope | Add scope to your Kick app in developer portal |
| "403 Forbidden" on kick_ban_user | Missing moderation:ban scope | Add moderation:ban scope to your app |
| "404" when getting categories | Category ID doesn't exist | Use kick_get_categories to find valid IDs |
| Chat message "is_sent: false" | Content rejected by Kick | Check content length (max 500) and type parameter |
| kick_send_chat_message fails with "user" type | Missing broadcaster_user_id | Provide broadcaster_user_id for user-type messages |
| kick_get_channels returns empty | No auth'd user or no params | Pass broadcaster_user_id or slug explicitly |
| kick_get_livestreams no results | No matching streams | Broaden filters — remove language/category restrictions |
| Reward creation fails | 15 reward limit reached | Delete unused rewards before creating new ones |
| Redemption accept fails | Already processed | Use kick_get_channel_reward_redemptions to check status |
| kick_get_stream_key fails | Missing streamkey:read scope | Add scope to your Kick app |

## FAQ

**Q: What authentication does the Kick API use?**
A: OAuth 2.1 App Access Token (client_credentials grant) or direct Bearer token.

**Q: How many rewards can I create?**
A: Maximum 15 rewards per channel (including disabled ones).

**Q: How many redemptions can I process at once?**
A: Up to 25 per call. Repeat for larger batches.

**Q: Can I monitor event subscriptions?**
A: `kick_get_event_subscriptions` lists them. Creating webhooks must be done via Kick Developer portal.

**Q: What transport modes are supported?**
A: stdio (default), HTTP streamable (--http), SSE (--sse).

**Q: How do I find my broadcaster_user_id?**
A: Call `kick_get_users()` to get your own user info, or `kick_get_channels(slug=["your_channel_name"])`.

**Q: What is a channel slug?**
A: The URL-friendly version of a channel name (e.g., "shroud" for https://kick.com/shroud).

**Q: Can I use kick-mcp without OAuth credentials?**
A: No. The Kick API requires authentication. You need either OAuth client credentials or a direct Bearer token.

**Q: Does kick-mcp support chat moderation (timeout, slow mode)?**
A: It supports ban/unban with optional duration (timeout). Other chat settings (slow mode, follower-only) are not exposed via the Kick API.

**Q: Are there any read-only tools that don't require OAuth scopes?**
A: Yes — kick_get_categories, kick_get_category, kick_get_channels, kick_get_livestreams, kick_get_livestream_stats, kick_get_leaderboard, kick_get_event_subscriptions, kick_get_users, and kick_get_channel_rewards (list only) can work with just the basic authentication token without specific OAuth scopes.
