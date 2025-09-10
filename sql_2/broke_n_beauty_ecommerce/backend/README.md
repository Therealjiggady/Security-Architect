# Backend (FastAPI)

## Run (dev)
```bash
python3 -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

Visit http://127.0.0.1:8000/docs for interactive API docs.

## Endpoints

- GET /
  - Description: Welcome ping to confirm the API is up.
  - Example response:
    {
      "message": "Welcome to Clover Line API"
    }

- GET /health
  - Description: Health-check endpoint for uptime monitoring and deployment verification.
  - Example response:
    {
      "status": "ok",
      "service": "Clover Line API",
      "version": "0.1.0",
      "time": "2025-09-09T00:00:00Z"
    }

## Run with explicit host/port

```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

- Local docs: http://127.0.0.1:8000/docs
- ReDoc: http://127.0.0.1:8000/redoc

## Quick verify with curl

```bash
# Root
curl -s http://127.0.0.1:8000/ | jq .

# Health
curl -s http://127.0.0.1:8000/health | jq .
```

## Troubleshooting

- ImportError: No module named 'app'
  - Make sure you run uvicorn from the backend directory:
    cd backend &amp;&amp; uvicorn app.main:app --reload
  - Or run with python module path from project root:
    python -m uvicorn app.main:app --reload

- Virtual environment not active
  - Create/activate and install deps:
    python3 -m venv .venv
    source .venv/bin/activate
    pip install -r backend/requirements.txt

## Day 5 — Database Initialization

Goal
- Set up a development database (SQLite by default; PostgreSQL for prod parity when needed).
- Ensure the backend can connect to a DB and report status via health endpoints.
- Defer schema creation/migrations for PostgreSQL to Day 6 (ORM + Alembic). SQLite schema is auto-applied for local dev.

What’s already implemented
- FastAPI app initializes a DB engine on startup and auto-initializes a local SQLite schema from database/schema.sql (idempotent) when using SQLite.
- Endpoints:
  - GET /db/health — checks DB connectivity (SELECT 1)
  - GET /db/url — shows the active SQLAlchemy URL (with optional password redaction)

Paths
- SQLite dev DB file: database/dev.sqlite3
- Dev schema SQL: database/schema.sql
- App entrypoint: backend/app/main.py
- DB helpers: backend/app/db.py

Option A: Quick local dev (SQLite — recommended to start)
1) Activate env and install deps
   ```bash
   python3 -m venv .venv
   source .venv/bin/activate
   pip install -r backend/requirements.txt
   ```
2) Run server (from project root)
   ```bash
   cd backend
   uvicorn app.main:app --reload
   ```
3) Verify DB connection
   ```bash
   curl -s http://127.0.0.1:8000/db/url | jq .
   curl -s http://127.0.0.1:8000/db/health | jq .
   ```
   Expected:
   - /db/url shows a sqlite URL pointing to database/dev.sqlite3
   - /db/health returns {"status":"ok", ...}
4) Notes
   - On first run, SQLite schema from database/schema.sql is applied automatically.
   - Re-running is safe (uses IF NOT EXISTS and INSERT OR IGNORE).

Option B: Local PostgreSQL (for parity testing)
1) Ensure a Postgres server is available
   - Docker example:
     ```bash
     docker run --name bnb-postgres -e POSTGRES_PASSWORD=devpass -e POSTGRES_DB=bnb -p 5432:5432 -d postgres:16
     ```
2) Install the Postgres driver if needed
   ```bash
   pip install "psycopg[binary]"
   ```
   If you want it pinned in requirements, add psycopg[binary] to backend/requirements.txt and reinstall.
3) Point the backend to Postgres via env var
   ```bash
   export DATABASE_URL="postgresql+psycopg://postgres:devpass@localhost:5432/bnb"
   ```
4) Run server
   ```bash
   cd backend
   uvicorn app.main:app --reload
   ```
5) Verify DB connection
   ```bash
   curl -s http://127.0.0.1:8000/db/url | jq .
   curl -s http://127.0.0.1:8000/db/health | jq .
   ```
   Expected:
   - /db/url shows a postgresql+psycopg URL
   - /db/health returns {"status":"ok", ...}
6) About schema on Postgres
   - Day 5 only requires a working connection + health check.
   - ORM models and Alembic migrations are introduced on Day 6 and will create the Postgres schema.

Troubleshooting
- ImportError: No module named 'psycopg' or driver/error when connecting to Postgres
  - Run: pip install "psycopg[binary]"
- Connection refused
  - Ensure Postgres is running and listening on localhost:5432
  - Verify credentials and DATABASE_URL
- Wrong database taken
  - Unset DATABASE_URL to fall back to SQLite:
    ```bash
    unset DATABASE_URL
    ```
- Password redaction
  - /db/url redacts password when redact=true (default). Use ?redact=false to see the full URL (only in safe dev contexts).

Checklist to complete Day 5
- [ ] Start backend with either SQLite (default) or Postgres (set DATABASE_URL)
- [ ] Confirm GET /db/url returns the expected URL/dialect
- [ ] Confirm GET /db/health returns status=ok
- [ ] Optionally commit: updated requirements (if you added psycopg), and any local notes
