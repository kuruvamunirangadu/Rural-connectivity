import { Injectable } from '@nestjs/common';
import { FinancialPartnerAdapter, PartnerApplicationPayload, PartnerUnderwritingResult } from '../partner-adapter.interface';

@Injectable()
export class MockBankPartnerAdapter implements FinancialPartnerAdapter {
  partnerId = 'prt-sbi-agri';
  partnerName = 'State Bank of India (Agri Division)';

  async submitApplication(payload: PartnerApplicationPayload): Promise<PartnerUnderwritingResult> {
    const extRef = `SBI-AGRI-${Date.now().toString(36).toUpperCase()}`;

    // Underwriting simulation
    const isStrong = payload.creditIndicators.some((i) => i.rating === 'STRONG' || i.rating === 'EXCELLENT');

    if (isStrong && payload.requestedAmount <= 300000) {
      return {
        externalReference: extRef,
        status: 'APPROVED',
        approvedAmount: payload.requestedAmount,
        interestRatePerAnnum: 7.25,
        tenureMonths: payload.requestedTenureMonths || 12,
        decisionNotes: `Appraisal approved under Kisan Credit Line at 7.25% p.a. based on ${payload.farmAcreage} acres verified crop history and zero disputes.`,
      };
    } else {
      return {
        externalReference: extRef,
        status: 'UNDER_REVIEW',
        decisionNotes: 'Application received by SBI Rural credit desk. Field inspection verification in progress.',
      };
    }
  }

  async checkApplicationStatus(externalReference: string): Promise<PartnerUnderwritingResult> {
    return {
      externalReference,
      status: 'APPROVED',
      approvedAmount: 80000,
      interestRatePerAnnum: 7.25,
      tenureMonths: 12,
      decisionNotes: 'Loan sanctioned and active.',
    };
  }

  async cancelApplication(externalReference: string): Promise<boolean> {
    return true;
  }
}
