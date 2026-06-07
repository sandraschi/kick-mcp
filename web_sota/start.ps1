Param([switch]$Headless)

# Fast port helpers (scripts/PortHelpers.ps1)
Param([switch]$Headless)

$BackendPort  = 10968
$FrontendPort = 10969
$WebRoot      = $PSScriptRoot

# --- SOTA Headless Standard ---
if ($Headless -and ($Host.UI.RawUI.WindowTitle -notmatch "Hidden")) {
    Start-Process powershell.exe -ArgumentList "-NoProfile","-File",$PSCommandPath,"-Headless" -WindowStyle Hidden
    exit
}
$WindowStyle = if ($Headless) { "Hidden" } else { "Normal" }

# Clear ports
foreach ($port in @($BackendPort, $FrontendPort)) {
    Get-NetTCPConnection -LocalPort $port -ErrorAction SilentlyContinue |
        ForEach-Object { Stop-Process -Id $_.OwningProcess -Force -ErrorAction SilentlyContinue }
}
Start-Sleep -Milliseconds 500

# Frontend deps
if (-not (Test-Path (Join-Path $WebRoot "node_modules"))) {
    Write-Host "Installing frontend deps (npm install) ..." -ForegroundColor Cyan
    Push-Location $WebRoot
    npm install --prefer-offline 2>&1
    if ($LASTEXITCODE -ne 0) { Write-Host "ERROR: npm install failed." -ForegroundColor Red; Pop-Location; exit 1 }
    Pop-Location
}

Write-Host "Starting Vite on :$FrontendPort ..." -ForegroundColor Cyan
$null = Start-Process -FilePath "cmd.exe" `
    -ArgumentList "/c","npm run dev" `
    -WorkingDirectory $WebRoot -WindowStyle $WindowStyle -PassThru

Write-Host "Frontend  http://127.0.0.1:$FrontendPort" -ForegroundColor Green
Write-Host "(Start the backend separately: uv run -m kick_mcp --http --port $BackendPort)" -ForegroundColor Gray
_RepoRootForPorts = Split-Path -Parent $PSScriptRoot
Param([switch]$Headless)

$BackendPort  = 10968
$FrontendPort = 10969
$WebRoot      = $PSScriptRoot

# --- SOTA Headless Standard ---
if ($Headless -and ($Host.UI.RawUI.WindowTitle -notmatch "Hidden")) {
    Start-Process powershell.exe -ArgumentList "-NoProfile","-File",$PSCommandPath,"-Headless" -WindowStyle Hidden
    exit
}
$WindowStyle = if ($Headless) { "Hidden" } else { "Normal" }

# Clear ports
foreach ($port in @($BackendPort, $FrontendPort)) {
    Get-NetTCPConnection -LocalPort $port -ErrorAction SilentlyContinue |
        ForEach-Object { Stop-Process -Id $_.OwningProcess -Force -ErrorAction SilentlyContinue }
}
Start-Sleep -Milliseconds 500

# Frontend deps
if (-not (Test-Path (Join-Path $WebRoot "node_modules"))) {
    Write-Host "Installing frontend deps (npm install) ..." -ForegroundColor Cyan
    Push-Location $WebRoot
    npm install --prefer-offline 2>&1
    if ($LASTEXITCODE -ne 0) { Write-Host "ERROR: npm install failed." -ForegroundColor Red; Pop-Location; exit 1 }
    Pop-Location
}

Write-Host "Starting Vite on :$FrontendPort ..." -ForegroundColor Cyan
$null = Start-Process -FilePath "cmd.exe" `
    -ArgumentList "/c","npm run dev" `
    -WorkingDirectory $WebRoot -WindowStyle $WindowStyle -PassThru

Write-Host "Frontend  http://127.0.0.1:$FrontendPort" -ForegroundColor Green
Write-Host "(Start the backend separately: uv run -m kick_mcp --http --port $BackendPort)" -ForegroundColor Gray
_PortHelpers = Join-Path Param([switch]$Headless)

$BackendPort  = 10968
$FrontendPort = 10969
$WebRoot      = $PSScriptRoot

# --- SOTA Headless Standard ---
if ($Headless -and ($Host.UI.RawUI.WindowTitle -notmatch "Hidden")) {
    Start-Process powershell.exe -ArgumentList "-NoProfile","-File",$PSCommandPath,"-Headless" -WindowStyle Hidden
    exit
}
$WindowStyle = if ($Headless) { "Hidden" } else { "Normal" }

# Clear ports
foreach ($port in @($BackendPort, $FrontendPort)) {
    Get-NetTCPConnection -LocalPort $port -ErrorAction SilentlyContinue |
        ForEach-Object { Stop-Process -Id $_.OwningProcess -Force -ErrorAction SilentlyContinue }
}
Start-Sleep -Milliseconds 500

# Frontend deps
if (-not (Test-Path (Join-Path $WebRoot "node_modules"))) {
    Write-Host "Installing frontend deps (npm install) ..." -ForegroundColor Cyan
    Push-Location $WebRoot
    npm install --prefer-offline 2>&1
    if ($LASTEXITCODE -ne 0) { Write-Host "ERROR: npm install failed." -ForegroundColor Red; Pop-Location; exit 1 }
    Pop-Location
}

Write-Host "Starting Vite on :$FrontendPort ..." -ForegroundColor Cyan
$null = Start-Process -FilePath "cmd.exe" `
    -ArgumentList "/c","npm run dev" `
    -WorkingDirectory $WebRoot -WindowStyle $WindowStyle -PassThru

