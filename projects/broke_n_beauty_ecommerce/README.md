# Clover Line – Secure E‑Commerce Platform with SmartFit Size Recommender

Monorepo for the Clover Line e‑commerce platform (frontend + backend).

## Repo Structure
```
cloverline/
├── backend/
│   ├── app/
│   │   ├── main.py
│   │   ├── db.py
│   │   ├── models/
│   │   ├── routers/
│   │   └── __init__.py
│   ├── .env
│   ├── requirements.txt
│   ├── test_connection.py
│   └── venv/  # local only, do not commit
├── database/
│   ├── schema.sql
│   └── seed.sql
├── docs/
├── frontend/
└── README.md
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

## Features

### Authentication
- User registration and login with email/password
- JWT-based authentication with secure HTTP-only cookies
- Password hashing using bcrypt
- Protected routes requiring authentication

### Product Catalog
- View all products with details, images, and variants
- Admin-only CRUD operations for products
- Product variants with size, color, and stock management
- Image upload for products

### Cart Functionality
- Frontend-based cart using React Context
- Add/remove products from cart
- Persistent cart state during session

### User Management
- User profiles with email and full name
- Admin ability to delete users (for testing/cleanup)

### API Endpoints
- `/auth/signup` - User registration
- `/auth/login` - User login
- `/products/` - Get all products (public), create product (admin)
- `/products/{id}` - Update product (admin)
- `/users/me` - Get current user info
- `/health` - Health check endpoint

## Setup Instructions

### Prerequisites
- Python 3.11+
- Node.js 18+
- SQLite (for development) or PostgreSQL (for production)

### Database Setup
1. For development (SQLite):
   - The database file `app.db` is created automatically when the backend starts.
   - To seed with sample data, run:
     ```bash
     python seed_products.py
     ```

2. For production (PostgreSQL):
   - Update `backend/app/db.py` with your PostgreSQL connection string.
   - Run the schema and seed scripts from `database/schema.sql` and `database/seed.sql`.

### Backend Setup
```bash
cd backend
python3 -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
# Optional: seed database
python ../seed_products.py
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### Frontend Setup
```bash
cd frontend
npm install
npm run dev  # Runs on http://localhost:5173
```

### Running Both Servers
- Backend: `http://localhost:8000`
- Frontend: `http://localhost:5173`
- API Docs: `http://localhost:8000/docs` (FastAPI Swagger UI)

---

**Versioning:** SemVer starting at v0.1.0 • **Branching:** trunk‑based with short‑lived feature branches (e.g., `feat/auth-jwt`, `fix/cart-precision`).

