// Validation schemas using Zod for RuralConnect
import { z } from 'zod';

export const LocationHierarchySchema = z.object({
  village: z.string().min(1, 'Village is required'),
  mandal: z.string().min(1, 'Mandal is required'),
  district: z.string().min(1, 'District is required'),
  state: z.string().default('Telangana'),
  pincode: z.string().regex(/^[0-9]{6}$/, 'Invalid 6-digit PIN code').optional(),
  lat: z.number().min(-90).max(90).optional(),
  lng: z.number().min(-180).max(180).optional(),
});

export const UserRegistrationSchema = z.object({
  phone: z.string().regex(/^[6-9][0-9]{9}$/, 'Invalid 10-digit Indian phone number'),
  email: z.string().email('Invalid email address').optional(),
  name: z.string().min(2, 'Name must be at least 2 characters'),
  role: z.enum(['farmer', 'tractor_owner', 'worker', 'contractor', 'supplier']),
  location: LocationHierarchySchema,
  preferredLanguage: z.string().default('Telugu'),
});

// 1. Farmer Profile Schema
export const FarmerProfileSchema = z.object({
  landAreaAcres: z.number().positive('Land area must be greater than 0'),
  landType: z.enum(['irrigated', 'dryland', 'wetland', 'mixed']),
  crops: z.array(z.string()).min(1, 'At least one crop must be specified'),
  irrigationType: z.enum(['borewell', 'canal', 'drip', 'sprinkler', 'rain_fed', 'other']),
  farmLocation: LocationHierarchySchema.extend({
    lat: z.number().min(-90).max(90),
    lng: z.number().min(-180).max(180),
  }),
  availableDates: z.array(z.string()).optional(),
});

// 2. Tractor Work Request Schema (TRW)
export const TractorWorkRequestSchema = z.object({
  farmerId: z.string().min(1, 'Farmer ID is required'),
  farmerName: z.string().min(2, 'Farmer name is required'),
  farmerPhone: z.string().regex(/^[6-9][0-9]{9}$/, 'Invalid phone number'),
  workType: z.enum([
    'ploughing',
    'rotavator',
    'cultivator',
    'harrowing',
    'seed_drilling',
    'land_levelling',
    'transport',
    'trailer_work',
    'other',
  ]),
  farmLocation: LocationHierarchySchema.extend({
    lat: z.number(),
    lng: z.number(),
  }),
  acreage: z.number().positive('Acreage must be greater than 0'),
  preferredDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be YYYY-MM-DD format'),
  preferredTime: z.string().min(1, 'Preferred time is required (e.g. 7:00 AM)'),
  requiredHpMin: z.number().int().positive().optional(),
  requiredTractorCategory: z.enum(['compact', 'medium', 'heavy']).optional(),
  requiredAttachment: z.enum([
    'rotavator',
    'cultivator',
    'plough',
    'seed_drill',
    'trailer',
    'leveller',
    'harrow',
    'thresher',
    'sprayer',
    'other',
  ]),
  budgetMin: z.number().positive().optional(),
  budgetMax: z.number().positive().optional(),
  notes: z.string().max(500).optional(),
});

// 3. Tractor Attachment & Fleet Registration Schema
export const TractorAttachmentSchema = z.object({
  type: z.enum([
    'rotavator',
    'cultivator',
    'plough',
    'seed_drill',
    'trailer',
    'leveller',
    'harrow',
    'thresher',
    'sprayer',
    'other',
  ]),
  name: z.string().min(2, 'Attachment name is required'),
  condition: z.enum(['new', 'good', 'fair', 'needs_service']),
  hourlyRate: z.number().positive().optional(),
  perAcreRate: z.number().positive().optional(),
});

export const TractorAvailabilitySchema = z.object({
  availableToday: z.boolean(),
  operatingRadiusKm: z.number().positive().default(15),
  minWorkAcres: z.number().positive().default(2),
  preferredWorkTypes: z.array(
    z.enum([
      'ploughing',
      'rotavator',
      'cultivator',
      'harrowing',
      'seed_drilling',
      'land_levelling',
      'transport',
      'trailer_work',
      'other',
    ])
  ),
  weeklySchedule: z.record(
    z.enum(['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']),
    z.enum(['available', 'booked', 'off'])
  ),
  unavailableDates: z.array(z.string()).optional(),
});

