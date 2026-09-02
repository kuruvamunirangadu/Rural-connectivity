// Matching & Pricing engine for RuralConnect
// Implements:
// 1. Module 5: Tractor Work Matching Engine with Strict Hard Filtering
// 2. Module 6: Transparent Multi-Factor Pricing Engine
// 3. Module 7 & 8: Skilled Worker Availability & Matching Engine
// 4. Module 9: Spray & Pump Dual Combo Matching (Equipment + Operator + Farmer)

import {
  CandidateTractorMatch,
  ComboMatchResult,
  MatchingCriteria,
  MatchingResponse,
  MatchScoreBreakdown,
  PricingBreakdown,
  PricingCalculationInput,
  SkilledWorkerProfile,
  SprayPumpEquipment,
  SprayPumpWorkRequest,
  Tractor,
  TractorOwnerProfile,
  WorkerCandidateMatch,
  WorkerWorkRequest,
} from '@ruralconnect/shared-types';
import { PRICING_DEFAULTS } from '@ruralconnect/constants';

/**
 * Calculate distance between two coordinates using Haversine formula (in km)
 */
export function calculateDistance(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const R = 6371; // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10; // Round to 1 decimal place
}

/**
 * Check if a date string falls on a specific day of week
 */
export function getDayOfWeek(dateStr: string): string {
  const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  const d = new Date(dateStr);
  return days[d.getDay()];
}

// =========================================================================
// MODULE 6: MULTI-FACTOR PRICING ENGINE
// =========================================================================

/**
 * Calculates transparent multi-factor expected price based on:
 * Work + Area + Equipment + Distance + Time = Expected Price
 * Formula:
 * (Base Tractor Rate + Attachment Charge) * Acreage + Transport Mobilization + Extra Hours
 */
export function calculateExpectedPrice(input: PricingCalculationInput): PricingBreakdown {
  const workTypeKey = (input.workType || 'ploughing').toLowerCase();
  const attachmentKey = (input.attachmentType || '').toLowerCase();

  // 1. Base Tractor Work Rate per Acre
  const baseRatePerAcre =
    PRICING_DEFAULTS.BASE_RATES_PER_ACRE[workTypeKey] ?? 850;
  const baseTractorWorkCharge = baseRatePerAcre * input.acreage;

  // 2. Attachment Charge per Acre
  const attachmentRatePerAcre = attachmentKey
    ? (PRICING_DEFAULTS.ATTACHMENT_CHARGES_PER_ACRE[attachmentKey] ?? 200)
    : 0;
  const attachmentCharge = attachmentRatePerAcre * input.acreage;

  // 3. Transport / Mobilization Distance Charge
  const baseFreeKm = PRICING_DEFAULTS.MOBILIZATION_BASE_KM;
  const mobilizationDistanceKm = Math.max(0, input.distanceKm - baseFreeKm);
  const transportMobilizationCharge =
    mobilizationDistanceKm * PRICING_DEFAULTS.MOBILIZATION_RATE_PER_KM;

  // 4. Extra-Hours Charge
  const extraHoursCount = Math.max(0, (input.estimatedHours ?? 0) - (input.acreage * 1.5));
  const extraHoursCharge = extraHoursCount * PRICING_DEFAULTS.EXTRA_HOUR_RATE;

  // 5. Regional & Seasonal Adjustment
  const seasonalMultiplier = input.isPeakSeason ? 1.15 : (input.villageMultiplier ?? 1.0);

  const subtotal =
    (baseTractorWorkCharge + attachmentCharge + transportMobilizationCharge + extraHoursCharge) *
    seasonalMultiplier;

  const totalExpectedPrice = Math.round(subtotal);
  const platformFeeEstimate = Math.round(totalExpectedPrice * 0.05); // 5% fee
  const pricePerAcreEffective = Math.round(totalExpectedPrice / input.acreage);

  const formulaDescription =
    `Base (${baseRatePerAcre}/ac × ${input.acreage}ac = ₹${baseTractorWorkCharge}) + ` +
    `Attachment (${attachmentRatePerAcre}/ac × ${input.acreage}ac = ₹${attachmentCharge}) + ` +
    `Mobilization (${mobilizationDistanceKm}km @ ₹${PRICING_DEFAULTS.MOBILIZATION_RATE_PER_KM}/km = ₹${transportMobilizationCharge})` +
    (extraHoursCharge > 0 ? ` + Overtime (₹${extraHoursCharge})` : '') +
    (seasonalMultiplier !== 1.0 ? ` × Season Multiplier (${seasonalMultiplier}x)` : '');

  return {
    baseTractorWorkCharge,
    baseRatePerAcre,
    attachmentCharge,
    attachmentRatePerAcre,
    transportMobilizationCharge,
    mobilizationDistanceKm,
    extraHoursCharge,
    extraHoursCount,
    seasonalMultiplier,
    subtotal,
    totalExpectedPrice,
    platformFeeEstimate,
    pricePerAcreEffective,
    formulaDescription,
  };
}

