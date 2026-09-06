import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { ProduceListingService, ProduceListingDto } from '../listings/produce-listing.service';

export interface AggregationItemDto {
  id: string;
  farmerId: string;
  farmerName: string;
  farmId?: string;
  cropName: string;
  cropVariety?: string;
  qualityGrade?: string;
  contributedQuantity: number;
  unit: string;
  unitPricePayable?: number;
  inwardDate: string;
  notes?: string;
}

export interface ProduceAggregationDto {
  id: string;
  batchCode: string;
  organizationId: string;
  organizationName: string;
  collectionCenterName: string;
  district: string;
  mandal: string;
  village: string;
  cropName: string;
  cropVariety?: string;
  qualityGrade?: string;
  targetQuantity: number;
  collectedQuantity: number;
  unit: string;
  items: AggregationItemDto[];
  status: 'COLLECTING' | 'INSPECTED' | 'AGGREGATED' | 'LISTED' | 'PARTIALLY_DISPATCHED' | 'DISPATCHED' | 'SETTLED';
  publishedListingId?: string;
  createdAt: string;
  updatedAt: string;
}

@Injectable()
export class ProduceAggregationService {
  constructor(private readonly listingService: ProduceListingService) {}

  private batches: ProduceAggregationDto[] = [
    {
      id: 'agg-cot-batch-01',
      batchCode: 'AGG-2026-COT-B01',
      organizationId: 'org-kalyan-fpo',
      organizationName: 'Kalyandurg Cotton & Groundnut Producer Co. Ltd.',
      collectionCenterName: 'Kalyan Central Aggregation Yard',
      district: 'Mahbubnagar',
      mandal: 'Kalyan Zone',
      village: 'Kalyandurg',
      cropName: 'Cotton (Long-Staple Bt-2)',
      cropVariety: 'Brahma 32mm Staple',
      qualityGrade: 'Grade A',
      targetQuantity: 500,
      collectedQuantity: 450,
      unit: 'Quintals',
      status: 'LISTED',
      publishedListingId: 'prd-cotton-01',
      items: [
        {
          id: 'agg-item-1',
          farmerId: 'usr-farmer-01',
          farmerName: 'K. Venkatesh',
          cropName: 'Cotton (Long-Staple Bt-2)',
          cropVariety: 'Brahma 32mm Staple',
          qualityGrade: 'Grade A',
          contributedQuantity: 120,
          unit: 'Quintals',
          unitPricePayable: 7300,
          inwardDate: '2026-02-14',
          notes: 'Lot tested for 32mm staple and zero dust.',
        },
        {
          id: 'agg-item-2',
          farmerId: 'usr-farmer-02',
          farmerName: 'M. Lakshmi Narayana',
          cropName: 'Cotton (Long-Staple Bt-2)',
          cropVariety: 'Brahma 32mm Staple',
          qualityGrade: 'Grade A',
          contributedQuantity: 180,
          unit: 'Quintals',
          unitPricePayable: 7300,
          inwardDate: '2026-02-15',
          notes: 'Standard moisture 7.5%.',
        },
        {
          id: 'agg-item-3',
          farmerId: 'usr-farmer-03',
          farmerName: 'B. Srinivas',
          cropName: 'Cotton (Long-Staple Bt-2)',
          cropVariety: 'Brahma 32mm Staple',
          qualityGrade: 'Grade A',
          contributedQuantity: 150,
          unit: 'Quintals',
          unitPricePayable: 7300,
          inwardDate: '2026-02-15',
          notes: 'Verified Grade A.',
        },
      ],
      createdAt: '2026-02-14T09:00:00Z',
      updatedAt: '2026-02-15T16:00:00Z',
    },
    {
      id: 'agg-pad-batch-02',
      batchCode: 'AGG-2026-PAD-B02',
      organizationId: 'org-deccan-coop',
      organizationName: 'Deccan Watershed & Organic Farmers Cooperative',
      collectionCenterName: 'Chevella Organic Storage Hub',
      district: 'Ranga Reddy',
      mandal: 'Chevella',
      village: 'Chevella',
      cropName: 'Sona Masoori Organic Paddy',
      cropVariety: 'BPT 5204 (Organic Certified)',
      qualityGrade: 'Export Quality',
      targetQuantity: 300,
      collectedQuantity: 280,
      unit: 'Quintals',
      status: 'LISTED',
      publishedListingId: 'prd-paddy-02',
      items: [
        {
          id: 'agg-item-201',
          farmerId: 'usr-farmer-11',
          farmerName: 'G. Ramana',
          cropName: 'Sona Masoori Organic Paddy',
          cropVariety: 'BPT 5204 (Organic Certified)',
          qualityGrade: 'Export Quality',
          contributedQuantity: 140,
          unit: 'Quintals',
          unitPricePayable: 2800,
          inwardDate: '2026-02-16',
        },
        {
          id: 'agg-item-202',
          farmerId: 'usr-farmer-12',
          farmerName: 'S. Chandrasekhar',
          cropName: 'Sona Masoori Organic Paddy',
          cropVariety: 'BPT 5204 (Organic Certified)',
          qualityGrade: 'Export Quality',
          contributedQuantity: 140,
          unit: 'Quintals',
          unitPricePayable: 2800,
          inwardDate: '2026-02-16',
        },
      ],
      createdAt: '2026-02-16T08:30:00Z',
      updatedAt: '2026-02-16T12:00:00Z',
    },
  ];

  listAggregations(filter?: { organizationId?: string; crop?: string; status?: string }): ProduceAggregationDto[] {
    return this.batches.filter((b) => {
      if (filter?.organizationId && b.organizationId !== filter.organizationId) return false;
      if (filter?.crop && !b.cropName.toLowerCase().includes(filter.crop.toLowerCase())) return false;
      if (filter?.status && b.status !== filter.status) return false;
      return true;
    });
  }

