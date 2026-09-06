import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { ProduceListingService } from '../listings/produce-listing.service';

export interface OfferRevisionDto {
  revisionNumber: number;
  initiatedBy: 'BUYER' | 'SELLER';
  initiatorId: string;
  initiatorName: string;
  offeredQuantity: number;
  offeredUnitPrice: number;
  totalAmount: number;
  paymentTerms?: string;
  deliveryTerms?: string;
  message?: string;
  createdAt: string;
}

export interface ProduceOfferDto {
  id: string;
  offerNumber: string;
  listingId: string;
  listingCrop: string;
  buyerId: string;
  buyerName: string;
  buyerOrganization?: string;
  sellerId?: string;
  sellerName?: string;
  organizationId?: string;
  organizationName?: string;
  offeredQuantity: number;
  offeredUnitPrice: number;
  unit: string;
  totalAmount: number;
  currency: string;
  paymentTerms: string;
  deliveryTerms: string;
  currentRevision: number;
  status: 'PENDING_SELLER_REVIEW' | 'PENDING_BUYER_REVIEW' | 'ACCEPTED' | 'REJECTED' | 'EXPIRED' | 'CANCELLED';
  expiresAt: string;
  revisions: OfferRevisionDto[];
  createdAt: string;
  updatedAt: string;
}

@Injectable()
export class ProduceOfferService {
  constructor(private readonly listingService: ProduceListingService) {}

  private offers: ProduceOfferDto[] = [
    {
      id: 'ofr-cot-101',
      offerNumber: 'OFR-2026-COT-101',
      listingId: 'prd-cotton-01',
      listingCrop: 'Cotton (Long-Staple Bt-2)',
      buyerId: 'usr-texcorp-01',
      buyerName: 'Vikram Mehta',
      buyerOrganization: 'Deccan Mills & Agro-Industrial Ltd.',
      organizationId: 'org-kalyan-fpo',
      organizationName: 'Kalyandurg Cotton & Groundnut Producer Co. Ltd.',
      sellerName: 'Kalyandurg FPO Cluster (42 Member Farmers)',
      offeredQuantity: 300,
      offeredUnitPrice: 7350,
      unit: 'Quintals',
      totalAmount: 2205000,
      currency: 'INR',
      paymentTerms: '20% Advance Escrow, 80% on Dispatch Inspection',
      deliveryTerms: 'Seller arranged transport to Mahbubnagar rail yard',
      currentRevision: 1,
      status: 'PENDING_SELLER_REVIEW',
      expiresAt: '2026-03-01T18:00:00Z',
      revisions: [
        {
          revisionNumber: 1,
          initiatedBy: 'BUYER',
          initiatorId: 'usr-texcorp-01',
          initiatorName: 'Vikram Mehta (Deccan Mills)',
          offeredQuantity: 300,
          offeredUnitPrice: 7350,
          totalAmount: 2205000,
          paymentTerms: '20% Advance Escrow, 80% on Dispatch Inspection',
          deliveryTerms: 'Seller arranged transport to Mahbubnagar rail yard',
          message: 'Initial commercial offer for 300Q lot with prompt 7-day pickup.',
          createdAt: '2026-02-18T10:00:00Z',
        },
      ],
      createdAt: '2026-02-18T10:00:00Z',
      updatedAt: '2026-02-18T10:00:00Z',
    },
    {
      id: 'ofr-gnt-102',
      offerNumber: 'OFR-2026-GNT-102',
      listingId: 'prd-groundnut-03',
      listingCrop: 'Groundnut (K-6 Bold Pods)',
      buyerId: 'usr-oiltech-03',
      buyerName: 'Ramesh Agro Oils',
      buyerOrganization: 'Telangana Agro Oil Refineries Ltd.',
      sellerId: 'usr-ravi-001',
      sellerName: 'Ravi Kumar (Direct Farmer)',
      offeredQuantity: 80,
      offeredUnitPrice: 6850,
      unit: 'Quintals',
      totalAmount: 548000,
      currency: 'INR',
      paymentTerms: '100% Instant Bank Settlement via RuralConnect Escrow on Gate Inward',
      deliveryTerms: 'Buyer arranges truck pickup from Tangipalli farm gate',
      currentRevision: 2,
      status: 'PENDING_BUYER_REVIEW',
      expiresAt: '2026-03-05T18:00:00Z',
      revisions: [
        {
          revisionNumber: 1,
          initiatedBy: 'BUYER',
          initiatorId: 'usr-oiltech-03',
          initiatorName: 'Ramesh Agro Oils',
          offeredQuantity: 80,
          offeredUnitPrice: 6700,
          totalAmount: 536000,
          paymentTerms: '100% Escrow on Gate Inward',
          deliveryTerms: 'Buyer truck pickup',
          message: 'Offer for full 80Q lot at market spot price.',
          createdAt: '2026-02-19T09:00:00Z',
        },
        {
          revisionNumber: 2,
          initiatedBy: 'SELLER',
          initiatorId: 'usr-ravi-001',
          initiatorName: 'Ravi Kumar',
          offeredQuantity: 80,
          offeredUnitPrice: 6850,
          totalAmount: 548000,
          paymentTerms: '100% Escrow on Gate Inward',
          deliveryTerms: 'Buyer truck pickup at farm gate',
          message: 'Counter-offer: Quality is clean Grade-A bold pods, minimum 6850 INR/Q.',
          createdAt: '2026-02-19T14:30:00Z',
        },
      ],
      createdAt: '2026-02-19T09:00:00Z',
      updatedAt: '2026-02-19T14:30:00Z',
    },
  ];

