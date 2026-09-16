# Mini Amazon Store

A small full-stack portfolio store with a production-oriented project layout. The app uses React/Vite, FastAPI, SQLAlchemy, SQLite, and Playwright. Checkout is intentionally a simulation: it never contacts a payment provider.

## Project structure

```text
backend/
  app/
    routers/          # HTTP endpoints grouped by feature
    services/         # External integrations and business services
    config.py         # Environment-backed settings
    database.py       # Engine and request-scoped sessions
    models.py         # SQLAlchemy models
    schemas.py        # Validated API contracts
    seed.py           # Idempotent local seed data
    main.py           # FastAPI application factory and lifecycle
  main.py             # Stable uvicorn entry point
frontend/
  src/
    components/       # Focused UI components
    services/api.js   # Centralized HTTP client
    App.jsx           # Page state and composition
tests/
  backend/            # Isolated API tests (no running server required)
  store.spec.js       # Browser-level user journeys
```

## Local setup

Python 3.10+ and Node.js 20+ are required.

```bash
python3 -m venv .venv
source .venv/bin/activate             # Windows: .\.venv\Scripts\Activate.ps1
pip install -r backend/requirements-dev.txt
npm --prefix frontend ci
npm install
```

Copy `.env.example` to `.env` and change secrets. Environment files are ignored by Git. Python does not load `.env` automatically; export the variables in your shell or inject them through your process manager/container platform.

Start the two development processes:

```bash
uvicorn backend.main:app --reload
npm --prefix frontend run dev
```

The UI is at `http://localhost:5173`, API health is at `http://127.0.0.1:8000/health`, and development API documentation is at `http://127.0.0.1:8000/docs`.

## Checks

```bash
pytest
ruff check backend tests/backend
npm --prefix frontend run build
npm test
```

Playwright starts both application servers itself. Install its browser once with `npx playwright install chromium`.

## Configuration

| Variable | Purpose | Default |
| --- | --- | --- |
| `APP_ENV` | Set to `production` to disable API docs | `development` |
| `DATABASE_URL` | SQLAlchemy database connection URL | repository SQLite database |
| `CORS_ORIGINS` | Comma-separated allowed browser origins | local Vite origins |
| `DEMO_USERNAME` / `DEMO_PASSWORD` | Demo sign-in credentials | local demo values |
| `SMTP_HOST` / `SMTP_PORT` | Invoice SMTP endpoint | Gmail SMTP |
| `SMTP_EMAIL` / `SMTP_PASSWORD` | Optional invoice credentials | unset |
| `VITE_API_URL` | Browser-visible API base URL | `/api` (Vite proxy locally) |

## Production boundary

This repository now has production-oriented separation, validation, lifecycle handling, health checks, responsive UI, and isolated tests. It is still a demo—not a real commerce system. Before accepting real users or money, use PostgreSQL with migrations, a real identity provider and authorization on history endpoints, HTTPS, rate limiting, centralized logs/metrics, a durable job queue for email, and a PCI-compliant hosted payment page such as Stripe Checkout. Never send raw card data to this API in a real deployment.
