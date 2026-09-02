# Database Design: RuralConnect Platform

## Overview

RuralConnect employs a **multi-profile, normalized database schema** implemented in PostgreSQL with Prisma ORM.

## Core Architectural Principle: User ≠ Role

A user is **not** defined by a single static role. Instead, a single `User` entity can have multiple active profile extensions:

```
USER
  │
  ├── FARMER_PROFILE
  ├── CONTRACTOR_PROFILE
  ├── TRACTOR_OWNER_PROFILE
  ├── SKILLED_WORKER_PROFILE
  ├── EQUIPMENT_OWNER_PROFILE
  └── SUPPLIER_PROFILE
```

## Schema Entity Catalog

1. **Identity & Core Profiles**:
   - `User`: Core authentication, verification tier (0–4), phone, active role, list of enabled roles.
   - `FarmerProfile`: Land area, crops, irrigation sources, farm locations.
   - `ContractorProfile`: Team size, specializations, acreage capacity.
   - `TractorOwnerProfile`: Experience, fleet count, work history.
   - `SkilledWorkerProfile`: Daily wage, work radius, active availability.
   - `EquipmentOwnerProfile`: Fleet of sprayers/pumps, operating radius.
   - `SupplierProfile`: Shop name, fertilizer/seed licenses, GSTIN.

2. **Resources & Equipment**:
   - `Tractor`: Brand, model, horsepower (HP), registration number, condition.
   - `TractorAttachment`: Attachment type (Rotavator, Plough, etc.), wear condition.
   - `TractorAvailability`: Weekly schedule, minimum acreage, operating radius.
   - `SprayPumpEquipment`: Power sprayers, HTP pumps, capacity specs, rental rates.
   - `InputProduct`: Fertilizers, seeds, crop protection inventory, stock levels.

3. **Work & Execution**:
   - `TractorWorkRequest` (`TRW-xxxxxx`): Work type, acreage, date, attachments.
   - `WorkerWorkRequest` (`SWR-xxxxxx`): Skill needed, workers count, wage offer.
   - `SprayPumpWorkRequest` (`SPR-xxxxxx`): Sprayer type, acres, operator required.
   - `InputInquiryRequest` (`FIR-xxxxxx`): Fertilizer/seed inquiry, delivery needed.
   - `ContractorProject` (`CTR-xxxxxx`): Multi-village demand aggregation.
   - `ContractorProjectRequirement`: Composite breakdown of tractors, workers, sprayers.

4. **Booking & Trust**:
   - `Booking` (`BKG-xxxxxx`): 15-state lifecycle engine.
   - `BookingLifecycleLog`: Immutable transition audit logs.
   - `WorkSession`: GPS start/end logs, acreage verified, proof photos.
   - `Payment`: Escrow transactions, milestone release.
   - `Rating`: 4-dimension score (quality, punctuality, professionalism, communication).
   - `Dispute`: Investigation evidence, resolution, refund audit.
   - `CommunicationLog`: Multi-channel SMS, WhatsApp, In-App, and IVR logs.
