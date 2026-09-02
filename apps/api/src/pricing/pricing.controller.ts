import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { PricingService } from './pricing.service';

@Controller('pricing')
export class PricingController {
  constructor(private readonly pricingService: PricingService) {}

  @Get('rules')
  async getRules(@Query('resourceType') resourceType?: string) {
    return this.pricingService.getRules(resourceType);
  }

  @Post('admin/rules')
  async createRule(@Body() body: any) {
    return this.pricingService.createRule(body);
  }

  @Get('estimate')
  async getEstimate(
    @Query('resourceType') resourceType: 'TRACTOR' | 'WORKER' | 'EQUIPMENT',
    @Query('attachmentType') attachmentType?: string,
    @Query('areaAcres') areaAcres?: string,
    @Query('distanceKm') distanceKm?: string
  ) {
    return this.pricingService.calculateEstimate({
      resourceType: resourceType || 'TRACTOR',
      attachmentType,
      areaAcres: areaAcres ? Number(areaAcres) : 5,
      distanceKm: distanceKm ? Number(distanceKm) : 4,
    });
  }
}
