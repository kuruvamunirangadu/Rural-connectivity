import { Controller, Get, Post, Param, Query, Body } from '@nestjs/common';
import { AdvisoryService } from './advisory.service';

@Controller('knowledge/advisories')
export class AdvisoryController {
  constructor(private readonly advisoryService: AdvisoryService) {}

  @Get()
  listAdvisories(
    @Query('userId') userId?: string,
    @Query('farmId') farmId?: string,
    @Query('status') status?: string
  ) {
    return this.advisoryService.listAdvisories({ userId, farmId, status });
  }

  @Get(':id')
  getAdvisory(@Param('id') id: string) {
    return this.advisoryService.getAdvisory(id);
  }

  @Post()
  createAdvisory(@Body() body: any) {
    return this.advisoryService.createAdvisory(body);
  }

  @Post(':id/acknowledge')
  acknowledgeAdvisory(@Param('id') id: string) {
    return this.advisoryService.acknowledgeAdvisory(id);
  }

  @Post(':id/dismiss')
  dismissAdvisory(@Param('id') id: string) {
    return this.advisoryService.dismissAdvisory(id);
  }
}
