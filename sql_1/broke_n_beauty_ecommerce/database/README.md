# Database

This directory contains database artifacts for the Clover Line e‑commerce project.

Goals
- Dev: SQLite for simple local development
- Prod: PostgreSQL for staging/production
- ORM: SQLAlchemy
- Migrations: Alembic

Current status
- Placeholder only. No models or migrations are active yet.
- This fulfills "create database folder with initial placeholders" for Day 3.

Planned layout
- database/README.md (this file)
- database/schema.sql (planned)
- database/migrations/ (planned)
- database/seeds/ (planned)
- database/dev.sqlite3 (planned local SQLite DB)

Connection strategy (planned)
- Development: SQLAlchemy URL sqlite:///../database/dev.sqlite3
- Production: SQLAlchemy URL postgresql+psycopg://USER:PASSWORD@HOST:PORT/DBNAME

Environment variables (planned)
- DATABASE_URL (prod)
- DEV_DATABASE_URL (dev) e.g., sqlite:////absolute/path/to/dev.sqlite3

Example initial schema (placeholder; not yet applied)

-- Users
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Products
CREATE TABLE IF NOT EXISTS products (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  price_cents INTEGER NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Orders
CREATE TABLE IF NOT EXISTS orders (
  id INTEGER PRIMARY KEY,
  user_id INTEGER NOT NULL,
  total_cents INTEGER NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  -- FOREIGN KEY(user_id) REFERENCES users(id)
);

Notes
- Alembic migration scripts will be generated once SQLAlchemy models are added in backend.
- Until then, this directory serves as a placeholder to complete structure setup for Day 3.

## Seed data

- The seed data lives in database/seed.sql.