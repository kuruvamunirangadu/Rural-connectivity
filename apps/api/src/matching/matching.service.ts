import { Injectable, BadRequestException } from '@nestjs/common';
import { calculateHaversineDistanceKm, getDistanceTierScore } from '../geo/distance';

export interface HyperlocalSearchParams {
  location: {
    latitude: number;
    longitude: number;
    village?: string;
  };
  resourceType: string;
  radiusKm?: number;
  date?: string;
  startTime?: string;
  endTime?: string;
  requirements?: {
    tractorHpMin?: number;
    attachmentType?: string;
    skillId?: string;
    equipmentType?: string;
    capacityMin?: number;
  };
  sortMode?: 'BEST_MATCH' | 'NEAREST' | 'LOWEST_PRICE' | 'BEST_RATED';
}

@Injectable()
export class MatchingService {
  // Provider Fleet Database with GPS Coordinates & Specific Operating Service Radii
  private tractors = [
    {
      id: 'tr-001',
      providerId: 'to-suresh-002',
      providerName: 'Suresh Reddy',
      tractorModel: 'Mahindra 575 DI',
      hp: 50,
      attachments: ['ROTAVATOR', 'PLOUGH'],
      location: { latitude: 17.27, longitude: 77.61, village: 'Village A' },
      serviceRadiusKm: 25,
      estimatedPricePerDay: 5000,
      rating: 4.8,
      isVerified: true,
      available: true,
    },
    {
      id: 'tr-002',
      providerId: 'to-ramesh-003',
      providerName: 'Ramesh Goud',
      tractorModel: 'John Deere 5310',
      hp: 55,
      attachments: ['ROTAVATOR', 'SEED_DRILL'],
      location: { latitude: 17.31, longitude: 77.65, village: 'Village B' },
      serviceRadiusKm: 20,
      estimatedPricePerDay: 5200,
      rating: 4.7,
      isVerified: true,
      available: true,
    },
    {
      id: 'tr-003',
      providerId: 'to-kumar-004',
      providerName: 'Kumar Machinery',
      tractorModel: 'Swaraj 735 FE',
      hp: 35, // Below 45 HP min
      attachments: ['ROTAVATOR'],
      location: { latitude: 17.26, longitude: 77.59, village: 'Village A' },
      serviceRadiusKm: 15,
      estimatedPricePerDay: 4000,
      rating: 4.6,
      isVerified: true,
      available: true,
    },
    {
      id: 'tr-004',
      providerId: 'to-shankar-005',
      providerName: 'Shankar Rao',
      tractorModel: 'Eicher 557 (55 HP)',
      hp: 55,
      attachments: ['PLOUGH'], // Missing Rotavator
      location: { latitude: 17.25, longitude: 77.58, village: 'Village A' },
      serviceRadiusKm: 15,
      estimatedPricePerDay: 4800,
      rating: 4.5,
      isVerified: true,
      available: true,
    },
  ];

  private workers = [
    {
      id: 'wp-001',
      providerId: 'usr-suresh-002',
      name: 'Suresh Reddy',
      skills: ['SPRAYER_OPERATOR', 'PUMP_OPERATOR'],
      experienceYears: 5,
      location: { latitude: 17.26, longitude: 77.59 },
      serviceRadiusKm: 20, // 20 km radius
      expectedDailyRate: 500,
      rating: 4.8,
      isVerified: true,
      available: true,
    },
    {
      id: 'wp-002',
      providerId: 'usr-laxman-003',
      name: 'Laxman Naik',
      skills: ['SPRAYER_OPERATOR'],
      experienceYears: 3,
      location: { latitude: 17.30, longitude: 77.63 },
      serviceRadiusKm: 5, // 5 km radius (Will be rejected if distance > 5 km)
      expectedDailyRate: 450,
      rating: 4.6,
      isVerified: true,
      available: true,
    },
  ];

