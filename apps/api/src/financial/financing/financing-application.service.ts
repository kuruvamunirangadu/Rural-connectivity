import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { FinancingRequestService } from './financing-request.service';
import { ConsentService } from '../consent/consent.service';
import { CreditProfileService } from '../credit-readiness/credit-profile.service';
import { FinancialPartnerService } from '../partners/financial-partner.service';
import { MockBankPartnerAdapter } from '../partners/adapters/mock-bank-adapter';

export interface FinancingApplicationDto {
  id: string;
  financingRequestId: string;
  productId: string;
  productName: string;
  partnerId: string;
  partnerName: string;
  consentId: string;
  applicationNumber: string;
  submittedAt: string;
  status: 'SUBMITTED' | 'UNDER_REVIEW' | 'ADDITIONAL_INFO_REQUIRED' | 'APPROVED' | 'REJECTED' | 'DISBURSED';
  externalReference?: string;
  approvedAmount?: number;
  interestRatePerAnnum?: number;
  tenureMonths?: number;
  decisionNotes?: string;
}

@Injectable()
export class FinancingApplicationService {
  constructor(
    private readonly requestService: FinancingRequestService,
    private readonly consentService: ConsentService,
    private readonly creditProfileService: CreditProfileService,
    private readonly partnerService: FinancialPartnerService,
    private readonly mockBankAdapter: MockBankPartnerAdapter
  ) {}

  private applications: FinancingApplicationDto[] = [
    {
      id: 'fin-app-9901',
      financingRequestId: 'fin-req-8801',
      productId: 'prod-sbi-kcc-01',
      productName: 'Kisan Seasonal Crop Working Capital',
      partnerId: 'prt-sbi-agri',
      partnerName: 'State Bank of India',
      consentId: 'cns-sbi-001',
      applicationNumber: 'APP-2026-SBI-8801',
      submittedAt: '2026-01-12T10:05:00Z',
      status: 'APPROVED',
      externalReference: 'SBI-AGRI-882194',
      approvedAmount: 80000,
      interestRatePerAnnum: 7.0,
      tenureMonths: 12,
      decisionNotes: 'Application sanctioned under Kisan Credit Line scheme for Kharif Bt-Cotton crop cycle.',
    },
  ];

  listApplications(userId: string): FinancingApplicationDto[] {
    const userRequests = this.requestService.listRequests(userId).map((r) => r.id);
    return this.applications.filter((a) => userRequests.includes(a.financingRequestId));
  }

  getApplication(id: string): FinancingApplicationDto {
    const app = this.applications.find((a) => a.id === id);
    if (!app) {
      throw new NotFoundException(`Financing application ${id} not found`);
    }
    return app;
  }

  async submitApplication(data: {
    requestId: string;
    productId: string;
    partnerId: string;
    consentId: string;
    userId: string;
  }): Promise<FinancingApplicationDto> {
    const request = this.requestService.getRequest(data.requestId);
    const product = this.partnerService.getProduct(data.productId);
    const partner = this.partnerService.getPartner(data.partnerId);

    // Verify explicit consent
    const consent = this.consentService
      .listConsents(data.userId)
      .find((c) => c.id === data.consentId && c.status === 'GRANTED');

    if (!consent) {
      throw new BadRequestException('Explicit active data-sharing consent is mandatory to submit financing application');
    }

    const appNumber = `APP-2026-${partner.name.substring(0, 3).toUpperCase()}-${Date.now().toString().slice(-4)}`;
    const creditProfile = this.creditProfileService.getCreditProfile(data.userId);

    // Submit to partner adapter
    const partnerResult = await this.mockBankAdapter.submitApplication({
      applicationNumber: appNumber,
      applicantUserId: data.userId,
      applicantName: 'Ravi Kumar (Verified Farmer)',
      applicantPhone: '+91 98765 43210',
      farmAcreage: request.farmAcreage || 5.0,
      cropName: request.cropName || 'Bt-Cotton (BG-II)',
      purpose: request.purpose,
      requestedAmount: request.requestedAmount,
      requestedTenureMonths: request.requestedTenureMonths,
      consentId: consent.id,
      creditIndicators: creditProfile.indicators.map((i) => ({
        indicatorType: i.indicatorType,
        rating: i.rating,
        valueScore: i.valueScore,
      })),
    });

    const application: FinancingApplicationDto = {
      id: `fin-app-${Date.now().toString(36)}`,
      financingRequestId: request.id,
      productId: product.id,
      productName: product.name,
      partnerId: partner.id,
      partnerName: partner.name,
      consentId: consent.id,
      applicationNumber: appNumber,
      submittedAt: new Date().toISOString(),
      status: partnerResult.status as any,
      externalReference: partnerResult.externalReference,
      approvedAmount: partnerResult.approvedAmount,
      interestRatePerAnnum: partnerResult.interestRatePerAnnum || product.indicativeInterestRate,
      tenureMonths: partnerResult.tenureMonths || request.requestedTenureMonths,
      decisionNotes: partnerResult.decisionNotes,
    };

    this.applications.push(application);
    this.requestService.updateStatus(request.id, partnerResult.status as any);

    return application;
  }
}
