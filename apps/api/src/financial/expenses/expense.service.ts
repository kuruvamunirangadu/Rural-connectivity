import { Injectable } from '@nestjs/common';
import { FinancialProfileService } from '../profiles/financial-profile.service';

export interface ExpenseRecordDto {
  id: string;
  userId: string;
  category: 'TRACTOR_SERVICE' | 'WORKER_SERVICE' | 'INPUT_PURCHASE' | 'TRANSPORT' | 'EQUIPMENT' | 'OTHER';
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
export class ExpenseService {
  constructor(private readonly profileService: FinancialProfileService) {}

  private records: ExpenseRecordDto[] = [
    {
      id: 'exp-rec-201',
      userId: 'usr-ravi-001',
      category: 'TRACTOR_SERVICE',
      referenceType: 'Booking',
      referenceId: 'bk-rot-8802',
      amount: 4750,
      currency: 'INR',
      date: '2026-02-10T08:00:00Z',
      status: 'VERIFIED',
      description: '5.0 Acres Rotavator Land Preparation operation by Suresh Reddy',
      createdAt: '2026-02-10T08:00:00Z',
    },
    {
      id: 'exp-rec-202',
      userId: 'usr-ravi-001',
      category: 'INPUT_PURCHASE',
      referenceType: 'Procurement',
      referenceId: 'rfq-ord-901',
      amount: 8200,
      currency: 'INR',
      date: '2026-02-12T11:00:00Z',
      status: 'VERIFIED',
      description: 'Fertilizer purchase (10x Neem Coated Urea, 2x Zinc Sulphate) from Sri Venkateshwara Hub',
      createdAt: '2026-02-12T11:00:00Z',
    },
    {
      id: 'exp-rec-203',
      userId: 'usr-ravi-001',
      category: 'TRANSPORT',
      referenceType: 'TransportBooking',
      referenceId: 'tr-bk-3301',
      amount: 823.4,
      currency: 'INR',
      date: '2026-02-16T15:00:00Z',
      status: 'VERIFIED',
      description: 'Logistics freight for 5000 kg cotton transport to central FPO Aggregation Yard',
      createdAt: '2026-02-16T15:00:00Z',
    },
  ];

  listExpenses(userId: string, filter?: { category?: string; fromDate?: string; toDate?: string }): ExpenseRecordDto[] {
    return this.records.filter((r) => {
      if (r.userId !== userId) return false;
      if (filter?.category && r.category !== filter.category) return false;
      if (filter?.fromDate && new Date(r.date) < new Date(filter.fromDate)) return false;
      if (filter?.toDate && new Date(r.date) > new Date(filter.toDate)) return false;
      return true;
    });
  }

  recordExpense(data: {
    userId: string;
    category: ExpenseRecordDto['category'];
    referenceType?: string;
    referenceId?: string;
    amount: number;
    currency?: string;
    description?: string;
  }): ExpenseRecordDto {
    const id = `exp-rec-${Date.now().toString(36)}`;
    const now = new Date().toISOString();

    const record: ExpenseRecordDto = {
      id,
      userId: data.userId,
      category: data.category,
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
    this.profileService.updateProfileTotals(data.userId, 0, data.amount);
    return record;
  }
}
