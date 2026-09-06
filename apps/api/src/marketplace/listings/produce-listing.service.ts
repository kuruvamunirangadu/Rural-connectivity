import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';

export interface ProduceListingDto {
  id: string;
  code: string;
  sellerId?: string;
  sellerName?: string;
  organizationId?: string;
  organizationName?: string;
  farmId?: string;
  cropName: string;
  cropVariety?: string;
  quantity: number;
  availableQuantity: number;
  unit: string;
  expectedHarvestDate?: string;
  harvestDate?: string;
  qualityGrade?: string;
  district: string;
  mandal: string;
  village: string;
  askingPrice?: number;
  priceUnit?: string;
  description?: string;
  status: 'DRAFT' | 'AVAILABLE' | 'PARTIALLY_COMMITTED' | 'COMMITTED' | 'SOLD' | 'EXPIRED' | 'CANCELLED';
  createdAt: string;
}

@Injectable()
export class ProduceListingService {
  private listings: ProduceListingDto[] = [
    {
      id: 'prd-cotton-01',
      code: 'PRD-2026-COT-01',
      organizationId: 'org-kalyan-fpo',
      organizationName: 'Kalyandurg Cotton & Groundnut Producer Co. Ltd.',
      sellerName: 'Kalyandurg FPO Cluster (42 Member Farmers)',
      cropName: 'Cotton (Long-Staple Bt-2)',
      cropVariety: 'Brahma 32mm Staple',
      quantity: 450,
      availableQuantity: 450,
      unit: 'Quintals',
      expectedHarvestDate: '2026-03-10',
      harvestDate: '2026-03-10',
      qualityGrade: 'Grade A',
      district: 'Mahbubnagar',
      mandal: 'Kalyan Zone',
      village: 'Central FPO Aggregation Yard',
      askingPrice: 7400,
      priceUnit: 'INR/Quintal',
      description: 'Clean long staple Bt-2 cotton harvested under FPO monitoring. Zero pesticide residue.',
      status: 'AVAILABLE',
      createdAt: '2026-02-15T10:00:00Z',
    },
    {
      id: 'prd-paddy-02',
      code: 'PRD-2026-PAD-02',
      organizationId: 'org-deccan-coop',
      organizationName: 'Deccan Watershed & Organic Farmers Cooperative',
      sellerName: 'Chevella Organic Paddy Cluster (18 Farmers)',
      cropName: 'Sona Masoori Organic Paddy',
      cropVariety: 'BPT 5204 (Organic Certified)',
      quantity: 280,
      availableQuantity: 280,
      unit: 'Quintals',
      expectedHarvestDate: '2026-02-28',
      harvestDate: '2026-02-28',
      qualityGrade: 'Export Quality',
      district: 'Ranga Reddy',
      mandal: 'Chevella',
      village: 'Chevella Coop Yard',
      askingPrice: 2850,
      priceUnit: 'INR/Quintal',
      description: 'NPOP Organic certified fine grain Sona Masoori paddy. Moisture tested at 12%.',
      status: 'AVAILABLE',
      createdAt: '2026-02-16T12:00:00Z',
    },
    {
      id: 'prd-groundnut-03',
      code: 'PRD-2026-GNT-03',
      sellerId: 'usr-ravi-001',
      sellerName: 'Ravi Kumar (Direct Farmer)',
      cropName: 'Groundnut (K-6 Bold Pods)',
      cropVariety: 'Kadiri-6 High Oil Content',
      quantity: 80,
      availableQuantity: 80,
      unit: 'Quintals',
      expectedHarvestDate: '2026-03-05',
      harvestDate: '2026-03-05',
      qualityGrade: 'Grade A',
      district: 'Vikarabad',
      mandal: 'Tandur',
      village: 'Tangipalli',
      askingPrice: 6900,
      priceUnit: 'INR/Quintal',
      description: 'Sun-dried bold groundnut pods harvested from 5-acre irrigated black soil plot.',
      status: 'AVAILABLE',
      createdAt: '2026-02-18T15:30:00Z',
    },
    {
      id: 'prd-chilli-04',
      code: 'PRD-2026-CHL-04',
      sellerId: 'usr-suresh-002',
      sellerName: 'Suresh Reddy (Direct Farmer)',
      cropName: 'Guntur Red Chilli (Teja)',
      cropVariety: 'Teja S17 Hot Dry',
      quantity: 50,
      availableQuantity: 50,
      unit: 'Quintals',
      expectedHarvestDate: '2026-03-15',
      harvestDate: '2026-03-15',
      qualityGrade: 'Export Quality',
      district: 'Guntur',
      mandal: 'Tenali',
      village: 'Tenali Rural Cluster',
      askingPrice: 19500,
      priceUnit: 'INR/Quintal',
      description: 'Premium red color value SHU 75,000+ Teja chillies without stalks.',
      status: 'AVAILABLE',
      createdAt: '2026-02-20T09:00:00Z',
    },
  ];

