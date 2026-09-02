import { Injectable } from '@nestjs/common';
import { PaymentProvider, PaymentIntentPayload, PaymentProviderResult } from '../payment.provider';

@Injectable()
export class MockPaymentProvider implements PaymentProvider {
  async createPayment(payload: PaymentIntentPayload): Promise<PaymentProviderResult> {
    const mockId = `mock_pay_${Date.now()}_${Math.floor(Math.random() * 10000)}`;
    return {
      providerPaymentId: mockId,
      status: 'SUCCEEDED',
      rawResponse: {
        gateway: 'MOCK_RURAL_PAY',
        amount: payload.amount,
        currency: payload.currency,
        idempotencyKey: payload.idempotencyKey,
      },
    };
  }

  async verifyPayment(providerPaymentId: string): Promise<{ isVerified: boolean; status: string }> {
    return {
      isVerified: true,
      status: 'SUCCEEDED',
    };
  }

  async refundPayment(providerPaymentId: string, amount: number, reason: string): Promise<{ refundId: string; status: string }> {
    return {
      refundId: `mock_ref_${Date.now()}`,
      status: 'COMPLETED',
    };
  }
}
