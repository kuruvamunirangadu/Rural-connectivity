export interface PartnerApplicationPayload {
  applicationNumber: string;
  applicantUserId: string;
  applicantName: string;
  applicantPhone: string;
  farmAcreage: number;
  cropName: string;
  purpose: string;
  requestedAmount: number;
  requestedTenureMonths: number;
  consentId: string;
  creditIndicators: {
    indicatorType: string;
    rating: string;
    valueScore: number;
  }[];
}

export interface PartnerUnderwritingResult {
  externalReference: string;
  status: 'SUBMITTED' | 'UNDER_REVIEW' | 'ADDITIONAL_INFO_REQUIRED' | 'APPROVED' | 'REJECTED';
  approvedAmount?: number;
  interestRatePerAnnum?: number;
  tenureMonths?: number;
  decisionNotes?: string;
}

export interface FinancialPartnerAdapter {
  partnerId: string;
  partnerName: string;
  submitApplication(payload: PartnerApplicationPayload): Promise<PartnerUnderwritingResult>;
  checkApplicationStatus(externalReference: string): Promise<PartnerUnderwritingResult>;
  cancelApplication(externalReference: string): Promise<boolean>;
}
