import { Injectable } from '@nestjs/common';
import { AIProvider, StructuredIntentResult } from './ai-provider.interface';

@Injectable()
export class MockAIProvider implements AIProvider {
  async interpretIntent(message: string): Promise<StructuredIntentResult> {
    const msg = message.toLowerCase();

    // 1. Natural Language Work Request for Rotavating / Ploughing
    if (msg.includes('tractor') || msg.includes('rotavator') || msg.includes('plough')) {
      const areaMatch = msg.match(/(\d+)\s*(acre|acres)/);
      const area = areaMatch ? parseInt(areaMatch[1], 10) : 3;

      return {
        intent: 'CREATE_WORK_REQUEST',
        requiresConfirmation: true,
        activityType: 'ROTAVATING',
        area,
        areaUnit: 'ACRE',
        resourceRequirements: [
          {
            resourceType: 'TRACTOR',
            attachmentType: 'ROTAVATOR',
            quantity: 1,
          },
        ],
        date: '2026-09-10',
        timePreference: 'MORNING',
        summary: `I understood that you need a tractor with a rotavator tomorrow morning for ${area} acres.`,
      };
    }

    // 2. Natural Language Work Request for Spraying
    if (msg.includes('spray') || msg.includes('cotton')) {
      const areaMatch = msg.match(/(\d+)\s*(acre|acres)/);
      const area = areaMatch ? parseInt(areaMatch[1], 10) : 5;

      return {
        intent: 'CREATE_WORK_REQUEST',
        requiresConfirmation: true,
        activityType: 'SPRAYING',
        crop: 'COTTON',
        area,
        areaUnit: 'ACRE',
        resourceRequirements: [
          {
            resourceType: 'EQUIPMENT',
            attachmentType: 'POWER_SPRAYER',
            quantity: 1,
          },
          {
            resourceType: 'WORKER',
            skillCategory: 'SPRAYER_OPERATOR',
            quantity: 1,
          },
        ],
        date: '2026-09-10',
        timePreference: 'MORNING',
        summary: `I understood that you need a power sprayer and sprayer operator for ${area} acres of cotton on Monday morning.`,
      };
    }

    // 3. Farm Planning Question
    if (msg.includes('plan') || msg.includes('work should i do') || msg.includes('next work')) {
      return {
        intent: 'FARM_PLAN_QUERY',
        requiresConfirmation: false,
        crop: 'COTTON',
        area: 5,
        summary: 'Reviewing your 5-acre cotton farm plan to suggest upcoming activities.',
      };
    }

    return {
      intent: 'UNKNOWN',
      requiresConfirmation: false,
      summary: 'I am here to assist with your farm planning, tractor booking, cost estimation, and input needs.',
    };
  }

  async generateExplanation(topic: string, context: Record<string, any>): Promise<string> {
    if (topic === 'RESOURCE_RECOMMENDATION') {
      return `Recommended ${context.resourceName} because it provides ${context.hp || 50} HP with an attached ${context.attachment || 'Rotavator'}, is located only ${context.distance || '3.8 km'} away, and holds a ★ ${context.rating || '4.8'} rating with 96% completion rate.`;
    }
    if (topic === 'PRICE_ESTIMATION') {
      return `Estimated range: ₹${context.minPrice} – ₹${context.maxPrice} based on ${context.acres} acres, ${context.attachment} implement attachment, transit distance, and regional historical bookings.`;
    }
    return `AI analyzed current farm context and historical marketplace data.`;
  }
}
