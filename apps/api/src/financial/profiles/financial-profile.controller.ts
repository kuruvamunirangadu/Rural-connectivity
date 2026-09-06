import { Controller, Get, Param, Query } from '@nestjs/common';
import { FinancialProfileService } from './financial-profile.service';

@Controller('financial/profile')
export class FinancialProfileController {
  constructor(private readonly profileService: FinancialProfileService) {}

  @Get(':userId')
  getProfile(@Param('userId') userId: string) {
    return this.profileService.getProfile(userId);
  }
}
