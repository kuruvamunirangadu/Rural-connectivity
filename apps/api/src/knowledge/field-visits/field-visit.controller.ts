import { Controller, Get, Post, Param, Query, Body } from '@nestjs/common';
import { FieldVisitService } from './field-visit.service';

@Controller('field-visits')
export class FieldVisitController {
  constructor(private readonly fieldVisitService: FieldVisitService) {}

  @Get()
  listVisits(
    @Query('officerId') officerId?: string,
    @Query('farmerId') farmerId?: string,
    @Query('farmId') farmId?: string,
    @Query('status') status?: string
  ) {
    return this.fieldVisitService.listVisits({ officerId, farmerId, farmId, status });
  }

  @Get(':id')
  getVisit(@Param('id') id: string) {
    return this.fieldVisitService.getVisit(id);
  }

  @Post()
  createVisit(@Body() body: any) {
    return this.fieldVisitService.createVisit(body);
  }

  @Post(':id/observations')
  recordObservation(@Param('id') id: string, @Body() body: any) {
    return this.fieldVisitService.recordObservation(id, body);
  }
}