Write-Host "Frontend  http://127.0.0.1:$FrontendPort" -ForegroundColor Green
Write-Host "(Start the backend separately: uv run -m kick_mcp --http --port $BackendPort)" -ForegroundColor Gray
_RepoRootForPorts 'scripts\PortHelpers.ps1'
if (Test-Path -LiteralPath Param([switch]$Headless)

$BackendPort  = 10968
$FrontendPort = 10969
$WebRoot      = $PSScriptRoot

# --- SOTA Headless Standard ---
if ($Headless -and ($Host.UI.RawUI.WindowTitle -notmatch "Hidden")) {
    Start-Process powershell.exe -ArgumentList "-NoProfile","-File",$PSCommandPath,"-Headless" -WindowStyle Hidden
    exit
}
$WindowStyle = if ($Headless) { "Hidden" } else { "Normal" }

# Clear ports
foreach ($port in @($BackendPort, $FrontendPort)) {
    Get-NetTCPConnection -LocalPort $port -ErrorAction SilentlyContinue |
        ForEach-Object { Stop-Process -Id $_.OwningProcess -Force -ErrorAction SilentlyContinue }
}
Start-Sleep -Milliseconds 500

# Frontend deps
if (-not (Test-Path (Join-Path $WebRoot "node_modules"))) {
    Write-Host "Installing frontend deps (npm install) ..." -ForegroundColor Cyan
    Push-Location $WebRoot
    npm install --prefer-offline 2>&1
    if ($LASTEXITCODE -ne 0) { Write-Host "ERROR: npm install failed." -ForegroundColor Red; Pop-Location; exit 1 }
    Pop-Location
}

Write-Host "Starting Vite on :$FrontendPort ..." -ForegroundColor Cyan
$null = Start-Process -FilePath "cmd.exe" `
    -ArgumentList "/c","npm run dev" `
    -WorkingDirectory $WebRoot -WindowStyle $WindowStyle -PassThru

Write-Host "Frontend  http://127.0.0.1:$FrontendPort" -ForegroundColor Green
Write-Host "(Start the backend separately: uv run -m kick_mcp --http --port $BackendPort)" -ForegroundColor Gray
_PortHelpers) { . Param([switch]$Headless)

$BackendPort  = 10968
$FrontendPort = 10969
$WebRoot      = $PSScriptRoot

# --- SOTA Headless Standard ---
if ($Headless -and ($Host.UI.RawUI.WindowTitle -notmatch "Hidden")) {
    Start-Process powershell.exe -ArgumentList "-NoProfile","-File",$PSCommandPath,"-Headless" -WindowStyle Hidden
    exit
}
$WindowStyle = if ($Headless) { "Hidden" } else { "Normal" }

# Clear ports
foreach ($port in @($BackendPort, $FrontendPort)) {
    Get-NetTCPConnection -LocalPort $port -ErrorAction SilentlyContinue |
        ForEach-Object { Stop-Process -Id $_.OwningProcess -Force -ErrorAction SilentlyContinue }
}
Start-Sleep -Milliseconds 500

# Frontend deps
if (-not (Test-Path (Join-Path $WebRoot "node_modules"))) {
    Write-Host "Installing frontend deps (npm install) ..." -ForegroundColor Cyan
    Push-Location $WebRoot
    npm install --prefer-offline 2>&1
    if ($LASTEXITCODE -ne 0) { Write-Host "ERROR: npm install failed." -ForegroundColor Red; Pop-Location; exit 1 }
    Pop-Location
}

Write-Host "Starting Vite on :$FrontendPort ..." -ForegroundColor Cyan
$null = Start-Process -FilePath "cmd.exe" `
    -ArgumentList "/c","npm run dev" `
    -WorkingDirectory $WebRoot -WindowStyle $WindowStyle -PassThru

Write-Host "Frontend  http://127.0.0.1:$FrontendPort" -ForegroundColor Green
Write-Host "(Start the backend separately: uv run -m kick_mcp --http --port $BackendPort)" -ForegroundColor Gray
_PortHelpers }

$BackendPort  = 10968
$FrontendPort = 10969
$WebRoot      = $PSScriptRoot

# --- SOTA Headless Standard ---
if ($Headless -and ($Host.UI.RawUI.WindowTitle -notmatch "Hidden")) {
    Start-Process powershell.exe -ArgumentList "-NoProfile","-File",$PSCommandPath,"-Headless" -WindowStyle Hidden
    exit
}
$WindowStyle = if ($Headless) { "Hidden" } else { "Normal" }

# Clear ports
foreach ($port in @($BackendPort, $FrontendPort)) {
    Get-NetTCPConnection -LocalPort $port -ErrorAction SilentlyContinue |
        ForEach-Object { Stop-Process -Id $_.OwningProcess -Force -ErrorAction SilentlyContinue }
}
Start-Sleep -Milliseconds 500

# Frontend deps
if (-not (Test-Path (Join-Path $WebRoot "node_modules"))) {
    Write-Host "Installing frontend deps (npm install) ..." -ForegroundColor Cyan
    Push-Location $WebRoot
    npm install --prefer-offline 2>&1
    if ($LASTEXITCODE -ne 0) { Write-Host "ERROR: npm install failed." -ForegroundColor Red; Pop-Location; exit 1 }
    Pop-Location
}

Write-Host "Starting Vite on :$FrontendPort ..." -ForegroundColor Cyan
$null = Start-Process -FilePath "cmd.exe" `
    -ArgumentList "/c","npm run dev" `
    -WorkingDirectory $WebRoot -WindowStyle $WindowStyle -PassThru

Write-Host "Frontend  http://127.0.0.1:$FrontendPort" -ForegroundColor Green
Write-Host "(Start the backend separately: uv run -m kick_mcp --http --port $BackendPort)" -ForegroundColor Gray

