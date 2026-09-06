import { Injectable } from '@nestjs/common';
import { FarmContextService, FarmContextData } from './farm-context.service';
import { MarketplaceContextService, MarketplaceContextData } from './marketplace-context.service';

@Injectable()
export class RetrievalService {
  constructor(
    private readonly farmContextService: FarmContextService,
    private readonly marketplaceContextService: MarketplaceContextService
  ) {}

  async getCombinedContext(farmId = 'farm-001', district = 'Guntur'): Promise<{ farm: FarmContextData; marketplace: MarketplaceContextData }> {
    const [farm, marketplace] = await Promise.all([
      this.farmContextService.getFarmContext(farmId),
      this.marketplaceContextService.getMarketplaceContext(district),
    ]);

    return { farm, marketplace };
  }
}

