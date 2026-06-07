Param([switch]$Headless)

$WebPort = 10968

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
