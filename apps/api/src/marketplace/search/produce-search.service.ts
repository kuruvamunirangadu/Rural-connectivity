import { Injectable } from '@nestjs/common';
import { ProduceListingService, ProduceListingDto } from '../listings/produce-listing.service';

export interface SearchQueryDto {
  query?: string;
  crop?: string;
  variety?: string;
  qualityGrade?: string;
  district?: string;
  minPrice?: number;
  maxPrice?: number;
  minQuantity?: number;
  sellerType?: 'FARMER' | 'FPO';
  status?: string;
}

export interface PriceTrendDto {
  crop: string;
  variety: string;
  currentBenchmarkPrice: number;
  unit: string;
  dailyChangePercentage: number;
  sevenDayAvg: number;
  demandLevel: 'HIGH' | 'MODERATE' | 'SURPLUS';
  historicalTrend: { date: string; price: number }[];
}

@Injectable()
export class ProduceSearchService {
  constructor(private readonly listingService: ProduceListingService) {}

  private priceTrends: PriceTrendDto[] = [
    {
      crop: 'Cotton (Long-Staple Bt-2)',
      variety: 'Brahma 32mm Staple',
      currentBenchmarkPrice: 7450,
      unit: 'INR/Quintal',
      dailyChangePercentage: 1.8,
      sevenDayAvg: 7320,
      demandLevel: 'HIGH',
      historicalTrend: [
        { date: '2026-02-14', price: 7200 },
        { date: '2026-02-15', price: 7250 },
        { date: '2026-02-16', price: 7300 },
        { date: '2026-02-17', price: 7350 },
        { date: '2026-02-18', price: 7380 },
        { date: '2026-02-19', price: 7410 },
        { date: '2026-02-20', price: 7450 },
      ],
    },
    {
      crop: 'Sona Masoori Organic Paddy',
      variety: 'BPT 5204 (Organic Certified)',
      currentBenchmarkPrice: 2850,
      unit: 'INR/Quintal',
      dailyChangePercentage: 0.5,
      sevenDayAvg: 2820,
      demandLevel: 'HIGH',
      historicalTrend: [
        { date: '2026-02-14', price: 2780 },
        { date: '2026-02-15', price: 2800 },
        { date: '2026-02-16', price: 2800 },
        { date: '2026-02-17', price: 2820 },
        { date: '2026-02-18', price: 2840 },
        { date: '2026-02-19', price: 2850 },
        { date: '2026-02-20', price: 2850 },
      ],
    },
    {
      crop: 'Groundnut (K-6 Bold Pods)',
      variety: 'Kadiri-6 High Oil Content',
      currentBenchmarkPrice: 6900,
      unit: 'INR/Quintal',
      dailyChangePercentage: -0.8,
      sevenDayAvg: 6950,
      demandLevel: 'MODERATE',
      historicalTrend: [
        { date: '2026-02-14', price: 7000 },
        { date: '2026-02-15', price: 6980 },
        { date: '2026-02-16', price: 6950 },
        { date: '2026-02-17', price: 6940 },
        { date: '2026-02-18', price: 6920 },
        { date: '2026-02-19', price: 6900 },
        { date: '2026-02-20', price: 6900 },
      ],
    },
    {
      crop: 'Guntur Red Chilli (Teja)',
      variety: 'Teja S17 Hot Dry',
      currentBenchmarkPrice: 19500,
      unit: 'INR/Quintal',
      dailyChangePercentage: 3.2,
      sevenDayAvg: 18900,
      demandLevel: 'HIGH',
      historicalTrend: [
        { date: '2026-02-14', price: 18200 },
        { date: '2026-02-15', price: 18500 },
        { date: '2026-02-16', price: 18700 },
        { date: '2026-02-17', price: 18900 },
        { date: '2026-02-18', price: 19100 },
        { date: '2026-02-19', price: 19300 },
        { date: '2026-02-20', price: 19500 },
      ],
    },
  ];

  searchListings(params: SearchQueryDto): {
    totalResults: number;
    results: ProduceListingDto[];
    facets: {
      crops: { name: string; count: number }[];
      districts: { name: string; count: number }[];
      grades: { name: string; count: number }[];
      sellerTypes: { type: string; count: number }[];
    };
  } {
    const allListings = this.listingService.listListings({});

    const filtered = allListings.filter((item) => {
      if (params.query) {
        const q = params.query.toLowerCase();
        const matchesQuery =
          item.cropName.toLowerCase().includes(q) ||
          (item.cropVariety && item.cropVariety.toLowerCase().includes(q)) ||
          item.district.toLowerCase().includes(q) ||
          item.mandal.toLowerCase().includes(q) ||
          (item.sellerName && item.sellerName.toLowerCase().includes(q));
        if (!matchesQuery) return false;
      }

      if (params.crop && !item.cropName.toLowerCase().includes(params.crop.toLowerCase())) {
        return false;
      }
      if (params.variety && item.cropVariety && !item.cropVariety.toLowerCase().includes(params.variety.toLowerCase())) {
        return false;
      }
      if (params.qualityGrade && item.qualityGrade !== params.qualityGrade) {
        return false;
      }
      if (params.district && !item.district.toLowerCase().includes(params.district.toLowerCase())) {
        return false;
      }
      if (params.minPrice && item.askingPrice && item.askingPrice < params.minPrice) {
        return false;
      }
      if (params.maxPrice && item.askingPrice && item.askingPrice > params.maxPrice) {
        return false;
      }
      if (params.minQuantity && item.availableQuantity < params.minQuantity) {
        return false;
      }
      if (params.sellerType === 'FPO' && !item.organizationId) {
        return false;
      }
      if (params.sellerType === 'FARMER' && item.organizationId) {
        return false;
      }
      if (params.status && item.status !== params.status) {
        return false;
      }

      return true;
    });

    const cropFacetMap = new Map<string, number>();
    const districtFacetMap = new Map<string, number>();
    const gradeFacetMap = new Map<string, number>();
    let fpoCount = 0;
    let farmerCount = 0;

    for (const item of filtered) {
      cropFacetMap.set(item.cropName, (cropFacetMap.get(item.cropName) || 0) + 1);
      districtFacetMap.set(item.district, (districtFacetMap.get(item.district) || 0) + 1);
      if (item.qualityGrade) {
        gradeFacetMap.set(item.qualityGrade, (gradeFacetMap.get(item.qualityGrade) || 0) + 1);
      }
      if (item.organizationId) fpoCount++;
      else farmerCount++;
    }

    return {
      totalResults: filtered.length,
      results: filtered,
      facets: {
        crops: Array.from(cropFacetMap.entries()).map(([name, count]) => ({ name, count })),
        districts: Array.from(districtFacetMap.entries()).map(([name, count]) => ({ name, count })),
        grades: Array.from(gradeFacetMap.entries()).map(([name, count]) => ({ name, count })),
        sellerTypes: [
          { type: 'FPO_AGGREGATION', count: fpoCount },
          { type: 'DIRECT_FARMER', count: farmerCount },
        ],
      },
    };
  }

  getPriceTrends(): PriceTrendDto[] {
    return this.priceTrends;
  }

  getCategories(): string[] {
    return [
      'Grains & Cereals',
      'Pulses & Legumes',
      'Oilseeds',
      'Commercial & Fiber Crops',
      'Spices & Condiments',
      'Fruits & Horticulture',
      'Vegetables',
    ];
  }
}
