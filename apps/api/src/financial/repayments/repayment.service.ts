import { Injectable, NotFoundException } from '@nestjs/common';

export interface FinancingRepaymentDto {
  id: string;
  applicationId: string;
  installmentNumber: number;
  dueDate: string;
  amount: number;
  principalComponent: number;
  interestComponent: number;
  currency: string;
  status: 'UPCOMING' | 'DUE' | 'PAID' | 'OVERDUE' | 'WAIVED';
  paidAt?: string;
  externalReference?: string;
}

@Injectable()
export class RepaymentService {
  private repayments: FinancingRepaymentDto[] = [
    {
      id: 'rep-8801-01',
      applicationId: 'fin-app-9901',
      installmentNumber: 1,
      dueDate: '2026-02-12',
      amount: 6940,
      principalComponent: 6473,
      interestComponent: 467,
      currency: 'INR',
      status: 'PAID',
      paidAt: '2026-02-10T11:00:00Z',
      externalReference: 'UPI-SBI-REP-900214',
    },
    {
      id: 'rep-8801-02',
      applicationId: 'fin-app-9901',
      installmentNumber: 2,
      dueDate: '2026-03-12',
      amount: 6940,
      principalComponent: 6511,
      interestComponent: 429,
      currency: 'INR',
      status: 'UPCOMING',
    },
    {
      id: 'rep-8801-03',
      applicationId: 'fin-app-9901',
      installmentNumber: 3,
      dueDate: '2026-04-12',
      amount: 6940,
      principalComponent: 6549,
      interestComponent: 391,
      currency: 'INR',
      status: 'UPCOMING',
    },
  ];

  listRepayments(applicationId: string): FinancingRepaymentDto[] {
    return this.repayments.filter((r) => r.applicationId === applicationId);
  }

  recordPayment(id: string, externalReference?: string): FinancingRepaymentDto {
    const repayment = this.repayments.find((r) => r.id === id);
    if (!repayment) {
      throw new NotFoundException(`Repayment ${id} not found`);
    }

    repayment.status = 'PAID';
    repayment.paidAt = new Date().toISOString();
    repayment.externalReference = externalReference || `UPI-${Date.now().toString().slice(-6)}`;
    return repayment;
  }
}
