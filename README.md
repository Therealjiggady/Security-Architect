# James Johnson's Development Portfolio

A comprehensive full-stack development learning repository showcasing my journey from fundamentals to production-ready applications, featuring a complete e-commerce platform and extensive coursework across multiple technologies.

## Overview

This repository serves as both a **learning progression tracker** and **portfolio showcase**, containing:
- 17+ structured learning modules covering full-stack development
- Production-ready e-commerce platform (Broke N Beauty)
- Real-world projects with modern tech stacks
- Comprehensive documentation and study materials

## Featured Project: Broke N Beauty E-Commerce Platform

A fully-featured, production-ready SaaS e-commerce platform built with modern web technologies.

**Live Demo:** [Frontend](https://broke-n-beauty.vercel.app) | [API Docs](https://broke-n-beauty-api.onrender.com/docs)

### Tech Stack

**Frontend:**
- React 18 + Vite
- TailwindCSS + shadcn/ui
- React Router + Context API
- TypeScript

**Backend:**
- FastAPI (Python)
- SQLAlchemy ORM
- PostgreSQL / SQLite
- JWT Authentication
- WebSocket Support

**Infrastructure:**
- Render (Backend Hosting)
- Vercel (Frontend CDN)
- GitHub Actions (CI/CD)
- Alembic (Database Migrations)

### Key Features

- **User Authentication** - Secure JWT-based auth with bcrypt password hashing
- **Product Catalog** - Admin CRUD operations with variants (size, color, stock)
- **Shopping Cart** - Persistent cart state with React Context
- **Real-Time Chat** - WebSocket-based messaging system
- **SmartFit Size Recommender** - AI-powered sizing based on user measurements
- **Admin Dashboard** - Complete management for products, users, and orders
- **Payment Integration** - Stripe and PayPal support
- **Order Tracking** - Full order lifecycle management

[View Full Project Documentation →](./projects/broke_n_beauty_ecommerce/README.md)

## Repository Structure

```
James-Repo/
├── projects/
│   ├── broke_n_beauty_ecommerce/    # Main full-stack e-commerce platform
│   ├── clover_smartfit_GUI/         # Python GUI for size recommendations
│   └── number_guessing_game/        # Learning project
│
├── learning/
│   ├── PLAN.md                      # Study plan and objectives
│   ├── notes.md                     # Technical notes and best practices
│   └── tutorial.md                  # WebSocket implementation tutorial
│
├── python_1/                        # Python fundamentals and utilities
├── python_2/                        # Advanced Python concepts
├── javascript_1/                    # React + Vite + FastAPI integration
├── javascript_2/                    # React + TailwindCSS projects
├── expressjs_1/                     # Express.js backend development
├── nodejs_1/                        # Node.js fundamentals
├── sql_1/                          # SQL basics and database design
├── sql_2/                          # Advanced SQL and ORM patterns
├── logic_1/                        # Algorithms and data structures
├── design_1/                       # UI/UX design concepts
├── figma_1/                        # Figma design tool
├── unix_1/                         # Unix/Linux command line
├── unix_2/                         # Advanced Unix scripting
├── cybersecurity_basics_1/         # Security fundamentals
├── cyber_threats_and_vulnerabilities_1/  # OWASP and threat analysis
├── version_control_1/              # Git and GitHub workflows
├── prompt_engineering_1/           # AI prompt engineering
│
├── 3 Week/                         # Beginner curriculum materials
└── 6 Months/                       # Extended learning path
```

## Learning Path

### Phase 1: Fundamentals (Weeks 1-4)
- **Programming Basics:** Python, JavaScript fundamentals
- **Web Basics:** HTML, CSS, basic React
- **Version Control:** Git and GitHub workflows
- **Unix/Command Line:** Terminal navigation and scripting

### Phase 2: Backend Development (Weeks 5-12)
- **Python Web Frameworks:** FastAPI, async patterns
- **Database Design:** SQL, PostgreSQL, SQLAlchemy ORM
- **API Development:** RESTful APIs, authentication, WebSockets
- **Testing:** Unit tests, integration tests, TDD practices

### Phase 3: Frontend Mastery (Weeks 13-20)
- **Modern React:** Hooks, Context API, component patterns
- **Styling:** TailwindCSS, responsive design, component libraries
- **State Management:** Context API, form handling
- **Real-Time Features:** WebSocket integration

### Phase 4: DevOps & Deployment (Weeks 21-26)
- **Cloud Hosting:** Render, Vercel deployment
- **CI/CD:** GitHub Actions automation
- **Database Migrations:** Alembic workflows
- **Production Best Practices:** Environment management, logging, monitoring

## Technologies & Skills

### Languages
- Python
- JavaScript/TypeScript
- SQL
- Bash/Shell Scripting

### Frontend
- React 18
- Vite
- TailwindCSS
- shadcn/ui
- React Router

### Backend
- FastAPI
- Express.js
- Node.js
- SQLAlchemy
- Pydantic

### Database
- PostgreSQL
- SQLite
- Alembic Migrations

### DevOps & Tools
- Git/GitHub
- GitHub Actions
- Docker
- Render
- Vercel
- VS Code

### Security
- JWT Authentication
- bcrypt Password Hashing
- OWASP Best Practices
- Threat Analysis

## Quick Start

### Clone the Repository
```bash
git clone https://github.com/yourusername/James-Repo.git
cd James-Repo
```

### Run the Main E-Commerce Project
```bash
# Backend Setup
cd projects/broke_n_beauty_ecommerce/backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
python seed_production.py
uvicorn app.main:app --reload

# Frontend Setup (in new terminal)
cd projects/broke_n_beauty_ecommerce/frontend
npm install
npm run dev
```

Visit `http://localhost:5173` to view the application.

[View Detailed Setup Guide →](./projects/broke_n_beauty_ecommerce/README.md)

## Documentation

- **[Learning Plan](./learning/PLAN.md)** - Detailed study objectives and timeline
- **[Technical Notes](./learning/notes.md)** - Best practices and patterns learned
- **[WebSocket Tutorial](./learning/tutorial.md)** - Real-time chat implementation guide
- **[Project Documentation](./projects/broke_n_beauty_ecommerce/README.md)** - Complete e-commerce setup
- **[Deployment Guide](./projects/broke_n_beauty_ecommerce/DEPLOYMENT.md)** - Production deployment steps

## Projects

### 1. Broke N Beauty E-Commerce Platform
Full-stack SaaS platform with authentication, real-time chat, payment integration, and admin dashboard.

**Stack:** React, FastAPI, PostgreSQL, WebSockets
**Status:** Production-ready, deployed on Render + Vercel

### 2. Clover SmartFit GUI
Python desktop application for clothing size recommendations using BMI calculations.

**Stack:** Python, Tkinter, CSV
**Status:** Complete

### 3. Number Guessing Game
Learning project demonstrating Python fundamentals and game logic.

**Stack:** Python
**Status:** Complete

## Current Focus

Working on enhancing the Broke N Beauty platform with:
- Advanced product filtering and search
- Enhanced admin analytics dashboard
- Performance optimizations
- Additional payment gateway integrations

## Connect With Me

**LinkedIn:** [James Johnson](https://www.linkedin.com/in/james-johnson-63b381367/?profileId=ACoAAFsAZk8B3pLdPd51n0dPIWEbm-1pqNeIGog)
**GitHub:** [therealjiggady](https://therealjiggady.github.io/Security-Architect/)

---

**License:** MIT
**Last Updated:** December 2025
