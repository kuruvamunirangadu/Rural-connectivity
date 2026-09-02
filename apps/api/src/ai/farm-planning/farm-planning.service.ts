import { Injectable } from '@nestjs/common';

export interface FarmPlanSuggestion {
  activityType: string;
  stageOrder: number;
  reason: string;
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
  recommendedResources: Array<{ type: string; detail: string }>;
  suggestedInputs?: Array<{ product: string; estimatedQty: string }>;
}

@Injectable()
export class FarmPlanningService {
  async generateSuggestions(farmId = 'farm-001', crop = 'Cotton', area = 5.0): Promise<{
    farmId: string;
    crop: string;
    area: number;
    suggestions: FarmPlanSuggestion[];
    explanation: string;
  }> {
    const suggestions: FarmPlanSuggestion[] = [
      {
        activityType: 'SPRAYING',
        stageOrder: 4,
        reason: 'Optimal 45-day window for bollworm protection in Bt Cotton crop.',
        priority: 'HIGH',
        recommendedResources: [
          { type: 'EQUIPMENT', detail: '500L Tractor-Mounted or Power Sprayer' },
          { type: 'WORKER', detail: 'Certified Sprayer Operator' },
        ],
        suggestedInputs: [{ product: 'Coragen Insecticide (Chlorantraniliprole)', estimatedQty: '300 ml' }],
      },
      {
        activityType: 'FERTILIZATION',
        stageOrder: 5,
        reason: 'Top dressing stage for vegetative growth and boll formation.',
        priority: 'MEDIUM',
        recommendedResources: [{ type: 'WORKER', detail: 'Farm Labor' }],
        suggestedInputs: [{ product: 'Urea 46% N', estimatedQty: '5 bags (225 kg)' }],
      },
    ];

    return {
      farmId,
      crop,
      area,
      suggestions,
      explanation: `For your ${area}-acre ${crop} farm, AI recommends scheduling pest-control spraying followed by secondary nitrogen fertilization to maximize yield during the current vegetative growth stage.`,
    };
  }
}
