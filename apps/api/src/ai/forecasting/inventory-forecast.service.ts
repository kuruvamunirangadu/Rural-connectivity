import { Injectable } from '@nestjs/common';

export interface InventoryForecastItem {
  productName: string;
  category: string;
  currentStockUnits: number;
  projectedDemandUnits: number;
  stockoutRisk: 'HIGH' | 'MEDIUM' | 'LOW';
  recommendedAction: string;
}

@Injectable()
export class InventoryForecastService {
  async getForecastForSupplier(supplierId = 'sup-001'): Promise<{
    supplierId: string;
    forecasts: InventoryForecastItem[];
  }> {
    return {
      supplierId,
      forecasts: [
        {
          productName: 'Urea 46% N',
          category: 'CHEMICAL_FERTILIZER',
          currentStockUnits: 180,
          projectedDemandUnits: 220,
          stockoutRisk: 'HIGH',
          recommendedAction: 'Projected shortage of 40 bags within next 7 days. Replenish inventory from central distributor.',
        },
        {
          productName: 'DAP (Di-Ammonium Phosphate)',
          category: 'CHEMICAL_FERTILIZER',
          currentStockUnits: 8,
          projectedDemandUnits: 42,
          stockoutRisk: 'HIGH',
          recommendedAction: 'Critical low stock alert (8 bags remaining vs 42 projected). Place immediate order.',
        },
        {
          productName: 'Bt-Cotton Hybrid Seeds',
          category: 'SEEDS',
          currentStockUnits: 95,
          projectedDemandUnits: 60,
          stockoutRisk: 'LOW',
          recommendedAction: 'Stock level is adequate for remaining sowing window.',
        },
      ],
    };
  }
}
