$root = $PSScriptRoot

if (-not (Test-Path "$root\.venv\Scripts\python.exe")) {
    throw "Virtual environment not found. Follow the setup steps in README.md first."
}

Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$root'; .\.venv\Scripts\python.exe -m uvicorn backend.main:app --reload"
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$root\frontend'; npm run dev"

Write-Host "Backend:  http://127.0.0.1:8000"
Write-Host "Frontend: http://localhost:5173"
