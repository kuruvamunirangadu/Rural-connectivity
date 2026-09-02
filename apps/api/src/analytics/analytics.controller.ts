import { Controller, Get, Query } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';

@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('marketplace')
  async getMarketplaceOverview() {
    return this.analyticsService.getMarketplaceOverview();
  }

  @Get('demand')
  async getDemandAnalytics() {
    return this.analyticsService.getDemandAnalytics();
  }

  @Get('supply')
  async getSupplyAnalytics() {
    return this.analyticsService.getSupplyAnalytics();
  }

  @Get('farmer/me')
  async getFarmerAnalytics(@Query('userId') userId?: string) {
    return this.analyticsService.getFarmerAnalytics(userId);
  }

  @Get('provider/me')
  async getProviderAnalytics(@Query('providerId') providerId?: string) {
    return this.analyticsService.getProviderAnalytics(providerId);
  }

  @Get('supplier/me')
  async getSupplierAnalytics(@Query('supplierId') supplierId?: string) {
    return this.analyticsService.getSupplierAnalytics(supplierId);
  }

  @Get('contractor/me')
  async getContractorAnalytics(@Query('contractorId') contractorId?: string) {
    return this.analyticsService.getContractorAnalytics(contractorId);
  }
}
