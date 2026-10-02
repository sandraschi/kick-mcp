"""Multi-transport runner for kick-mcp."""

from __future__ import annotations

import argparse
import logging

from .config import get_settings
from .server import mcp

logger = logging.getLogger("kick-mcp")


def create_argument_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(description="kick-mcp server")
    parser.add_argument("--stdio", action="store_true", help="Run via STDIO transport")
    parser.add_argument(
        "--http",
        action="store_true",
        help="Run via HTTP Streamable HTTP transport",
    )
    parser.add_argument("--sse", action="store_true", help="Run via SSE transport (legacy)")
    parser.add_argument(
        "--port",
        type=int,
        default=10968,
        help="Port for HTTP/SSE transport",
    )
    parser.add_argument("--host", type=str, default="127.0.0.1")
    return parser


def run_server(args: argparse.Namespace | None = None) -> None:
    settings = get_settings()

    if args is None:
        parser = create_argument_parser()
        args = parser.parse_args()

    host = args.host or settings.host
    port = args.port or settings.port

    if args.http:
        logger.info("Starting kick-mcp via HTTP Streamable HTTP on %s:%s", host, port)
        _run_http(host, port)
    elif args.sse:
        logger.info("Starting kick-mcp via SSE on %s:%s", host, port)
        mcp.run(transport="sse", host=host, port=port)
    else:
        logger.info("Starting kick-mcp via STDIO")
        mcp.run(transport="stdio")


def _run_http(host: str, port: int) -> None:
    """HTTP mode for the fleet webapp: /health plus streamable MCP at /mcp."""
    import uvicorn
    from starlette.applications import Starlette
    from starlette.responses import JSONResponse
    from starlette.routing import Mount, Route

    async def health(request):
        return JSONResponse({"status": "ok", "service": "kick-mcp"})

    mcp_asgi = mcp.http_app(path="/mcp")
    app = Starlette(routes=[Route("/health", health), Mount("/", app=mcp_asgi)])
    uvicorn.run(app, host=host, port=port, log_level="warning")
