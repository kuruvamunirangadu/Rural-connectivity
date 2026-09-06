import { Module, Global } from '@nestjs/common';
import { AIController } from './ai.controller';
import { AssistantService } from './assistant/assistant.service';
import { AssistantToolsService } from './assistant/assistant.tools';
import { FarmPlanningService } from './farm-planning/farm-planning.service';
import { RecommendationService } from './recommendations/recommendation.service';
import { PriceEstimationService } from './pricing/price-estimation.service';
import { DemandForecastService } from './forecasting/demand-forecast.service';
import { SupplyGapService } from './forecasting/supply-gap.service';
import { InventoryForecastService } from './forecasting/inventory-forecast.service';
import { MockAIProvider } from './providers/mock-ai.provider';
import { ActionPolicyService } from './guardrails/action-policy.service';
import { SafetyService } from './guardrails/safety.service';
import { AIValidationService } from './guardrails/ai-validation.service';
import { HallucinationCheckService } from './guardrails/hallucination-check.service';
import { RetrievalService } from './retrieval/retrieval.service';
import { FarmContextService } from './retrieval/farm-context.service';
import { MarketplaceContextService } from './retrieval/marketplace-context.service';

@Global()
@Module({
  controllers: [AIController],
  providers: [
    MockAIProvider,
    ActionPolicyService,
    SafetyService,
    AIValidationService,
    HallucinationCheckService,
    FarmContextService,
    MarketplaceContextService,
    RetrievalService,
    AssistantToolsService,
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
    AssistantToolsService,
    FarmPlanningService,
    RecommendationService,
    PriceEstimationService,
    DemandForecastService,
    SupplyGapService,
    InventoryForecastService,
    ActionPolicyService,
    SafetyService,
    AIValidationService,
    HallucinationCheckService,
    RetrievalService,
  ],
})
export class AIModule {}
