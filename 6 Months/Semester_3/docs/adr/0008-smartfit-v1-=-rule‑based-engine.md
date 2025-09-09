# ADR-008: SmartFit v1 = rule‑based engine
Date: 2025-09-08
Status: Accepted

## Context
We lack labeled data for ML; need MVP immediately.

## Decision
Implement deterministic rules mapping measurements/height+weight to sizes; log anonymized outcomes for future ML.

## Rationale
Ships quickly and transparently; easy to reason about.

## Consequences
**Positive**
- Predictable results; easy to tune thresholds.

**Negative**
- Limited personalization; may underfit edge cases.

## References
- NNGroup: Simple vs Complex Algorithms
