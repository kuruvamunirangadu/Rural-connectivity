import { Controller, Get, Param } from '@nestjs/common';
import { CreditProfileService } from './credit-profile.service';

@Controller('financial/credit-readiness')
export class CreditReadinessController {
  constructor(private readonly creditProfileService: CreditProfileService) {}

  @Get(':userId')
  getCreditProfile(@Param('userId') userId: string) {
    return this.creditProfileService.getCreditProfile(userId);
  }
}