// =========================================================================
// MODULE 5: TRACTOR WORK MATCHING ENGINE (Strict Hard Filtering)
// =========================================================================

export function evaluateCandidateTractor(
  owner: TractorOwnerProfile,
  tractor: Tractor,
  criteria: MatchingCriteria
): CandidateTractorMatch {
  const ownerLat = owner.location.lat ?? 0;
  const ownerLng = owner.location.lng ?? 0;
  const farmerLat = criteria.farmerLocation.lat;
  const farmerLng = criteria.farmerLocation.lng;

  const distanceKm = calculateDistance(farmerLat, farmerLng, ownerLat, ownerLng);
  const operatingRadius = tractor.availability?.operatingRadiusKm ?? 15;
  const minWorkAcres = tractor.availability?.minWorkAcres ?? 2;

  // 1. Hard Filtering Checks
  const matchingAttachment = tractor.attachments.find(
    (att) => att.type === criteria.requiredAttachment
  );
  const hasRequiredAttachment = !!matchingAttachment;
  const isWithinRadius = distanceKm <= operatingRadius;
  const meetsMinAcreage = criteria.acreage >= minWorkAcres;

  const dayOfWeek = criteria.date ? getDayOfWeek(criteria.date) : 'monday';
  const scheduleStatus = tractor.availability?.weeklySchedule?.[dayOfWeek] ?? 'available';
  const isHoliday = tractor.availability?.unavailableDates?.includes(criteria.date) ?? false;
  const isAvailableOnDate = scheduleStatus !== 'booked' && scheduleStatus !== 'off' && !isHoliday;

  const meetsHpReq = !criteria.minHp || tractor.hp >= criteria.minHp;

  let isEligible = true;
  let exclusionReason: string | undefined;

  if (!hasRequiredAttachment) {
    isEligible = false;
    exclusionReason = `Missing required attachment: ${criteria.requiredAttachment}`;
  } else if (!isWithinRadius) {
    isEligible = false;
    exclusionReason = `Distance (${distanceKm} km) exceeds operating radius of ${operatingRadius} km`;
  } else if (!meetsMinAcreage) {
    isEligible = false;
    exclusionReason = `Requested area (${criteria.acreage} acres) is below minimum requirement (${minWorkAcres} acres)`;
  } else if (!isAvailableOnDate) {
    isEligible = false;
    exclusionReason = `Tractor is marked as ${scheduleStatus} or unavailable on ${criteria.date}`;
  } else if (!meetsHpReq) {
    isEligible = false;
    exclusionReason = `Tractor HP (${tractor.hp}) is below required ${criteria.minHp} HP`;
  }

  const estimatedPricePerAcre =
    matchingAttachment?.perAcreRate ??
    tractor.baseRatePerAcre ??
    (criteria.targetBudget ? criteria.targetBudget : 1200);

  // 2. Weighted Scoring (0 - 100)
  const distanceFactor = Math.max(0, 1 - distanceKm / operatingRadius);
  const distanceScore = Math.round(distanceFactor * 100 * 0.4);

  let availRaw = 100;
  if (scheduleStatus !== 'available') availRaw = 50;
  const availabilityScore = Math.round(availRaw * 0.2);

  const rating = owner.rating || 4.0;
  let ratingRaw = 0;
  if (rating >= 4.5) ratingRaw = 100;
  else if (rating >= 4.0) ratingRaw = 80;
  else if (rating >= 3.5) ratingRaw = 60;
  else ratingRaw = 0;
  const ratingScore = Math.round(ratingRaw * 0.15);

  let priceRaw = 100;
  if (criteria.targetBudget && criteria.targetBudget > 0) {
    if (estimatedPricePerAcre <= criteria.targetBudget) {
      priceRaw = 100;
    } else {
      const overPct = (estimatedPricePerAcre - criteria.targetBudget) / criteria.targetBudget;
      if (overPct <= 0.10) priceRaw = 80;
      else if (overPct <= 0.20) priceRaw = 50;
      else priceRaw = 0;
    }
  }
  const priceScore = Math.round(priceRaw * 0.15);

  const isPreferredWork =
    tractor.availability?.preferredWorkTypes?.includes(criteria.workType) ?? false;
  const preferenceRaw = isPreferredWork ? 100 : 50;
  const preferenceScore = Math.round(preferenceRaw * 0.10);

  const totalScore = isEligible
    ? distanceScore + availabilityScore + ratingScore + priceScore + preferenceScore
    : 0;

  const scoreBreakdown: MatchScoreBreakdown = {
    distanceScore,
    availabilityScore,
    ratingScore,
    priceScore,
    preferenceScore,
    totalScore,
  };

  return {
    ownerId: owner.id,
    ownerName: owner.name,
    ownerPhone: owner.phone,
    ownerLocation: owner.location,
    ownerRating: owner.rating,
    ownerTotalJobs: owner.totalRatingsCount ?? 0,
    verified: owner.verified,
    tractor: {
      id: tractor.id,
      brand: tractor.brand,
      model: tractor.model,
      hp: tractor.hp,
      category: tractor.category,
      registrationNumber: tractor.registrationNumber,
    },
    hasRequiredAttachment,
    distanceKm,
    isWithinRadius,
    isAvailableOnDate,
    meetsMinAcreage,
    estimatedPricePerAcre,
    scoreBreakdown,
    matchScore: totalScore,
    isEligible,
    exclusionReason,
  };
}

