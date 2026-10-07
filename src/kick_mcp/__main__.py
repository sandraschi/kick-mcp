from __future__ import annotations

import logging
import sys

from .config import get_settings
from .server import (  # noqa: F401 - imports tools, registers @mcp.tool() decorators
    mcp,
)
from .transport import create_argument_parser, run_server

logging.basicConfig(
    level=logging.INFO,
    format="%(levelname)-8s %(name)s: %(message)s",
    stream=sys.stderr,
)


def main() -> None:
    get_settings()  # eager-load settings to fail fast on bad config
    parser = create_argument_parser()
    args = parser.parse_args()
    run_server(args)


if __name__ == "__main__":
    main()
