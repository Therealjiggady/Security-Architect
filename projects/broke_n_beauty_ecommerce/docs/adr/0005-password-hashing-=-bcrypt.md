# ADR-005: Password Hashing = bcrypt
Date: 2025-09-08
Status: Accepted

## Context
We must store passwords using a modern, widely audited KDF.

## Decision
Use bcrypt with strong parameters and per‑user salt.

## Rationale
Industry standard and battle‑tested.

## Consequences
**Positive**
- Secure baseline; library support is excellent.

**Negative**
- Slight CPU cost at login/signup—acceptable trade‑off.

## References
- OWASP Password Storage Cheat Sheet