  private equipment = [
    {
      id: 'eq-001',
      providerId: 'usr-suresh-002',
      name: 'Suresh Reddy',
      equipmentType: 'SPRAYER',
      brand: 'Aspee 500L Power Sprayer',
      capacity: 500,
      location: { latitude: 17.27, longitude: 77.60 },
      serviceRadiusKm: 15,
      dailyRentalPrice: 1200,
      rating: 4.8,
      isVerified: true,
      available: true,
    },
    {
      id: 'eq-002',
      providerId: 'usr-mahesh-005',
      name: 'Mahesh Patil',
      equipmentType: 'SPRAYER',
      brand: 'Fieldking 500L Sprayer',
      capacity: 500,
      location: { latitude: 17.40, longitude: 77.72 }, // 18 km away
      serviceRadiusKm: 10, // 10 km radius -> Hard reject (18 > 10)
      dailyRentalPrice: 1100,
      rating: 4.5,
      isVerified: true,
      available: true,
    },
  ];

  async searchHyperlocal(params: HyperlocalSearchParams) {
    if (!params.location || params.location.latitude === undefined || params.location.longitude === undefined) {
      throw new BadRequestException('Valid requester latitude and longitude coordinates are required for hyperlocal search');
    }

    const requesterLat = params.location.latitude;
    const requesterLon = params.location.longitude;
    const maxSearchRadiusKm = params.radiusKm || 25;
    const type = params.resourceType?.toUpperCase() || 'TRACTOR';
    const sortMode = params.sortMode || 'BEST_MATCH';

    const eligibleCandidates: any[] = [];
    const rejectedCandidates: any[] = [];

    if (type === 'TRACTOR') {
      const minHp = params.requirements?.tractorHpMin || 45;
      const reqAtt = params.requirements?.attachmentType?.toUpperCase() || 'ROTAVATOR';

      for (const t of this.tractors) {
        const distanceKm = calculateHaversineDistanceKm(requesterLat, requesterLon, t.location.latitude, t.location.longitude);

        // 1. HARD FILTERS (Must all satisfy before ranking)
        const isHpOk = t.hp >= minHp;
        const isAttOk = t.attachments.includes(reqAtt);
        const isAvail = t.available;
        const isWithinSearchRadius = distanceKm <= maxSearchRadiusKm;
        const isWithinProviderServiceRadius = distanceKm <= t.serviceRadiusKm;

        if (isHpOk && isAttOk && isAvail && isWithinSearchRadius && isWithinProviderServiceRadius) {
          // 2. SOFT RANKING ENGINE (Deterministic Weighted Formula)
          const capabilityScore = Math.min(1.0, t.hp / minHp) * 0.35;
          const availabilityScore = 1.0 * 0.25;
          const distanceScore = getDistanceTierScore(distanceKm) * 0.20;
          const ratingScore = (t.rating / 5.0) * 0.10;
          const verificationScore = (t.isVerified ? 1.0 : 0.5) * 0.10;

          const totalMatchScore = Math.round((capabilityScore + availabilityScore + distanceScore + ratingScore + verificationScore) * 100);

          eligibleCandidates.push({
            resourceId: t.id,
            resourceType: 'TRACTOR',
            providerId: t.providerId,
            providerName: t.providerName,
            model: t.tractorModel,
            hp: t.hp,
            attachments: t.attachments,
            distanceKm, // Distance is exposed, raw coordinates are NEVER exposed
            rating: t.rating,
            isVerified: t.isVerified,
            price: t.estimatedPricePerDay,
            matchScore: totalMatchScore,
            reasons: [
              `Meets requirement: ${t.hp} HP (≥${minHp} HP) with ${reqAtt}`,
              `Distance: ${distanceKm} km (within provider's ${t.serviceRadiusKm} km service radius)`,
              `High customer rating: ★ ${t.rating}`,
            ],
          });
        } else {
          let rejectReason = 'Unknown';
          if (!isWithinProviderServiceRadius) rejectReason = `Distance (${distanceKm} km) exceeds provider's service radius (${t.serviceRadiusKm} km)`;
          else if (!isWithinSearchRadius) rejectReason = `Outside search radius (${distanceKm} km > ${maxSearchRadiusKm} km)`;
          else if (!isHpOk) rejectReason = `Horsepower insufficient (${t.hp} < ${minHp} HP)`;
          else if (!isAttOk) rejectReason = `Missing required attachment: ${reqAtt}`;
          else if (!isAvail) rejectReason = 'Provider unavailable for requested schedule';

          rejectedCandidates.push({
            resourceId: t.id,
            providerName: t.providerName,
            distanceKm,
            reason: rejectReason,
          });
        }
      }
    } else if (type === 'WORKER') {
      const reqSkill = params.requirements?.skillId || 'SPRAYER_OPERATOR';

      for (const w of this.workers) {
        const distanceKm = calculateHaversineDistanceKm(requesterLat, requesterLon, w.location.latitude, w.location.longitude);
        const hasSkill = w.skills.includes(reqSkill);
        const isAvail = w.available;
        const isWithinRadius = distanceKm <= w.serviceRadiusKm;

        if (hasSkill && isAvail && isWithinRadius) {
          const score = Math.round((0.35 + 0.25 + getDistanceTierScore(distanceKm) * 0.20 + (w.rating / 5) * 0.10 + 0.10) * 100);
          eligibleCandidates.push({
            resourceId: w.id,
            resourceType: 'WORKER',
            providerId: w.providerId,
            providerName: w.name,
            skills: w.skills,
            experienceYears: w.experienceYears,
            distanceKm,
            rating: w.rating,
            price: w.expectedDailyRate,
            matchScore: score,
            reasons: [`Certified ${reqSkill}`, `Nearby (${distanceKm} km away • radius ${w.serviceRadiusKm} km)`],
          });
        } else {
          rejectedCandidates.push({
            resourceId: w.id,
            providerName: w.name,
            distanceKm,
            reason: !isWithinRadius ? `Distance (${distanceKm} km) exceeds service radius (${w.serviceRadiusKm} km)` : 'Missing skill or unavailable',
          });
        }
      }
    } else if (type === 'EQUIPMENT') {
      const eqType = params.requirements?.equipmentType || 'SPRAYER';
      const capMin = params.requirements?.capacityMin || 500;

      for (const eq of this.equipment) {
        const distanceKm = calculateHaversineDistanceKm(requesterLat, requesterLon, eq.location.latitude, eq.location.longitude);
        const isTypeOk = eq.equipmentType === eqType;
        const isCapOk = eq.capacity >= capMin;
        const isWithinRadius = distanceKm <= eq.serviceRadiusKm;

        if (isTypeOk && isCapOk && isWithinRadius) {
          const score = Math.round((0.35 + 0.25 + getDistanceTierScore(distanceKm) * 0.20 + (eq.rating / 5) * 0.10 + 0.10) * 100);
          eligibleCandidates.push({
            resourceId: eq.id,
            resourceType: 'EQUIPMENT',
            providerId: eq.providerId,
            providerName: eq.name,
            brand: eq.brand,
            capacity: eq.capacity,
            distanceKm,
            rating: eq.rating,
            price: eq.dailyRentalPrice,
            matchScore: score,
            reasons: [`${eq.brand} (${eq.capacity}L)`, `Distance: ${distanceKm} km`],
          });
        } else {
          rejectedCandidates.push({
            resourceId: eq.id,
            providerName: eq.name,
            distanceKm,
            reason: !isWithinRadius ? `Distance (${distanceKm} km) exceeds service radius (${eq.serviceRadiusKm} km)` : 'Capacity or availability mismatch',
          });
        }
      }
    }

    // 3. SORTING BY REQUESTED MODE
    if (sortMode === 'NEAREST') {
      eligibleCandidates.sort((a, b) => a.distanceKm - b.distanceKm);
    } else if (sortMode === 'LOWEST_PRICE') {
      eligibleCandidates.sort((a, b) => a.price - b.price);
    } else if (sortMode === 'BEST_RATED') {
      eligibleCandidates.sort((a, b) => b.rating - a.rating);
    } else {
      // Default: BEST_MATCH (Highest deterministic match score)
      eligibleCandidates.sort((a, b) => b.matchScore - a.matchScore);
    }

    return {
      searchCriteria: {
        requesterCoordinates: { lat: requesterLat, lon: requesterLon },
        resourceType: type,
        radiusKm: maxSearchRadiusKm,
        sortMode,
      },
      totalEligible: eligibleCandidates.length,
      totalExcluded: rejectedCandidates.length,
      results: eligibleCandidates,
      excludedDetails: rejectedCandidates,
    };
  }
}
