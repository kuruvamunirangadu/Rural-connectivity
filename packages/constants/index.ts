// Application constants for RuralConnect

export const APP_NAME = 'RuralConnect';

// 1. The Ecosystem - 5 Primary Participant Roles
export const USER_ROLES = {
  FARMER: 'farmer',
  TRACTOR_OWNER: 'tractor_owner',
  SKILLED_WORKER: 'worker',
  CONTRACTOR: 'contractor',
  INPUT_SUPPLIER: 'supplier',
} as const;

// 2. Tractor Work Types
export const TRACTOR_WORK_TYPES = {
  PLOUGHING: 'ploughing',
  ROTAVATOR: 'rotavator',
  CULTIVATOR: 'cultivator',
  HARROWING: 'harrowing',
  SEED_DRILLING: 'seed_drilling',
  LAND_LEVELLING: 'land_levelling',
  TRANSPORT: 'transport',
  TRAILER_WORK: 'trailer_work',
  OTHER: 'other',
} as const;

// 3. Tractor Attachment Types
export const ATTACHMENT_TYPES = {
  ROTAVATOR: 'rotavator',
  CULTIVATOR: 'cultivator',
  PLOUGH: 'plough',
  SEED_DRILL: 'seed_drill',
  TRAILER: 'trailer',
  LEVELLER: 'leveller',
  HARROW: 'harrow',
  THRESHER: 'thresher',
  SPRAYER: 'sprayer',
  OTHER: 'other',
} as const;

// 4. Role 3 — Structured Skilled Worker Skills Taxonomy (Module 7)
export const SKILLED_WORKER_SKILLS = {
  TRACTOR_OPERATOR: 'tractor_operator',
  SPRAYER_OPERATOR: 'sprayer_operator',
  PUMP_TECHNICIAN: 'pump_technician',
  IRRIGATION_TECHNICIAN: 'irrigation_technician',
  MACHINERY_MECHANIC: 'machinery_mechanic',
  ELECTRICIAN: 'electrician',
  GENERAL_SKILLED_WORKER: 'general_skilled_worker',
  OTHER: 'other',
} as const;

// 5. Spray & Pump Equipment Category (Module 9)
export const SPRAY_PUMP_EQUIPMENT_TYPES = {
  KNAPSACK_BATTERY_SPRAYER: 'knapsack_battery_sprayer',
  POWER_SPRAYER: 'power_sprayer',
  HTP_SPRAYER: 'htp_sprayer',
  TRACTOR_MOUNTED_BOOM_SPRAYER: 'tractor_mounted_boom_sprayer',
  SUBMERSIBLE_PUMP: 'submersible_pump',
  DIESEL_PUMP: 'diesel_pump',
  SOLAR_PUMP: 'solar_pump',
  MONOBLOCK_ELECTRIC_PUMP: 'monoblock_electric_pump',
  OTHER: 'other',
} as const;

export const POWER_SOURCES = {
  BATTERY: 'battery',
  PETROL_DIESEL: 'petrol_diesel',
  ELECTRIC: 'electric',
  SOLAR: 'solar',
  MANUAL: 'manual',
} as const;

// 6. Role 4 — Fertilizer & Agricultural Input Categories (Module 10)
export const INPUT_PRODUCT_CATEGORIES = {
  FERTILIZERS: 'fertilizers',
  SEEDS: 'seeds',
  CROP_PROTECTION: 'crop_protection',
  MICRONUTRIENTS: 'micronutrients',
  AGRICULTURAL_SUPPLIES: 'agricultural_supplies',
} as const;

// Tractor Categories based on Horsepower (HP)
export const TRACTOR_CATEGORIES = {
  COMPACT: 'compact',     // < 35 HP
  MEDIUM: 'medium',       // 35 - 55 HP
  HEAVY: 'heavy',         // > 55 HP
} as const;

// Land Types
export const LAND_TYPES = {
  IRRIGATED: 'irrigated',
  DRYLAND: 'dryland',
  WETLAND: 'wetland',
  MIXED: 'mixed',
} as const;

