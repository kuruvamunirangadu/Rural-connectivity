import { Controller, Get, Post, Param, Body, Query } from '@nestjs/common';
import { ConsentService, FinancialConsentDto } from './consent.service';

@Controller('financial/consents')
export class ConsentController {
  constructor(private readonly consentService: ConsentService) {}

  @Get(':userId')
  listConsents(
    @Param('userId') userId: string,
    @Query('status') status?: string,
    @Query('partnerId') partnerId?: string
  ) {
    return this.consentService.listConsents(userId, { status, partnerId });
  }

  @Post('grant')
  grantConsent(
    @Body()
    body: {
      userId: string;
      purpose: FinancialConsentDto['purpose'];
      scope: string[];
      partnerId?: string;
      partnerName?: string;
      validityDays?: number;
    }
  ) {
    return this.consentService.grantConsent(body);
  }

  @Post(':id/revoke')
  revokeConsent(
    @Param('id') id: string,
    @Body() body: { userId: string; reason?: string }
  ) {
    return this.consentService.revokeConsent(id, body.userId, body.reason);
  }
}
