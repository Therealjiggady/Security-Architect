# Clover Line – Secure E‑Commerce Platform with SmartFit Size Recommender

Monorepo for the Clover Line e‑commerce platform (frontend + backend).

## Repo Structure
```
cloverline/
├─ frontend/            # React + Vite + Tailwind
├─ backend/             # FastAPI + SQLAlchemy
├─ docs/                # Design docs, diagrams, ADRs, screenshots
├─ .github/workflows/   # CI pipelines (lint, test, build)
└─ README.md
```

## Project Summary
Clover Line is a full‑stack e‑commerce platform for a small clothing brand, featuring secure authentication, product catalog, cart/checkout, order tracking, and admin dashboards. A built‑in **SmartFit** recommender improves conversions by suggesting sizes from body measurements or quick inputs (height/weight).

## Tech Stack
- **Frontend:** React, Vite, TailwindCSS, React Router
- **Backend:** FastAPI (Python), Pydantic, SQLAlchemy, Alembic
- **Database:** PostgreSQL (prod), SQLite (dev)
- **Security:** JWT, bcrypt, input validation, HTTPS, secure cookies
- **Payments:** Stripe/PayPal (planned)
- **Testing:** pytest, Jest, React Testing Library
- **CI/CD:** GitHub Actions, pre‑commit, black/ruff, Bandit, pip‑audit
- **Hosting:** Backend on Render/Heroku/Railway; Frontend on Vercel/Netlify

## Goals (MVP)
- Auth (signup/login) with hashed passwords + JWT
- Product catalog (CRUD for admins)
- Cart + checkout → order creation
- SmartFit API endpoint for size suggestions
- Basic admin dashboard
- Deployed demo (frontend + backend) with docs

## Quickstart
### Frontend
```bash
cd frontend
npm install
npm run dev
```

### Backend
```bash
cd backend
python3 -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

---

**Versioning:** SemVer starting at v0.1.0 • **Branching:** trunk‑based with short‑lived feature branches (e.g., `feat/auth-jwt`, `fix/cart-precision`).

