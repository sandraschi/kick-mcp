Param([switch]$Headless)

$WebPort = 10968
$FleetStartPath = Join-Path $ProjectRoot "scripts\FleetStartMode.ps1"
if (-not (Test-Path -LiteralPath $FleetStartPath)) {
    Write-Host "ERROR: Missing vendored launcher helper: $FleetStartPath" -ForegroundColor Red
    exit 1
}
. $FleetStartPath


# --- SOTA Headless Standard ---
if ($Headless -and ($Host.UI.RawUI.WindowTitle -notmatch 'Hidden')) {
    Start-Process pwsh -ArgumentList '-NoProfile', '-File', $PSCommandPath, '-Headless' -WindowStyle Hidden
    exit
}

# Clear zombie port
Get-NetTCPConnection -LocalPort $WebPort -ErrorAction SilentlyContinue | ForEach-Object {
    Write-Host "Clearing zombie process on port $WebPort (PID $($_.OwningProcess))" -ForegroundColor Yellow
    Stop-Process -Id $_.OwningProcess -Force
}

$env:FASTMCP_LOG_LEVEL = "WARNING"
Write-Host "Starting kick-mcp on port $WebPort..." -ForegroundColor Cyan

Set-Location $PSScriptRoot
uv run -m kick_mcp --http --port $WebPort
