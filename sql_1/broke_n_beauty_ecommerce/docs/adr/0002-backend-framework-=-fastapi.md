# ADR-002: Backend Framework = FastAPI
Date: 2025-09-08
Status: Accepted

## Context
We need typed validation, async I/O, and OpenAPI for quick frontend integration.

## Decision
Adopt FastAPI + Pydantic + SQLAlchemy + Uvicorn.

## Rationale
Great DX; auto OpenAPI; performant async handlers.

## Consequences
**Positive**
- Strong validation, good perf, quick scaffolding.

**Negative**
- Smaller ecosystem vs. Django; admin UI custom-built.

## References
- FastAPI Docs
- TechEmpower Benchmarks
