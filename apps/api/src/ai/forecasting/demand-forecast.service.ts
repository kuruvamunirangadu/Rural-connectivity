import { Injectable } from '@nestjs/common';

export interface DemandForecastItem {
  resourceType: string;
  historicalRequests: number;
  projectedDemandRequests: number;
  growthPct: number;
  confidence: 'HIGH' | 'MEDIUM' | 'LOW';
}

@Injectable()
export class DemandForecastService {
  async getForecast(district = 'Guntur', period = 'NEXT_MONTH'): Promise<{
    district: string;
    period: string;
    forecasts: DemandForecastItem[];
  }> {
    return {
      district,
      period,
      forecasts: [
        { resourceType: 'TRACTOR', historicalRequests: 1200, projectedDemandRequests: 1416, growthPct: 18.0, confidence: 'HIGH' },
        { resourceType: 'SPRAYER', historicalRequests: 680, projectedDemandRequests: 890, growthPct: 30.9, confidence: 'HIGH' },
        { resourceType: 'WORKER', historicalRequests: 940, projectedDemandRequests: 1052, growthPct: 11.9, confidence: 'MEDIUM' },
        { resourceType: 'PUMP', historicalRequests: 220, projectedDemandRequests: 242, growthPct: 10.0, confidence: 'MEDIUM' },
      ],
    };
  }
}
