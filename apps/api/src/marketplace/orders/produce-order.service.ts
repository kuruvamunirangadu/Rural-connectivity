import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { ProduceListingService } from '../listings/produce-listing.service';
import { ProduceOfferService } from '../offers/produce-offer.service';

export interface OrderItemDto {
  id: string;
  listingId: string;
  cropName: string;
  cropVariety?: string;
  qualityGrade?: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  totalPrice: number;
}

export interface ProduceOrderDto {
  id: string;
  orderNumber: string;
  offerId?: string;
  listingId: string;
  buyerId: string;
  buyerName: string;
  buyerOrganization?: string;
  sellerId?: string;
  sellerName?: string;
  organizationId?: string;
  organizationName?: string;
  items: OrderItemDto[];
  totalQuantity: number;
  unit: string;
  subtotal: number;
  platformFee: number;
  totalAmount: number;
  currency: string;
  paymentTerms: string;
  deliveryTerms: string;
  escrowStatus: 'NOT_FUNDED' | 'ESCROW_HELD' | 'PARTIALLY_RELEASED' | 'RELEASED' | 'REFUNDED';
  status:
    | 'PENDING_CONFIRMATION'
    | 'CONFIRMED'
    | 'IN_FULFILLMENT'
    | 'LOGISTICS_DISPATCHED'
    | 'DELIVERED'
    | 'INSPECTED'
    | 'SETTLED'
    | 'CANCELLED'
    | 'DISPUTED';
  transportRequestId?: string;
  disputeReason?: string;
  createdAt: string;
  updatedAt: string;
}

@Injectable()
export class ProduceOrderService {
  constructor(
    private readonly listingService: ProduceListingService,
    private readonly offerService: ProduceOfferService
  ) {}

  private orders: ProduceOrderDto[] = [
    {
      id: 'ord-cot-8801',
      orderNumber: 'ORD-2026-COT-8801',
      offerId: 'ofr-cot-101',
      listingId: 'prd-cotton-01',
      buyerId: 'usr-texcorp-01',
      buyerName: 'Vikram Mehta',
      buyerOrganization: 'Deccan Mills & Agro-Industrial Ltd.',
      organizationId: 'org-kalyan-fpo',
      organizationName: 'Kalyandurg Cotton & Groundnut Producer Co. Ltd.',
      sellerName: 'Kalyandurg FPO Cluster (42 Member Farmers)',
      items: [
        {
          id: 'item-1',
          listingId: 'prd-cotton-01',
          cropName: 'Cotton (Long-Staple Bt-2)',
          cropVariety: 'Brahma 32mm Staple',
          qualityGrade: 'Grade A',
          quantity: 300,
          unit: 'Quintals',
          unitPrice: 7350,
          totalPrice: 2205000,
        },
      ],
      totalQuantity: 300,
      unit: 'Quintals',
      subtotal: 2205000,
      platformFee: 22050,
      totalAmount: 2227050,
      currency: 'INR',
      paymentTerms: '20% Advance Escrow, 80% on Dispatch Inspection',
      deliveryTerms: 'Seller arranged transport to Mahbubnagar rail yard',
      escrowStatus: 'ESCROW_HELD',
      status: 'CONFIRMED',
      transportRequestId: 'tr-req-001',
      createdAt: '2026-02-19T11:00:00Z',
      updatedAt: '2026-02-19T11:30:00Z',
    },
  ];

  listOrders(filter?: {
    buyerId?: string;
    sellerId?: string;
    status?: string;
    listingId?: string;
  }): ProduceOrderDto[] {
    return this.orders.filter((o) => {
      if (filter?.buyerId && o.buyerId !== filter.buyerId) return false;
      if (filter?.sellerId && o.sellerId !== filter.sellerId && o.organizationId !== filter.sellerId) return false;
      if (filter?.status && o.status !== filter.status) return false;
      if (filter?.listingId && o.listingId !== filter.listingId) return false;
      return true;
    });
  }

  getOrder(id: string): ProduceOrderDto {
    const order = this.orders.find((o) => o.id === id || o.orderNumber.toLowerCase() === id.toLowerCase());
    if (!order) {
      throw new NotFoundException(`Produce order ${id} not found`);
    }
    return order;
  }

