import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';

export interface PriceComponent {
  id: string;
  type: string;
  description: string;
  quantity: number;
  unitPrice: number;
  amount: number;
}

export interface PriceQuote {
  id: string;
  workOfferId: string;
  bookingId?: string;
  providerId: string;
  customerId: string;
  components: PriceComponent[];
  subtotal: number;
  platformFee: number;
  tax: number;
  discount: number;
  total: number;
  currency: string;
  status: 'DRAFT' | 'SENT' | 'ACCEPTED' | 'REJECTED' | 'EXPIRED' | 'CANCELLED';
  expiresAt: string;
  createdAt: string;
}

@Injectable()
export class QuotesService {
  private quotes: PriceQuote[] = [
    {
      id: 'quote-001',
      workOfferId: 'offer-001',
      providerId: 'to-suresh-002',
      customerId: 'usr-ravi-001',
      components: [
        { id: 'pc-1', type: 'TRACTOR_BASE', description: 'Mahindra 575 DI (50 HP) Base Tilling', quantity: 1, unitPrice: 1500, amount: 1500 },
        { id: 'pc-2', type: 'ROTAVATOR', description: 'Rotavator Implement Attachment', quantity: 1, unitPrice: 400, amount: 400 },
        { id: 'pc-3', type: 'DISTANCE', description: 'Transit Distance Allowance (5 km)', quantity: 1, unitPrice: 100, amount: 100 },
      ],
      subtotal: 2000,
      platformFee: 100, // 5% platform fee
      tax: 0,
      discount: 0,
      total: 2000, // Customer pays quote total ₹2000
      currency: 'INR',
      status: 'SENT',
      expiresAt: new Date(Date.now() + 86400000).toISOString(),
      createdAt: new Date().toISOString(),
    },
  ];

  async createQuote(dto: any): Promise<PriceQuote> {
    const components: PriceComponent[] = (dto.components || []).map((c: any, idx: number) => ({
      id: `pc-${Date.now()}-${idx + 1}`,
      type: c.type || 'SERVICE',
      description: c.description || 'Service Component',
      quantity: Number(c.quantity) || 1,
      unitPrice: Number(c.unitPrice) || 0,
      amount: (Number(c.quantity) || 1) * (Number(c.unitPrice) || 0),
    }));

    const subtotal = components.reduce((sum, item) => sum + item.amount, 0) || Number(dto.total) || 2000;
    const platformFee = Math.round(subtotal * 0.05);
    const total = subtotal;

    const newQuote: PriceQuote = {
      id: `quote-${Date.now()}`,
      workOfferId: dto.workOfferId || 'offer-001',
      bookingId: dto.bookingId,
      providerId: dto.providerId || 'to-suresh-002',
      customerId: dto.customerId || 'usr-ravi-001',
      components,
      subtotal,
      platformFee,
      tax: 0,
      discount: 0,
      total,
      currency: 'INR',
      status: 'SENT',
      expiresAt: new Date(Date.now() + 86400000).toISOString(),
      createdAt: new Date().toISOString(),
    };

    this.quotes.push(newQuote);
    return newQuote;
  }

  async getQuoteById(id: string): Promise<PriceQuote> {
    const q = this.quotes.find((item) => item.id === id);
    if (!q) throw new NotFoundException(`PriceQuote ${id} not found`);
    return q;
  }

  async acceptQuote(id: string, customerId = 'usr-ravi-001'): Promise<{ success: boolean; quote: PriceQuote; paymentRequiredAmount: number }> {
    const q = await this.getQuoteById(id);
    if (q.status !== 'SENT') {
      throw new BadRequestException(`Cannot accept quote in status '${q.status}'`);
    }

    q.status = 'ACCEPTED';
    return {
      success: true,
      quote: q,
      paymentRequiredAmount: q.total,
    };
  }

  async rejectQuote(id: string, reason?: string): Promise<{ success: boolean; quote: PriceQuote }> {
    const q = await this.getQuoteById(id);
    q.status = 'REJECTED';
    return { success: true, quote: q };
  }
}
