# API Design: RuralConnect Modular Backend

## RESTful & Micro-Modular Architecture

RuralConnect's backend exposes modular NestJS REST endpoints across domain boundaries.

### 1. Authentication & Onboarding
- `POST /api/v1/auth/send-otp`: Initiates mobile OTP verification.
- `POST /api/v1/auth/verify-otp`: Confirms OTP and returns session token.
- `POST /api/v1/users/register`: Base user registration (name, phone, village, mandal, district).
- `PATCH /api/v1/users/roles`: Multi-role selection (`activeRoles`).
- `POST /api/v1/users/switch-role`: Dynamic role context switching without re-authentication.

### 2. Role Profiles
- `POST /api/v1/profiles/farmer`: Creates/updates farmer profile.
- `POST /api/v1/profiles/tractor-owner`: Fleet management & availability.
- `POST /api/v1/profiles/worker`: Skills taxonomy & daily wage.
- `POST /api/v1/profiles/contractor`: Multi-village project capabilities.
- `POST /api/v1/profiles/supplier`: Shop metadata & licenses.
- `POST /api/v1/profiles/equipment-owner`: Spray-pump fleet.

### 3. Work Requests & Aggregation
- `POST /api/v1/requests/tractor`: Create `TRW` work request.
- `POST /api/v1/requests/worker`: Create `SWR` labor request.
- `POST /api/v1/requests/spray-pump`: Create `SPR` equipment request.
- `POST /api/v1/requests/input-inquiry`: Create `FIR` supplier inquiry.
- `POST /api/v1/projects`: Create `CTR` contractor aggregated project.

### 4. Matching & Bookings
- `POST /api/v1/matching/find-candidates`: Execute hard-filtered weighted matching.
- `POST /api/v1/bookings`: Initialize `BKG` booking.
- `PATCH /api/v1/bookings/:id/transition`: Transition booking lifecycle state.
- `POST /api/v1/bookings/:id/sessions`: Work session start/completion logs with GPS.

### 5. Trust, Payments & Communications
- `POST /api/v1/payments/escrow`: Lock payment into escrow.
- `POST /api/v1/payments/release`: Milestone release to provider.
- `POST /api/v1/ratings`: Submit 4-factor review.
- `POST /api/v1/disputes`: File dispute investigation ticket.
- `POST /api/v1/communication/dispatch`: Route multi-channel message.
