import { Injectable } from '@nestjs/common';

export interface CreditIndicatorDto {
  indicatorType: 'TRANSACTION_HISTORY' | 'INCOME_STABILITY' | 'SALES_ACTIVITY' | 'SERVICE_ACTIVITY' | 'PAYMENT_RELIABILITY' | 'SETTLEMENT_HISTORY' | 'PROFILE_VERIFICATION' | 'DISPUTE_ACTIVITY';
  rating: 'EXCELLENT' | 'STRONG' | 'MODERATE' | 'LIMITED' | 'INSUFFICIENT_DATA';
  valueScore: number; // 0 to 100
  rationale: string;
  dataSource: string;
  calculatedAt: string;
}

@Injectable()
export class IndicatorService {
  calculateIndicators(userData: {
    tenureMonths: number;
    completedTransactions: number;
    produceSalesCount: number;
    serviceJobsCount: number;
    disputeCount: number;
    verificationTier: number;
    onTimeSettlementPercent: number;
  }): CreditIndicatorDto[] {
    const now = new Date().toISOString();

    const indicators: CreditIndicatorDto[] = [
      {
        indicatorType: 'TRANSACTION_HISTORY',
        rating: userData.completedTransactions > 50 ? 'STRONG' : userData.completedTransactions > 20 ? 'MODERATE' : 'LIMITED',
        valueScore: Math.min(100, Math.round((userData.completedTransactions / 60) * 100)),
        rationale: `${userData.completedTransactions} verified platform transactions recorded over ${userData.tenureMonths} months.`,
        dataSource: 'Authoritative platform transaction ledger',
        calculatedAt: now,
      },
      {
        indicatorType: 'INCOME_STABILITY',
        rating: userData.produceSalesCount >= 8 ? 'STRONG' : userData.produceSalesCount >= 3 ? 'MODERATE' : 'LIMITED',
        valueScore: Math.min(100, Math.round((userData.produceSalesCount / 10) * 100)),
        rationale: `${userData.produceSalesCount} verified seasonal produce sales batches settled through escrow.`,
        dataSource: 'B2B Marketplace trade settlements',
        calculatedAt: now,
      },
      {
        indicatorType: 'SERVICE_ACTIVITY',
        rating: userData.serviceJobsCount > 15 ? 'EXCELLENT' : userData.serviceJobsCount > 5 ? 'STRONG' : 'MODERATE',
        valueScore: Math.min(100, Math.round((userData.serviceJobsCount / 20) * 100)),
        rationale: `${userData.serviceJobsCount} verified equipment or labor bookings fulfilled with positive feedback.`,
        dataSource: 'Booking & Dispatch execution telemetry',
        calculatedAt: now,
      },
      {
        indicatorType: 'PAYMENT_RELIABILITY',
        rating: userData.onTimeSettlementPercent >= 95 ? 'EXCELLENT' : userData.onTimeSettlementPercent >= 80 ? 'STRONG' : 'MODERATE',
        valueScore: Math.round(userData.onTimeSettlementPercent),
        rationale: `${userData.onTimeSettlementPercent}% on-time payment & escrow release consistency without chargebacks.`,
        dataSource: 'Escrow Vault & Payment gateway logs',
        calculatedAt: now,
      },
      {
        indicatorType: 'PROFILE_VERIFICATION',
        rating: userData.verificationTier >= 3 ? 'EXCELLENT' : userData.verificationTier >= 2 ? 'STRONG' : 'MODERATE',
        valueScore: userData.verificationTier * 25,
        rationale: `Tier ${userData.verificationTier} verified identity (Aadhaar/OTP, land survey boundary, geo-grid location).`,
        dataSource: 'Identity & Land Registry verification records',
        calculatedAt: now,
      },
      {
        indicatorType: 'DISPUTE_ACTIVITY',
        rating: userData.disputeCount === 0 ? 'EXCELLENT' : userData.disputeCount === 1 ? 'MODERATE' : 'LIMITED',
        valueScore: userData.disputeCount === 0 ? 100 : Math.max(0, 100 - userData.disputeCount * 40),
        rationale: userData.disputeCount === 0 ? 'Zero outstanding or unresolved platform disputes.' : `${userData.disputeCount} platform disputes recorded.`,
        dataSource: 'Trust & Dispute Resolution Engine',
        calculatedAt: now,
      },
    ];

    return indicators;
  }
}