  createOrderFromOffer(offerId: string): ProduceOrderDto {
    const offer = this.offerService.getOffer(offerId);

    // Accept offer if not already accepted
    if (offer.status !== 'ACCEPTED') {
      this.offerService.acceptOffer(offerId);
    }

    const listing = this.listingService.getListing(offer.listingId);

    // Zero-overselling check & inventory reservation
    this.listingService.reserveQuantity(listing.id, offer.offeredQuantity);

    const orderId = `ord-${Date.now().toString(36)}`;
    const orderNumber = `ORD-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const subtotal = offer.offeredQuantity * offer.offeredUnitPrice;
    const platformFee = Math.round(subtotal * 0.01); // 1% platform facilitation fee
    const totalAmount = subtotal + platformFee;
    const now = new Date().toISOString();

    const newOrder: ProduceOrderDto = {
      id: orderId,
      orderNumber,
      offerId: offer.id,
      listingId: listing.id,
      buyerId: offer.buyerId,
      buyerName: offer.buyerName,
      buyerOrganization: offer.buyerOrganization,
      sellerId: offer.sellerId,
      sellerName: offer.sellerName,
      organizationId: offer.organizationId,
      organizationName: offer.organizationName,
      items: [
        {
          id: `item-${Date.now().toString(36)}`,
          listingId: listing.id,
          cropName: listing.cropName,
          cropVariety: listing.cropVariety,
          qualityGrade: listing.qualityGrade,
          quantity: offer.offeredQuantity,
          unit: listing.unit,
          unitPrice: offer.offeredUnitPrice,
          totalPrice: subtotal,
        },
      ],
      totalQuantity: offer.offeredQuantity,
      unit: listing.unit,
      subtotal,
      platformFee,
      totalAmount,
      currency: 'INR',
      paymentTerms: offer.paymentTerms,
      deliveryTerms: offer.deliveryTerms,
      escrowStatus: 'ESCROW_HELD',
      status: 'CONFIRMED',
      createdAt: now,
      updatedAt: now,
    };

    this.orders.push(newOrder);
    return newOrder;
  }

  createDirectOrder(data: {
    listingId: string;
    buyerId: string;
    buyerName?: string;
    buyerOrganization?: string;
    quantity: number;
    paymentTerms?: string;
    deliveryTerms?: string;
  }): ProduceOrderDto {
    const listing = this.listingService.getListing(data.listingId);
    if (!listing.askingPrice) {
      throw new BadRequestException('Listing does not have a set asking price. Please submit an offer instead.');
    }

    if (data.quantity <= 0) {
      throw new BadRequestException('Order quantity must be greater than zero');
    }

    // Zero-overselling check & inventory reservation
    this.listingService.reserveQuantity(listing.id, data.quantity);

    const orderId = `ord-${Date.now().toString(36)}`;
    const orderNumber = `ORD-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const subtotal = data.quantity * listing.askingPrice;
    const platformFee = Math.round(subtotal * 0.01);
    const totalAmount = subtotal + platformFee;
    const now = new Date().toISOString();

    const newOrder: ProduceOrderDto = {
      id: orderId,
      orderNumber,
      listingId: listing.id,
      buyerId: data.buyerId,
      buyerName: data.buyerName || 'Verified Commodity Buyer',
      buyerOrganization: data.buyerOrganization,
      sellerId: listing.sellerId,
      sellerName: listing.sellerName,
      organizationId: listing.organizationId,
      organizationName: listing.organizationName,
      items: [
        {
          id: `item-${Date.now().toString(36)}`,
          listingId: listing.id,
          cropName: listing.cropName,
          cropVariety: listing.cropVariety,
          qualityGrade: listing.qualityGrade,
          quantity: data.quantity,
          unit: listing.unit,
          unitPrice: listing.askingPrice,
          totalPrice: subtotal,
        },
      ],
      totalQuantity: data.quantity,
      unit: listing.unit,
      subtotal,
      platformFee,
      totalAmount,
      currency: 'INR',
      paymentTerms: data.paymentTerms || '100% Escrow on Dispatch Verification',
      deliveryTerms: data.deliveryTerms || 'Direct Transport Fulfillment',
      escrowStatus: 'ESCROW_HELD',
      status: 'CONFIRMED',
      createdAt: now,
      updatedAt: now,
    };

    this.orders.push(newOrder);
    return newOrder;
  }

  confirmOrder(id: string): ProduceOrderDto {
    const order = this.getOrder(id);
    order.status = 'CONFIRMED';
    order.escrowStatus = 'ESCROW_HELD';
    order.updatedAt = new Date().toISOString();
    return order;
  }

  dispatchOrder(id: string, transportRequestId?: string): ProduceOrderDto {
    const order = this.getOrder(id);
    order.status = 'LOGISTICS_DISPATCHED';
    if (transportRequestId) order.transportRequestId = transportRequestId;
    order.updatedAt = new Date().toISOString();
    return order;
  }

  deliverOrder(id: string): ProduceOrderDto {
    const order = this.getOrder(id);
    order.status = 'DELIVERED';
    order.updatedAt = new Date().toISOString();
    return order;
  }

  settleOrder(id: string): ProduceOrderDto {
    const order = this.getOrder(id);
    if (order.status === 'DISPUTED') {
      throw new BadRequestException('Cannot settle order while under active dispute');
    }
    order.status = 'SETTLED';
    order.escrowStatus = 'RELEASED';
    order.updatedAt = new Date().toISOString();
    return order;
  }

  cancelOrder(id: string, reason?: string): ProduceOrderDto {
    const order = this.getOrder(id);
    if (order.status === 'SETTLED' || order.status === 'DELIVERED') {
      throw new BadRequestException(`Cannot cancel order in '${order.status}' state`);
    }

    // Release reserved quantity back to listing
    this.listingService.releaseQuantity(order.listingId, order.totalQuantity);

    order.status = 'CANCELLED';
    order.escrowStatus = 'REFUNDED';
    order.disputeReason = reason;
    order.updatedAt = new Date().toISOString();
    return order;
  }

  disputeOrder(id: string, reason: string): ProduceOrderDto {
    const order = this.getOrder(id);
    order.status = 'DISPUTED';
    order.disputeReason = reason;
    order.updatedAt = new Date().toISOString();
    return order;
  }
}
