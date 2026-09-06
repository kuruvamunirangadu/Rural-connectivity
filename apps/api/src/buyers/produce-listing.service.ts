import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';

export interface ProduceListingItem {
  id: string;
  code: string;
  organizationId?: string;
  organizationName?: string;
  farmId?: string;
  farmerName?: string;
  farmerPhone?: string;
  crop: string;
  variety?: string;
  quantity: number;
  unit: string; // "Quintals", "Metric Tonnes", "Bags"
  targetPricePerUnit: number; // INR
  qualityGrade: 'Grade A' | 'Grade B' | 'Export Quality' | 'Standard';
  moisturePct?: number;
  harvestDate: string;
  district: string;
  mandal: string;
  village: string;
  status: 'AVAILABLE' | 'PARTIALLY_SOLD' | 'SOLD' | 'EXPIRED' | 'CANCELLED';
  createdAt: string;
}

export interface BuyerPurchaseOrderDto {
  listingId: string;
  buyerId: string;
  buyerName: string;
  quantityOrdered: number;
  offeredPricePerUnit: number;
  deliveryNotes?: string;
}

export interface BuyerPurchaseOrderResult {
  orderId: string;
  listingId: string;
  buyerId: string;
  crop: string;
  quantityOrdered: number;
  unit: string;
  pricePerUnit: number;
  totalAmount: number;
  sellerName: string;
  pickupLocation: string;
  status: 'ORDER_PLACED' | 'CONFIRMED' | 'IN_TRANSIT' | 'SETTLED';
  createdAt: string;
}

@Injectable()
export class ProduceListingService {
  private listings: ProduceListingItem[] = [
    {
      id: 'prd-cotton-01',
      code: 'PRD-2026-COT-01',
      organizationId: 'org-kalyan-fpo',
      organizationName: 'Kalyandurg Cotton & Groundnut Producer Co. Ltd.',
      farmerName: 'Kalyandurg Aggregated Farmer Group (42 Farmers)',
      farmerPhone: '+91 98765 43210',
      crop: 'Cotton (Long-Staple Bt-2)',
      variety: 'Brahma 32mm Staple',
      quantity: 450,
      unit: 'Quintals',
      targetPricePerUnit: 7400,
      qualityGrade: 'Grade A',
      moisturePct: 7.2,
      harvestDate: '2026-03-10',
      district: 'Mahbubnagar',
      mandal: 'Kalyan Zone',
      village: 'Central FPO Aggregation Yard',
      status: 'AVAILABLE',
      createdAt: '2026-02-15T10:00:00Z',
    },
    {
      id: 'prd-paddy-02',
      code: 'PRD-2026-PAD-02',
      organizationId: 'org-deccan-coop',
      organizationName: 'Deccan Watershed & Organic Farmers Cooperative',
      farmerName: 'Chevella Organic Paddy Cluster (18 Farmers)',
      farmerPhone: '+91 98765 43230',
      crop: 'Sona Masoori Organic Paddy',
      variety: 'BPT 5204 (Organic Certified)',
      quantity: 280,
      unit: 'Quintals',
      targetPricePerUnit: 2850,
      qualityGrade: 'Export Quality',
      moisturePct: 12.0,
      harvestDate: '2026-02-28',
      district: 'Ranga Reddy',
      mandal: 'Chevella',
      village: 'Chevella Coop Yard',
      status: 'AVAILABLE',
      createdAt: '2026-02-16T12:00:00Z',
    },
    {
      id: 'prd-groundnut-03',
      code: 'PRD-2026-GNT-03',
      organizationId: 'org-kalyan-fpo',
      organizationName: 'Kalyandurg Cotton & Groundnut Producer Co. Ltd.',
      farmerName: 'Laxmi Devi & Co-farmers',
      farmerPhone: '+91 98765 43214',
      crop: 'Groundnut (K-6 Bold Pods)',
      variety: 'Kadiri-6 High Oil Content',
      quantity: 120,
      unit: 'Quintals',
      targetPricePerUnit: 6900,
      qualityGrade: 'Grade A',
      moisturePct: 8.0,
      harvestDate: '2026-03-05',
      district: 'Mahbubnagar',
      mandal: 'Kalyan Zone',
      village: 'Peddapalli FPO Point',
      status: 'AVAILABLE',
      createdAt: '2026-02-18T15:30:00Z',
    },
  ];

