import { Injectable, ForbiddenException } from '@nestjs/common';
import { FarmContextService } from '../retrieval/farm-context.service';
import { MarketplaceContextService } from '../retrieval/marketplace-context.service';

export interface ToolDefinition {
  name: string;
  description: string;
  parameters: Record<string, any>;
  requiresConfirmation: boolean;
}

@Injectable()
export class AssistantToolsService {
  constructor(
    private readonly farmContext: FarmContextService,
    private readonly marketplaceContext: MarketplaceContextService
  ) {}

  getAvailableTools(): ToolDefinition[] {
    return [
      {
        name: 'getFarm',
        description: 'Get verified details of the farmer plot and soil condition',
        parameters: { farmId: 'string' },
        requiresConfirmation: false,
      },
      {
        name: 'getUpcomingActivities',
        description: 'Retrieve scheduled crop activities for the farm',
        parameters: { farmId: 'string' },
        requiresConfirmation: false,
      },
      {
        name: 'searchResources',
        description: 'Search available tractors, equipment, and skilled workers nearby',
        parameters: { district: 'string', resourceType: 'string' },
        requiresConfirmation: false,
      },
      {
        name: 'getPriceEstimate',
        description: 'Get statistical price estimation range for a given activity',
        parameters: { activityType: 'string', acres: 'number' },
        requiresConfirmation: false,
      },
      {
        name: 'prepareWorkRequest',
        description: 'Prepare a structured draft work request for human review and confirmation',
        parameters: { activityType: 'string', area: 'number', date: 'string' },
        requiresConfirmation: true,
      },
    ];
  }

  async executeTool(toolName: string, args: Record<string, any>): Promise<any> {
    switch (toolName) {
      case 'getFarm':
        return this.farmContext.getFarmContext(args.farmId);
      case 'getUpcomingActivities': {
        const farm = await this.farmContext.getFarmContext(args.farmId);
        return farm.upcomingActivities;
      }
      case 'searchResources': {
        const market = await this.marketplaceContext.getMarketplaceContext(args.district || 'Guntur');
        return market.availableTractors;
      }
      case 'getPriceEstimate': {
        const acres = Number(args.acres || 3);
        return {
          minPrice: Math.round(acres * 600),
          maxPrice: Math.round(acres * 800 + 400),
          acres,
          currency: 'INR',
        };
      }
      case 'prepareWorkRequest':
        return {
          status: 'DRAFT_REQUIRES_CONFIRMATION',
          draft: args,
          message: 'Draft work request prepared. Farmer must review and confirm before dispatch.',
        };
      default:
        throw new ForbiddenException(`Unknown or prohibited AI tool: ${toolName}`);
    }
  }
}