// Irrigation Types
export const IRRIGATION_TYPES = {
  BOREWELL: 'borewell',
  CANAL: 'canal',
  DRIP: 'drip',
  SPRINKLER: 'sprinkler',
  RAIN_FED: 'rain_fed',
  OTHER: 'other',
} as const;

// Request Reference Prefixes
export const REQUEST_PREFIXES = {
  TRACTOR_WORK: 'TRW',
  SKILLED_WORKER: 'SWR',
  FERTILIZER_INPUT: 'FIR',
  CONTRACTOR: 'CTR',
  SPRAY_PUMP: 'SPR',
} as const;

// Request Statuses
export const REQUEST_STATUS = {
  OPEN: 'open',
  MATCHED: 'matched',
  CONFIRMED: 'confirmed',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
} as const;

// Module 16: Complete Standard Booking Lifecycle State Machine
export const BOOKING_LIFECYCLE_STATUS = {
  REQUESTED: 'requested',
  MATCHED: 'matched',
  QUOTED: 'quoted',
  ACCEPTED: 'accepted',
  SCHEDULED: 'scheduled',
  WORK_STARTED: 'work_started',
  WORK_COMPLETED: 'work_completed',
  PAYMENT: 'payment',
  RATING: 'rating',
  CLOSED: 'closed',
  // Exception states
  CANCELLED: 'cancelled',
  DISPUTED: 'disputed',
  NO_SHOW: 'no_show',
  RESCHEDULED: 'rescheduled',
} as const;

export const BOOKING_STATUS = BOOKING_LIFECYCLE_STATUS;

// Module 15: Progressive Multi-Tier Trust & Verification Levels
export const TRUST_VERIFICATION_LEVELS = {
  LEVEL_0_MOBILE: {
    level: 0,
    name: 'Mobile Verified',
    badge: '✓ Mobile verified',
    description: 'Phone number verified via OTP',
  },
  LEVEL_1_IDENTITY: {
    level: 1,
    name: 'Identity Verified',
    badge: '✓ Identity verified',
    description: 'Aadhaar / Government ID verified',
  },
  LEVEL_2_DOCUMENT: {
    level: 2,
    name: 'Equipment / Document Verified',
    badge: '✓ Equipment verified',
    description: 'RC book / Dealer license / Land records verified',
  },
  LEVEL_3_HISTORY: {
    level: 3,
    name: 'Work History Established',
    badge: '✓ Proven work history',
    description: 'At least 10 successfully completed platform jobs',
  },
  LEVEL_4_TRUSTED: {
    level: 4,
    name: 'Trusted Community Provider',
    badge: '★ Trusted Gold Provider',
    description: 'Rating >= 4.7 with 30+ completed jobs & zero disputes',
  },
} as const;

// Module 17: Multi-Tier Location Hierarchy & Expanding Radius Bands
export const LOCATION_RADIUS_BANDS = [5, 10, 15, 25] as const; // in km

// Module 18: Multi-Channel Rural Communication Channels
export const COMMUNICATION_CHANNELS = {
  IN_APP: 'in_app',
  SMS: 'sms',
  WHATSAPP: 'whatsapp',
  IVR_AGENT: 'ivr_agent',
} as const;

// Module 12 & 13: Contractor Multi-Village Project Statuses
export const CONTRACTOR_PROJECT_STATUS = {
  DRAFT: 'draft',
  OPEN: 'open',
  PARTIALLY_FULFILLED: 'partially_fulfilled',
  FULLY_FULFILLED: 'fully_fulfilled',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
} as const;

// Module 19: Strict Phase 1 Scope Guardrails
export const PHASE_1_EXCLUSIONS = [
  'crop_disease_ai',
  'drone_services',
  'loan_marketplace',
  'crop_insurance',
  'full_ecommerce',
  'satellite_analytics',
  'complex_iot',
  'national_marketplace',
] as const;

