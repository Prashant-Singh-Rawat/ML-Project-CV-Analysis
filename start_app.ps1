# Setup and Start Backend
Write-Host "Starting Backend..." -ForegroundColor Green
$BackendPath = Join-Path -Path $PSScriptRoot -ChildPath "backend"
cd $BackendPath

# Check if virtual environment exists, if so activate it
if (Test-Path -Path ".\venv\Scripts\activate.ps1") {
    & ".\venv\Scripts\activate.ps1"
} elseif (Test-Path -Path ".\.venv\Scripts\activate.ps1") {
    & ".\.venv\Scripts\activate.ps1"
}

# Install dependencies if needed
pip install -r requirements.txt

# Download Spacy model just in case it's causing the connection issue
python -m spacy download en_core_web_sm

# Start FastAPI server in the background
Start-Process -FilePath "uvicorn" -ArgumentList "main:app --reload --host 0.0.0.0 --port 8000" -NoNewWindow -PassThru

# Setup and Start Frontend
Write-Host "Starting Frontend..." -ForegroundColor Cyan
$FrontendPath = Join-Path -Path $PSScriptRoot -ChildPath "frontend"
cd $FrontendPath

npm install
npm run dev
