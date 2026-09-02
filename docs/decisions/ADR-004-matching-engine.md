# ADR-004: Central Hard-Filtered Matching Pipeline

## Status
Accepted

## Context
Matching an agricultural machine is fundamentally different from ride-hailing. A tractor without the right implement (e.g. rotavator vs plough) is completely useless for a specific farming operation.

## Decision
All resource matching is processed by a central algorithmic engine that enforces:
1. **Strict Hard Filtering**:
   - Attachment compatibility (rotavator, cultivator, plough, etc.)
   - Calendar availability on requested date
   - Minimum acreage threshold
   - Maximum distance boundary
2. **Multi-Factor Scoring**:
   - Distance (40%)
   - Availability (20%)
   - Trust & Ratings (15%)
   - Transparent Pricing (15%)
   - Preference (10%)

## Consequences
- **Positive**: Eliminates wasted dispatches; protects tractor owners from unprofitable trips; guarantees equipment compatibility.