  listOffers(filter?: { listingId?: string; buyerId?: string; sellerId?: string; status?: string }): ProduceOfferDto[] {
    return this.offers.filter((o) => {
      if (filter?.listingId && o.listingId !== filter.listingId) return false;
      if (filter?.buyerId && o.buyerId !== filter.buyerId) return false;
      if (filter?.sellerId && o.sellerId !== filter.sellerId && o.organizationId !== filter.sellerId) return false;
      if (filter?.status && o.status !== filter.status) return false;
      return true;
    });
  }

  getOffer(id: string): ProduceOfferDto {
    const offer = this.offers.find((o) => o.id === id || o.offerNumber.toLowerCase() === id.toLowerCase());
    if (!offer) {
      throw new NotFoundException(`Offer ${id} not found`);
    }
    return offer;
  }

  createOffer(data: {
    listingId: string;
    buyerId: string;
    buyerName?: string;
    buyerOrganization?: string;
    offeredQuantity: number;
    offeredUnitPrice: number;
    paymentTerms?: string;
    deliveryTerms?: string;
    message?: string;
    validityDays?: number;
  }): ProduceOfferDto {
    const listing = this.listingService.getListing(data.listingId);

    if (data.offeredQuantity <= 0) {
      throw new BadRequestException('Offered quantity must be greater than zero');
    }
    if (data.offeredQuantity > listing.availableQuantity) {
      throw new BadRequestException(
        `Offered quantity (${data.offeredQuantity}) exceeds available quantity (${listing.availableQuantity} ${listing.unit})`
      );
    }
    if (data.offeredUnitPrice <= 0) {
      throw new BadRequestException('Offered unit price must be greater than zero');
    }

    const offerId = `ofr-${Date.now().toString(36)}`;
    const offerNumber = `OFR-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const totalAmount = data.offeredQuantity * data.offeredUnitPrice;
    const now = new Date();
    const expiry = new Date(now.getTime() + (data.validityDays || 5) * 24 * 60 * 60 * 1000).toISOString();

    const initialRevision: OfferRevisionDto = {
      revisionNumber: 1,
      initiatedBy: 'BUYER',
      initiatorId: data.buyerId,
      initiatorName: data.buyerName || 'Verified Commodity Buyer',
      offeredQuantity: data.offeredQuantity,
      offeredUnitPrice: data.offeredUnitPrice,
      totalAmount,
      paymentTerms: data.paymentTerms || 'Standard Escrow Settlement',
      deliveryTerms: data.deliveryTerms || 'Direct Transport Fulfillment',
      message: data.message || 'Commercial offer initiated via RuralConnect Marketplace',
      createdAt: now.toISOString(),
    };

    const newOffer: ProduceOfferDto = {
      id: offerId,
      offerNumber,
      listingId: listing.id,
      listingCrop: listing.cropName,
      buyerId: data.buyerId,
      buyerName: data.buyerName || 'Verified Commodity Buyer',
      buyerOrganization: data.buyerOrganization,
      sellerId: listing.sellerId,
      sellerName: listing.sellerName,
      organizationId: listing.organizationId,
      organizationName: listing.organizationName,
      offeredQuantity: data.offeredQuantity,
      offeredUnitPrice: data.offeredUnitPrice,
      unit: listing.unit,
      totalAmount,
      currency: 'INR',
      paymentTerms: initialRevision.paymentTerms || '',
      deliveryTerms: initialRevision.deliveryTerms || '',
      currentRevision: 1,
      status: 'PENDING_SELLER_REVIEW',
      expiresAt: expiry,
      revisions: [initialRevision],
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
    };

    this.offers.push(newOffer);
    return newOffer;
  }

  counterOffer(
    id: string,
    data: {
      counterBy: 'BUYER' | 'SELLER';
      initiatorId: string;
      initiatorName: string;
      quantity?: number;
      unitPrice: number;
      paymentTerms?: string;
      deliveryTerms?: string;
      message?: string;
    }
  ): ProduceOfferDto {
    const offer = this.getOffer(id);

    if (offer.status !== 'PENDING_SELLER_REVIEW' && offer.status !== 'PENDING_BUYER_REVIEW') {
      throw new BadRequestException(`Cannot counter offer in '${offer.status}' state`);
    }

    const listing = this.listingService.getListing(offer.listingId);
    const newQty = data.quantity || offer.offeredQuantity;
    if (newQty > listing.availableQuantity) {
      throw new BadRequestException(
        `Counter quantity (${newQty}) exceeds available stock (${listing.availableQuantity} ${listing.unit})`
      );
    }

    const revisionNumber = offer.currentRevision + 1;
    const totalAmount = newQty * data.unitPrice;
    const now = new Date().toISOString();

    const newRevision: OfferRevisionDto = {
      revisionNumber,
      initiatedBy: data.counterBy,
      initiatorId: data.initiatorId,
      initiatorName: data.initiatorName,
      offeredQuantity: newQty,
      offeredUnitPrice: data.unitPrice,
      totalAmount,
      paymentTerms: data.paymentTerms || offer.paymentTerms,
      deliveryTerms: data.deliveryTerms || offer.deliveryTerms,
      message: data.message,
      createdAt: now,
    };

    offer.currentRevision = revisionNumber;
    offer.offeredQuantity = newQty;
    offer.offeredUnitPrice = data.unitPrice;
    offer.totalAmount = totalAmount;
    if (data.paymentTerms) offer.paymentTerms = data.paymentTerms;
    if (data.deliveryTerms) offer.deliveryTerms = data.deliveryTerms;
    offer.revisions.push(newRevision);
    offer.updatedAt = now;

    // Flip status
    offer.status = data.counterBy === 'SELLER' ? 'PENDING_BUYER_REVIEW' : 'PENDING_SELLER_REVIEW';

    return offer;
  }

  acceptOffer(id: string): ProduceOfferDto {
    const offer = this.getOffer(id);
    if (offer.status === 'ACCEPTED') {
      return offer;
    }
    if (offer.status !== 'PENDING_SELLER_REVIEW' && offer.status !== 'PENDING_BUYER_REVIEW') {
      throw new BadRequestException(`Cannot accept offer in '${offer.status}' state`);
    }

    offer.status = 'ACCEPTED';
    offer.updatedAt = new Date().toISOString();
    return offer;
  }

  rejectOffer(id: string, reason?: string): ProduceOfferDto {
    const offer = this.getOffer(id);
    if (offer.status === 'REJECTED') {
      return offer;
    }
    offer.status = 'REJECTED';
    offer.updatedAt = new Date().toISOString();
    return offer;
  }
}
