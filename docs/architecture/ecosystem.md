# RuralConnect Ecosystem

## Overview

RuralConnect connects five primary participant types in rural agriculture through role-specific, dedicated workflows. No user sees features they don't need.

```
                         ┌──────────────────┐
                         │     FARMER       │
                         │ Work Requirement │
                         └────────┬─────────┘
                                  │
                 ┌────────────────┼────────────────┐
                 │                │                │
                 ▼                ▼                ▼
        ┌────────────────┐ ┌───────────────┐ ┌───────────────┐
        │ TRACTOR OWNER  │ │ SKILLED WORKER│ │  CONTRACTOR   │
        │ Equipment      │ │ Labour/Skill  │ │ Work Provider │
        └────────────────┘ └───────────────┘ └───────────────┘
                 │
                 ▼
        ┌────────────────────┐
        │ SUPPLIER / INPUT   │
        │      OWNER         │
        └────────────────────┘
```

---

## 1. Farmer (Work Requester)

### Profile

- **Name**
- **Mobile Number**
- **Location Hierarchy**: Village → Mandal → District
- **Preferred Language**
- **Farm Profile**:
  - Land area (acres)
  - Land type (irrigated, dryland, mixed)
  - Crops grown
  - Irrigation type (bore, canal, drip, etc.)
  - Available dates for work
- **Verification Status**: Unverified → Verified → Gold → Platinum

### Dashboard (Simplified)

```
GOOD MORNING

What do you need today?

[ 🚜 Tractor Work ]

[ 🌱 Spray / Pump Work ]

[ 👷 Skilled Worker ]

[ 🧪 Fertilizer / Input ]

[ 📋 My Requests ]
```

### Tractor Work Request Flow

When farmer selects **🚜 Tractor Work**:

**Step 1: Work Type Selection**
- Ploughing
- Rotavator
- Cultivator
- Harrowing
- Seed drilling
- Land levelling
- Transport
- Trailer work
- Other

**Step 2: Work Details**
- Farm location (auto-filled from profile, can override)
- Acreage
- Preferred date
- Preferred time (morning 6-8 AM, afternoon, etc.)
- Required tractor type/HP
- Attachments needed (Rotavator, Plough, Cultivator, etc.)
- Special requirements/notes

**Step 3: Budget**
- Budget/expected rate (based on market rates)
- Payment method preference

### Generated Request

System creates unique reference:

```
TRW-000124
Status: OPEN
Created: Sept 1, 2026 10:30 AM
Farmer: Ramesh Kumar
Location: Village Tangipalli, Mandal Tandur
Work: Rotavator
Area: 4 acres
Date: Sept 4, 2026
Time: 7 AM
Expected Budget: ₹1200-1400
```

### Request Lifecycle

- **OPEN** → Available for tractor owners to bid/accept
- **MATCHED** → Tractor owner selected (negotiation possible)
- **CONFIRMED** → Booking finalized, payment initiated
- **IN_PROGRESS** → Work started
- **COMPLETED** → Work done, awaiting payment release
- **CANCELLED** → Request cancelled with reason

---

## 2. Tractor Owner (Primary Supply)

### Critical Distinction

**A Tractor Owner is NOT a simple "user with a tractor".**

One owner can manage **multiple tractors**, each with different:
- Specifications (HP, brand, model, category)
- Attachments
- Availability
- Maintenance status

### Owner Profile

- **Name**
- **Mobile Number**
- **Location**: Village → Mandal → District
- **Experience Years**
- **Languages Spoken**
- **Verification Status**: ID verified, documents verified, ratings verified
- **Reputation**: Total ratings, average rating, number of completed jobs

### Tractor Model

```
TRACTOR OWNER
      │
      ├── TRACTOR 1 (50 HP, Mahindra)
      │    ├── HP: 50
      │    ├── Brand: Mahindra
      │    ├── Model: Arjun 550
      │    ├── Registration: AP29XX0001
      │    ├── Category: Medium
      │    ├── Purchase Year: 2020
      │    ├── Condition: Excellent
      │    ├── Service Status: Active
      │    ├── Photos: [4 images]
      │    ├── Attachments:
      │    │   ├── Rotavator
      │    │   ├── Cultivator
      │    │   ├── Plough
      │    │   └── Trailer
      │    └── Availability: [see below]
      │
      ├── TRACTOR 2 (35 HP, John Deere)
      │    ├── HP: 35
      │    ├── Brand: John Deere
      │    ├── Attachments:
      │    │   └── Plough
      │    └── Availability: [see below]
      │
      └── TRACTOR 3 (45 HP, Massey)
           └── ...
```

### Attachment Types

```
ATTACHMENT TYPES:
├── Rotavator
├── Cultivator
├── Plough
├── Seed Drill
├── Trailer
├── Leveller
├── Harrow
├── Thresher
├── Sprayer
└── Other
```

### Availability Management

For each tractor, owner sets:

**Weekly Schedule**:
```
Monday    Available
Tuesday   Available
Wednesday Booked
Thursday  Available
Friday    Available
Saturday  Available
Sunday    Off
```

**Service Radius**:
```
Operating Radius: 15 km
(Can travel from base location)
```

**Constraints**:
```
Minimum work: 2 acres
Preferred work types: Rotavator, Ploughing
Holiday dates: Sept 15-20 (unavailable)
```

**Rate Card** (per tractor + attachment combination):
```
Tractor 1 (50 HP) + Rotavator:
├── Hourly: ₹600
├── Half day (4 hrs): ₹2000
├── Full day (8 hrs): ₹3500
└── Per acre: ₹350

Tractor 1 (50 HP) + Plough:
├── Per acre: ₹250
└── ...
```

