import { Injectable, NotFoundException } from '@nestjs/common';

export interface FinancingProductDto {
  id: string;
  partnerId: string;
  partnerName: string;
  name: string;
  code: string;
  purpose: 'INPUT_PURCHASE' | 'EQUIPMENT' | 'TRACTOR' | 'WORKING_CAPITAL' | 'CROP_ACTIVITY' | 'TRANSPORT' | 'OTHER';
  minAmount: number;
  maxAmount: number;
  currency: string;
  minTenureMonths: number;
  maxTenureMonths: number;
  indicativeInterestRate: number; // e.g. 7.5%
  status: 'ACTIVE' | 'INACTIVE';
  description: string;
}

export interface FinancialPartnerDto {
  id: string;
  partnerType: 'BANK' | 'NBFC' | 'COOPERATIVE' | 'MICROFINANCE' | 'INSURANCE_PROVIDER' | 'OTHER_REGULATED_ENTITY';
  name: string;
  registrationNumber?: string;
  verificationStatus: 'VERIFIED' | 'GOLD' | 'PLATINUM';
  status: 'ACTIVE' | 'INACTIVE';
  apiEndpoint?: string;
  contactEmail?: string;
  products: FinancingProductDto[];
}

@Injectable()
export class FinancialPartnerService {
  private partners: FinancialPartnerDto[] = [
    {
      id: 'prt-sbi-agri',
      partnerType: 'BANK',
      name: 'State Bank of India (Rural & Agri Banking)',
      registrationNumber: 'RBI-PSB-001',
      verificationStatus: 'PLATINUM',
      status: 'ACTIVE',
      contactEmail: 'agri.support@sbi.co.in',
      products: [
        {
          id: 'prod-sbi-kcc-01',
          partnerId: 'prt-sbi-agri',
          partnerName: 'State Bank of India',
          name: 'Kisan Seasonal Crop Working Capital',
          code: 'SBI-KCC-SEASONAL',
          purpose: 'WORKING_CAPITAL',
          minAmount: 15000,
          maxAmount: 300000,
          currency: 'INR',
          minTenureMonths: 6,
          maxTenureMonths: 18,
          indicativeInterestRate: 7.0,
          status: 'ACTIVE',
          description: 'Subsidized seasonal crop production loan tied to verified land acreage and harvesting cycle.',
        },
        {
          id: 'prod-sbi-mach-02',
          partnerId: 'prt-sbi-agri',
          partnerName: 'State Bank of India',
          name: 'Farm Mechanization & Tractor Term Loan',
          code: 'SBI-TRACTOR-TERM',
          purpose: 'TRACTOR',
          minAmount: 100000,
          maxAmount: 1200000,
          currency: 'INR',
          minTenureMonths: 12,
          maxTenureMonths: 60,
          indicativeInterestRate: 8.75,
          status: 'ACTIVE',
          description: 'Medium-term asset financing for tractors, rotavators, power sprayers, and combine harvesters.',
        },
      ],
    },
    {
      id: 'prt-nabard-pacs',
      partnerType: 'COOPERATIVE',
      name: 'NABARD / Primary Agricultural Credit Society (PACS)',
      registrationNumber: 'NABARD-COOP-882',
      verificationStatus: 'GOLD',
      status: 'ACTIVE',
      contactEmail: 'pacs.credit@nabard.org',
      products: [
        {
          id: 'prod-pacs-input-03',
          partnerId: 'prt-nabard-pacs',
          partnerName: 'NABARD PACS',
          name: 'Direct Agri-Input Purchase Line',
          code: 'PACS-INPUT-LINE',
          purpose: 'INPUT_PURCHASE',
          minAmount: 5000,
          maxAmount: 100000,
          currency: 'INR',
          minTenureMonths: 3,
          maxTenureMonths: 12,
          indicativeInterestRate: 4.0, // Subsidized rate
          status: 'ACTIVE',
          description: 'Zero-collateral micro-line disbursed directly to verified fertilizer and seed input suppliers.',
        },
      ],
    },
    {
      id: 'prt-icici-rural',
      partnerType: 'BANK',
      name: 'ICICI Bank Rural & Inclusive Banking',
      registrationNumber: 'RBI-PVT-004',
      verificationStatus: 'PLATINUM',
      status: 'ACTIVE',
      contactEmail: 'rural.lending@icicibank.com',
      products: [
        {
          id: 'prod-icici-b2b-04',
          partnerId: 'prt-icici-rural',
          partnerName: 'ICICI Bank',
          name: 'FPO / Post-Harvest Warehouse Receipt Loan',
          code: 'ICICI-WHR-POSTHARVEST',
          purpose: 'CROP_ACTIVITY',
          minAmount: 50000,
          maxAmount: 2000000,
          currency: 'INR',
          minTenureMonths: 3,
          maxTenureMonths: 12,
          indicativeInterestRate: 8.25,
          status: 'ACTIVE',
          description: 'Liquidity financing against pledged harvested produce stored in verified FPO aggregation warehouses.',
        },
      ],
    },
  ];

  listPartners(): FinancialPartnerDto[] {
    return this.partners;
  }

  getPartner(id: string): FinancialPartnerDto {
    const partner = this.partners.find((p) => p.id === id);
    if (!partner) {
      throw new NotFoundException(`Financial Partner ${id} not found`);
    }
    return partner;
  }

  listProducts(filter?: { purpose?: string; partnerId?: string }): FinancingProductDto[] {
    const allProducts = this.partners.flatMap((p) => p.products);
    return allProducts.filter((p) => {
      if (filter?.purpose && p.purpose !== filter.purpose) return false;
      if (filter?.partnerId && p.partnerId !== filter.partnerId) return false;
      return true;
    });
  }

  getProduct(id: string): FinancingProductDto {
    const product = this.partners.flatMap((p) => p.products).find((p) => p.id === id);
    if (!product) {
      throw new NotFoundException(`Financing product ${id} not found`);
    }
    return product;
  }
}
