import { Injectable } from '@nestjs/common';

export interface FarmContextData {
  farmId: string;
  farmName: string;
  village: string;
  district: string;
  totalAcres: number;
  crops: Array<{
    cropName: string;
    acres: number;
    season: string;
    stage: string;
  }>;
  soilMoisture: string;
  soilHealth: string;
  upcomingActivities: Array<{
    activity: string;
    scheduledDate: string;
    status: string;
  }>;
}

@Injectable()
export class FarmContextService {
  private mockFarms: Record<string, FarmContextData> = {
    'farm-001': {
      farmId: 'farm-001',
      farmName: 'Ravi Krishna Green Lands',
      village: 'Tangipalli',
      district: 'Guntur',
      totalAcres: 5.0,
      crops: [
        { cropName: 'Cotton Hybrid-6', acres: 3.5, season: 'Kharif', stage: 'SOWING_PREP' },
        { cropName: 'Paddy BPT-5204', acres: 1.5, season: 'Kharif', stage: 'LAND_PREPARATION' },
      ],
      soilMoisture: '28% (Optimal)',
      soilHealth: 'NPK Grade A - Black Cotton Soil',
      upcomingActivities: [
        { activity: 'Rotavation for Cotton', scheduledDate: '2026-09-10', status: 'PENDING_MATCH' },
        { activity: 'Paddy Nursery Sowing', scheduledDate: '2026-09-15', status: 'SCHEDULED' },
      ],
    },
  };

  async getFarmContext(farmId = 'farm-001'): Promise<FarmContextData> {
    return (
      this.mockFarms[farmId] || {
        farmId,
        farmName: 'Demo Agricultural Plot',
        village: 'Guntur Rural',
        district: 'Guntur',
        totalAcres: 4.0,
        crops: [{ cropName: 'Cotton', acres: 4.0, season: 'Kharif', stage: 'VEGETATIVE' }],
        soilMoisture: '25%',
        soilHealth: 'Loamy Soil',
        upcomingActivities: [],
      }
    );
  }
}

