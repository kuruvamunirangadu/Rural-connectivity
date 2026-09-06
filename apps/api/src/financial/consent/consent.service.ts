import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';

export interface FinancialConsentDto {
  id: string;
  userId: string;
  purpose: 'FINANCIAL_PROFILE' | 'CREDIT_ASSESSMENT' | 'LENDER_DATA_SHARING' | 'INCOME_VERIFICATION' | 'TRANSACTION_ANALYSIS';
  scope: string[]; // ["PLATFORM_TRANSACTIONS", "PRODUCE_SALES", "SERVICE_EARNINGS", "FARM_ACREAGE"]
  status: 'PENDING' | 'GRANTED' | 'REVOKED' | 'EXPIRED';
  partnerId?: string;
  partnerName?: string;
  grantedAt: string;
  revokedAt?: string;
  expiresAt: string;
  version: number;
  auditTrail: { timestamp: string; action: string; actor: string; details?: string }[];
}

@Injectable()
export class ConsentService {
  private consents: FinancialConsentDto[] = [
    {
      id: 'cns-sbi-001',
      userId: 'usr-ravi-001',
      purpose: 'CREDIT_ASSESSMENT',
      scope: ['PLATFORM_TRANSACTIONS', 'PRODUCE_SALES', 'FARM_ACREAGE'],
      status: 'GRANTED',
      partnerId: 'prt-sbi-agri',
      partnerName: 'State Bank of India (Rural & Agri Banking Division)',
      grantedAt: '2026-01-10T09:00:00Z',
      expiresAt: '2026-04-10T09:00:00Z',
      version: 1,
      auditTrail: [
        {
          timestamp: '2026-01-10T09:00:00Z',
          action: 'CONSENT_GRANTED',
          actor: 'usr-ravi-001',
          details: 'Granted 90-day data sharing consent for Kisan Working Capital loan appraisal.',
        },
      ],
    },
    {
      id: 'cns-nabard-002',
      userId: 'usr-suresh-002',
      purpose: 'LENDER_DATA_SHARING',
      scope: ['SERVICE_EARNINGS', 'PLATFORM_TRANSACTIONS'],
      status: 'GRANTED',
      partnerId: 'prt-nabard-pacs',
      partnerName: 'NABARD / Primary Agricultural Credit Society (PACS)',
      grantedAt: '2026-01-20T10:00:00Z',
      expiresAt: '2026-07-20T10:00:00Z',
      version: 1,
      auditTrail: [
        {
          timestamp: '2026-01-20T10:00:00Z',
          action: 'CONSENT_GRANTED',
          actor: 'usr-suresh-002',
          details: 'Granted 180-day consent for tractor modernization equipment finance.',
        },
      ],
    },
  ];

  listConsents(userId: string, filter?: { status?: string; partnerId?: string }): FinancialConsentDto[] {
    return this.consents.filter((c) => {
      if (c.userId !== userId) return false;
      if (filter?.status && c.status !== filter.status) return false;
      if (filter?.partnerId && c.partnerId !== filter.partnerId) return false;
      return true;
    });
  }

  grantConsent(data: {
    userId: string;
    purpose: FinancialConsentDto['purpose'];
    scope: string[];
    partnerId?: string;
    partnerName?: string;
    validityDays?: number;
  }): FinancialConsentDto {
    const id = `cns-${Date.now().toString(36)}`;
    const now = new Date();
    const validityDays = data.validityDays || 90;
    const expiresAt = new Date(now.getTime() + validityDays * 24 * 60 * 60 * 1000).toISOString();

    const consent: FinancialConsentDto = {
      id,
      userId: data.userId,
      purpose: data.purpose,
      scope: data.scope,
      status: 'GRANTED',
      partnerId: data.partnerId,
      partnerName: data.partnerName || 'Approved Regulated Financial Partner',
      grantedAt: now.toISOString(),
      expiresAt,
      version: 1,
      auditTrail: [
        {
          timestamp: now.toISOString(),
          action: 'CONSENT_GRANTED',
          actor: data.userId,
          details: `Granted ${validityDays}-day consent for ${data.purpose} (${data.scope.join(', ')}).`,
        },
      ],
    };

    this.consents.push(consent);
    return consent;
  }

  revokeConsent(consentId: string, userId: string, reason?: string): FinancialConsentDto {
    const consent = this.consents.find((c) => c.id === consentId && c.userId === userId);
    if (!consent) {
      throw new NotFoundException(`Consent ${consentId} not found or unauthorized`);
    }

    if (consent.status === 'REVOKED') {
      throw new BadRequestException(`Consent ${consentId} is already revoked`);
    }

    const now = new Date().toISOString();
    consent.status = 'REVOKED';
    consent.revokedAt = now;
    consent.auditTrail.push({
      timestamp: now,
      action: 'CONSENT_REVOKED',
      actor: userId,
      details: reason || 'User explicitly terminated third-party data sharing access.',
    });

    return consent;
  }

  validateAccess(userId: string, partnerId: string, requiredScope: string): boolean {
    const activeConsent = this.consents.find(
      (c) =>
        c.userId === userId &&
        c.partnerId === partnerId &&
        c.status === 'GRANTED' &&
        new Date(c.expiresAt) > new Date() &&
        c.scope.includes(requiredScope)
    );
    return !!activeConsent;
  }
}
