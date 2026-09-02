import { Injectable, NotFoundException } from '@nestjs/common';

export interface InvoiceItem {
  id: string;
  invoiceNumber: string;
  bookingId: string;
  customerId: string;
  providerId: string;
  lineItems: Array<{ description: string; amount: number }>;
  subtotal: number;
  platformFee: number;
  tax: number;
  total: number;
  currency: string;
  status: 'ISSUED' | 'PAID' | 'VOID';
  issuedAt: string;
}

@Injectable()
export class InvoicesService {
  private invoiceCounter = 124;
  private invoices: InvoiceItem[] = [
    {
      id: 'inv-001',
      invoiceNumber: 'RC-2026-000124',
      bookingId: 'BK1001',
      customerId: 'usr-ravi-001',
      providerId: 'to-suresh-002',
      lineItems: [
        { description: 'Tractor Service (Mahindra 575 DI 50 HP)', amount: 1500 },
        { description: 'Rotavator Implement Attachment', amount: 400 },
        { description: 'Transit Distance (5 km)', amount: 100 },
      ],
      subtotal: 2000,
      platformFee: 100,
      tax: 0,
      total: 2000,
      currency: 'INR',
      status: 'PAID',
      issuedAt: new Date().toISOString(),
    },
  ];

  async generateInvoice(params: {
    bookingId: string;
    customerId: string;
    providerId: string;
    lineItems?: Array<{ description: string; amount: number }>;
    total: number;
    platformFee?: number;
  }): Promise<InvoiceItem> {
    this.invoiceCounter += 1;
    const invoiceNumber = `RC-2026-${String(this.invoiceCounter).padStart(6, '0')}`;

    const items = params.lineItems || [{ description: 'Agricultural Machinery & Work Service', amount: params.total }];
    const subtotal = items.reduce((sum, i) => sum + i.amount, 0) || params.total;
    const platformFee = params.platformFee || Math.round(subtotal * 0.05);

    const newInvoice: InvoiceItem = {
      id: `inv-${Date.now()}`,
      invoiceNumber,
      bookingId: params.bookingId,
      customerId: params.customerId,
      providerId: params.providerId,
      lineItems: items,
      subtotal,
      platformFee,
      tax: 0,
      total: subtotal,
      currency: 'INR',
      status: 'PAID',
      issuedAt: new Date().toISOString(),
    };

    this.invoices.push(newInvoice);
    return newInvoice;
  }

  async getInvoiceById(id: string): Promise<InvoiceItem> {
    const inv = this.invoices.find((i) => i.id === id || i.invoiceNumber === id);
    if (!inv) throw new NotFoundException(`Invoice ${id} not found`);
    return inv;
  }

  async getInvoiceByBooking(bookingId: string): Promise<InvoiceItem> {
    const inv = this.invoices.find((i) => i.bookingId === bookingId);
    if (!inv) throw new NotFoundException(`Invoice for booking ${bookingId} not found`);
    return inv;
  }
}
