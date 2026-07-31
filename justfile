set windows-shell := ["powershell.exe", "-NoProfile", "-Command"]

# Open the interactive recipe dashboard in the browser
import 'scripts/just/fleet.just'
# Open the interactive recipe dashboard in the browser
default:
    @just --list

# Install dependencies
sync:
    uv sync

# Lint all Python files
lint:
    uv run ruff check src/
    uv run ruff format --check src/

# Auto-fix lint issues
fix:
    uv run ruff check --fix src/
    uv run ruff format src/

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

# Bootstrap: install dev deps + pre-commit hook
bootstrap:
    uv sync --group dev
    uv run pre-commit install
    Write-Host "Pre-commit hooks installed." -ForegroundColor Green