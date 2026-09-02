import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common';
import { AssistantService } from './assistant/assistant.service';
import { FarmPlanningService } from './farm-planning/farm-planning.service';
import { RecommendationService } from './recommendations/recommendation.service';
import { PriceEstimationService } from './pricing/price-estimation.service';
import { DemandForecastService } from './forecasting/demand-forecast.service';
import { SupplyGapService } from './forecasting/supply-gap.service';
import { InventoryForecastService } from './forecasting/inventory-forecast.service';

@Controller('ai')
export class AIController {
  constructor(
    private readonly assistantService: AssistantService,
    private readonly farmPlanningService: FarmPlanningService,
    private readonly recommendationService: RecommendationService,
    private readonly priceEstimationService: PriceEstimationService,
    private readonly demandForecastService: DemandForecastService,
    private readonly supplyGapService: SupplyGapService,
    private readonly inventoryForecastService: InventoryForecastService
  ) {}

  @Post('assistant/conversations')
  async createConversation(@Body() body: { userId?: string; title?: string }) {
    return this.assistantService.createConversation(body?.userId, body?.title);
  }

  @Get('assistant/conversations')
  async getConversations(@Query('userId') userId?: string) {
    return this.assistantService.getConversations(userId);
  }

  @Get('assistant/conversations/:id/messages')
  async getMessages(@Param('id') id: string) {
    return this.assistantService.getMessages(id);
  }

  @Post('assistant/conversations/:id/messages')
  async sendMessage(
    @Param('id') conversationId: string,
    @Body() body: { content: string; userId?: string }
  ) {
    return this.assistantService.sendMessage(conversationId, body.content, body?.userId);
  }

  @Post('work-requests/interpret')
  async interpretWorkRequest(@Body() body: { message: string }) {
    return this.assistantService.interpretWorkRequest(body.message);
  }

  @Post('farms/:farmId/plan-suggestions')
  async getFarmPlanSuggestions(
    @Param('farmId') farmId: string,
    @Body() body: { crop?: string; area?: number }
  ) {
    return this.farmPlanningService.generateSuggestions(farmId, body?.crop, body?.area);
  }

  @Get('recommendations')
  async getRecommendations(@Query('userId') userId?: string) {
    return this.recommendationService.getRecommendations(userId);
  }

  @Post('recommendations/:id/accept')
  async acceptRecommendation(@Param('id') id: string) {
    return this.recommendationService.acceptRecommendation(id);
  }

  @Post('recommendations/:id/reject')
  async rejectRecommendation(@Param('id') id: string) {
    return this.recommendationService.rejectRecommendation(id);
  }

  @Post('recommendations/feedback')
  async recordFeedback(@Body() body: { userId: string; recommendationId: string; rating: 'UPVOTE' | 'DOWNVOTE'; feedback?: string }) {
    return this.recommendationService.recordFeedback(body.userId, body.recommendationId, body.rating, body.feedback);
  }

  @Post('pricing/estimate')
  async estimatePrice(@Body() body: { resourceType: string; attachmentType?: string; acres: number; locationId?: string }) {
    return this.priceEstimationService.estimatePrice(body);
  }

  @Get('forecast/demand')
  async getDemandForecast(@Query('district') district?: string) {
    return this.demandForecastService.getForecast(district);
  }

  @Get('forecast/supply-gaps')
  async getSupplyGaps(@Query('district') district?: string) {
    return this.supplyGapService.detectGaps(district);
  }

  @Get('forecast/inventory')
  async getInventoryForecast(@Query('supplierId') supplierId?: string) {
    return this.inventoryForecastService.getForecastForSupplier(supplierId);
  }
}
