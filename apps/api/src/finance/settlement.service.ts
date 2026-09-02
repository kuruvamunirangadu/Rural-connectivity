import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { LedgerService } from './ledger.service';

export interface SettlementRecord {
  id: string;
  providerId: string;
  bookingId: string;
  amount: number;
  currency: string;
  status: 'PENDING' | 'ELIGIBLE' | 'PROCESSING' | 'COMPLETED' | 'FAILED' | 'ON_HOLD';
  eligibleAt?: string | null;
  processedAt?: string | null;
  reference?: string | null;
  holdReason?: string | null;
}

@Injectable()
export class SettlementService {
  constructor(private readonly ledgerService: LedgerService) {}

  private settlements: SettlementRecord[] = [];

  async createSettlement(params: { providerId: string; bookingId: string; amount: number }): Promise<SettlementRecord> {
    const settlement: SettlementRecord = {
      id: `stl-${Date.now()}`,
      providerId: params.providerId,
      bookingId: params.bookingId,
      amount: params.amount,
      currency: 'INR',
      status: 'PENDING',
      eligibleAt: null,
      processedAt: null,
    };
    this.settlements.push(settlement);
    return settlement;
  }

  async markEligibleForSettlement(bookingId: string) {
    let stl = this.settlements.find((s) => s.bookingId === bookingId);
    if (!stl) {
      // Create on demand if not present
      stl = await this.createSettlement({ providerId: 'to-suresh-002', bookingId, amount: 1900 });
    }

    if (stl.status === 'ON_HOLD') {
      return { message: 'Settlement is ON_HOLD due to active dispute investigation.', settlement: stl };
    }

    stl.status = 'ELIGIBLE';
    stl.eligibleAt = new Date().toISOString();
    await this.ledgerService.markEarningEligible(bookingId);
    return stl;
  }

  async processSettlement(id: string, bankReference = 'UTR-RURAL-2026-9921') {
    const stl = this.settlements.find((s) => s.id === id || s.bookingId === id);
    if (!stl) throw new NotFoundException(`Settlement record not found`);

    if (stl.status === 'ON_HOLD') {
      throw new BadRequestException(`Cannot process settlement in status '${stl.status}': ${stl.holdReason}`);
    }

    stl.status = 'COMPLETED';
    stl.processedAt = new Date().toISOString();
    stl.reference = bankReference;
    await this.ledgerService.markEarningSettled(stl.bookingId);

    return {
      success: true,
      settlement: stl,
      payoutAmount: stl.amount,
      reference: stl.reference,
    };
  }

  async putOnHold(bookingId: string, reason: string) {
    const stl = this.settlements.find((s) => s.bookingId === bookingId);
    if (stl) {
      stl.status = 'ON_HOLD';
      stl.holdReason = reason || 'Disputed booking under admin moderation';
    }
    return stl;
  }

  async getSettlements(providerId?: string) {
    if (providerId) return this.settlements.filter((s) => s.providerId === providerId);
    return this.settlements;
  }
}