export const TractorRegistrationSchema = z.object({
  registrationNumber: z.string().min(5, 'Valid registration plate number is required'),
  brand: z.string().min(2, 'Tractor brand is required'),
  model: z.string().min(1, 'Tractor model is required'),
  hp: z.number().int().min(15).max(150, 'Horsepower must be between 15 and 150 HP'),
  category: z.enum(['compact', 'medium', 'heavy']),
  purchaseYear: z.number().int().min(1980).max(2030),
  currentCondition: z.enum(['excellent', 'good', 'fair', 'needs_repair']),
  serviceStatus: z.enum(['active', 'in_maintenance', 'retired']).default('active'),
  photos: z.array(z.string()).default([]),
  attachments: z.array(TractorAttachmentSchema).min(1, 'Tractor must have at least one attachment registered'),
  availability: TractorAvailabilitySchema,
  baseRatePerAcre: z.number().positive().optional(),
  baseRatePerHour: z.number().positive().optional(),
});

// 4. Module 6: Pricing Calculation Schema
export const PricingCalculationSchema = z.object({
  workType: z.string().min(1),
  acreage: z.number().positive(),
  attachmentType: z.string().optional(),
  distanceKm: z.number().nonnegative().default(0),
  estimatedHours: z.number().positive().optional(),
  isPeakSeason: z.boolean().default(false),
  villageMultiplier: z.number().positive().default(1.0),
});

// 5. Role 3 — Skilled Worker & Worker Request Schemas (Modules 7 & 8)
export const WorkerSkillProficiencySchema = z.object({
  skill: z.enum([
    'tractor_operator',
    'sprayer_operator',
    'pump_technician',
    'irrigation_technician',
    'machinery_mechanic',
    'electrician',
    'general_skilled_worker',
    'other',
  ]),
  experienceYears: z.number().int().nonnegative(),
  isPrimary: z.boolean().default(false),
  certifications: z.array(z.string()).optional(),
});

export const SkilledWorkerProfileSchema = z.object({
  skills: z.array(WorkerSkillProficiencySchema).min(1, 'At least one skill must be registered'),
  experienceYears: z.number().int().nonnegative(),
  languages: z.array(z.string()).min(1),
  expectedDailyWage: z.number().positive(),
  expectedHourlyWage: z.number().positive().optional(),
  workRadiusKm: z.number().positive().default(10),
  availableToday: z.boolean().default(true),
  preferredTimeWindow: z.string().default('6:00 AM - 5:00 PM'),
});

export const WorkerWorkRequestSchema = z.object({
  farmerId: z.string().min(1),
  farmerName: z.string().min(2),
  farmerPhone: z.string().regex(/^[6-9][0-9]{9}$/),
  requiredSkill: z.enum([
    'tractor_operator',
    'sprayer_operator',
    'pump_technician',
    'irrigation_technician',
    'machinery_mechanic',
    'electrician',
    'general_skilled_worker',
    'other',
  ]),
  workersCount: z.number().int().positive().default(1),
  location: LocationHierarchySchema.extend({
    lat: z.number(),
    lng: z.number(),
  }),
  crop: z.string().optional(),
  acreage: z.number().positive().optional(),
  workDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  timeWindow: z.string().default('6:00 AM - 5:00 PM'),
  wageOfferPerWorker: z.number().positive(),
  notes: z.string().max(500).optional(),
});

// 6. Spray & Pump Equipment Schemas (Module 9)
export const SprayPumpEquipmentSchema = z.object({
  type: z.enum([
    'knapsack_battery_sprayer',
    'power_sprayer',
    'htp_sprayer',
    'tractor_mounted_boom_sprayer',
    'submersible_pump',
    'diesel_pump',
    'solar_pump',
    'monoblock_electric_pump',
    'other',
  ]),
  brand: z.string().min(1),
  model: z.string().min(1),
  capacitySpecs: z.string().min(1),
  powerSource: z.enum(['battery', 'petrol_diesel', 'electric', 'solar', 'manual']),
  sprayCapacityPerDayAcres: z.number().positive().optional(),
  condition: z.enum(['new', 'good', 'fair']),
  availableToday: z.boolean().default(true),
  operatingRadiusKm: z.number().positive().default(15),
  operatorRequired: z.boolean().default(true),
  operatorProvidedWithRental: z.boolean().default(false),
  rentalRatePerDay: z.number().positive(),
  rentalRatePerAcre: z.number().positive().optional(),
  photos: z.array(z.string()).default([]),
});

