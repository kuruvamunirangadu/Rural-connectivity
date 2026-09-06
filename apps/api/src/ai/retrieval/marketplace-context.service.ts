import { Injectable } from '@nestjs/common';

export interface MarketplaceContextData {
  district: string;
  nearbyMachineryCount: number;
  availableTractors: Array<{
    id: string;
    model: string;
    hp: number;
    implements: string[];
    distanceKm: number;
    rating: number;
    verified: boolean;
  }>;
  historicalBaseTariff: {
    rotavatorPerAcre: number;
    ploughPerAcre: number;
    sprayerPerAcre: number;
  };
  inputSuppliersAvailable: number;
}

@Injectable()
export class MarketplaceContextService {
  async getMarketplaceContext(district = 'Guntur'): Promise<MarketplaceContextData> {
    return {
      district,
      nearbyMachineryCount: 14,
      availableTractors: [
        {
          id: 'trc-001',
          model: 'Mahindra 575 DI (50 HP)',
          hp: 50,
          implements: ['Rotavator', 'Plough', 'Cultivator'],
          distanceKm: 3.8,
          rating: 4.8,
          verified: true,
        },
        {
          id: 'trc-002',
          model: 'John Deere 5050D (50 HP)',
          hp: 50,
          implements: ['Laser Leveler', 'Rotavator'],
          distanceKm: 6.2,
          rating: 4.9,
          verified: true,
        },
        {
          id: 'trc-003',
          model: 'Sonalika DI 42 (42 HP)',
          hp: 42,
          implements: ['Cultivator', 'Trailer'],
          distanceKm: 2.1,
          rating: 4.6,
          verified: true,
        },
      ],
      historicalBaseTariff: {
        rotavatorPerAcre: 950,
        ploughPerAcre: 900,
        sprayerPerAcre: 600,
      },
      inputSuppliersAvailable: 6,
    };
  }
}