  getAggregation(id: string): ProduceAggregationDto {
    const batch = this.batches.find((b) => b.id === id || b.batchCode.toLowerCase() === id.toLowerCase());
    if (!batch) {
      throw new NotFoundException(`Aggregation batch ${id} not found`);
    }
    return batch;
  }

  createAggregation(data: {
    organizationId: string;
    organizationName: string;
    collectionCenterName: string;
    district: string;
    mandal: string;
    village: string;
    cropName: string;
    cropVariety?: string;
    qualityGrade?: string;
    targetQuantity: number;
    unit?: string;
  }): ProduceAggregationDto {
    if (data.targetQuantity <= 0) {
      throw new BadRequestException('Target aggregation quantity must be greater than zero');
    }

    const batchId = `agg-${Date.now().toString(36)}`;
    const batchCode = `AGG-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const now = new Date().toISOString();

    const newBatch: ProduceAggregationDto = {
      id: batchId,
      batchCode,
      organizationId: data.organizationId,
      organizationName: data.organizationName,
      collectionCenterName: data.collectionCenterName,
      district: data.district,
      mandal: data.mandal,
      village: data.village,
      cropName: data.cropName,
      cropVariety: data.cropVariety,
      qualityGrade: data.qualityGrade || 'Grade A',
      targetQuantity: data.targetQuantity,
      collectedQuantity: 0,
      unit: data.unit || 'Quintals',
      items: [],
      status: 'COLLECTING',
      createdAt: now,
      updatedAt: now,
    };

    this.batches.push(newBatch);
    return newBatch;
  }

  addItemToAggregation(
    batchId: string,
    data: {
      farmerId: string;
      farmerName: string;
      farmId?: string;
      cropName: string;
      cropVariety?: string;
      qualityGrade?: string;
      contributedQuantity: number;
      unit?: string;
      unitPricePayable?: number;
      notes?: string;
    }
  ): ProduceAggregationDto {
    const batch = this.getAggregation(batchId);

    if (batch.status === 'LISTED' || batch.status === 'DISPATCHED' || batch.status === 'SETTLED') {
      throw new BadRequestException(`Cannot add lots to batch in '${batch.status}' status`);
    }

    // Compatibility validation
    if (data.cropName.toLowerCase().trim() !== batch.cropName.toLowerCase().trim()) {
      throw new BadRequestException(
        `Incompatible crop: Batch expects '${batch.cropName}' but received '${data.cropName}'`
      );
    }

    if (batch.cropVariety && data.cropVariety && data.cropVariety.toLowerCase().trim() !== batch.cropVariety.toLowerCase().trim()) {
      throw new BadRequestException(
        `Incompatible variety: Batch expects '${batch.cropVariety}' but received '${data.cropVariety}'`
      );
    }

    if (batch.qualityGrade && data.qualityGrade && data.qualityGrade !== batch.qualityGrade) {
      throw new BadRequestException(
        `Incompatible grade: Batch requires quality grade '${batch.qualityGrade}' but lot is '${data.qualityGrade}'`
      );
    }

    if (data.contributedQuantity <= 0) {
      throw new BadRequestException('Contributed quantity must be greater than zero');
    }

    const itemId = `agg-item-${Date.now().toString(36)}`;
    const now = new Date().toISOString();

    const newItem: AggregationItemDto = {
      id: itemId,
      farmerId: data.farmerId,
      farmerName: data.farmerName,
      farmId: data.farmId,
      cropName: data.cropName,
      cropVariety: data.cropVariety,
      qualityGrade: data.qualityGrade || batch.qualityGrade,
      contributedQuantity: data.contributedQuantity,
      unit: data.unit || batch.unit,
      unitPricePayable: data.unitPricePayable,
      inwardDate: now.split('T')[0],
      notes: data.notes,
    };

    batch.items.push(newItem);
    batch.collectedQuantity += data.contributedQuantity;

    if (batch.collectedQuantity >= batch.targetQuantity) {
      batch.status = 'AGGREGATED';
    }

    batch.updatedAt = now;
    return batch;
  }

  publishAggregationListing(
    batchId: string,
    options: {
      askingPrice?: number;
      priceUnit?: string;
      description?: string;
    }
  ): { aggregation: ProduceAggregationDto; listing: ProduceListingDto } {
    const batch = this.getAggregation(batchId);

    if (batch.collectedQuantity <= 0) {
      throw new BadRequestException('Cannot publish empty aggregation batch');
    }

    const listing = this.listingService.createListing({
      organizationId: batch.organizationId,
      organizationName: batch.organizationName,
      sellerName: `${batch.organizationName} (${batch.items.length} Aggregated Farmers)`,
      cropName: batch.cropName,
      cropVariety: batch.cropVariety,
      quantity: batch.collectedQuantity,
      unit: batch.unit,
      qualityGrade: batch.qualityGrade,
      district: batch.district,
      mandal: batch.mandal,
      village: batch.collectionCenterName,
      askingPrice: options.askingPrice,
      priceUnit: options.priceUnit || 'INR/Quintal',
      description:
        options.description ||
        `Bulk aggregated batch of ${batch.collectedQuantity} ${batch.unit} from ${batch.items.length} verified FPO smallholder farmers at ${batch.collectionCenterName}.`,
    });

    batch.status = 'LISTED';
    batch.publishedListingId = listing.id;
    batch.updatedAt = new Date().toISOString();

    return { aggregation: batch, listing };
  }
}