  listListings(filter?: {
    crop?: string;
    variety?: string;
    qualityGrade?: string;
    district?: string;
    status?: string;
    sellerType?: 'FARMER' | 'FPO';
  }): ProduceListingDto[] {
    return this.listings.filter((l) => {
      if (filter?.crop && !l.cropName.toLowerCase().includes(filter.crop.toLowerCase())) return false;
      if (filter?.variety && l.cropVariety && !l.cropVariety.toLowerCase().includes(filter.variety.toLowerCase()))
        return false;
      if (filter?.qualityGrade && l.qualityGrade !== filter.qualityGrade) return false;
      if (filter?.district && !l.district.toLowerCase().includes(filter.district.toLowerCase())) return false;
      if (filter?.status && l.status !== filter.status) return false;
      if (filter?.sellerType === 'FPO' && !l.organizationId) return false;
      if (filter?.sellerType === 'FARMER' && l.organizationId) return false;
      return true;
    });
  }

  getListing(id: string): ProduceListingDto {
    const listing = this.listings.find((l) => l.id === id || l.code.toLowerCase() === id.toLowerCase());
    if (!listing) {
      throw new NotFoundException(`Produce listing ${id} not found`);
    }
    return listing;
  }

  createListing(data: {
    sellerId?: string;
    sellerName?: string;
    organizationId?: string;
    organizationName?: string;
    farmId?: string;
    cropName: string;
    cropVariety?: string;
    quantity: number;
    unit?: string;
    expectedHarvestDate?: string;
    harvestDate?: string;
    qualityGrade?: string;
    district: string;
    mandal: string;
    village: string;
    askingPrice?: number;
    priceUnit?: string;
    description?: string;
  }): ProduceListingDto {
    if (data.quantity <= 0) {
      throw new BadRequestException('Listing quantity must be greater than zero');
    }

    const listingId = `prd-${Date.now().toString(36)}`;
    const code = `PRD-2026-${Math.floor(1000 + Math.random() * 9000)}`;

    const newListing: ProduceListingDto = {
      id: listingId,
      code,
      sellerId: data.sellerId,
      sellerName: data.sellerName || (data.organizationId ? data.organizationName : 'Registered Producer'),
      organizationId: data.organizationId,
      organizationName: data.organizationName,
      farmId: data.farmId,
      cropName: data.cropName,
      cropVariety: data.cropVariety,
      quantity: data.quantity,
      availableQuantity: data.quantity,
      unit: data.unit || 'Quintals',
      expectedHarvestDate: data.expectedHarvestDate,
      harvestDate: data.harvestDate || new Date().toISOString().split('T')[0],
      qualityGrade: data.qualityGrade || 'Grade A',
      district: data.district,
      mandal: data.mandal,
      village: data.village,
      askingPrice: data.askingPrice,
      priceUnit: data.priceUnit || 'INR/Quintal',
      description: data.description,
      status: 'AVAILABLE',
      createdAt: new Date().toISOString(),
    };

    this.listings.push(newListing);
    return newListing;
  }

  reserveQuantity(listingId: string, quantityToReserve: number): void {
    const listing = this.getListing(listingId);
    if (quantityToReserve <= 0) {
      throw new BadRequestException('Reservation quantity must be greater than 0');
    }

    if (quantityToReserve > listing.availableQuantity) {
      throw new BadRequestException(
        `Cannot commit ${quantityToReserve} ${listing.unit}. Only ${listing.availableQuantity} ${listing.unit} available in stock.`
      );
    }

    listing.availableQuantity -= quantityToReserve;
    if (listing.availableQuantity <= 0) {
      listing.status = 'COMMITTED';
    } else {
      listing.status = 'PARTIALLY_COMMITTED';
    }
  }

  releaseQuantity(listingId: string, quantityToRelease: number): void {
    const listing = this.getListing(listingId);
    listing.availableQuantity = Math.min(listing.quantity, listing.availableQuantity + quantityToRelease);
    if (listing.availableQuantity >= listing.quantity) {
      listing.status = 'AVAILABLE';
    } else if (listing.availableQuantity > 0) {
      listing.status = 'PARTIALLY_COMMITTED';
    }
  }

  updateListing(id: string, updates: Partial<ProduceListingDto>): ProduceListingDto {
    const listing = this.getListing(id);
    Object.assign(listing, updates);
    return listing;
  }

  deleteListing(id: string): { success: boolean } {
    const idx = this.listings.findIndex((l) => l.id === id);
    if (idx === -1) {
      throw new NotFoundException(`Listing ${id} not found`);
    }
    this.listings.splice(idx, 1);
    return { success: true };
  }
}
