import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { MockPaymentProvider } from './providers/mock.provider';
import { LedgerService } from '../finance/ledger.service';
import { SettlementService } from '../finance/settlement.service';

export type PaymentStatus =
  | 'CREATED'
  | 'PENDING'
  | 'AUTHORIZED'
  | 'SUCCEEDED'
  | 'FAILED'
  | 'CANCELLED'
  | 'REFUNDED'
  | 'PARTIALLY_REFUNDED';

export interface PaymentRecord {
  id: string;
  bookingId: string;
  quoteId?: string;
  payerId: string;
  payeeId: string;
  amount: number;
  currency: string;
  provider: string;
  providerPaymentId?: string;
  idempotencyKey: string;
  status: PaymentStatus;
  paymentMethod: string;
  paidAt?: string | null;
  createdAt: string;
}

export interface RefundRecord {
  id: string;
  paymentId: string;
  amount: number;
  reason: string;
  status: 'REQUESTED' | 'PROCESSING' | 'COMPLETED' | 'FAILED';
  createdAt: string;
}

@Injectable()
export class PaymentsService {
  constructor(
    private readonly mockProvider: MockPaymentProvider,
    private readonly ledgerService: LedgerService,
    private readonly settlementService: SettlementService
  ) {}

  private payments: PaymentRecord[] = [];
  private refunds: RefundRecord[] = [];
  private processedWebhookEvents = new Set<string>();

  async createPaymentIntent(dto: {
    bookingId: string;
    quoteId?: string;
    payerId?: string;
    payeeId?: string;
    amount: number;
    idempotencyKey: string;
    paymentMethod?: string;
  }): Promise<{ payment: PaymentRecord; clientSecret: string }> {
    if (!dto.idempotencyKey) {
      throw new BadRequestException('Idempotency-Key is required to initialize a payment');
    }

    // Idempotency check
    const existing = this.payments.find((p) => p.idempotencyKey === dto.idempotencyKey);
    if (existing) {
      return {
        payment: existing,
        clientSecret: `cs_existing_${existing.id}`,
      };
    }

    const paymentId = `pay-${Date.now()}`;
    const payerId = dto.payerId || 'usr-ravi-001';
    const payeeId = dto.payeeId || 'to-suresh-002';

    const providerResult = await this.mockProvider.createPayment({
      paymentId,
      amount: dto.amount,
      currency: 'INR',
      customerId: payerId,
      providerId: payeeId,
      idempotencyKey: dto.idempotencyKey,
    });

    const newPayment: PaymentRecord = {
      id: paymentId,
      bookingId: dto.bookingId,
      quoteId: dto.quoteId,
      payerId,
      payeeId,
      amount: dto.amount,
      currency: 'INR',
      provider: 'MOCK_RURAL_PAY',
      providerPaymentId: providerResult.providerPaymentId,
      idempotencyKey: dto.idempotencyKey,
      status: 'SUCCEEDED', // Mock provider completes successfully
      paymentMethod: dto.paymentMethod || 'UPI_QR',
      paidAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    };

    this.payments.push(newPayment);

    // Record into Double-Entry Ledger & initialize provider earning
    await this.ledgerService.recordPaymentTransaction({
      bookingId: dto.bookingId,
      payerId,
      providerId: payeeId,
      totalAmount: dto.amount,
      platformFeeRatePct: 0.05,
    });

    // Initialize settlement record
    await this.settlementService.createSettlement({
      providerId: payeeId,
      bookingId: dto.bookingId,
      amount: Math.round(dto.amount * 0.95),
    });

    return {
      payment: newPayment,
      clientSecret: `cs_secret_${paymentId}`,
    };
  }

  async verifyPayment(paymentId: string) {
    const payment = this.payments.find((p) => p.id === paymentId || p.bookingId === paymentId);
    if (!payment) throw new NotFoundException(`Payment ${paymentId} not found`);

    if (payment.providerPaymentId) {
      const verifyResult = await this.mockProvider.verifyPayment(payment.providerPaymentId);
      payment.status = verifyResult.status as PaymentStatus;
    }

    return {
      isVerified: payment.status === 'SUCCEEDED',
      payment,
    };
  }

  async handleWebhook(body: any): Promise<{ received: boolean; status: string }> {
    const eventId = body?.eventId || `evt-${Date.now()}`;

    // Duplicate webhook protection
    if (this.processedWebhookEvents.has(eventId)) {
      return { received: true, status: 'IGNORED_DUPLICATE' };
    }

    this.processedWebhookEvents.add(eventId);

    if (body?.paymentId) {
      const payment = this.payments.find((p) => p.id === body.paymentId);
      if (payment) {
        payment.status = body.status || 'SUCCEEDED';
      }
    }

    return { received: true, status: 'PROCESSED' };
  }

  async processRefund(paymentId: string, amount?: number, reason = 'Farmer cancelled prior to work'): Promise<RefundRecord> {
    const payment = this.payments.find((p) => p.id === paymentId || p.bookingId === paymentId);
    if (!payment) throw new NotFoundException(`Payment ${paymentId} not found`);

    const refundAmount = amount || payment.amount;

    const refund: RefundRecord = {
      id: `ref-${Date.now()}`,
      paymentId: payment.id,
      amount: refundAmount,
      reason,
      status: 'COMPLETED',
      createdAt: new Date().toISOString(),
    };

    payment.status = refundAmount === payment.amount ? 'REFUNDED' : 'PARTIALLY_REFUNDED';
    this.refunds.push(refund);

    return refund;
  }

  async getPayments(bookingId?: string) {
    if (bookingId) return this.payments.filter((p) => p.bookingId === bookingId);
    return this.payments;
  }
}