export function findMatchingTractors(
  criteria: MatchingCriteria,
  owners: TractorOwnerProfile[]
): MatchingResponse {
  const allEvaluations: CandidateTractorMatch[] = [];

  for (const owner of owners) {
    for (const tractor of owner.tractors) {
      const evalResult = evaluateCandidateTractor(owner, tractor, criteria);
      allEvaluations.push(evalResult);
    }
  }

  const eligibleMatches = allEvaluations
    .filter((cand) => cand.isEligible)
    .sort((a, b) => b.matchScore - a.matchScore);

  const excludedCandidates = allEvaluations.filter((cand) => !cand.isEligible);

  return {
    totalCandidatesEvaluated: allEvaluations.length,
    eligibleMatches,
    excludedCandidates,
  };
}

// =========================================================================
// MODULE 7 & 8: SKILLED WORKER MATCHING ENGINE
// =========================================================================

export function findMatchingWorkers(
  request: WorkerWorkRequest,
  workers: SkilledWorkerProfile[]
): WorkerCandidateMatch[] {
  const results: WorkerCandidateMatch[] = [];

  for (const worker of workers) {
    const workerLat = worker.location.lat ?? 0;
    const workerLng = worker.location.lng ?? 0;
    const distanceKm = calculateDistance(
      request.location.lat,
      request.location.lng,
      workerLat,
      workerLng
    );

    // 1. Hard Filters
    const matchedSkillProficiency = worker.skills.find(
      (s) => s.skill === request.requiredSkill
    );
    const hasSkill = !!matchedSkillProficiency;
    const isWithinRadius = distanceKm <= (worker.workRadiusKm || 10);
    const isAvailableOnDate = worker.availableToday;

    let isEligible = true;
    let exclusionReason: string | undefined;

    if (!hasSkill) {
      isEligible = false;
      exclusionReason = `Worker does not possess required skill: ${request.requiredSkill}`;
    } else if (!isWithinRadius) {
      isEligible = false;
      exclusionReason = `Distance (${distanceKm} km) exceeds worker operating radius (${worker.workRadiusKm} km)`;
    } else if (!isAvailableOnDate) {
      isEligible = false;
      exclusionReason = 'Worker is unavailable on requested date';
    }

    // 2. Scoring (0 - 100)
    // Distance (35%), Rating (25%), Skill Experience (20%), Wage (20%)
    const distFactor = Math.max(0, 1 - distanceKm / (worker.workRadiusKm || 10));
    const distScore = distFactor * 35;

    const ratingScore = ((worker.rating || 4.0) / 5) * 25;

    const expYears = matchedSkillProficiency?.experienceYears ?? 1;
    const expScore = Math.min(20, expYears * 4);

    const wageRatio = request.wageOfferPerWorker >= worker.expectedDailyWage
      ? 1.0
      : request.wageOfferPerWorker / worker.expectedDailyWage;
    const wageScore = wageRatio * 20;

    const totalScore = isEligible
      ? Math.round(distScore + ratingScore + expScore + wageScore)
      : 0;

    results.push({
      workerId: worker.id,
      workerName: worker.name,
      workerPhone: worker.phone,
      village: worker.location.village,
      distanceKm,
      matchedSkill: request.requiredSkill,
      experienceYears: expYears,
      rating: worker.rating,
      completedJobs: worker.totalRatingsCount ?? 0,
      dailyWage: worker.expectedDailyWage,
      isWithinRadius,
      isAvailableOnDate,
      score: totalScore,
      isEligible,
      exclusionReason,
    });
  }

  return results
    .filter((w) => w.isEligible)
    .sort((a, b) => b.score - a.score);
}

