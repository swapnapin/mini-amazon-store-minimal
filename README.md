# Mini Amazon Store

Minimal QA portfolio project using React + Vite, FastAPI, SQLite, and Playwright.

## Run backend
```powershell
cd D:\development\mini-amazon-store
.\.venv\Scripts\Activate.ps1
pip install -r backend\requirements.txt
uvicorn backend.main:app --reload
```

Backend: http://127.0.0.1:8000

## Run frontend
Open a second terminal:
```powershell
cd D:\development\mini-amazon-store\frontend
npm install
npm run dev
```

Frontend: http://localhost:5173

## Run Playwright
Open a third terminal:
```powershell
cd D:\development\mini-amazon-store
npm install
npx playwright install
npx playwright test
```
