# ADR-002: User ≠ Role Multi-Profile Architecture

## Status
Accepted

## Context
In rural economies, participants frequently fulfill multiple personas. For instance, a farmer who owns 4 acres of land may also own a 50 HP tractor rented out to neighbors, and may also act as an aggregator/contractor for sowing operations. If the system constrains a user record to a single `role = FARMER` column, users are forced to create multiple accounts or log out and log back in, creating unacceptable friction.

## Decision
We decouple identity from functional roles. A single `User` identity can possess multiple associated profile records:
- `FarmerProfile`
- `ContractorProfile`
- `TractorOwnerProfile`
- `SkilledWorkerProfile`
- `EquipmentOwnerProfile`
- `SupplierProfile`

The UI provides a zero-logout **Role Switcher** in the navigation bar that dynamically alters the active dashboard, capabilities, and request views.

## Consequences
- **Positive**: Seamless multi-role participation; users maintain unified reputation and phone credentials; dynamic onboarding presents only relevant questions.
- **Trade-off**: Requires careful access control checks per endpoint depending on the requesting active role context.
