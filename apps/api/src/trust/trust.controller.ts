import { Controller, Get, Param } from '@nestjs/common';
import { TrustService } from './trust.service';
import { ReliabilityService } from './reliability.service';

@Controller('users')
export class TrustController {
  constructor(
    private readonly trustService: TrustService,
    private readonly reliabilityService: ReliabilityService
  ) {}

  @Get(':id/trust')
  async getUserTrustProfile(@Param('id') userId: string) {
    return this.trustService.getUserTrustProfile(userId);
  }

  @Get(':id/reliability')
  async getUserReliability(@Param('id') userId: string) {
    return this.reliabilityService.getMetricsForUser(userId);
  }
}