---

## 3. Skilled Worker (Labour Provider)

### Profile

- **Name, Mobile, Location**
- **Skills**: Spraying, Harvesting, Planting, Pest Management, etc.
- **Certifications/Training** (if applicable)
- **Languages**
- **Availability**: Days available, preferred work types
- **Experience**: Years in agriculture

### Workflow

- Browse available work
- Bid on farmer requests
- Get assigned to tasks
- Log hours worked
- Receive payment

---

## 4. Contractor (Work Provider/Aggregator)

### Profile

- **Name, Mobile, Location**
- **Team Size**: Number of workers
- **Specializations**: Types of work (harvesting, pest management, etc.)
- **Capacity**: Can handle 5-50 acres per project
- **Experience**

### Workflow

- Browse farmer requests
- Submit comprehensive bids
- Manage worker allocation
- Oversee work completion
- Invoice farmer

---

## 5. Supplier / Input Owner

### Profile

- **Name, Mobile, Location**
- **Product Categories**: Seeds, Fertilizers, Pesticides, Tools, etc.
- **Inventory**

### Workflow

- List products with prices
- Receive farmer orders
- Process shipments
- Collect payments

---

## 6. Matching Engine (Core of Phase 1)

### Matching Criteria

When farmer posts request:

```
Location: Village A (Lat, Lng)
Work: Rotavator
Area: 5 acres
Date: Sept 4
Time: 7 AM (morning)
Budget: ₹1200-1400
```

### Search Space

System finds all tractor owners where:

✅ Tractor has "Rotavator" attachment
✅ Tractor is available on Sept 4
✅ Owner is within 15 km radius
✅ Owner has NOT marked as on holiday
✅ Minimum work (2 acres) is met
✅ Tractor capacity fits (5 acres within min/max)

### Ranking Algorithm

For each matching tractor owner, calculate score (0-100):

```
Score = 
  (40% × Distance Score) +
  (20% × Availability Match) +
  (15% × Rating Score) +
  (15% × Price Competitiveness) +
  (10% × Work Preference Match)
```

**Distance Score** (40% weight):
- 0 km = 100 points
- 15 km = 0 points
- Linear interpolation

**Availability Match** (20% weight):
- Exact date available = 100
- Within ±1 day = 75
- Within ±2 days = 50

**Rating Score** (15% weight):
- 4.5+ stars = 100 points
- 4.0+ stars = 80 points
- 3.5+ stars = 60 points
- < 3.5 = 0 points

**Price Competitiveness** (15% weight):
- Within budget = 100 points
- 10% over budget = 80 points
- 20% over budget = 50 points
- 30%+ over budget = 0 points

**Work Preference Match** (10% weight):
- Owner marked this work type as "preferred" = 100
- Otherwise = 50

### Results

System ranks matches:

```
RANK 1: TRACTOR OWNER A
├── Tractor: 50 HP Mahindra + Rotavator
├── Distance: 4 km
├── Rating: 4.7 (87 jobs)
├── Price: ₹1250/acre (within budget)
├── Score: 82/100
└── Status: Available Today ✓

RANK 2: TRACTOR OWNER B
├── Tractor: 45 HP John Deere + Rotavator
├── Distance: 7 km
├── Rating: 4.5 (56 jobs)
├── Price: ₹1300/acre (within budget)
├── Score: 75/100
└── Status: Available Tomorrow

RANK 3: TRACTOR OWNER C
├── Tractor: 35 HP Swaraj (NO Rotavator)
├── Distance: 3 km
├── Rating: 4.6
├── Score: 0/100
└── Status: Doesn't have required attachment ✗
```

**Owner C is NOT presented** — they don't have the required attachment.

### Presentation

Farmer sees:

```
MATCHING RESULTS

Top Match (82% fit)
┌─────────────────────────────┐
│ Ramesh Kumar                │
│ 50 HP Tractor + Rotavator   │
│ 4 km away                   │
│ 4.7 ★ (87 jobs)             │
│ ₹1250/acre                  │
│                             │
│ [ VIEW PROFILE ] [ BOOK ]   │
└─────────────────────────────┘

Good Match (75% fit)
┌─────────────────────────────┐
│ Suresh Rao                  │
│ 45 HP Tractor + Rotavator   │
│ 7 km away                   │
│ 4.5 ★ (56 jobs)             │
│ ₹1300/acre                  │
│                             │
│ [ VIEW PROFILE ] [ BOOK ]   │
└─────────────────────────────┘

[ See More ]
```

---

## 7. Request Reference System

Every request gets a unique, human-readable reference:

```
TRW-000124
│   │
│   └── Sequence number
└────── Type prefix (TRW = Tractor Work Request)
```

Similarly:

```
SWR-000045  (Skilled Worker Request)
FIR-000012  (Fertilizer/Input Request)
CTR-000089  (Contractor Work Request)
```

This makes it easy for users to:
- Reference work over phone
- Share via SMS
- Track via WhatsApp

---

## 8. Phase 1 Focus

**Phase 1 priorities** (6 months):

1. ✅ **Farmer → Tractor Owner matching** (core marketplace)
2. ✅ **Tractor owner inventory & availability** (supply modeling)
3. ✅ **Booking & work session tracking**
4. ✅ **Payment & commission handling**
5. ✅ **Rating system** (build reputation)
6. ✅ **Notifications** (SMS, in-app, WhatsApp)

**Phase 2 & beyond**:
- Skilled worker matching
- Contractor bidding platform
- Supplier marketplace
- Advanced matching (ML-based)
- Supply forecasting
