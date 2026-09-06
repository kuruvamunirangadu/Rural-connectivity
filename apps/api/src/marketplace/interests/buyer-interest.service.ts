import { Injectable, NotFoundException } from '@nestjs/common';
import { ProduceListingService } from '../listings/produce-listing.service';

export interface BuyerInterestDto {
  id: string;
  listingId: string;
  listingCrop: string;
  buyerId: string;
  buyerName: string;
  buyerOrganization?: string;
  quantityRequested: number;
  unit: string;
  targetPrice?: number;
  deliveryPreference: 'SELLER_ARRANGED' | 'BUYER_ARRANGED' | 'FPO_YARD_PICKUP';
  deliveryDistrict?: string;
  notes?: string;
  status: 'EXPRESSED' | 'RESPONDED' | 'CONVERTED_TO_OFFER' | 'CLOSED' | 'EXPIRED';
  sellerResponseNotes?: string;
  createdAt: string;
}

@Injectable()
export class BuyerInterestService {
  constructor(private readonly listingService: ProduceListingService) {}

  private interests: BuyerInterestDto[] = [
    {
      id: 'int-001',
      listingId: 'prd-cotton-01',
      listingCrop: 'Cotton (Long-Staple Bt-2)',
      buyerId: 'usr-texcorp-01',
      buyerName: 'Vikram Mehta',
      buyerOrganization: 'Deccan Mills & Agro-Industrial Ltd.',
      quantityRequested: 300,
      unit: 'Quintals',
      targetPrice: 7350,
      deliveryPreference: 'SELLER_ARRANGED',
      deliveryDistrict: 'Hyderabad Industrial Area',
      notes: 'Need standard quality certificate and moisture under 8%. Ready for quick delivery.',
      status: 'RESPONDED',
      sellerResponseNotes: 'FPO can supply 300 Quintals @ 7400 INR. Moisture is 7.4%.',
      createdAt: '2026-02-17T11:00:00Z',
    },
    {
      id: 'int-002',
      listingId: 'prd-paddy-02',
      listingCrop: 'Sona Masoori Organic Paddy',
      buyerId: 'usr-organics-02',
      buyerName: 'Ananya Sharma',
      buyerOrganization: 'PureRoots Organic Foods Pvt Ltd',
      quantityRequested: 150,
      unit: 'Quintals',
      targetPrice: 2850,
      deliveryPreference: 'BUYER_ARRANGED',
      deliveryDistrict: 'Ranga Reddy',
      notes: 'Looking for prompt batch collection at Chevella yard.',
      status: 'EXPRESSED',
      createdAt: '2026-02-19T14:20:00Z',
    },
  ];

  listInterests(filter?: { listingId?: string; buyerId?: string; status?: string }): BuyerInterestDto[] {
    return this.interests.filter((i) => {
      if (filter?.listingId && i.listingId !== filter.listingId) return false;
      if (filter?.buyerId && i.buyerId !== filter.buyerId) return false;
      if (filter?.status && i.status !== filter.status) return false;
      return true;
    });
  }

  getInterest(id: string): BuyerInterestDto {
    const interest = this.interests.find((i) => i.id === id);
    if (!interest) {
      throw new NotFoundException(`Buyer interest ${id} not found`);
    }
    return interest;
  }

  createInterest(data: {
    listingId: string;
    buyerId: string;
    buyerName?: string;
    buyerOrganization?: string;
    quantityRequested: number;
    unit?: string;
    targetPrice?: number;
    deliveryPreference?: 'SELLER_ARRANGED' | 'BUYER_ARRANGED' | 'FPO_YARD_PICKUP';
    deliveryDistrict?: string;
    notes?: string;
  }): BuyerInterestDto {
    const listing = this.listingService.getListing(data.listingId);

    const newInterest: BuyerInterestDto = {
      id: `int-${Date.now().toString(36)}`,
      listingId: listing.id,
      listingCrop: listing.cropName,
      buyerId: data.buyerId,
      buyerName: data.buyerName || 'Verified Commodity Buyer',
      buyerOrganization: data.buyerOrganization,
      quantityRequested: data.quantityRequested,
      unit: data.unit || listing.unit,
      targetPrice: data.targetPrice || listing.askingPrice,
      deliveryPreference: data.deliveryPreference || 'SELLER_ARRANGED',
      deliveryDistrict: data.deliveryDistrict,
      notes: data.notes,
      status: 'EXPRESSED',
      createdAt: new Date().toISOString(),
    };

    this.interests.push(newInterest);
    return newInterest;
  }

  respondToInterest(id: string, responseNotes: string): BuyerInterestDto {
    const interest = this.getInterest(id);
    interest.sellerResponseNotes = responseNotes;
    interest.status = 'RESPONDED';
    return interest;
  }

  convertToOffer(id: string): BuyerInterestDto {
    const interest = this.getInterest(id);
    interest.status = 'CONVERTED_TO_OFFER';
    return interest;
  }
}
