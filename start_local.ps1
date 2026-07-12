# TonyCV Local Development Startup Script
# Starts both the FastAPI backend (port 8000) and Vite frontend (port 5173)

$ProjectRoot = $PSScriptRoot
$BackendPath = Join-Path $ProjectRoot "backend"
$FrontendPath = Join-Path $ProjectRoot "frontend"

Write-Host ""
Write-Host "=========================================" -ForegroundColor Cyan
Write-Host "   TonyCV Local Development Server" -ForegroundColor Cyan
Write-Host "=========================================" -ForegroundColor Cyan
Write-Host ""

# ── Backend Setup ──────────────────────────────────────────────────────────────
Write-Host "[1/3] Setting up Backend..." -ForegroundColor Yellow

$VenvPath = Join-Path $BackendPath ".venv"
$VenvActivate = Join-Path $VenvPath "Scripts\Activate.ps1"

if (-not (Test-Path $VenvPath)) {
    Write-Host "  Creating virtual environment..." -ForegroundColor Gray
    python -m venv $VenvPath
}

# Install backend deps quietly
Write-Host "  Installing backend dependencies..." -ForegroundColor Gray
$PipPath = Join-Path $VenvPath "Scripts\pip.exe"
if (-not (Test-Path $PipPath)) {
    $PipPath = "pip" # fallback
}
& $PipPath install -r (Join-Path $BackendPath "requirements.txt") -q

Write-Host "  Launching FastAPI on http://localhost:8000 ..." -ForegroundColor Green

# Launch backend as a background job
$BackendJob = Start-Job -ScriptBlock {
    param($path, $venv)
    Set-Location $path
    if (Test-Path $venv) { & $venv }
    uvicorn main:app --reload --host 127.0.0.1 --port 8000
} -ArgumentList $BackendPath, $VenvActivate

# Give the backend a moment to start
Start-Sleep -Seconds 3

# Check if backend is up
try {
    $res = Invoke-WebRequest -Uri "http://localhost:8000/health" -TimeoutSec 10 -UseBasicParsing -ErrorAction Stop
    Write-Host "  Backend is RUNNING ✓" -ForegroundColor Green
} catch {
    Write-Host "  Backend starting up (may take a few more seconds)..." -ForegroundColor Yellow
}

Write-Host ""

# ── Frontend Setup ─────────────────────────────────────────────────────────────
Write-Host "[2/3] Setting up Frontend..." -ForegroundColor Yellow
Set-Location $FrontendPath

if (-not (Test-Path (Join-Path $FrontendPath "node_modules"))) {
    Write-Host "  Installing npm packages (first run, this takes a minute)..." -ForegroundColor Gray
    npm install
} else {
    Write-Host "  node_modules found, skipping npm install." -ForegroundColor Gray
}

Write-Host ""
Write-Host "[3/3] Launching Development Servers..." -ForegroundColor Yellow
Write-Host ""
Write-Host "  Backend  → http://localhost:8000" -ForegroundColor Cyan
Write-Host "  Backend API Docs → http://localhost:8000/docs" -ForegroundColor Cyan
Write-Host "  Frontend → http://localhost:5173" -ForegroundColor Cyan
Write-Host ""
Write-Host "  Press Ctrl+C to stop the frontend (backend runs in background)" -ForegroundColor Gray
Write-Host "=========================================" -ForegroundColor Cyan
Write-Host ""

# Start frontend (blocking — keeps terminal alive)
npm run dev