export const SprayPumpWorkRequestSchema = z.object({
  farmerId: z.string().min(1),
  farmerName: z.string().min(2),
  crop: z.string().min(1),
  acreage: z.number().positive(),
  preferredDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  preferredTime: z.string().min(1),
  sprayerType: z.enum([
    'knapsack_battery_sprayer',
    'power_sprayer',
    'htp_sprayer',
    'tractor_mounted_boom_sprayer',
    'submersible_pump',
    'diesel_pump',
    'solar_pump',
    'monoblock_electric_pump',
    'other',
  ]),
  operatorRequired: z.boolean().default(true),
  location: LocationHierarchySchema.extend({
    lat: z.number(),
    lng: z.number(),
  }),
});

// 7. Role 4 — Local Fertilizer & Input Supplier Schemas (Module 10)
export const InputProductSchema = z.object({
  name: z.string().min(2),
  category: z.enum([
    'fertilizers',
    'seeds',
    'crop_protection',
    'micronutrients',
    'agricultural_supplies',
  ]),
  brand: z.string().min(1),
  packSize: z.string().min(1),
  mrp: z.number().positive(),
  discountedPrice: z.number().positive(),
  inStock: z.boolean().default(true),
  isRegulated: z.boolean().default(false),
  licenseRequired: z.string().optional(),
});

export const InputSupplierProfileSchema = z.object({
  shopName: z.string().min(2),
  ownerName: z.string().min(2),
  licenseNumbers: z.object({
    fertilizerDealerLicense: z.string().optional(),
    seedDealerLicense: z.string().optional(),
    pesticideLicense: z.string().optional(),
    gstin: z.string().optional(),
  }),
  isVerifiedDealer: z.boolean().default(false),
  categories: z.array(
    z.enum([
      'fertilizers',
      'seeds',
      'crop_protection',
      'micronutrients',
      'agricultural_supplies',
    ])
  ).min(1),
  operatingHours: z.string().default('8:00 AM - 8:00 PM'),
  deliveryAvailable: z.boolean().default(false),
  deliveryRadiusKm: z.number().positive().default(20),
  inventory: z.array(InputProductSchema).default([]),
});

export const InputInquiryRequestSchema = z.object({
  farmerId: z.string().min(1),
  farmerName: z.string().min(2),
  village: z.string().min(1),
  categoriesRequested: z.array(
    z.enum([
      'fertilizers',
      'seeds',
      'crop_protection',
      'micronutrients',
      'agricultural_supplies',
    ])
  ).min(1),
  productNames: z.array(z.string()).min(1),
  quantityRequested: z.string().min(1),
  needDelivery: z.boolean().default(false),
});

// 8. Contractor Project Aggregator Schema (Modules 12 & 13)
export const ContractorRequirementItemSchema = z.object({
  category: z.enum(['tractor', 'worker', 'sprayer', 'equipment']),
  specName: z.string().min(2),
  quantityRequired: z.number().int().positive(),
  unitRateBudget: z.number().positive(),
  notes: z.string().optional(),
});

export const ContractorProjectSchema = z.object({
  contractorId: z.string().min(1),
  contractorName: z.string().min(2),
  projectName: z.string().min(3),
  villagesCovered: z.array(z.string()).min(1),
  totalAcreage: z.number().positive(),
  startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  durationDays: z.number().int().positive().default(5),
  requirements: z.array(ContractorRequirementItemSchema).min(1),
  notes: z.string().optional(),
});

// 9. Supplier Product Search Query Schema (Module 11)
export const SupplierProductSearchSchema = z.object({
  productQuery: z.string().min(2),
  category: z.enum([
    'fertilizers',
    'seeds',
    'crop_protection',
    'micronutrients',
    'agricultural_supplies',
  ]).optional(),
  farmerLocation: z.object({
    lat: z.number(),
    lng: z.number(),
  }),
  maxRadiusKm: z.number().positive().default(25),
  requireDelivery: z.boolean().default(false),
});

