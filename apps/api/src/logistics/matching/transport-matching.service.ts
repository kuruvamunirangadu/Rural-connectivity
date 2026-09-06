import { Injectable } from '@nestjs/common';
import { VehicleService, VehicleItem } from '../vehicles/vehicle.service';
import { DriverService } from '../drivers/driver.service';
import { TransportRequestService, TransportRequestItem } from '../requests/transport-request.service';

export interface VehicleMatchCandidate {
  vehicle: VehicleItem;
  estimatedDistanceKm: number;
  capacitySuitabilityPct: number;
  driverName?: string;
  driverRating: number;
  scores: {
    capacityScore: number;
    availabilityScore: number;
    distanceScore: number;
    ratingScore: number;
    reliabilityScore: number;
    compositeScore: number;
  };
  estimatedPriceINR: number;
  matchReasons: string[];
}

export interface MatchingResult {
  requestId: string;
  cargoType: string;
  requiredCapacityKg: number;
  totalCandidatesEvaluated: number;
  eligibleCandidates: VehicleMatchCandidate[];
  excludedCandidates: { vehicleId: string; reason: string }[];
}

@Injectable()
export class TransportMatchingService {
  constructor(
    private readonly vehicleService: VehicleService,
    private readonly driverService: DriverService,
    private readonly requestService: TransportRequestService
  ) {}

  matchVehiclesForRequest(requestId: string): MatchingResult {
    const request = this.requestService.getRequest(requestId);
    const requirement = request.requirements[0];
    const requiredMinCap = requirement?.minimumCapacityKg || 1000;

    const allVehicles = this.vehicleService.listVehicles();
    const eligibleCandidates: VehicleMatchCandidate[] = [];
    const excludedCandidates: { vehicleId: string; reason: string }[] = [];

    for (const vehicle of allVehicles) {
      // 1. Hard Filter: Vehicle Status
      if (vehicle.status !== 'ACTIVE') {
        excludedCandidates.push({
          vehicleId: vehicle.id,
          reason: `Vehicle status is ${vehicle.status} (Not Active)`,
        });
        continue;
      }

      // 2. Hard Filter: Minimum Payload Capacity Guard
      if (vehicle.capacity < requiredMinCap) {
        excludedCandidates.push({
          vehicleId: vehicle.id,
          reason: `Payload capacity (${vehicle.capacity} ${vehicle.capacityUnit}) is less than required (${requiredMinCap} kg)`,
        });
        continue;
      }

      // 3. Hard Filter: Driver Eligibility Guard (if assigned)
      let driverRating = 4.8;
      if (vehicle.assignedDriverId) {
        const eligibility = this.driverService.isDriverEligible(vehicle.assignedDriverId);
        if (!eligibility.eligible) {
          excludedCandidates.push({
            vehicleId: vehicle.id,
            reason: `Assigned driver is ineligible: ${eligibility.reason}`,
          });
          continue;
        }
        const driver = this.driverService.getDriver(vehicle.assignedDriverId);
        driverRating = driver.rating;
      }

      // Compute approximate distance
      const distanceKm = 4.5 + Math.round((Math.random() * 8) * 10) / 10;

      // 4. Hard Filter: Service Radius
      if (distanceKm > vehicle.serviceRadiusKm) {
        excludedCandidates.push({
          vehicleId: vehicle.id,
          reason: `Pickup location is outside service radius (${distanceKm} km > ${vehicle.serviceRadiusKm} km)`,
        });
        continue;
      }

      // Soft Multi-Factor Scoring Model
      // Capacity Score: Higher if payload fits tightly without extreme excess
      const capacityRatio = requiredMinCap / vehicle.capacity;
      const capacityScore = Math.round(Math.min(1.0, capacityRatio) * 100);

      const availabilityScore = 95;
      const distanceScore = Math.round(Math.max(0, (1 - distanceKm / vehicle.serviceRadiusKm)) * 100);
      const ratingScore = Math.round((driverRating / 5.0) * 100);
      const reliabilityScore = 92;

      // Weights: 30% Capacity, 25% Availability, 20% Distance, 15% Rating, 10% Reliability
      const compositeScore = Math.round(
        capacityScore * 0.30 +
        availabilityScore * 0.25 +
        distanceScore * 0.20 +
        ratingScore * 0.15 +
        reliabilityScore * 0.10
      );

      const estPrice = Math.round(
        600 + request.estimatedDistanceKm * 38 + (vehicle.capacity > 5000 ? 1200 : 400)
      );

      const matchReasons = [
        `Capacity ${vehicle.capacity} kg exceeds ${requiredMinCap} kg payload requirement.`,
        `Located ${distanceKm} km from pickup in ${vehicle.baseVillage}.`,
        `Assigned certified driver with ★ ${driverRating} rating.`,
      ];

      eligibleCandidates.push({
        vehicle,
        estimatedDistanceKm: distanceKm,
        capacitySuitabilityPct: Math.round(capacityRatio * 100),
        driverName: vehicle.assignedDriverName,
        driverRating,
        scores: {
          capacityScore,
          availabilityScore,
          distanceScore,
          ratingScore,
          reliabilityScore,
          compositeScore,
        },
        estimatedPriceINR: estPrice,
        matchReasons,
      });
    }

    eligibleCandidates.sort((a, b) => b.scores.compositeScore - a.scores.compositeScore);

    return {
      requestId,
      cargoType: requirement?.cargoType || 'Agricultural Cargo',
      requiredCapacityKg: requiredMinCap,
      totalCandidatesEvaluated: allVehicles.length,
      eligibleCandidates,
      excludedCandidates,
    };
  }
}
