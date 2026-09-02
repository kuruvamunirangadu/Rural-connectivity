import { Injectable } from '@nestjs/common';

export interface SmsSendPayload {
  phoneNumber: string;
  message: string;
}

export interface SmsProvider {
  send(payload: SmsSendPayload): Promise<{ messageId: string; status: 'SENT' | 'FAILED' }>;
}

@Injectable()
export class MockSmsProvider implements SmsProvider {
  async send(payload: SmsSendPayload): Promise<{ messageId: string; status: 'SENT' | 'FAILED' }> {
    return {
      messageId: `sms-${Date.now()}`,
      status: 'SENT',
    };
  }
}