// 10. Booking State Machine Transition Schema (Module 16)
export const BookingStateTransitionSchema = z.object({
  bookingId: z.string().min(1),
  fromStatus: z.enum([
    'requested',
    'matched',
    'quoted',
    'accepted',
    'scheduled',
    'work_started',
    'work_completed',
    'payment',
    'rating',
    'closed',
    'cancelled',
    'disputed',
    'no_show',
    'rescheduled',
  ]),
  toStatus: z.enum([
    'requested',
    'matched',
    'quoted',
    'accepted',
    'scheduled',
    'work_started',
    'work_completed',
    'payment',
    'rating',
    'closed',
    'cancelled',
    'disputed',
    'no_show',
    'rescheduled',
  ]),
  triggeredByUserId: z.string().min(1),
  reason: z.string().optional(),
  metadata: z.record(z.any()).optional(),
});

// 11. Rural Communication Message Schema (Module 18)
export const RuralCommunicationMessageSchema = z.object({
  recipientId: z.string().min(1),
  recipientPhone: z.string().regex(/^[6-9][0-9]{9}$/),
  preferredLanguage: z.string().default('Telugu'),
  channel: z.enum(['in_app', 'sms', 'whatsapp', 'ivr_agent']),
  title: z.string().min(1),
  body: z.string().min(1),
  referenceCode: z.string().optional(),
  actionUrl: z.string().url().optional(),
});

// Matching Criteria Schema
export const MatchingCriteriaSchema = z.object({
  farmerLocation: z.object({
    lat: z.number(),
    lng: z.number(),
    village: z.string().optional(),
    mandal: z.string().optional(),
    district: z.string().optional(),
  }),
  workType: z.enum([
    'ploughing',
    'rotavator',
    'cultivator',
    'harrowing',
    'seed_drilling',
    'land_levelling',
    'transport',
    'trailer_work',
    'other',
  ]),
  requiredAttachment: z.enum([
    'rotavator',
    'cultivator',
    'plough',
    'seed_drill',
    'trailer',
    'leveller',
    'harrow',
    'thresher',
    'sprayer',
    'other',
  ]),
  acreage: z.number().positive(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  time: z.string().optional(),
  targetBudget: z.number().positive().optional(),
  minHp: z.number().positive().optional(),
});

// Booking & Rating Schemas
export const BookingSchema = z.object({
  requestId: z.string().optional(),
  farmerId: z.string().uuid(),
  ownerId: z.string().uuid(),
  tractorId: z.string().uuid().optional(),
  workerId: z.string().uuid().optional(),
  equipmentId: z.string().uuid().optional(),
  startDate: z.coerce.date(),
  endDate: z.coerce.date(),
  totalAcreage: z.number().positive().optional(),
  ratePerAcre: z.number().positive().optional(),
  totalAmount: z.number().positive(),
});

export const RatingSchema = z.object({
  bookingId: z.string().uuid(),
  quality: z.number().min(1).max(5),
  punctuality: z.number().min(1).max(5),
  professionalism: z.number().min(1).max(5),
  communication: z.number().min(1).max(5),
  comment: z.string().min(5).max(500).optional(),
});

export type UserRegistration = z.infer<typeof UserRegistrationSchema>;
export type FarmerProfileInput = z.infer<typeof FarmerProfileSchema>;
export type TractorWorkRequestInput = z.infer<typeof TractorWorkRequestSchema>;
export type TractorRegistrationInput = z.infer<typeof TractorRegistrationSchema>;
export type PricingCalculationInput = z.infer<typeof PricingCalculationSchema>;
export type SkilledWorkerProfileInput = z.infer<typeof SkilledWorkerProfileSchema>;
export type WorkerWorkRequestInput = z.infer<typeof WorkerWorkRequestSchema>;
export type SprayPumpEquipmentInput = z.infer<typeof SprayPumpEquipmentSchema>;
export type SprayPumpWorkRequestInput = z.infer<typeof SprayPumpWorkRequestSchema>;
export type InputSupplierProfileInput = z.infer<typeof InputSupplierProfileSchema>;
export type InputInquiryRequestInput = z.infer<typeof InputInquiryRequestSchema>;
export type ContractorProjectInput = z.infer<typeof ContractorProjectSchema>;
export type SupplierProductSearchInput = z.infer<typeof SupplierProductSearchSchema>;
export type BookingStateTransitionInput = z.infer<typeof BookingStateTransitionSchema>;
export type RuralCommunicationMessageInput = z.infer<typeof RuralCommunicationMessageSchema>;
export type MatchingCriteriaInput = z.infer<typeof MatchingCriteriaSchema>;
export type BookingInput = z.infer<typeof BookingSchema>;
export type RatingInput = z.infer<typeof RatingSchema>;
