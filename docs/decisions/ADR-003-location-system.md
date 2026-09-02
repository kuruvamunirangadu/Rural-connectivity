# ADR-003: Hierarchical Location & Expanding Search Radii

## Status
Accepted

## Context
Rural locations often lack standardized street addresses. GPS coordinates alone can be imprecise when cell reception is spotty or when operating within village boundaries.

## Decision
We implement a dual-tier location model:
1. **Administrative Hierarchy**: `State` $\to$ `District` $\to$ `Mandal` $\to$ `Village`
2. **Geospatial Coordinates**: Latitude / Longitude

The matching engine searches progressively through expanding radius bands:
- **Band 1**: $5\text{ km}$ (Immediate neighborhood / village cluster)
- **Band 2**: $10\text{ km}$ (Adjacent villages in same mandal)
- **Band 3**: $15\text{ km}$ (Cross-mandal operational zone)
- **Band 4**: $25\text{ km}$ (Maximum feasible mobilization distance)

## Consequences
- **Positive**: Works reliably with or without GPS; provides clear locality context to farmers and tractor drivers.
