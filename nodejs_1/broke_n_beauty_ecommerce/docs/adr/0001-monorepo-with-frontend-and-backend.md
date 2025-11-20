# ADR-001: Monorepo with frontend and backend
Date: 2025-09-08
Status: Accepted

## Context
Clover Line’s frontend (React) and backend (FastAPI) change together and share CI/CD and docs.

## Decision
Use a monorepo with `frontend/`, `backend/`, `docs/`, and `.github/` (if used).

## Rationale
Keeps app and API versioned together; simplifies atomic PRs and shared workflows.

## Consequences
**Positive**
- Single source of truth; simpler onboarding; easier cross‑cutting refactors.

**Negative**
- Repo grows faster; CI must use path filters to avoid unnecessary jobs.

## References
- ThoughtWorks Tech Radar – Monorepo
- Google: 'Why Google Stores Billions of Lines of Code in a Single Repository'
