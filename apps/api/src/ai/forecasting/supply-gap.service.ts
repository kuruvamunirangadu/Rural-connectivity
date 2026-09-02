import { Injectable } from '@nestjs/common';

export interface SupplyGapDetection {
  mandal: string;
  district: string;
  resourceType: string;
  projectedDemand: number;
  availableSuitableSupply: number;
  shortageGap: number;
  riskLevel: 'HIGH' | 'MEDIUM' | 'LOW';
  recommendedAdminAction: string;
}

@Injectable()
export class SupplyGapService {
  async detectGaps(district = 'Guntur'): Promise<SupplyGapDetection[]> {
    return [
      {
        mandal: 'Tenali (Mandal X)',
        district: 'Guntur',
        resourceType: 'TRACTOR (ROTAVATOR)',
        projectedDemand: 100,
        availableSuitableSupply: 63,
        shortageGap: 37,
        riskLevel: 'HIGH',
        recommendedAdminAction: 'Recruit 35+ tractor owners equipped with rotavators in Tenali mandal cluster.',
      },
      {
        mandal: 'Mangalagiri',
        district: 'Guntur',
        resourceType: 'POWER_SPRAYER',
        projectedDemand: 85,
        availableSuitableSupply: 55,
        shortageGap: 30,
        riskLevel: 'MEDIUM',
        recommendedAdminAction: 'Onboard 20+ power sprayer equipment owners and trained operators.',
      },
    ];
  }
}
