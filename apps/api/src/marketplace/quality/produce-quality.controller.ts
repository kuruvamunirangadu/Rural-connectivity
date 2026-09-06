import { Controller, Get, Post, Patch, Body, Param, Query } from '@nestjs/common';
import { ProduceQualityService } from './produce-quality.service';

@Controller('produce-quality')
export class ProduceQualityController {
  constructor(private readonly qualityService: ProduceQualityService) {}

  @Get('inspections')
  listInspections(
    @Query('listingId') listingId?: string,
    @Query('orderId') orderId?: string,
    @Query('status') status?: string
  ) {
    return this.qualityService.listInspections({ listingId, orderId, status });
  }

  @Get('inspections/:id')
  getInspection(@Param('id') id: string) {
    return this.qualityService.getInspection(id);
  }

  @Post('inspect')
  recordInspection(@Body() body: any) {
    return this.qualityService.recordInspection(body);
  }

  @Patch('inspections/:id/status')
  updateInspectionStatus(@Param('id') id: string, @Body() body: { status: any; notes?: string }) {
    return this.qualityService.updateInspectionStatus(id, body.status, body.notes);
  }
}
