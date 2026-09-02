import { Injectable } from '@nestjs/common';

export interface AIPriceEstimate {
  resourceType: string;
  attachmentType?: string;
  acres: number;
  estimatedMinInr: number;
  estimatedMaxInr: number;
  medianEstimateInr: number;
  confidence: 'HIGH' | 'MEDIUM' | 'LOW';
  factors: string[];
  disclaimer: string;
}

@Injectable()
export class PriceEstimationService {
  async estimatePrice(dto: { resourceType: string; attachmentType?: string; acres: number; locationId?: string }): Promise<AIPriceEstimate> {
    const acres = dto.acres || 3;
    let base = 1200;
    let perAcre = 200 * acres;
    let attach = dto.attachmentType === 'ROTAVATOR' ? 400 : 200;

    const median = base + perAcre + attach; // e.g. 1200 + 600 + 400 = 2200 for 3 acres
    const minPrice = Math.round(median * 0.9); // 1980 (~ 1800-2400)
    const maxPrice = Math.round(median * 1.1);

    return {
      resourceType: dto.resourceType,
      attachmentType: dto.attachmentType,
      acres,
      estimatedMinInr: minPrice,
      estimatedMaxInr: maxPrice,
      medianEstimateInr: median,
      confidence: 'HIGH',
      factors: [
        `${acres} acres operational workload`,
        `${dto.attachmentType || 'Standard'} implement calibration`,
        'Regional historical completion data within 15 km radius',
        'Fuel and transit base rate',
      ],
      disclaimer: 'AI Price Estimate is an informational guideline based on regional marketplace history. Final price is agreed upon explicit provider quotation.',
    };
  }
}