export const PAYMENT_STATUS = {
  PENDING: 'pending',
  COMPLETED: 'completed',
  FAILED: 'failed',
  REFUNDED: 'refunded',
} as const;

export const PAYMENT_METHODS = {
  UPI: 'upi',
  BANK_TRANSFER: 'bank_transfer',
  WALLET: 'wallet',
  CASH: 'cash',
  CARD: 'card',
} as const;

export const COMMISSION_RATE = 0.15; // 15%

// Module 6: Transparent Multi-Factor Pricing Baseline Defaults
export const PRICING_DEFAULTS = {
  BASE_RATES_PER_ACRE: {
    ploughing: 900,
    rotavator: 950,
    cultivator: 750,
    harrowing: 800,
    seed_drilling: 850,
    land_levelling: 1100,
    transport: 600,
    trailer_work: 650,
    other: 800,
  } as Record<string, number>,
  ATTACHMENT_CHARGES_PER_ACRE: {
    rotavator: 350,
    cultivator: 200,
    plough: 250,
    seed_drill: 300,
    trailer: 200,
    leveller: 300,
    harrow: 250,
    thresher: 450,
    sprayer: 250,
    other: 150,
  } as Record<string, number>,
  MOBILIZATION_BASE_KM: 3,         // First 3 km free mobilization
  MOBILIZATION_RATE_PER_KM: 35,     // ₹35 per km beyond base distance
  EXTRA_HOUR_RATE: 450,             // ₹450/hr for overtime
  DEFAULT_SEASONAL_MULTIPLIER: 1.0, // 1.0x baseline, up to 1.2x during peak sowing
} as const;

// Matching Engine Default Scoring Weights (Phase 1)
export const MATCHING_WEIGHTS = {
  DISTANCE: 0.40,          // 40% Distance scoring
  AVAILABILITY: 0.20,      // 20% Availability match
  RATING: 0.15,            // 15% Rating & reputation
  PRICE: 0.15,             // 15% Price competitiveness
  WORK_PREFERENCE: 0.10,   // 10% Work preference match
} as const;

export const DEFAULT_SEARCH_RADIUS_KM = 15;
export const DEFAULT_WORKER_RADIUS_KM = 10;
export const DEFAULT_MIN_ACRES = 2;

export const CANCELLATION_POLICY = {
  OVER_24H: 1.0, // 100% refund
  12_24H: 0.75, // 75% refund
  6_12H: 0.5, // 50% refund
  UNDER_6H: 0.25, // 25% refund
};

// Section 24: 1-Mandal Pilot Deployment Configuration (Tandur Pilot)
export const PILOT_MANDAL_CONFIG = {
  mandalName: 'Tandur',
  district: 'Vikarabad',
  state: 'Telangana',
  villages: [
    { name: 'Tangipalli', code: 'VIL-A', targetFarmers: 25, targetTractors: 6, targetWorkers: 5 },
    { name: 'Malkapur', code: 'VIL-B', targetFarmers: 15, targetTractors: 4, targetWorkers: 4 },
    { name: 'Kotbaspalli', code: 'VIL-C', targetFarmers: 12, targetTractors: 3, targetWorkers: 3 },
  ],
  quotas: {
    minTractorOwners: 10,
    maxTractorOwners: 20,
    minFarmers: 20,
    maxFarmers: 50,
    minWorkers: 10,
    maxWorkers: 20,
    minEquipmentProviders: 5,
    maxEquipmentProviders: 10,
    minSuppliers: 3,
    maxSuppliers: 5,
    minContractors: 2,
    maxContractors: 5,
  },
  pilotGoal: 'Can we complete real jobs successfully?',
} as const;

