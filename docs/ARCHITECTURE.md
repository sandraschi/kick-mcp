# Architecture

## Overview

`kick-mcp` is a FastMCP 3.2 server that wraps the [Kick.com Public API](https://docs.kick.com).

It provides an MCP interface for all major Kick API capabilities:
- Content discovery (categories, livestreams)
- Channel management (metadata, stream keys)
- Chat (send, delete messages)
- Moderation (ban, timeout, unban)
- Channel Points / Rewards (CRUD + redemptions)
- Kicks leaderboard
- Event subscriptions (webhooks)

## Project Structure

```
src/kick_mcp/
├── __init__.py      # Package exports
├── __main__.py      # CLI entry point
├── server.py        # FastMCP app + resource registration
├── config.py        # Pydantic-settings config
├── transport.py     # Multi-transport runner (stdio/http/sse)
├── api/
│   ├── __init__.py
│   └── client.py    # KickAPIClient — async httpx wrapper
└── tools/
    ├── __init__.py  # Portmanteau imports for registration
    ├── categories.py
    ├── channels.py
    ├── chat.py
    ├── events.py
    ├── kicks.py
    ├── livestreams.py
    ├── moderation.py
    ├── rewards.py
    └── users.py
```

## Authentication

Two modes:
1. **App Access Token** (OAuth 2.1 client_credentials) — set `KICK_MCP_CLIENT_ID` + `KICK_MCP_CLIENT_SECRET`
2. **Direct Bearer Token** — set `KICK_MCP_ACCESS_TOKEN`

The client auto-acquires tokens on first use via the client_credentials flow.

## Ports

- Backend: `10968` (FastMCP HTTP Streamable)
- Frontend (future): `10969` (Vite dashboard)

See [WEBAPP_PORTS.md](../../mcp-central-docs/operations/WEBAPP_PORTS.md).
