// Shared type definitions for RuralConnect

export enum UserRole {
  FARMER = 'farmer',
  TRACTOR_OWNER = 'tractor_owner',
  WORKER = 'worker',
  CONTRACTOR = 'contractor',
  SUPPLIER = 'supplier',
}

export type VerificationStatus = 'unverified' | 'verified' | 'gold' | 'platinum';

export interface LocationHierarchy {
  village: string;
  mandal: string;
  district: string;
  state?: string;
  pincode?: string;
  lat?: number;
  lng?: number;
}

export interface GeoLocation {
  lat: number;
  lng: number;
  address?: string;
}

// Base User
export interface User {
  id: string;
  email?: string;
  phone: string;
  name: string;
  role: UserRole;
  profileImageUrl?: string;
  location: LocationHierarchy;
  verified: boolean;
  verificationStatus: VerificationStatus;
  rating: number;
  totalRatingsCount: number;
  createdAt: Date;
  updatedAt: Date;
}

// ----------------------------------------------------
// 1. Role 1 — Farmer
// ----------------------------------------------------

export type LandType = 'irrigated' | 'dryland' | 'wetland' | 'mixed';
export type IrrigationType = 'borewell' | 'canal' | 'drip' | 'sprinkler' | 'rain_fed' | 'other';

export interface FarmProfile {
  farmLocation: LocationHierarchy & { lat: number; lng: number };
  landAreaAcres: number;
  landType: LandType;
  crops: string[];
  irrigationType: IrrigationType;
  availableDates?: string[];
}

export interface FarmerProfile extends User {
  role: UserRole.FARMER;
  preferredLanguage: string;
  farm: FarmProfile;
}

// Tractor Work Request
export type TractorWorkType =
  | 'ploughing'
  | 'rotavator'
  | 'cultivator'
  | 'harrowing'
  | 'seed_drilling'
  | 'land_levelling'
  | 'transport'
  | 'trailer_work'
  | 'other';

export type AttachmentType =
  | 'rotavator'
  | 'cultivator'
  | 'plough'
  | 'seed_drill'
  | 'trailer'
  | 'leveller'
  | 'harrow'
  | 'thresher'
  | 'sprayer'
  | 'other';

export type TractorCategory = 'compact' | 'medium' | 'heavy';

export interface TractorWorkRequest {
  id: string;
  referenceCode: string; // e.g. "TRW-000124"
  farmerId: string;
  farmerName: string;
  farmerPhone: string;
  workType: TractorWorkType;
  farmLocation: LocationHierarchy & { lat: number; lng: number };
  acreage: number;
  preferredDate: string; // YYYY-MM-DD
  preferredTime: string; // e.g. "7:00 AM" or "morning"
  requiredHpMin?: number;
  requiredTractorCategory?: TractorCategory;
  requiredAttachment: AttachmentType;
  budgetMin?: number;
  budgetMax?: number;
  notes?: string;
  status: 'open' | 'matched' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled';
  createdAt: Date;
  updatedAt: Date;
}

// ----------------------------------------------------
// 2. Role 2 — Tractor Owner & Fleet Modeling
// ----------------------------------------------------

export interface TractorAttachment {
  id: string;
  type: AttachmentType;
  name: string;
  condition: 'new' | 'good' | 'fair' | 'needs_service';
  hourlyRate?: number;
  perAcreRate?: number;
}

export interface TractorAvailability {
  availableToday: boolean;
  operatingRadiusKm: number; // e.g. 15 km
  minWorkAcres: number; // e.g. 2 acres
  preferredWorkTypes: TractorWorkType[];
  weeklySchedule: Record<string, 'available' | 'booked' | 'off'>;
  unavailableDates?: string[]; // e.g. holidays ['2026-09-15', '2026-09-20']
}

