import { Injectable } from '@nestjs/common';

export interface TransportPriceEstimate {
  vehicleType: string;
  distanceKm: number;
  weightTons: number;
  breakdown: {
    baseFareINR: number;
    distanceChargeINR: number;
    tonnageChargeINR: number;
    loadingFeeINR: number;
  };
  totalEstimatedPriceINR: number;
  estimatedPriceRange: { min: number; max: number };
}

@Injectable()
export class TransportPricingService {
  calculateEstimate(data: {
    vehicleType: string;
    distanceKm: number;
    weightTons: number;
    requiresLoading?: boolean;
  }): TransportPriceEstimate {
    let baseFare = 600;
    let ratePerKm = 35;

    switch (data.vehicleType) {
      case 'TRACTOR_TRAILER':
        baseFare = 600;
        ratePerKm = 32;
        break;
      case 'MINI_TRUCK':
        baseFare = 800;
        ratePerKm = 36;
        break;
      case 'TRUCK':
        baseFare = 1500;
        ratePerKm = 45;
        break;
      case 'PICKUP':
        baseFare = 500;
        ratePerKm = 28;
        break;
      case 'TANKER':
        baseFare = 1000;
        ratePerKm = 40;
        break;
      default:
        baseFare = 600;
        ratePerKm = 35;
    }

    const distanceCharge = Math.round(data.distanceKm * ratePerKm);
    const tonnageCharge = Math.round(data.weightTons * 120);
    const loadingFee = data.requiresLoading ? 400 : 0;

    const total = baseFare + distanceCharge + tonnageCharge + loadingFee;

    return {
      vehicleType: data.vehicleType,
      distanceKm: data.distanceKm,
      weightTons: data.weightTons,
      breakdown: {
        baseFareINR: baseFare,
        distanceChargeINR: distanceCharge,
        tonnageChargeINR: tonnageCharge,
        loadingFeeINR: loadingFee,
      },
      totalEstimatedPriceINR: total,
      estimatedPriceRange: {
        min: Math.round(total * 0.92),
        max: Math.round(total * 1.08),
      },
    };
  }
}

