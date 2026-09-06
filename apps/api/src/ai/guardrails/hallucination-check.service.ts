import { Injectable } from '@nestjs/common';

@Injectable()
export class HallucinationCheckService {
  verifyResourceExistence(resourceId: string, availableResources: Array<{ id: string }>): boolean {
    return availableResources.some((r) => r.id === resourceId);
  }

  ensurePriceWithinBounds(estimatedMin: number, estimatedMax: number, historicalMedian: number): { valid: boolean; min: number; max: number } {
    // Prevent ungrounded outlier prices
    const lowerBound = Math.max(500, historicalMedian * 0.5);
    const upperBound = historicalMedian * 2.5;

    const boundedMin = Math.max(lowerBound, estimatedMin);
    const boundedMax = Math.min(upperBound, estimatedMax);

    return {
      valid: boundedMin <= boundedMax,
      min: Math.round(boundedMin),
      max: Math.round(boundedMax),
    };
  }
}