export interface Tractor {
  id: string;
  ownerId: string;
  registrationNumber: string;
  brand: string;
  model: string;
  hp: number;
  category: TractorCategory;
  purchaseYear: number;
  currentCondition: 'excellent' | 'good' | 'fair' | 'needs_repair';
  serviceStatus: 'active' | 'in_maintenance' | 'retired';
  photos: string[];
  attachments: TractorAttachment[];
  availability: TractorAvailability;
  baseRatePerAcre?: number;
  baseRatePerHour?: number;
}

export interface TractorOwnerProfile extends User {
  role: UserRole.TRACTOR_OWNER;
  experienceYears: number;
  languages: string[];
  tractors: Tractor[];
}

// ----------------------------------------------------
// 3. Module 6: Multi-Factor Pricing Engine Types
// ----------------------------------------------------

export interface PricingCalculationInput {
  workType: TractorWorkType | string;
  acreage: number;
  attachmentType?: AttachmentType | string;
  distanceKm: number;
  estimatedHours?: number;
  isPeakSeason?: boolean;
  villageMultiplier?: number;
}

export interface PricingBreakdown {
  baseTractorWorkCharge: number;
  baseRatePerAcre: number;
  attachmentCharge: number;
  attachmentRatePerAcre: number;
  transportMobilizationCharge: number;
  mobilizationDistanceKm: number;
  extraHoursCharge: number;
  extraHoursCount: number;
  seasonalMultiplier: number;
  subtotal: number;
  totalExpectedPrice: number;
  platformFeeEstimate: number;
  pricePerAcreEffective: number;
  formulaDescription: string;
}

// ----------------------------------------------------
// 4. Role 3 — Skilled Worker & Matching Types (Modules 7 & 8)
// ----------------------------------------------------

export type WorkerSkillType =
  | 'tractor_operator'
  | 'sprayer_operator'
  | 'pump_technician'
  | 'irrigation_technician'
  | 'machinery_mechanic'
  | 'electrician'
  | 'general_skilled_worker'
  | 'other';

export interface WorkerSkillProficiency {
  skill: WorkerSkillType;
  experienceYears: number;
  isPrimary: boolean;
  certifications?: string[];
}

export interface SkilledWorkerProfile extends User {
  role: UserRole.WORKER;
  skills: WorkerSkillProficiency[];
  experienceYears: number;
  languages: string[];
  expectedDailyWage: number;
  expectedHourlyWage?: number;
  workRadiusKm: number; // e.g. 10 km
  availableToday: boolean;
  availableDateRange?: string;
  preferredTimeWindow?: string; // e.g. "6:00 AM - 5:00 PM"
}

export interface WorkerWorkRequest {
  id: string;
  referenceCode: string; // e.g. "SWR-000045"
  farmerId: string;
  farmerName: string;
  farmerPhone: string;
  requiredSkill: WorkerSkillType;
  workersCount: number; // e.g. 2 workers
  location: LocationHierarchy & { lat: number; lng: number };
  crop?: string; // e.g. "Cotton"
  acreage?: number;
  workDate: string; // YYYY-MM-DD
  timeWindow: string; // e.g. "6:00 AM - 5:00 PM" or "Morning"
  wageOfferPerWorker: number;
  notes?: string;
  status: 'open' | 'matched' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled';
  createdAt: Date;
  updatedAt: Date;
}

export interface WorkerCandidateMatch {
  workerId: string;
  workerName: string;
  workerPhone: string;
  village: string;
  distanceKm: number;
  matchedSkill: WorkerSkillType;
  experienceYears: number;
  rating: number;
  completedJobs: number;
  dailyWage: number;
  isWithinRadius: boolean;
  isAvailableOnDate: boolean;
  score: number;
  isEligible: boolean;
  exclusionReason?: string;
}

// ----------------------------------------------------
// 5. Spray & Pump Equipment Category & Combo Match (Module 9)
// ----------------------------------------------------

export type SprayPumpEquipmentType =
  | 'knapsack_battery_sprayer'
  | 'power_sprayer'
  | 'htp_sprayer'
  | 'tractor_mounted_boom_sprayer'
  | 'submersible_pump'
  | 'diesel_pump'
  | 'solar_pump'
  | 'monoblock_electric_pump'
  | 'other';

