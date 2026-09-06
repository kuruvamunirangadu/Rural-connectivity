import { Controller, Get, Post, Param, Body, Query } from '@nestjs/common';
import { FinancingRequestService, FinancingRequestDto } from './financing-request.service';
import { FinancingApplicationService } from './financing-application.service';

@Controller('financial/financing')
export class FinancingController {
  constructor(
    private readonly requestService: FinancingRequestService,
    private readonly applicationService: FinancingApplicationService
  ) {}

  @Get('requests/:userId')
  listRequests(@Param('userId') userId: string) {
    return this.requestService.listRequests(userId);
  }

  @Post('requests')
  createRequest(
    @Body()
    body: {
      userId: string;
      purpose: FinancingRequestDto['purpose'];
      requestedAmount: number;
      requestedTenureMonths?: number;
      partnerId?: string;
      partnerName?: string;
      cropName?: string;
      farmAcreage?: number;
    }
  ) {
    return this.requestService.createRequest(body);
  }

  @Get('applications/:userId')
  listApplications(@Param('userId') userId: string) {
    return this.applicationService.listApplications(userId);
  }

  @Post('applications/submit')
  submitApplication(
    @Body()
    body: {
      requestId: string;
      productId: string;
      partnerId: string;
      consentId: string;
      userId: string;
    }
  ) {
    return this.applicationService.submitApplication(body);
  }
}
