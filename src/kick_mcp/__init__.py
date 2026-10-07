"""kick-mcp: FastMCP 3.2 server wrapping the Kick.com streaming platform API."""

__version__ = "0.1.0"
__author__ = "Sandra Schipal"

from ._mcp import mcp
from .config import KickMCPSettings, get_settings

__all__ = [
    "KickMCPSettings",
    "get_settings",
    "mcp",
]