export type PowerSource = 'battery' | 'petrol_diesel' | 'electric' | 'solar' | 'manual';

export interface SprayPumpEquipment {
  id: string;
  ownerId: string;
  type: SprayPumpEquipmentType;
  brand: string;
  model: string;
  capacitySpecs: string; // e.g. "16 Litres", "35 LPM", "7.5 HP"
  powerSource: PowerSource;
  sprayCapacityPerDayAcres?: number;
  condition: 'new' | 'good' | 'fair';
  availableToday: boolean;
  operatingRadiusKm: number;
  operatorRequired: boolean;
  operatorProvidedWithRental: boolean;
  rentalRatePerDay: number;
  rentalRatePerAcre?: number;
  photos: string[];
}

export interface SprayPumpOwnerProfile extends User {
  equipmentFleet: SprayPumpEquipment[];
}

export interface SprayPumpWorkRequest {
  id: string;
  referenceCode: string; // e.g. "SPR-000078"
  farmerId: string;
  farmerName: string;
  crop: string; // e.g. "Cotton"
  acreage: number; // e.g. 3 acres
  preferredDate: string;
  preferredTime: string;
  sprayerType: SprayPumpEquipmentType;
  operatorRequired: boolean;
  location: LocationHierarchy & { lat: number; lng: number };
  status: 'open' | 'matched' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled';
}

export interface ComboMatchResult {
  equipmentMatch: SprayPumpEquipment & { ownerName: string; ownerPhone: string; distanceKm: number };
  operatorMatch?: SkilledWorkerProfile & { distanceKm: number };
  bundleType: 'equipment_with_operator' | 'equipment_only' | 'bundled_third_party_operator';
  totalEstimatedPrice: number;
  comboScore: number;
  distanceKm: number;
  isEligible: boolean;
}

// ----------------------------------------------------
// 6. Role 4 — Local Fertilizer & Input Supplier (Module 10)
// ----------------------------------------------------

export type InputProductCategory =
  | 'fertilizers'
  | 'seeds'
  | 'crop_protection'
  | 'micronutrients'
  | 'agricultural_supplies';

export interface InputProduct {
  id: string;
  name: string;
  category: InputProductCategory;
  brand: string;
  packSize: string; // e.g. "50 kg bag", "1 litre bottle"
  mrp: number;
  discountedPrice: number;
  inStock: boolean;
  isRegulated: boolean;
  licenseRequired?: string;
}

export interface InputSupplierProfile extends User {
  role: UserRole.SUPPLIER;
  shopName: string;
  ownerName: string;
  licenseNumbers: {
    fertilizerDealerLicense?: string;
    seedDealerLicense?: string;
    pesticideLicense?: string;
    gstin?: string;
  };
  isVerifiedDealer: boolean;
  categories: InputProductCategory[];
  operatingHours: string; // e.g. "8:00 AM - 8:00 PM"
  deliveryAvailable: boolean;
  deliveryRadiusKm: number; // e.g. 20 km
  inventory: InputProduct[];
}

export interface InputInquiryRequest {
  id: string;
  referenceCode: string; // e.g. "FIR-000012"
  farmerId: string;
  farmerName: string;
  village: string;
  categoriesRequested: InputProductCategory[];
  productNames: string[];
  quantityRequested: string;
  needDelivery: boolean;
  status: 'open' | 'quoted' | 'confirmed' | 'fulfilled' | 'cancelled';
}

// ----------------------------------------------------
// 7. Matching Engine Interfaces
// ----------------------------------------------------

export interface MatchingCriteria {
  farmerLocation: {
    lat: number;
    lng: number;
    village?: string;
    mandal?: string;
    district?: string;
  };
  workType: TractorWorkType;
  requiredAttachment: AttachmentType;
  acreage: number;
  date: string;
  time?: string;
  targetBudget?: number;
  minHp?: number;
}

