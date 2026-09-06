import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common';
import { ProduceAggregationService } from './produce-aggregation.service';

@Controller('produce-aggregations')
export class ProduceAggregationController {
  constructor(private readonly aggregationService: ProduceAggregationService) {}

  @Get()
  listAggregations(
    @Query('organizationId') organizationId?: string,
    @Query('crop') crop?: string,
    @Query('status') status?: string
  ) {
    return this.aggregationService.listAggregations({ organizationId, crop, status });
  }

  @Get(':id')
  getAggregation(@Param('id') id: string) {
    return this.aggregationService.getAggregation(id);
  }

  @Post()
  createAggregation(@Body() body: any) {
    return this.aggregationService.createAggregation(body);
  }

  @Post(':id/add-item')
  addItem(@Param('id') id: string, @Body() body: any) {
    return this.aggregationService.addItemToAggregation(id, body);
  }

  @Post(':id/publish-listing')
  publishListing(@Param('id') id: string, @Body() body: any) {
    return this.aggregationService.publishAggregationListing(id, body);
  }
}