// Section 23: Phase 1 MVP — Exact 10-Sprint Development Roadmap
export const SPRINT_PLAN_MILESTONES = [
  { sprint: 1, name: 'Foundation', focus: 'Authentication, User roles, Location, Profiles' },
  { sprint: 2, name: 'Tractor Ecosystem', focus: 'Tractor Owner, Registration, Attachments, Availability, Farmer request' },
  { sprint: 3, name: 'Matching Engine', focus: 'Location matching, Availability matching, Equipment matching, Ranking' },
  { sprint: 4, name: 'Booking Machine', focus: 'Request, Accept, Reject, Schedule, Complete, Cancel' },
  { sprint: 5, name: 'Skilled Workers', focus: 'Worker profile, Skills, Availability, Worker requests, Worker matching' },
  { sprint: 6, name: 'Pumps & Sprayers', focus: 'Equipment profile, Sprayer/pump availability, Operator requirement, Dual combo' },
  { sprint: 7, name: 'Suppliers', focus: 'Supplier profile, Product catalogue, Availability enquiry, Farmer -> supplier request' },
  { sprint: 8, name: 'Contractors', focus: 'Contractor profile, Project creation, Bulk requirements, Resource allocation' },
  { sprint: 9, name: 'Trust & Reputation', focus: 'Verification tiers, Ratings, Reviews, Work history, No-show tracking' },
  { sprint: 10, name: 'Admin & Analytics', focus: 'Admin dashboard, User verification, Dispute management, Platform analytics' },
] as const;

// Section 26: 5-Phase Long-Term Agricultural Expansion Roadmap
export const FIVE_PHASE_ROADMAP = [
  { phase: 1, name: 'Phase 1: Local Equipment & Labor Coordination', scope: 'Tractor + Sprayer/Pump + Skilled Labor Local Coordination' },
  { phase: 2, name: 'Phase 2: Comprehensive Farm Inputs & Workforce', scope: 'Farmers + Workers + Inputs + Structured Micro-Hubs' },
  { phase: 3, name: 'Phase 3: End-to-End 30-Day Farm Operations', scope: 'Full Crop Lifecycle (Land Prep -> Seeding -> Spraying -> Harvest)' },
  { phase: 4, name: 'Phase 4: Agri-Logistics & Marketplace', scope: 'Post-Harvest Transport, Storage, Mandi Direct Buyers' },
  { phase: 5, name: 'Phase 5: AI-Driven Agricultural Operating Network', scope: 'Predictive Scheduling, Weather-linked Dispatch, Autonomous Ag' },
] as const;

// Dispute Reasons (Module 21)
export const DISPUTE_REASONS = {
  NO_SHOW: 'no_show',
  INCOMPLETE_WORK: 'incomplete_work',
  RATE_DISPUTE: 'rate_dispute',
  QUALITY_ISSUE: 'quality_issue',
  EQUIPMENT_BREAKDOWN: 'equipment_breakdown',
} as const;

// Section 31: The Locked Master Architectural Principle
export const MASTER_ARCHITECTURE_PIPELINE = [
  { step: 1, name: 'Identity', description: 'User registration & OTP authentication' },
  { step: 2, name: 'Roles', description: 'Multi-role assignment (Farmer, Contractor, Tractor Owner, Worker, Equipment, Supplier)' },
  { step: 3, name: 'Profiles', description: 'Decoupled domain profiles for each active role' },
  { step: 4, name: 'Resources', description: 'Tractors, Implements, Sprayers, Pumps, Skills, Products' },
  { step: 5, name: 'Availability', description: 'Unified common calendar & slot availability engine' },
  { step: 6, name: 'Requests', description: 'Farmer / Contractor work and resource demand requests' },
  { step: 7, name: 'Matching', description: 'Hard filtering + multi-factor scoring algorithm' },
  { step: 8, name: 'Booking', description: '15-state lifecycle booking management' },
  { step: 9, name: 'Work', description: 'On-field work sessions, GPS coordinates & acreage tracking' },
  { step: 10, name: 'Transaction', description: 'Secure escrow payment release and provider settlement' },
  { step: 11, name: 'Reputation', description: 'Universal cross-persona rating, reviews & progressive trust upgrade' },
] as const;




