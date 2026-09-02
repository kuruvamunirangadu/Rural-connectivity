export interface PaymentIntentPayload {
  paymentId: string;
  amount: number;
  currency: string;
  customerId: string;
  providerId: string;
  idempotencyKey: string;
  metadata?: Record<string, any>;
}

export interface PaymentProviderResult {
  providerPaymentId: string;
  status: 'PENDING' | 'SUCCEEDED' | 'FAILED';
  rawResponse?: any;
}

export interface PaymentProvider {
  createPayment(payload: PaymentIntentPayload): Promise<PaymentProviderResult>;
  verifyPayment(providerPaymentId: string): Promise<{ isVerified: boolean; status: string }>;
  refundPayment(providerPaymentId: string, amount: number, reason: string): Promise<{ refundId: string; status: string }>;
}
