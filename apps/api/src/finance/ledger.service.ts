import { Injectable, BadRequestException } from '@nestjs/common';

export interface FinancialTransaction {
  id: string;
  referenceType: 'BOOKING' | 'REFUND' | 'DISPUTE_ADJUSTMENT';
  referenceId: string;
  transactionType: 'PAYMENT_COLLECTION' | 'PLATFORM_COMMISSION' | 'PROVIDER_PAYABLE' | 'REFUND';
  amount: number;
  currency: string;
  status: 'POSTED' | 'PENDING' | 'REVERSED';
  createdAt: string;
}

export interface LedgerEntry {
  id: string;
  transactionId: string;
  accountType: 'CUSTOMER_CLEARING' | 'PLATFORM_REVENUE' | 'PROVIDER_PAYABLE' | 'REFUND_SUSPENSE';
  accountId: string;
  entryType: 'DEBIT' | 'CREDIT';
  amount: number;
}

export interface ProviderEarning {
  id: string;
  providerId: string;
  bookingId: string;
  grossAmount: number;
  platformFee: number;
  adjustments: number;
  netAmount: number;
  status: 'PENDING' | 'ELIGIBLE' | 'SETTLED';
  createdAt: string;
}

@Injectable()
export class LedgerService {
  private transactions: FinancialTransaction[] = [];
  private ledgerEntries: LedgerEntry[] = [];
  private earnings: ProviderEarning[] = [];

  async recordPaymentTransaction(params: {
    bookingId: string;
    payerId: string;
    providerId: string;
    totalAmount: number;
    platformFeeRatePct?: number;
  }) {
    const feeRate = params.platformFeeRatePct !== undefined ? params.platformFeeRatePct : 0.05;
    const platformFee = Math.round(params.totalAmount * feeRate);
    const providerNet = params.totalAmount - platformFee;

    // 1. Immutable Financial Transaction
    const txId = `ftx-${Date.now()}`;
    const tx: FinancialTransaction = {
      id: txId,
      referenceType: 'BOOKING',
      referenceId: params.bookingId,
      transactionType: 'PAYMENT_COLLECTION',
      amount: params.totalAmount,
      currency: 'INR',
      status: 'POSTED',
      createdAt: new Date().toISOString(),
    };
    this.transactions.push(tx);

    // 2. Double-Entry Ledger Balancing
    // DEBIT: Customer Clearing Account
    this.ledgerEntries.push({
      id: `ledg-${Date.now()}-1`,
      transactionId: txId,
      accountType: 'CUSTOMER_CLEARING',
      accountId: params.payerId,
      entryType: 'DEBIT',
      amount: params.totalAmount,
    });

    // CREDIT: Platform Revenue Account
    this.ledgerEntries.push({
      id: `ledg-${Date.now()}-2`,
      transactionId: txId,
      accountType: 'PLATFORM_REVENUE',
      accountId: 'platform-treasury-001',
      entryType: 'CREDIT',
      amount: platformFee,
    });

    // CREDIT: Provider Payable Account
    this.ledgerEntries.push({
      id: `ledg-${Date.now()}-3`,
      transactionId: txId,
      accountType: 'PROVIDER_PAYABLE',
      accountId: params.providerId,
      entryType: 'CREDIT',
      amount: providerNet,
    });

    // 3. Provider Earning Record
    const earning: ProviderEarning = {
      id: `earn-${Date.now()}`,
      providerId: params.providerId,
      bookingId: params.bookingId,
      grossAmount: params.totalAmount,
      platformFee,
      adjustments: 0,
      netAmount: providerNet,
      status: 'PENDING',
      createdAt: new Date().toISOString(),
    };
    this.earnings.push(earning);

    return {
      transaction: tx,
      platformFee,
      providerNet,
      earning,
    };
  }

  async markEarningEligible(bookingId: string) {
    const earning = this.earnings.find((e) => e.bookingId === bookingId);
    if (earning) {
      earning.status = 'ELIGIBLE';
    }
    return earning;
  }

  async markEarningSettled(bookingId: string) {
    const earning = this.earnings.find((e) => e.bookingId === bookingId);
    if (earning) {
      earning.status = 'SETTLED';
    }
    return earning;
  }

  async getTransactions() {
    return this.transactions;
  }

  async getLedgerEntries() {
    return this.ledgerEntries;
  }

  async getProviderEarnings(providerId = 'to-suresh-002') {
    return this.earnings.filter((e) => e.providerId === providerId);
  }
}
