import { Injectable, BadRequestException } from '@nestjs/common';

export interface PricingRule {
  id: string;
  resourceType: 'TRACTOR' | 'WORKER' | 'EQUIPMENT';
  ruleType: 'BASE_PRICE' | 'PER_ACRE' | 'ATTACHMENT' | 'DISTANCE' | 'PLATFORM_FEE';
  name: string;
  value: number;
  unit: string;
  isActive: boolean;
}

export interface PriceEstimateParams {
  resourceType: 'TRACTOR' | 'WORKER' | 'EQUIPMENT';
  hpMin?: number;
  attachmentType?: string;
  areaAcres?: number;
  distanceKm?: number;
  skillId?: string;
  equipmentType?: string;
}

export interface PriceEstimateResult {
  resourceType: string;
  breakdown: Array<{ item: string; amount: number; description: string }>;
  subtotal: number;
  estimatedPlatformFee: number;
  totalEstimated: number;
  estimateRange: { min: number; max: number };
}

@Injectable()
export class PricingService {
  private rules: PricingRule[] = [
    // Tractor rules
    { id: 'prule-1', resourceType: 'TRACTOR', ruleType: 'BASE_PRICE', name: 'Tractor Base Daily Rate (45+ HP)', value: 1200, unit: 'INR/day', isActive: true },
    { id: 'prule-2', resourceType: 'TRACTOR', ruleType: 'ATTACHMENT', name: 'Rotavator Implement Add-on', value: 400, unit: 'INR/day', isActive: true },
    { id: 'prule-3', resourceType: 'TRACTOR', ruleType: 'PER_ACRE', name: 'Tillage Operational Work Rate', value: 60, unit: 'INR/acre', isActive: true },
    { id: 'prule-4', resourceType: 'TRACTOR', ruleType: 'DISTANCE', name: 'Transit Surcharge per km (beyond 3 km)', value: 20, unit: 'INR/km', isActive: true },
    { id: 'prule-5', resourceType: 'TRACTOR', ruleType: 'PLATFORM_FEE', name: 'RuralConnect Platform Commission', value: 5, unit: 'PERCENT', isActive: true },

    // Worker rules
    { id: 'prule-6', resourceType: 'WORKER', ruleType: 'BASE_PRICE', name: 'Skilled Operator Base Daily Wage', value: 500, unit: 'INR/day', isActive: true },
    { id: 'prule-7', resourceType: 'WORKER', ruleType: 'PLATFORM_FEE', name: 'Worker Service Fee', value: 5, unit: 'PERCENT', isActive: true },

    // Equipment rules
    { id: 'prule-8', resourceType: 'EQUIPMENT', ruleType: 'BASE_PRICE', name: 'Power Sprayer Rental (500L)', value: 1200, unit: 'INR/day', isActive: true },
    { id: 'prule-9', resourceType: 'EQUIPMENT', ruleType: 'PLATFORM_FEE', name: 'Equipment Platform Commission', value: 7, unit: 'PERCENT', isActive: true },
  ];

  async getRules(resourceType?: string) {
    if (resourceType) {
      return this.rules.filter((r) => r.resourceType === resourceType.toUpperCase() && r.isActive);
    }
    return this.rules;
  }

  async createRule(dto: any) {
    const newRule: PricingRule = {
      id: `prule-${Date.now()}`,
      resourceType: dto.resourceType,
      ruleType: dto.ruleType,
      name: dto.name,
      value: Number(dto.value),
      unit: dto.unit || 'INR',
      isActive: true,
    };
    this.rules.push(newRule);
    return newRule;
  }

  async calculateEstimate(params: PriceEstimateParams): Promise<PriceEstimateResult> {
    const type = params.resourceType.toUpperCase() as 'TRACTOR' | 'WORKER' | 'EQUIPMENT';
    const breakdown: Array<{ item: string; amount: number; description: string }> = [];

    let subtotal = 0;

    if (type === 'TRACTOR') {
      const basePrice = 1200;
      breakdown.push({ item: 'Tractor Base Operation', amount: basePrice, description: '45+ HP tractor operational base' });
      subtotal += basePrice;

      if (params.attachmentType?.toUpperCase() === 'ROTAVATOR') {
        const attPrice = 400;
        breakdown.push({ item: 'Rotavator Implement', amount: attPrice, description: 'High-speed pulverizing implement rental' });
        subtotal += attPrice;
      }

      const acres = params.areaAcres || 5;
      const areaCost = acres * 60;
      breakdown.push({ item: `Field Area Factor (${acres} acres)`, amount: areaCost, description: `₹60 per acre operational load` });
      subtotal += areaCost;

      const dist = params.distanceKm || 4;
      const transitDist = Math.max(0, dist - 2);
      const distCost = transitDist * 20;
      if (distCost > 0) {
        breakdown.push({ item: `Transit Allowance (${dist} km)`, amount: distCost, description: `₹20/km beyond 2 km base` });
        subtotal += distCost;
      }
    } else if (type === 'WORKER') {
      const baseWage = 500;
      breakdown.push({ item: 'Skilled Daily Labor', amount: baseWage, description: 'Certified operator standard wage' });
      subtotal += baseWage;
    } else if (type === 'EQUIPMENT') {
      const equipRate = 1200;
      breakdown.push({ item: 'Equipment Daily Rental', amount: equipRate, description: '500L calibrated power sprayer' });
      subtotal += equipRate;
    }

    const platformFeePct = type === 'EQUIPMENT' ? 0.07 : 0.05;
    const estimatedPlatformFee = Math.round(subtotal * platformFeePct);
    const totalEstimated = subtotal;

    return {
      resourceType: type,
      breakdown,
      subtotal,
      estimatedPlatformFee,
      totalEstimated,
      estimateRange: {
        min: Math.round(totalEstimated * 0.95),
        max: Math.round(totalEstimated * 1.05),
      },
    };
  }
}
