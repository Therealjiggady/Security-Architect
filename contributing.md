# Contributing – Clover Line E-Commerce Platform

Thanks for considering contributing to the **Clover Line Secure E-Commerce Platform with SmartFit Recommender**.  
This document explains how to contribute effectively to the backend and overall system.

---

## 📦 Project Overview

Clover Line is a full-stack e-commerce app for a small apparel brand.  
The **backend** (FastAPI + PostgreSQL) powers:

- Secure authentication (JWT, bcrypt, cookies)
- Product catalog, cart, orders
- SmartFit recommender (rule-based now, ML later)
- Admin dashboard APIs
- Payment integration (Stripe/PayPal)
- Email notifications (orders, shipping)

---

## 🛠️ Development Setup

### Requirements
- Python 3.11+
- PostgreSQL (production-like)
- SQLite (optional for local dev)
- Node.js 18+ (if working on frontend)
- Git & GitHub

### Setup (Backend)
```bash
git clone https://github.com/<your-username>/cloverline.git
cd cloverline/backend

python -m venv .venv
source .venv/bin/activate   # macOS/Linux
.venv\Scripts\activate      # Windows

pip install -r requirements.txt
alembic upgrade head
uvicorn app.main:app --reload
