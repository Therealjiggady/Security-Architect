# ADR-004: Auth = JWT access + refresh in HttpOnly cookies
Date: 2025-09-08
Status: Accepted

## Context
SPA + API require stateless scaling and XSS‑resistant token storage.

## Decision
Store short‑lived access JWT and rotating refresh JWT in HttpOnly, Secure cookies; SameSite=Lax; HTTPS required.

## Rationale
Balances security and scalability; avoids localStorage risks; aligns with OWASP guidance.

## Consequences
**Positive**
- Horizontal scaling with minimal server state.

**Negative**
- Requires refresh rotation and token invalidation/versioning on logout.

## References
- OWASP JWT Cheat Sheet
- Auth0 Token Storage Best Practices
