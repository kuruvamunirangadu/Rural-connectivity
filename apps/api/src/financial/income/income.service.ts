import { Injectable } from '@nestjs/common';
import { FinancialProfileService } from '../profiles/financial-profile.service';

export interface IncomeRecordDto {
  id: string;
  userId: string;
  sourceType: 'PRODUCE_SALE' | 'SERVICE_EARNING' | 'CONTRACTOR_REVENUE' | 'SUPPLIER_SALE' | 'OTHER';
  referenceType?: string;
  referenceId?: string;
  amount: number;
  currency: string;
  date: string;
  status: 'RECORDED' | 'VERIFIED' | 'RECONCILED' | 'DISPUTED' | 'CANCELLED';
  description?: string;
  createdAt: string;
}

@Injectable()
export class IncomeService {
  constructor(private readonly profileService: FinancialProfileService) {}

  private records: IncomeRecordDto[] = [
    {
      id: 'inc-rec-101',
      userId: 'usr-ravi-001',
      sourceType: 'PRODUCE_SALE',
      referenceType: 'ProduceOrder',
      referenceId: 'ord-2026-cot-8801',
      amount: 2227050,
      currency: 'INR',
      date: '2026-02-15T10:00:00Z',
      status: 'VERIFIED',
      description: 'Produce sale of 300Q Bt-2 Cotton to Deccan Cotton Mills via Marketplace Escrow',
      createdAt: '2026-02-15T10:00:00Z',
    },
    {
      id: 'inc-rec-102',
      userId: 'usr-suresh-002',
      sourceType: 'SERVICE_EARNING',
      referenceType: 'Settlement',
      referenceId: 'set-tr-9021',
      amount: 798.7,
      currency: 'INR',
      date: '2026-02-18T14:30:00Z',
      status: 'VERIFIED',
      description: 'Trip settlement for 5-Ton Cotton cargo haulage to FPO warehouse',
      createdAt: '2026-02-18T14:30:00Z',
    },
  ];

  listIncome(userId: string, filter?: { sourceType?: string; fromDate?: string; toDate?: string }): IncomeRecordDto[] {
    return this.records.filter((r) => {
      if (r.userId !== userId) return false;
      if (filter?.sourceType && r.sourceType !== filter.sourceType) return false;
      if (filter?.fromDate && new Date(r.date) < new Date(filter.fromDate)) return false;
      if (filter?.toDate && new Date(r.date) > new Date(filter.toDate)) return false;
      return true;
    });
  }

  recordIncome(data: {
    userId: string;
    sourceType: IncomeRecordDto['sourceType'];
    referenceType?: string;
    referenceId?: string;
    amount: number;
    currency?: string;
    description?: string;
  }): IncomeRecordDto {
    const id = `inc-rec-${Date.now().toString(36)}`;
    const now = new Date().toISOString();

    const record: IncomeRecordDto = {
      id,
      userId: data.userId,
      sourceType: data.sourceType,
      referenceType: data.referenceType,
      referenceId: data.referenceId,
      amount: data.amount,
      currency: data.currency || 'INR',
      date: now,
      status: 'VERIFIED',
      description: data.description,
      createdAt: now,
    };

    this.records.push(record);
    this.profileService.updateProfileTotals(data.userId, data.amount, 0);
    return record;
  }
}
