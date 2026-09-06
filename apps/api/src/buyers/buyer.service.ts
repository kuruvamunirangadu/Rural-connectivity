import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';

export interface BuyerProfileItem {
  id: string;
  userId: string;
  companyName: string;
  buyerType: 'INSTITUTIONAL' | 'AGGREGATOR' | 'FOOD_PROCESSOR' | 'EXPORTER' | 'RETAIL_CHAIN';
  gstNumber?: string;
  contactPerson: string;
  contactPhone: string;
  contactEmail?: string;
  city: string;
  state: string;
  verificationStatus: 'VERIFIED' | 'PENDING' | 'GOLD';
  tradingVolumeQuintals: number;
  rating: number;
  joinedAt: string;
}

@Injectable()
export class BuyerService {
  private buyers: BuyerProfileItem[] = [
    {
      id: 'buyer-deccan-mills-01',
      userId: 'usr-buyer-01',
      companyName: 'Deccan Cotton Ginning & Spinning Mills Pvt Ltd',
      buyerType: 'FOOD_PROCESSOR',
      gstNumber: '36AAACD1234F1Z5',
      contactPerson: 'K. Venkatesh (Procurement Head)',
      contactPhone: '+91 98765 43250',
      contactEmail: 'procure@deccanmills.com',
      city: 'Mahbubnagar Industrial Area',
      state: 'Telangana',
      verificationStatus: 'GOLD',
      tradingVolumeQuintals: 14500,
      rating: 4.9,
      joinedAt: '2026-01-05T10:00:00Z',
    },
    {
      id: 'buyer-itc-agri-02',
      userId: 'usr-buyer-02',
      companyName: 'ITC Agri-Business Division (Choupal Sourcing)',
      buyerType: 'INSTITUTIONAL',
      gstNumber: '36AAACI5678K1Z9',
      contactPerson: 'Rajesh Nair',
      contactPhone: '+91 98765 43251',
      contactEmail: 'sourcing.choupal@itc.in',
      city: 'Hyderabad Sourcing Hub',
      state: 'Telangana',
      verificationStatus: 'GOLD',
      tradingVolumeQuintals: 38200,
      rating: 5.0,
      joinedAt: '2026-01-10T12:00:00Z',
    },
    {
      id: 'buyer-telangana-oil-03',
      userId: 'usr-buyer-03',
      companyName: 'Telangana Agro Oilseed Extractors Association',
      buyerType: 'AGGREGATOR',
      gstNumber: '36AAACT9012M1Z2',
      contactPerson: 'Anand Rao',
      contactPhone: '+91 98765 43252',
      contactEmail: 'oilseed.trade@tsagro.org',
      city: 'Kurnool / Mahbubnagar Junction',
      state: 'Telangana',
      verificationStatus: 'VERIFIED',
      tradingVolumeQuintals: 8200,
      rating: 4.7,
      joinedAt: '2026-01-22T14:00:00Z',
    },
  ];

  listBuyers(filter?: { buyerType?: string }): BuyerProfileItem[] {
    return this.buyers.filter((b) => {
      if (filter?.buyerType && b.buyerType.toLowerCase() !== filter.buyerType.toLowerCase()) return false;
      return true;
    });
  }

  getBuyer(id: string): BuyerProfileItem {
    const buyer = this.buyers.find((b) => b.id === id || b.userId === id);
    if (!buyer) {
      throw new NotFoundException(`Buyer profile ${id} not found`);
    }
    return buyer;
  }

  registerBuyer(data: {
    userId: string;
    companyName: string;
    buyerType: 'INSTITUTIONAL' | 'AGGREGATOR' | 'FOOD_PROCESSOR' | 'EXPORTER' | 'RETAIL_CHAIN';
    gstNumber?: string;
    contactPerson: string;
    contactPhone: string;
    contactEmail?: string;
    city: string;
    state?: string;
  }): BuyerProfileItem {
    const exists = this.buyers.some((b) => b.userId === data.userId);
    if (exists) {
      throw new BadRequestException(`Buyer profile for user ${data.userId} already exists`);
    }

    const newBuyer: BuyerProfileItem = {
      id: `buyer-${Date.now().toString(36)}`,
      userId: data.userId,
      companyName: data.companyName,
      buyerType: data.buyerType,
      gstNumber: data.gstNumber,
      contactPerson: data.contactPerson,
      contactPhone: data.contactPhone,
      contactEmail: data.contactEmail,
      city: data.city,
      state: data.state || 'Telangana',
      verificationStatus: 'PENDING',
      tradingVolumeQuintals: 0,
      rating: 5.0,
      joinedAt: new Date().toISOString(),
    };

    this.buyers.push(newBuyer);
    return newBuyer;
  }
}

