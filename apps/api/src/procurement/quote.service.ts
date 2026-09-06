import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';

export interface SupplierQuoteItem {
  id: string;
  procurementId: string;
  supplierId: string;
  supplierName: string;
  supplierShopName: string;
  supplierRating: number;
  quoteAmount: number; // INR total
  unitPriceEstimate: number; // INR per unit
  deliveryDays: number; // Delivery turnaround in days
  bulkDiscountPct: number;
  notes?: string;
  status: 'SUBMITTED' | 'UNDER_REVIEW' | 'ACCEPTED' | 'REJECTED' | 'EXPIRED';
  validUntil: string;
  submittedAt: string;
  // Computed Evaluation Score
  comparisonScore?: {
    priceScore: number; // 0-100 (higher = cheaper)
    speedScore: number; // 0-100 (higher = faster)
    ratingScore: number; // 0-100
    overallWeightedScore: number; // 0-100
    isLowestBid: boolean;
  };
}

@Injectable()
export class SupplierQuoteService {
  private quotes: SupplierQuoteItem[] = [
    {
      id: 'quote-001',
      procurementId: 'proc-kd-fert-01',
      supplierId: 'sup-venkat-01',
      supplierName: 'Sri Venkateshwara Agri Inputs',
      supplierShopName: 'Venkateshwara Fertilizers & Agro Chemicals',
      supplierRating: 4.8,
      quoteAmount: 312000,
      unitPriceEstimate: 260.0, // per 50kg bag
      deliveryDays: 2,
      bulkDiscountPct: 8.5,
      notes: 'Direct factory consignment from IFFCO hub. Includes unloading at FPO godown.',
      status: 'SUBMITTED',
      validUntil: '2026-06-30T23:59:59Z',
      submittedAt: '2026-02-18T10:00:00Z',
    },
    {
      id: 'quote-002',
      procurementId: 'proc-kd-fert-01',
      supplierId: 'sup-balaji-02',
      supplierName: 'Balaji Kisan Seva Kendra',
      supplierShopName: 'Balaji Seeds & Fertilizers',
      supplierRating: 4.6,
      quoteAmount: 324000,
      unitPriceEstimate: 270.0,
      deliveryDays: 1,
      bulkDiscountPct: 5.0,
      notes: 'Immediate next-day delivery from regional depot.',
      status: 'SUBMITTED',
      validUntil: '2026-06-30T23:59:59Z',
      submittedAt: '2026-02-18T14:30:00Z',
    },
    {
      id: 'quote-003',
      procurementId: 'proc-kd-fert-01',
      supplierId: 'sup-deccan-agri-03',
      supplierName: 'Deccan Agro Supply Logistics',
      supplierShopName: 'Deccan Wholesale Agri',
      supplierRating: 4.9,
      quoteAmount: 300000,
      unitPriceEstimate: 250.0,
      deliveryDays: 4,
      bulkDiscountPct: 12.0,
      notes: 'Lowest bulk contract price with verified batch quality testing certificates.',
      status: 'SUBMITTED',
      validUntil: '2026-06-30T23:59:59Z',
      submittedAt: '2026-02-19T09:15:00Z',
    },
  ];

  listQuotes(procurementId: string): SupplierQuoteItem[] {
    const procQuotes = this.quotes.filter((q) => q.procurementId === procurementId);
    if (procQuotes.length === 0) return [];

    const minAmount = Math.min(...procQuotes.map((q) => q.quoteAmount));
    const minDays = Math.min(...procQuotes.map((q) => q.deliveryDays));

    return procQuotes.map((quote) => {
      const priceScore = Math.round((minAmount / quote.quoteAmount) * 100);
      const speedScore = Math.round((minDays / Math.max(1, quote.deliveryDays)) * 100);
      const ratingScore = Math.round((quote.supplierRating / 5.0) * 100);

      // Weighted: 50% Price, 30% Speed, 20% Trust/Rating
      const overallWeightedScore = Math.round(
        priceScore * 0.5 + speedScore * 0.3 + ratingScore * 0.2
      );

      return {
        ...quote,
        comparisonScore: {
          priceScore,
          speedScore,
          ratingScore,
          overallWeightedScore,
          isLowestBid: quote.quoteAmount === minAmount,
        },
      };
    }).sort((a, b) => (b.comparisonScore?.overallWeightedScore ?? 0) - (a.comparisonScore?.overallWeightedScore ?? 0));
  }

  getQuote(quoteId: string): SupplierQuoteItem {
    const quote = this.quotes.find((q) => q.id === quoteId);
    if (!quote) {
      throw new NotFoundException(`Supplier quote ${quoteId} not found`);
    }
    return quote;
  }

  submitQuote(data: {
    procurementId: string;
    supplierId: string;
    supplierName: string;
    supplierShopName?: string;
    supplierRating?: number;
    quoteAmount: number;
    unitPriceEstimate?: number;
    deliveryDays: number;
    bulkDiscountPct?: number;
    notes?: string;
  }): SupplierQuoteItem {
    const existing = this.quotes.find(
      (q) => q.procurementId === data.procurementId && q.supplierId === data.supplierId
    );
    if (existing) {
      throw new BadRequestException('Supplier has already submitted a quote for this procurement RFP');
    }

    const newQuote: SupplierQuoteItem = {
      id: `quote-${Date.now().toString(36)}`,
      procurementId: data.procurementId,
      supplierId: data.supplierId,
      supplierName: data.supplierName,
      supplierShopName: data.supplierShopName || data.supplierName,
      supplierRating: data.supplierRating || 4.7,
      quoteAmount: data.quoteAmount,
      unitPriceEstimate: data.unitPriceEstimate || (data.quoteAmount / 1200),
      deliveryDays: data.deliveryDays,
      bulkDiscountPct: data.bulkDiscountPct || 0,
      notes: data.notes,
      status: 'SUBMITTED',
      validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      submittedAt: new Date().toISOString(),
    };

    this.quotes.push(newQuote);
    return newQuote;
  }

  acceptQuote(procurementId: string, quoteId: string): SupplierQuoteItem {
    const quotes = this.quotes.filter((q) => q.procurementId === procurementId);
    const targetQuote = quotes.find((q) => q.id === quoteId);

    if (!targetQuote) {
      throw new NotFoundException(`Quote ${quoteId} not found for procurement ${procurementId}`);
    }

    // Accept target quote, mark others as rejected
    quotes.forEach((q) => {
      if (q.id === quoteId) {
        q.status = 'ACCEPTED';
      } else {
        q.status = 'REJECTED';
      }
    });

    return targetQuote;
  }
}

