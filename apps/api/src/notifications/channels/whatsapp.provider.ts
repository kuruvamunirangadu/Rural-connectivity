import { Injectable } from '@nestjs/common';

export interface WhatsAppSendPayload {
  phoneNumber: string;
  templateName: string;
  parameters: Record<string, string>;
}

export interface WhatsAppProvider {
  sendTemplate(payload: WhatsAppSendPayload): Promise<{ messageId: string; status: 'SENT' | 'FAILED' }>;
}

@Injectable()
export class MockWhatsAppProvider implements WhatsAppProvider {
  async sendTemplate(payload: WhatsAppSendPayload): Promise<{ messageId: string; status: 'SENT' | 'FAILED' }> {
    return {
      messageId: `wa-${Date.now()}`,
      status: 'SENT',
    };
  }
}
