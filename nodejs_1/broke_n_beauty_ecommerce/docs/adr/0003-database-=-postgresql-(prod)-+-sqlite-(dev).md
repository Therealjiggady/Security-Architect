# ADR-003: Database = PostgreSQL (prod) + SQLite (dev)
Date: 2025-09-08
Status: Accepted

## Context
Production needs robust features (constraints, JSON, FTS). Local dev benefits from minimal setup.

## Decision
Use PostgreSQL in production; allow SQLite for local CI/dev; prefer running PG locally for parity when feasible.

## Rationale
Postgres is reliable for relational commerce workloads; SQLite speeds developer onboarding.

## Consequences
**Positive**
- Scalable, reliable prod; fast local iteration.

**Negative**
- Feature mismatch risk between PG and SQLite; encourage local PG for features like FTS.

## References
- PostgreSQL Docs
- SQLite 'When to Use'
