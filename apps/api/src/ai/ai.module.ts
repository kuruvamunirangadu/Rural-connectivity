import { Module, Global } from '@nestjs/common';
import { AIController } from './ai.controller';
import { AssistantService } from './assistant/assistant.service';
import { FarmPlanningService } from './farm-planning/farm-planning.service';
import { RecommendationService } from './recommendations/recommendation.service';
import { PriceEstimationService } from './pricing/price-estimation.service';
import { DemandForecastService } from './forecasting/demand-forecast.service';
import { SupplyGapService } from './forecasting/supply-gap.service';
import { InventoryForecastService } from './forecasting/inventory-forecast.service';
import { MockAIProvider } from './providers/mock-ai.provider';
import { ActionPolicyService } from './guardrails/action-policy.service';

@Global()
@Module({
  controllers: [AIController],
  providers: [
    MockAIProvider,
    ActionPolicyService,
    AssistantService,
    FarmPlanningService,
    RecommendationService,
    PriceEstimationService,
    DemandForecastService,
    SupplyGapService,
    InventoryForecastService,
  ],
  exports: [
    AssistantService,
    FarmPlanningService,
    RecommendationService,
    PriceEstimationService,
    DemandForecastService,
    SupplyGapService,
    InventoryForecastService,
    ActionPolicyService,
  ],
})
export class AIModule {}
