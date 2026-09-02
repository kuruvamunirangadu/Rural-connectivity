# RuralConnect REST API Specification (Phase 1)

This document provides the RESTful API endpoint contracts for RuralConnect Phase 1.

---

## 1. Authentication & Roles
- `POST /api/v1/auth/send-otp`: Sends 6-digit OTP to user mobile phone (`+91 __________`).
- `POST /api/v1/auth/verify-otp`: Verifies OTP, returns JWT bearer token and user identity.
- `GET /api/v1/users/me`: Returns user details, assigned multi-roles (`roles`), and `currentRole`.
- `POST /api/v1/users/roles/switch`: Switches active operational context (`currentRole = FARMER` ➔ `CONTRACTOR` ➔ `TRACTOR_OWNER`) with zero logout.
- `POST /api/v1/users/roles`: Activates a new role capability on existing user identity.

---

## 2. Farmer & Farms
- `POST /api/v1/farmers/profile`: Upsert farmer profile.
- `POST /api/v1/farmers/farms`: Add agricultural plot (`name`, `area`, `areaUnit`, `locationId`, `crop`, `irrigationType`).
- `GET /api/v1/farmers/farms`: List all farms belonging to farmer.

---

## 3. Tractor Fleet & Implements
- `POST /api/v1/tractors`: Register tractor (`brand`, `model`, `hp`, `registrationNumber`, `manufacturingYear`).
- `POST /api/v1/tractors/:id/attachments`: Add implement attachment (Rotavator, Plough, Cultivator, Trailer, Seed Drill).
- `GET /api/v1/tractors/mine`: List owner's tractor fleet.

---

## 4. Skilled Workers & Skills
- `POST /api/v1/workers/profile`: Create/update skilled worker profile (`serviceRadiusKm`, `expectedDailyRate`).
- `POST /api/v1/workers/skills`: Assign skills (`Tractor Operator`, `Sprayer Operator`, `Pump Technician`).
- `GET /api/v1/skills`: List master taxonomy of skills.

---

## 5. Generic Equipment
- `POST /api/v1/equipment`: Register equipment (`type`: `SPRAYER`, `PUMP`, `WATER_PUMP`, `OTHER`, `brand`, `model`, `capacity`).
- `GET /api/v1/equipment/mine`: List owner's equipment.

---

## 6. Shared Unified Availability
- `POST /api/v1/availability`: Create availability slots for `TRACTOR`, `WORKER`, or `EQUIPMENT`.
- `GET /api/v1/availability/query`: Search availability by `resourceType`, `date`, `locationId`.

---

## 7. Work Requests, Matching & Bookings
- `POST /api/v1/work-requests`: Create demand order with requirements (`TRACTOR`, Min HP, Attachment).
- `GET /api/v1/work-requests/:id/matches`: Returns scored and ranked eligible candidates (e.g. Candidate A Score 94, Candidate B Score 82).
- `POST /api/v1/bookings`: Create booking from matched quote.
- `PATCH /api/v1/bookings/:id/status`: Transitions booking state (`SCHEDULED` ➔ `ARRIVED` ➔ `WORK_STARTED` ➔ `WORK_COMPLETED` ➔ `CONFIRMED`).
- `POST /api/v1/work-sessions`: Record on-field metrics (`actualHours`, `actualArea`, notes).
- `POST /api/v1/ratings`: Record universal review from customer or provider.
