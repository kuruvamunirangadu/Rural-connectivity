import { Injectable } from '@nestjs/common';
import { IndicatorService, CreditIndicatorDto } from './indicator.service';

export interface CreditProfileDto {
  userId: string;
  overallGrade: 'EXCELLENT' | 'STRONG' | 'MODERATE' | 'LIMITED' | 'INSUFFICIENT_DATA';
  indicators: CreditIndicatorDto[];
  disclaimer: string;
  summaryNotes: string;
  lastCalculatedAt: string;
  version: number;
}

@Injectable()
export class CreditProfileService {
  constructor(private readonly indicatorService: IndicatorService) {}

  getCreditProfile(userId: string): CreditProfileDto {
    // In production, queries authoritative records. Here mock contextual data for user:
    const isFarmer = userId.includes('ravi') || userId.includes('farmer');
    const userData = isFarmer
      ? {
          tenureMonths: 18,
          completedTransactions: 74,
          produceSalesCount: 12,
          serviceJobsCount: 8,
          disputeCount: 0,
          verificationTier: 4,
          onTimeSettlementPercent: 98.4,
        }
      : {
          tenureMonths: 14,
          completedTransactions: 42,
          produceSalesCount: 2,
          serviceJobsCount: 38,
          disputeCount: 0,
          verificationTier: 3,
          onTimeSettlementPercent: 96.2,
        };

    const indicators = this.indicatorService.calculateIndicators(userData);
    const avgScore = indicators.reduce((s, i) => s + i.valueScore, 0) / indicators.length;
    const overallGrade = avgScore >= 85 ? 'STRONG' : avgScore >= 70 ? 'MODERATE' : 'LIMITED';

    return {
      userId,
      overallGrade,
      indicators,
      disclaimer:
        'This Credit Readiness Profile is strictly informational based on platform-recorded transaction history. RuralConnect is not a lender. Lending decisions and underwriting terms are determined exclusively by regulated financial partners upon review of submitted applications.',
      summaryNotes: `User demonstrates ${overallGrade.toLowerCase()} platform economic consistency with ${userData.completedTransactions} completed operations and ${userData.onTimeSettlementPercent}% settlement reliability.`,
      lastCalculatedAt: new Date().toISOString(),
      version: 1,
    };
  }
}
