from __future__ import annotations

import logging

from . import tools  # noqa: F401 - registers tools via @mcp.tool() decorator
from ._mcp import mcp  # noqa: F401 - re-exported for __init__ and transport

logger = logging.getLogger("kick-mcp")
