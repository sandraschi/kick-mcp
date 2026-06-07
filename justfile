# Open the interactive recipe dashboard in the browser
default:
    @just --list

# Install dependencies
sync:
    uv sync

# Lint all Python files
lint:
    ruff check src/
    ruff format --check src/

# Auto-fix lint issues
fix:
    ruff check --fix src/
    ruff format src/

# Run MCP server in stdio mode
stdio:
    uv run -m kick_mcp --stdio

# Serve via HTTP
serve:
    uv run -m kick_mcp --http --port 10968

# Run tests
test:
    uv run pytest

# Update all deps
vendor:
    uv sync --upgrade