export interface MatchScoreBreakdown {
  distanceScore: number; // max 40
  availabilityScore: number; // max 20
  ratingScore: number; // max 15
  priceScore: number; // max 15
  preferenceScore: number; // max 10
  totalScore: number; // 0 - 100
}

export interface CandidateTractorMatch {
  ownerId: string;
  ownerName: string;
  ownerPhone: string;
  ownerLocation: LocationHierarchy;
  ownerRating: number;
  ownerTotalJobs: number;
  verified: boolean;
  tractor: {
    id: string;
    brand: string;
    model: string;
    hp: number;
    category: TractorCategory;
    registrationNumber: string;
  };
  hasRequiredAttachment: boolean;
  distanceKm: number;
  isWithinRadius: boolean;
  isAvailableOnDate: boolean;
  meetsMinAcreage: boolean;
  estimatedPricePerAcre: number;
  scoreBreakdown: MatchScoreBreakdown;
  matchScore: number; // 0 - 100
  isEligible: boolean;
  exclusionReason?: string;
}

export interface MatchingResponse {
  requestId?: string;
  totalCandidatesEvaluated: number;
  eligibleMatches: CandidateTractorMatch[];
  excludedCandidates: CandidateTractorMatch[];
}

// ----------------------------------------------------
// 8. Other Platform Roles & Contractor Project Aggregation (Modules 12 & 13)
// ----------------------------------------------------

export interface ContractorProfile extends User {
  role: UserRole.CONTRACTOR;
  teamSize: number;
  specializations: string[];
  capacityAcresMin: number;
  capacityAcresMax: number;
  experienceYears: number;
}

export interface ContractorRequirementItem {
  id: string;
  category: 'tractor' | 'worker' | 'sprayer' | 'equipment';
  specName: string; // e.g. "50 HP Tractor", "Sprayer Operator", "HTP Sprayer"
  quantityRequired: number;
  quantityFulfilled: number;
  unitRateBudget: number;
  notes?: string;
}

