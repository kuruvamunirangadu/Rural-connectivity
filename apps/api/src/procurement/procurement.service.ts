import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { SupplierQuoteService, SupplierQuoteItem } from './quote.service';

export interface ProcurementRequirementItem {
  id: string;
  procurementId: string;
  itemCategory: string; // 'FERTILIZER', 'SEED', 'PESTICIDE', 'EQUIPMENT', 'CUSTOM'
  itemName: string;
  quantity: number;
  unit: string;
  specifications?: string;
  estimatedBudget: number;
}

export interface ProcurementRequestItem {
  id: string;
  code: string;
  organizationId: string;
  organizationName: string;
  title: string;
  description?: string;
  targetBudget: number;
  deliveryDistrict: string;
  deliveryMandal: string;
  deliveryVillage: string;
  status: 'DRAFT' | 'OPEN' | 'QUOTED' | 'AWARDED' | 'IN_PROGRESS' | 'FULFILLED' | 'CANCELLED';
  biddingDeadline: string;
  requirements: ProcurementRequirementItem[];
  quotesCount: number;
  winningQuoteId?: string;
  winningSupplierName?: string;
  createdAt: string;
}

@Injectable()
export class ProcurementService {
  constructor(private readonly quoteService: SupplierQuoteService) {}

  private procurements: ProcurementRequestItem[] = [
    {
      id: 'proc-kd-fert-01',
      code: 'PROC-2026-KD-FERT-01',
      organizationId: 'org-kalyan-fpo',
      organizationName: 'Kalyandurg Cotton & Groundnut Producer Co. Ltd.',
      title: 'Bulk Monsoon Fertilizer Supply (1200 Bags Neem Coated Urea + DAP)',
      description: 'Collective FPO input procurement for 450+ cotton farmers ahead of Kharif sowing window.',
      targetBudget: 350000,
      deliveryDistrict: 'Mahbubnagar',
      deliveryMandal: 'Kalyan Zone',
      deliveryVillage: 'Kalyan FPO Central Godown',
      status: 'QUOTED',
      biddingDeadline: '2026-06-30T18:00:00Z',
      requirements: [
        {
          id: 'preq-001',
          procurementId: 'proc-kd-fert-01',
          itemCategory: 'FERTILIZER',
          itemName: 'Neem Coated Urea (45kg Bag)',
          quantity: 800,
          unit: 'bags',
          specifications: 'Government approved standard urea with 46% Nitrogen content',
          estimatedBudget: 213000,
        },
        {
          id: 'preq-002',
          procurementId: 'proc-kd-fert-01',
          itemCategory: 'FERTILIZER',
          itemName: 'Di-Ammonium Phosphate (DAP 50kg)',
          quantity: 400,
          unit: 'bags',
          specifications: '18:46:0 composition, tamper-proof sealed bags',
          estimatedBudget: 137000,
        },
      ],
      quotesCount: 3,
      createdAt: '2026-02-15T09:00:00Z',
    },
    {
      id: 'proc-ts-sprayers-02',
      code: 'PROC-2026-TS-SPRAY-02',
      organizationId: 'org-dept-agri-ts',
      organizationName: 'Telangana State Dept. of Agriculture & Mechanization',
      title: 'Institutional Procurement of 50 High-Pressure Battery Sprayers',
      description: 'Departmental scheme to equip Village Custom Hiring Centers across 3 districts.',
      targetBudget: 175000,
      deliveryDistrict: 'Mahbubnagar',
      deliveryMandal: 'District Agri Office Depot',
      deliveryVillage: 'Mahbubnagar HQ',
      status: 'OPEN',
      biddingDeadline: '2026-07-15T18:00:00Z',
      requirements: [
        {
          id: 'preq-003',
          procurementId: 'proc-ts-sprayers-02',
          itemCategory: 'EQUIPMENT',
          itemName: '16-Litre 12V Battery Sprayer with Dual Nozzle & Telescopic Lance',
          quantity: 50,
          unit: 'units',
          specifications: '12V 12Ah lead-acid or lithium battery with ISI certification',
          estimatedBudget: 175000,
        },
      ],
      quotesCount: 0,
      createdAt: '2026-02-18T11:00:00Z',
    },
  ];

  listProcurements(filter?: { organizationId?: string; status?: string }): ProcurementRequestItem[] {
    return this.procurements.filter((p) => {
      if (filter?.organizationId && p.organizationId !== filter.organizationId) return false;
      if (filter?.status && p.status.toLowerCase() !== filter.status.toLowerCase()) return false;
      return true;
    });
  }

  getProcurement(id: string): ProcurementRequestItem {
    const proc = this.procurements.find((p) => p.id === id || p.code.toLowerCase() === id.toLowerCase());
    if (!proc) {
      throw new NotFoundException(`Procurement RFP ${id} not found`);
    }
    return proc;
  }

  createProcurement(data: {
    organizationId: string;
    organizationName?: string;
    code: string;
    title: string;
    description?: string;
    targetBudget: number;
    deliveryDistrict: string;
    deliveryMandal: string;
    deliveryVillage?: string;
    biddingDeadline: string;
    requirements: Omit<ProcurementRequirementItem, 'id' | 'procurementId'>[];
  }): ProcurementRequestItem {
    const exists = this.procurements.some((p) => p.code.toLowerCase() === data.code.toLowerCase());
    if (exists) {
      throw new BadRequestException(`Procurement RFP with code ${data.code} already exists`);
    }

    const procId = `proc-${data.code.toLowerCase().replace(/[^a-z0-9]/g, '-')}`;
    const reqs: ProcurementRequirementItem[] = data.requirements.map((r, i) => ({
      id: `preq-${Date.now().toString(36)}-${i}`,
      procurementId: procId,
      ...r,
    }));

    const newProc: ProcurementRequestItem = {
      id: procId,
      code: data.code.toUpperCase(),
      organizationId: data.organizationId,
      organizationName: data.organizationName || 'Agricultural Producer Organization',
      title: data.title,
      description: data.description,
      targetBudget: data.targetBudget,
      deliveryDistrict: data.deliveryDistrict,
      deliveryMandal: data.deliveryMandal,
      deliveryVillage: data.deliveryVillage || 'Central Village Warehouse',
      status: 'OPEN',
      biddingDeadline: data.biddingDeadline,
      requirements: reqs,
      quotesCount: 0,
      createdAt: new Date().toISOString(),
    };

    this.procurements.push(newProc);
    return newProc;
  }

  awardProcurement(procurementId: string, quoteId: string): ProcurementRequestItem {
    const proc = this.getProcurement(procurementId);
    const acceptedQuote = this.quoteService.acceptQuote(procurementId, quoteId);

    proc.status = 'AWARDED';
    proc.winningQuoteId = quoteId;
    proc.winningSupplierName = acceptedQuote.supplierName;

    return proc;
  }
}

