import { Injectable } from '@nestjs/common';
import { IncomeService } from '../income/income.service';
import { ExpenseService } from '../expenses/expense.service';
import { FinancialProfileService } from '../profiles/financial-profile.service';

export interface FinancialSummaryDto {
  userId: string;
  currency: string;
  totalIncome: number;
  totalExpense: number;
  netPlatformActivity: number;
  incomeBreakdown: {
    produceSales: number;
    serviceEarnings: number;
    contractorRevenue: number;
    supplierSales: number;
    other: number;
  };
  expenseBreakdown: {
    tractorServices: number;
    workerServices: number;
    inputPurchases: number;
    transport: number;
    equipment: number;
    other: number;
  };
  cropEconomics: {
    cropName: string;
    season: string;
    acreage: number;
    revenue: number;
    costs: number;
    netMargin: number;
  }[];
  transactionCount: number;
  lastUpdated: string;
}

@Injectable()
export class FinancialSummaryService {
  constructor(
    private readonly incomeService: IncomeService,
    private readonly expenseService: ExpenseService,
    private readonly profileService: FinancialProfileService
  ) {}

  getSummary(userId: string): FinancialSummaryDto {
    const profile = this.profileService.getProfile(userId);
    const incomes = this.incomeService.listIncome(userId);
    const expenses = this.expenseService.listExpenses(userId);

    const incomeBreakdown = {
      produceSales: incomes.filter((i) => i.sourceType === 'PRODUCE_SALE').reduce((s, i) => s + i.amount, 0),
      serviceEarnings: incomes.filter((i) => i.sourceType === 'SERVICE_EARNING').reduce((s, i) => s + i.amount, 0),
      contractorRevenue: incomes.filter((i) => i.sourceType === 'CONTRACTOR_REVENUE').reduce((s, i) => s + i.amount, 0),
      supplierSales: incomes.filter((i) => i.sourceType === 'SUPPLIER_SALE').reduce((s, i) => s + i.amount, 0),
      other: incomes.filter((i) => i.sourceType === 'OTHER').reduce((s, i) => s + i.amount, 0),
    };

    const expenseBreakdown = {
      tractorServices: expenses.filter((e) => e.category === 'TRACTOR_SERVICE').reduce((s, e) => s + e.amount, 0),
      workerServices: expenses.filter((e) => e.category === 'WORKER_SERVICE').reduce((s, e) => s + e.amount, 0),
      inputPurchases: expenses.filter((e) => e.category === 'INPUT_PURCHASE').reduce((s, e) => s + e.amount, 0),
      transport: expenses.filter((e) => e.category === 'TRANSPORT').reduce((s, e) => s + e.amount, 0),
      equipment: expenses.filter((e) => e.category === 'EQUIPMENT').reduce((s, e) => s + e.amount, 0),
      other: expenses.filter((e) => e.category === 'OTHER').reduce((s, e) => s + e.amount, 0),
    };

    const totalIncome = Object.values(incomeBreakdown).reduce((a, b) => a + b, 0);
    const totalExpense = Object.values(expenseBreakdown).reduce((a, b) => a + b, 0);

    const cropEconomics = [
      {
        cropName: 'Bt-Cotton (BG-II)',
        season: 'Kharif 2025-26',
        acreage: 5.0,
        revenue: 2227050,
        costs: 13773.4,
        netMargin: 2213276.6,
      },
      {
        cropName: 'Paddy (Sona Masoori)',
        season: 'Rabi 2025-26',
        acreage: 3.5,
        revenue: 420000,
        costs: 45000,
        netMargin: 375000,
      },
    ];

    return {
      userId,
      currency: profile.currency,
      totalIncome,
      totalExpense,
      netPlatformActivity: totalIncome - totalExpense,
      incomeBreakdown,
      expenseBreakdown,
      cropEconomics,
      transactionCount: incomes.length + expenses.length,
      lastUpdated: new Date().toISOString(),
    };
  }
}