  private orders: BuyerPurchaseOrderResult[] = [];

  listListings(filter?: { crop?: string; district?: string; status?: string }): ProduceListingItem[] {
    return this.listings.filter((l) => {
      if (filter?.crop && !l.crop.toLowerCase().includes(filter.crop.toLowerCase())) return false;
      if (filter?.district && !l.district.toLowerCase().includes(filter.district.toLowerCase())) return false;
      if (filter?.status && l.status.toLowerCase() !== filter.status.toLowerCase()) return false;
      return true;
    });
  }

  getListing(id: string): ProduceListingItem {
    const listing = this.listings.find((l) => l.id === id || l.code.toLowerCase() === id.toLowerCase());
    if (!listing) {
      throw new NotFoundException(`Produce listing ${id} not found`);
    }
    return listing;
  }

  createListing(data: {
    organizationId?: string;
    organizationName?: string;
    farmId?: string;
    farmerName?: string;
    farmerPhone?: string;
    crop: string;
    variety?: string;
    quantity: number;
    unit?: string;
    targetPricePerUnit: number;
    qualityGrade?: 'Grade A' | 'Grade B' | 'Export Quality' | 'Standard';
    moisturePct?: number;
    harvestDate?: string;
    district: string;
    mandal: string;
    village: string;
  }): ProduceListingItem {
    const listingId = `prd-${Date.now().toString(36)}`;
    const code = `PRD-2026-${Math.floor(1000 + Math.random() * 9000)}`;

    const newListing: ProduceListingItem = {
      id: listingId,
      code,
      organizationId: data.organizationId,
      organizationName: data.organizationName,
      farmId: data.farmId,
      farmerName: data.farmerName || 'Registered Producer',
      farmerPhone: data.farmerPhone,
      crop: data.crop,
      variety: data.variety,
      quantity: data.quantity,
      unit: data.unit || 'Quintals',
      targetPricePerUnit: data.targetPricePerUnit,
      qualityGrade: data.qualityGrade || 'Grade A',
      moisturePct: data.moisturePct,
      harvestDate: data.harvestDate || new Date().toISOString().split('T')[0],
      district: data.district,
      mandal: data.mandal,
      village: data.village,
      status: 'AVAILABLE',
      createdAt: new Date().toISOString(),
    };

    this.listings.push(newListing);
    return newListing;
  }

  placeOrder(dto: BuyerPurchaseOrderDto): BuyerPurchaseOrderResult {
    const listing = this.getListing(dto.listingId);

    if (listing.status !== 'AVAILABLE' && listing.status !== 'PARTIALLY_SOLD') {
      throw new BadRequestException('This produce listing is no longer available for purchase');
    }

    if (dto.quantityOrdered > listing.quantity) {
      throw new BadRequestException(`Requested quantity (${dto.quantityOrdered}) exceeds available stock (${listing.quantity})`);
    }

    const price = dto.offeredPricePerUnit || listing.targetPricePerUnit;
    const totalAmount = dto.quantityOrdered * price;

    // Deduct stock
    listing.quantity -= dto.quantityOrdered;
    if (listing.quantity <= 0) {
      listing.status = 'SOLD';
    } else {
      listing.status = 'PARTIALLY_SOLD';
    }

    const order: BuyerPurchaseOrderResult = {
      orderId: `ord-buyer-${Date.now().toString(36)}`,
      listingId: listing.id,
      buyerId: dto.buyerId,
      crop: listing.crop,
      quantityOrdered: dto.quantityOrdered,
      unit: listing.unit,
      pricePerUnit: price,
      totalAmount,
      sellerName: listing.organizationName || listing.farmerName || 'FPO Producer',
      pickupLocation: `${listing.village}, ${listing.mandal}, ${listing.district}`,
      status: 'ORDER_PLACED',
      createdAt: new Date().toISOString(),
    };

    this.orders.push(order);
    return order;
  }

  listOrders(buyerId?: string): BuyerPurchaseOrderResult[] {
    if (buyerId) {
      return this.orders.filter((o) => o.buyerId === buyerId);
    }
    return this.orders;
  }
}