// =========================================================================
// MODULE 9: SPRAY & PUMP DUAL COMBO MATCHING (Equipment + Operator + Farmer)
// =========================================================================

export function findSprayPumpComboMatches(
  request: SprayPumpWorkRequest,
  equipmentList: (SprayPumpEquipment & { ownerName: string; ownerPhone: string; lat: number; lng: number })[],
  workers: SkilledWorkerProfile[]
): ComboMatchResult[] {
  const combos: ComboMatchResult[] = [];

  for (const eq of equipmentList) {
    const distKm = calculateDistance(request.location.lat, request.location.lng, eq.lat, eq.lng);
    if (distKm > eq.operatingRadiusKm || !eq.availableToday || eq.type !== request.sprayerType) {
      continue;
    }

    if (!request.operatorRequired || eq.operatorProvidedWithRental) {
      // Equipment only or Owner provides operator bundled
      const baseRental = eq.rentalRatePerAcre
        ? eq.rentalRatePerAcre * request.acreage
        : eq.rentalRatePerDay;

      combos.push({
        equipmentMatch: {
          ...eq,
          ownerName: eq.ownerName,
          ownerPhone: eq.ownerPhone,
          distanceKm: distKm,
        },
        bundleType: eq.operatorProvidedWithRental ? 'equipment_with_operator' : 'equipment_only',
        totalEstimatedPrice: Math.round(baseRental),
        comboScore: Math.round(Math.max(0, 100 - distKm * 3)),
        distanceKm: distKm,
        isEligible: true,
      });
    } else {
      // Combo Match Required: Find matching Sprayer Operator worker
      const matchingOperators = workers.filter(
        (w) =>
          w.availableToday &&
          w.skills.some((s) => s.skill === 'sprayer_operator') &&
          calculateDistance(request.location.lat, request.location.lng, w.location.lat ?? 0, w.location.lng ?? 0) <= w.workRadiusKm
      );

      for (const op of matchingOperators) {
        const opDist = calculateDistance(request.location.lat, request.location.lng, op.location.lat ?? 0, op.location.lng ?? 0);
        const eqRental = eq.rentalRatePerAcre
          ? eq.rentalRatePerAcre * request.acreage
          : eq.rentalRatePerDay;
        const totalEstimatedPrice = Math.round(eqRental + op.expectedDailyWage);
        const comboScore = Math.round(95 - (distKm + opDist));

        combos.push({
          equipmentMatch: {
            ...eq,
            ownerName: eq.ownerName,
            ownerPhone: eq.ownerPhone,
            distanceKm: distKm,
          },
          operatorMatch: {
            ...op,
            distanceKm: opDist,
          },
          bundleType: 'bundled_third_party_operator',
          totalEstimatedPrice,
          comboScore: Math.max(0, comboScore),
          distanceKm: Math.max(distKm, opDist),
          isEligible: true,
        });
      }
    }
  }

// =========================================================================
// MODULE 11: FARMER -> FERTILIZER SUPPLIER NEARBY SEARCH & QUOTES
// =========================================================================

export function findNearbySuppliersWithStock(
  farmerLat: number,
  farmerLng: number,
  productQuery: string,
  suppliers: (InputSupplierProfile & { lat: number; lng: number })[],
  maxRadiusKm: number = 25
): SupplierSearchResultItem[] {
  const results: SupplierSearchResultItem[] = [];
  const queryLower = productQuery.toLowerCase();

  for (const sup of suppliers) {
    const distKm = calculateDistance(farmerLat, farmerLng, sup.lat, sup.lng);
    if (distKm > maxRadiusKm) continue;

    // Search inventory for matching product
    const matchingProduct = sup.inventory.find(
      (p) =>
        p.name.toLowerCase().includes(queryLower) ||
        p.category.toLowerCase().includes(queryLower) ||
        p.brand.toLowerCase().includes(queryLower)
    );

    const isAvailable = matchingProduct ? matchingProduct.inStock : false;
    const stockStatus: 'in_stock' | 'low_stock' | 'out_of_stock' = matchingProduct
      ? (matchingProduct.inStock ? 'in_stock' : 'out_of_stock')
      : 'out_of_stock';

    results.push({
      supplierId: sup.id,
      shopName: sup.shopName,
      ownerName: sup.ownerName,
      phone: sup.phone,
      village: sup.location.village,
      distanceKm: distKm,
      isVerifiedDealer: sup.isVerifiedDealer,
      fertilizerLicense: sup.licenseNumbers?.fertilizerDealerLicense,
      isAvailable,
      stockStatus,
      priceQuote: matchingProduct?.discountedPrice ?? matchingProduct?.mrp,
      deliveryAvailable: sup.deliveryAvailable && distKm <= sup.deliveryRadiusKm,
    });
  }

  return results.sort((a, b) => a.distanceKm - b.distanceKm);
}

// =========================================================================
// MODULES 12 & 13: CONTRACTOR PROJECT DEMAND AGGREGATOR & FULFILLMENT
// =========================================================================

export function evaluateContractorProjectFulfillment(
  project: ContractorProject,
  availableTractorsCount: number,
  availableWorkersCount: number,
  availableSprayersCount: number
): ProjectFulfillmentReport {
  let totalReqs = 0;
  let fulfilledReqs = 0;
  const shortages: { category: string; specName: string; missingCount: number }[] = [];

  for (const item of project.requirements) {
    totalReqs += item.quantityRequired;
    let availableForCategory = 0;

    if (item.category === 'tractor') {
      availableForCategory = availableTractorsCount;
    } else if (item.category === 'worker') {
      availableForCategory = availableWorkersCount;
    } else if (item.category === 'sprayer' || item.category === 'equipment') {
      availableForCategory = availableSprayersCount;
    }

    const actualFulfilled = Math.min(item.quantityRequired, Math.max(item.quantityFulfilled, availableForCategory));
    fulfilledReqs += actualFulfilled;

    if (actualFulfilled < item.quantityRequired) {
      shortages.push({
        category: item.category,
        specName: item.specName,
        missingCount: item.quantityRequired - actualFulfilled,
      });
    }
  }

  const percentageComplete = totalReqs > 0 ? Math.round((fulfilledReqs / totalReqs) * 100) : 100;

  return {
    projectId: project.id,
    referenceCode: project.referenceCode,
    totalRequirementsCount: totalReqs,
    fulfilledRequirementsCount: fulfilledReqs,
    percentageComplete,
    shortages,
    isReadyForDispatch: shortages.length === 0,
  };
}

// =========================================================================
// MODULE 15: PROGRESSIVE 5-TIER TRUST & VERIFICATION ENGINE
// =========================================================================

export function calculateTrustTier(
  user: { id: string; name: string; phone: string },
  completedJobsCount: number,
  averageRating: number,
  disputeCount: number,
  isIdentityVerified: boolean,
  isEquipmentVerified: boolean
): TrustProfile {
  let tier: VerificationTier = 0;
  let tierName = 'Mobile Verified';
  const badges: string[] = ['✓ Mobile verified'];

  if (isIdentityVerified) {
    tier = 1;
    tierName = 'Identity Verified';
    badges.push('✓ Identity verified');
  }

  if (isIdentityVerified && isEquipmentVerified) {
    tier = 2;
    tierName = 'Equipment Verified';
    badges.push('✓ Equipment verified');
  }

  if (tier >= 2 && completedJobsCount >= 10 && disputeCount === 0) {
    tier = 3;
    tierName = 'Proven Work History';
    badges.push(`${completedJobsCount} completed jobs`);
  }

  if (tier >= 3 && completedJobsCount >= 30 && averageRating >= 4.7 && disputeCount === 0) {
    tier = 4;
    tierName = 'Trusted Gold Provider';
    badges.push(`★ ${averageRating.toFixed(1)} rating (Gold)`);
  }

  return {
    userId: user.id,
    tier,
    tierName,
    badges,
    isMobileVerified: true,
    isIdentityVerified,
    isEquipmentVerified,
    completedJobsCount,
    averageRating,
    disputeCount,
    isTrustedGold: tier === 4,
  };
}

// =========================================================================
// MODULE 16: COMPLETE 15-STATE BOOKING LIFECYCLE MACHINE
// =========================================================================

const VALID_FORWARD_TRANSITIONS: Record<BookingLifecycleStatus, BookingLifecycleStatus[]> = {
  requested: ['matched', 'cancelled'],
  matched: ['quoted', 'cancelled', 'rescheduled'],
  quoted: ['accepted', 'cancelled', 'rescheduled'],
  accepted: ['scheduled', 'cancelled', 'rescheduled'],
  scheduled: ['work_started', 'no_show', 'cancelled', 'rescheduled'],
  work_started: ['work_completed', 'disputed', 'cancelled'],
  work_completed: ['payment', 'disputed'],
  payment: ['rating', 'disputed'],
  rating: ['closed'],
  closed: [],
  cancelled: [],
  disputed: ['rescheduled', 'payment', 'closed', 'cancelled'],
  no_show: ['rescheduled', 'cancelled'],
  rescheduled: ['scheduled', 'cancelled'],
};

export function transitionBookingLifecycle(
  currentStatus: BookingLifecycleStatus,
  targetStatus: BookingLifecycleStatus,
  triggeredByUserId: string,
  reason?: string
): { isValid: boolean; newStatus: BookingLifecycleStatus; transitionLog?: BookingStateTransition; error?: string } {
  const allowedNext = VALID_FORWARD_TRANSITIONS[currentStatus] ?? [];

  if (!allowedNext.includes(targetStatus)) {
    return {
      isValid: false,
      newStatus: currentStatus,
      error: `Illegal state transition from '${currentStatus}' to '${targetStatus}'. Allowed next: [${allowedNext.join(', ')}]`,
    };
  }

  const transitionLog: BookingStateTransition = {
    bookingId: `BKG-TXN-${Date.now()}`,
    fromStatus: currentStatus,
    toStatus: targetStatus,
    triggeredByUserId,
    timestamp: new Date(),
    reason,
  };

  return {
    isValid: true,
    newStatus: targetStatus,
    transitionLog,
  };
}

// =========================================================================
// MODULE 17: EXPANDING RADIUS BANDS MATCHING (5km -> 10km -> 15km -> 25km)
// =========================================================================

export function findWithExpandingRadiusBands<T extends { lat: number; lng: number }>(
  farmerLat: number,
  farmerLng: number,
  providers: T[],
  minResultsDesired: number = 2
): ExpandingRadiusSearchResult<T & { distanceKm: number }> {
  const bands: LocationRadiusBand[] = [5, 10, 15, 25];

  for (const band of bands) {
    const matchesWithinBand = providers
      .map((p) => ({ ...p, distanceKm: calculateDistance(farmerLat, farmerLng, p.lat, p.lng) }))
      .filter((p) => p.distanceKm <= band)
      .sort((a, b) => a.distanceKm - b.distanceKm);

    if (matchesWithinBand.length >= minResultsDesired || band === 25) {
      return {
        currentRadiusBandKm: band,
        totalFound: matchesWithinBand.length,
        results: matchesWithinBand,
        expandedToNextBand: band > 5,
      };
    }
  }

  return {
    currentRadiusBandKm: 25,
    totalFound: 0,
    results: [],
    expandedToNextBand: true,
  };
}

// =========================================================================
// MODULE 18: MULTI-CHANNEL RURAL COMMUNICATION DISPATCHER
// =========================================================================

export function dispatchRuralCommunication(
  recipient: { id: string; phone: string; preferredLanguage?: string },
  channel: RuralCommunicationChannel,
  title: string,
  body: string,
  referenceCode?: string
): RuralCommunicationMessage {
  // Format channel-tailored templates
  let formattedBody = body;
  if (channel === 'sms') {
    formattedBody = `[RuralConnect] ${title}: ${body}. Ref: ${referenceCode || 'N/A'}`;
  } else if (channel === 'whatsapp') {
    formattedBody = `🌾 *RuralConnect Alert*\n*${title}*\n${body}\n\n📌 Reference: *${referenceCode || 'N/A'}*\nReply *YES* to accept or call 1800-RURAL-HELP.`;
  }

  return {
    recipientId: recipient.id,
    recipientPhone: recipient.phone,
    preferredLanguage: recipient.preferredLanguage || 'Telugu',
    channel,
    title,
    body: formattedBody,
    referenceCode,
    status: 'sent',
    timestamp: new Date(),
  };
}

// =========================================================================
// SECTION 22: THE GOLDEN RELATIONSHIP CHAIN EXECUTOR
// =========================================================================

export function executeGoldenChain(
  farmer: { id: string; name: string; village: string },
  tractorOwner: { id: string; name: string; tractorModel: string; hp: number },
  requestInput: { acreage: number; workType: string; attachment: string; date: string },
  ratePerAcre: number = 1250,
  ratingScore: number = 4.8
): GoldenChainAuditRecord {
  // Step 1: User & Profile (Ramesh Goud -> Tractor Owner)
  // Step 2: Resource (50 HP Mahindra Arjun)
  // Step 3: Availability (Sept 4 Available)
  // Step 4: Work (Farmer requests Rotavator, 4 Acres)
  // Step 5: Booking (BKG-000124)
  // Step 6: Transaction (4 Acres * 1250 = 5000 + 235 mob = 5235)
  // Step 7: Rating (4.8 Stars)

  const transactionAmount = Math.round(requestInput.acreage * ratePerAcre + 235);

  return {
    userId: tractorOwner.id,
    userName: tractorOwner.name,
    profileRole: 'Tractor Owner',
    resourceName: `${tractorOwner.tractorModel} (${tractorOwner.hp} HP)`,
    resourceSpec: `Equipped with ${requestInput.attachment}`,
    availabilityWindow: `${requestInput.date} (Full Day Slot)`,
    workRequestId: `TRW-${Date.now().toString().slice(-6)}`,
    workDescription: `${requestInput.workType} across ${requestInput.acreage} acres in ${farmer.village}`,
    bookingRefCode: `BKG-${Date.now().toString().slice(-6)}`,
    transactionAmount,
    ratingGiven: ratingScore,
    ratingComment: 'Excellent punctuality and thorough rotavator tilling.',
    chainCompletedAt: new Date(),
  };
}

// =========================================================================
// SECTION 24 & 25: 1-MANDAL PILOT SIMULATION & REAL-TIME KPI METRICS ENGINE
// =========================================================================

export function getPilotMandalSimulationData() {
  return {
    mandalName: 'Tandur',
    district: 'Vikarabad',
    state: 'Telangana',
    villages: [
      { name: 'Tangipalli', activeFarmers: 25, activeTractors: 6, activeWorkers: 5, jobsCompleted: 18 },
      { name: 'Malkapur', activeFarmers: 15, activeTractors: 4, activeWorkers: 4, jobsCompleted: 12 },
      { name: 'Kotbaspalli', activeFarmers: 12, activeTractors: 3, activeWorkers: 3, jobsCompleted: 9 },
    ],
    supplySummary: {
      totalRegisteredTractors: 16,
      activeAvailableTractors: 14,
      totalSkilledWorkers: 12,
      totalEquipmentProviders: 4,
      totalInputSuppliers: 3,
      totalContractors: 2,
    },
    demandSummary: {
      totalFarmerRequests: 42,
      totalContractorProjects: 6,
      totalRequests: 48,
    },
    executionSummary: {
      matchedRequests: 44,
      acceptedJobs: 41,
      completedJobs: 39,
      cancelledJobs: 2,
      noShows: 0,
      averageResponseTimeMin: 14,
      totalGmvInr: 203700,
      totalProviderEarningsInr: 173145,
      averageJobValueInr: 5223,
      repeatCustomers: 18,
    },
  };
}

export function computePlatformKpis(simulationData = getPilotMandalSimulationData()): PlatformKpiMetrics {
  const { supplySummary, demandSummary, executionSummary } = simulationData;

  const matchRatePct = Math.round((executionSummary.matchedRequests / demandSummary.totalRequests) * 1000) / 10;
  const completionRatePct = Math.round((executionSummary.completedJobs / executionSummary.acceptedJobs) * 1000) / 10;
  const cancellationRatePct = Math.round((executionSummary.cancelledJobs / executionSummary.acceptedJobs) * 1000) / 10;
  const noShowRatePct = Math.round((executionSummary.noShows / executionSummary.acceptedJobs) * 1000) / 10;

  return {
    totalRegisteredTractors: supplySummary.totalRegisteredTractors,
    activeAvailableTractors: supplySummary.activeAvailableTractors,
    totalSkilledWorkers: supplySummary.totalSkilledWorkers,
    totalEquipmentProviders: supplySummary.totalEquipmentProviders,
    totalInputSuppliers: supplySummary.totalInputSuppliers,
    totalFarmerRequests: demandSummary.totalFarmerRequests,
    totalContractorProjects: demandSummary.totalContractorProjects,
    requestsByVillage: {
      Tangipalli: 22,
      Malkapur: 15,
      Kotbaspalli: 11,
    },
    matchedRequestsCount: executionSummary.matchedRequests,
    matchRatePct,
    acceptedJobsCount: executionSummary.acceptedJobs,
    completedJobsCount: executionSummary.completedJobs,
    completionRatePct,
    cancelledJobsCount: executionSummary.cancelledJobs,
    cancellationRatePct,
    noShowCount: executionSummary.noShows,
    noShowRatePct,
    averageResponseTimeMinutes: executionSummary.averageResponseTimeMin,
    averageJobValueInr: executionSummary.averageJobValueInr,
    totalPlatformGmvInr: executionSummary.totalGmvInr,
    totalProviderEarningsInr: executionSummary.totalProviderEarningsInr,
    repeatCustomersCount: executionSummary.repeatCustomers,
    successfulConnectionsCreated: executionSummary.completedJobs,
  };
}

// =========================================================================
// SECTION 22: CANDIDATE MATCHING PIPELINE (CANDIDATES A, B, C)
// =========================================================================

export interface CandidateEvaluationInput {
  name: string;
  distanceKm: number;
  available: boolean;
  hp: number;
  hasAttachment: boolean;
  rating: number;
}

export interface CandidateEvaluationResult {
  name: string;
  isEligible: boolean;
  score: number;
  reason?: string;
}

export function evaluateCandidateMatching(
  minHpRequired: number,
  requiredAttachment: string,
  candidates: CandidateEvaluationInput[]
): CandidateEvaluationResult[] {
  return candidates.map((cand) => {
    // Stage 1: Hard filter
    if (!cand.available) {
      return { name: cand.name, isEligible: false, score: 0, reason: 'Unavailable on date' };
    }
    if (!cand.hasAttachment) {
      return { name: cand.name, isEligible: false, score: 0, reason: `Missing required attachment: ${requiredAttachment}` };
    }
    if (cand.hp < minHpRequired) {
      return { name: cand.name, isEligible: false, score: 0, reason: `Insufficient HP (${cand.hp} < ${minHpRequired})` };
    }

    // Stage 2: Weighted scoring
    const distScore = Math.max(0, 10 - cand.distanceKm) * 4; // up to 40
    const ratingScore = (cand.rating / 5) * 30; // up to 30
    const hpScore = Math.min(20, (cand.hp / minHpRequired) * 15); // up to 20
    const score = Math.round(distScore + ratingScore + hpScore + 10);

    return {
      name: cand.name,
      isEligible: true,
      score,
    };
  });
}

// =========================================================================
// SECTION 30: 6 CORE DEVELOPMENT MILESTONES
// =========================================================================

export function getMilestonesPlan() {
  return [
    { milestone: 1, title: 'Foundation & Roles', components: ['AUTH', 'MULTI-ROLE', 'ROLE SWITCHING', 'LOCATION'] },
    { milestone: 2, title: 'Tractor Fleet & Supply', components: ['FARMER', 'TRACTOR OWNER', 'TRACTOR', 'AVAILABILITY'] },
    { milestone: 3, title: 'Work Request & Matching', components: ['WORK REQUEST', 'MATCHING', 'BOOKING'] },
    { milestone: 4, title: 'Workers & Sprayers/Pumps', components: ['WORKER', 'SPRAYER/PUMP'] },
    { milestone: 5, title: 'Suppliers & Contractors', components: ['SUPPLIER', 'CONTRACTOR'] },
    { milestone: 6, title: 'Trust, Payments & Admin', components: ['PAYMENT', 'RATING', 'VERIFICATION', 'ADMIN'] },
  ];
}