export interface ContractorProject {
  id: string;
  referenceCode: string; // e.g. "CTR-000089"
  contractorId: string;
  contractorName: string;
  projectName: string;
  villagesCovered: string[]; // e.g. ["Village X", "Village Y", "Village Z"]
  totalAcreage: number; // e.g. 50 acres
  startDate: string;
  durationDays: number; // e.g. 5 days
  status: 'draft' | 'open' | 'partially_fulfilled' | 'fully_fulfilled' | 'in_progress' | 'completed' | 'cancelled';
  requirements: ContractorRequirementItem[];
  fulfillmentPercentage: number; // 0 - 100
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProjectFulfillmentReport {
  projectId: string;
  referenceCode: string;
  totalRequirementsCount: number;
  fulfilledRequirementsCount: number;
  percentageComplete: number;
  shortages: { category: string; specName: string; missingCount: number }[];
  isReadyForDispatch: boolean;
}

// ----------------------------------------------------
// 9. Module 11: Supplier Search & Availability Comparison
// ----------------------------------------------------

export interface SupplierSearchResultItem {
  supplierId: string;
  shopName: string;
  ownerName: string;
  phone: string;
  village: string;
  distanceKm: number;
  isVerifiedDealer: boolean;
  fertilizerLicense?: string;
  isAvailable: boolean;
  stockStatus: 'in_stock' | 'low_stock' | 'out_of_stock';
  priceQuote?: number;
  deliveryAvailable: boolean;
}

// ----------------------------------------------------
// 10. Module 15: Progressive 5-Tier Trust & Verification
// ----------------------------------------------------

export type VerificationTier = 0 | 1 | 2 | 3 | 4;

export interface TrustProfile {
  userId: string;
  tier: VerificationTier;
  tierName: string;
  badges: string[]; // ['✓ Mobile verified', '✓ Equipment verified', '★ 4.8 rating', '42 completed jobs']
  isMobileVerified: boolean;
  isIdentityVerified: boolean;
  isEquipmentVerified: boolean;
  completedJobsCount: number;
  averageRating: number;
  disputeCount: number;
  isTrustedGold: boolean;
}

// ----------------------------------------------------
// 11. Module 16: Complete Standard Booking Lifecycle State Machine
// ----------------------------------------------------

export type BookingLifecycleStatus =
  | 'requested'
  | 'matched'
  | 'quoted'
  | 'accepted'
  | 'scheduled'
  | 'work_started'
  | 'work_completed'
  | 'payment'
  | 'rating'
  | 'closed'
  // Exception states
  | 'cancelled'
  | 'disputed'
  | 'no_show'
  | 'rescheduled';

export interface BookingStateTransition {
  bookingId: string;
  fromStatus: BookingLifecycleStatus;
  toStatus: BookingLifecycleStatus;
  triggeredByUserId: string;
  timestamp: Date;
  reason?: string;
  metadata?: Record<string, any>;
}

export interface Booking {
  id: string;
  referenceCode: string; // e.g. "BKG-000124"
  requestId?: string;
  projectId?: string;
  farmerId: string;
  ownerId?: string;
  workerId?: string;
  equipmentId?: string;
  serviceType: 'tractor_work' | 'skilled_worker' | 'spray_pump' | 'input_supply' | 'contractor_project';
  startDate: Date;
  endDate: Date;
  status: BookingLifecycleStatus;
  totalAcreage?: number;
  ratePerAcre?: number;
  totalAmount: number;
  commissionAmount: number;
  stateHistory?: BookingStateTransition[];
  createdAt: Date;
  updatedAt: Date;
}

// ----------------------------------------------------
// 12. Module 17: Multi-Tier Location & Expanding Search Bands
// ----------------------------------------------------

export type LocationRadiusBand = 5 | 10 | 15 | 25;

export interface ExpandingRadiusSearchResult<T> {
  currentRadiusBandKm: LocationRadiusBand;
  totalFound: number;
  results: T[];
  expandedToNextBand: boolean;
}

// ----------------------------------------------------
// 13. Module 18: Multi-Channel Rural Communication Dispatcher
// ----------------------------------------------------

export type RuralCommunicationChannel = 'in_app' | 'sms' | 'whatsapp' | 'ivr_agent';

export interface RuralCommunicationMessage {
  recipientId: string;
  recipientPhone: string;
  preferredLanguage: string;
  channel: RuralCommunicationChannel;
  title: string;
  body: string;
  referenceCode?: string;
  actionUrl?: string;
  status: 'queued' | 'sent' | 'delivered' | 'failed';
  timestamp: Date;
}

export interface Rating {
  id: string;
  bookingId: string;
  reviewerId: string;
  revieweeId: string;
  quality: number; // 1-5
  punctuality: number; // 1-5
  professionalism: number; // 1-5
  communication: number; // 1-5
  averageScore?: number;
  comment?: string;
  images?: string[];
  createdAt: Date;
}

export interface Payment {
  id: string;
  bookingId: string;
  amount: number;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  paymentMethod: 'upi' | 'bank_transfer' | 'wallet' | 'cash' | 'card';
  transactionId: string;
  createdAt: Date;
  updatedAt: Date;
}

// ----------------------------------------------------
// 14. Normalized Tables & Section 21 Data Entities
// ----------------------------------------------------

export interface Farm {
  id: string;
  farmerId: string;
  surveyNumber?: string;
  landAreaAcres: number;
  landType: 'irrigated' | 'dryland' | 'wetland' | 'mixed';
  village: string;
  mandal: string;
  district: string;
  latitude: number;
  longitude: number;
  soilType?: string;
}

export interface Quote {
  id: string;
  requestId: string;
  providerId: string;
  proposedAmount: number;
  baseRatePerAcre: number;
  attachmentCharge: number;
  mobilizationFee: number;
  estimatedHours?: number;
  status: 'pending' | 'accepted' | 'rejected' | 'expired';
}

export interface WorkSession {
  id: string;
  bookingId: string;
  startedAt: Date;
  completedAt?: Date;
  startLatitude?: number;
  startLongitude?: number;
  endLatitude?: number;
  endLongitude?: number;
  acresCompleted?: number;
  proofPhotos: string[];
  farmerVerified: boolean;
  notes?: string;
}

export interface Dispute {
  id: string;
  bookingId: string;
  raisedByUserId: string;
  reason: 'no_show' | 'incomplete_work' | 'rate_dispute' | 'quality_issue' | 'equipment_breakdown';
  description: string;
  evidencePhotos: string[];
  status: 'open' | 'under_investigation' | 'resolved' | 'dismissed';
  resolution?: string;
  refundAmount?: number;
  resolvedAt?: Date;
}

export interface MatchRecord {
  id: string;
  requestId: string;
  providerId: string;
  resourceType: 'tractor' | 'worker' | 'sprayer' | 'supplier';
  matchScore: number;
  distanceKm: number;
  isEligible: boolean;
  scoreBreakdown: Record<string, number>;
}

// ----------------------------------------------------
// 15. Section 22: The Golden Relationship Chain Model
// ----------------------------------------------------

export interface GoldenChainAuditRecord {
  userId: string;
  userName: string;
  profileRole: string;
  resourceName: string;
  resourceSpec: string;
  availabilityWindow: string;
  workRequestId: string;
  workDescription: string;
  bookingRefCode: string;
  transactionAmount: number;
  ratingGiven: number;
  ratingComment: string;
  chainCompletedAt: Date;
}

// ----------------------------------------------------
// 17. Sections 11–20: Normalized Architecture Entities
// ----------------------------------------------------

export interface UserRoleEntry {
  id: string;
  userId: string;
  role: 'FARMER' | 'CONTRACTOR' | 'TRACTOR_OWNER' | 'SKILLED_WORKER' | 'EQUIPMENT_OWNER' | 'SUPPLIER';
  isActive: boolean;
  createdAt: Date;
}

export interface UserPreference {
  id: string;
  userId: string;
  currentRole: 'FARMER' | 'CONTRACTOR' | 'TRACTOR_OWNER' | 'SKILLED_WORKER' | 'EQUIPMENT_OWNER' | 'SUPPLIER';
  preferredLanguage: string;
  theme: string;
  updatedAt: Date;
}

export interface Location {
  id: string;
  village: string;
  mandal: string;
  district: string;
  state: string;
  pincode?: string;
  latitude: number;
  longitude: number;
}

export interface Skill {
  id: string;
  name: string; // e.g. "Tractor Operator", "Sprayer Operator", "Pump Technician"
  category: string;
}

export interface WorkerSkill {
  id: string;
  workerId: string;
  skillId: string;
  skillName?: string;
  experienceYears: number;
}

export type EquipmentType = 'SPRAYER' | 'PUMP' | 'WATER_PUMP' | 'AGRICULTURAL_MACHINE' | 'OTHER';

export interface Equipment {
  id: string;
  ownerId: string;
  equipmentType: EquipmentType;
  brand: string;
  model: string;
  capacity: string;
  condition: string;
  locationId: string;
  rentalRatePerDay: number;
  status: 'active' | 'in_use' | 'maintenance';
}

export type ResourceType = 'TRACTOR' | 'WORKER' | 'EQUIPMENT';
export type AvailabilitySlotStatus = 'AVAILABLE' | 'BOOKED' | 'MAINTENANCE' | 'UNAVAILABLE';

export interface UnifiedAvailability {
  id: string;
  resourceType: ResourceType;
  resourceId: string;
  date: string; // YYYY-MM-DD
  startTime: string; // "07:00"
  endTime: string; // "17:00"
  status: AvailabilitySlotStatus;
}




