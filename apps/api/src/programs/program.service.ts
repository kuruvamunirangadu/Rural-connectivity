import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { ProgramParticipantService } from './participant.service';
import { ProgramLocationService } from './location.service';

export interface ProgramItem {
  id: string;
  organizationId: string;
  organizationName: string;
  code: string;
  name: string;
  description?: string;
  type: 'GOVERNMENT_SUBSIDY' | 'FPO_SCHEME' | 'NGO_INITIATIVE' | 'SEASONAL_DRIVE' | 'EQUIPMENT_MECHANIZATION';
  status: 'DRAFT' | 'ACTIVE' | 'PAUSED' | 'COMPLETED' | 'ARCHIVED';
  budgetTotal: number; // INR
  budgetSpent: number; // INR
  subsidyRate: number; // percentage, e.g. 50%
  startDate: string;
  endDate: string;
  totalBeneficiariesTarget: number;
  totalBeneficiariesEnrolled: number;
  machineryDeployed: number;
  districtsCovered: string[];
  createdAt: string;
}

@Injectable()
export class ProgramService {
  constructor(
    private readonly participantService: ProgramParticipantService,
    private readonly locationService: ProgramLocationService
  ) {}

  private programs: ProgramItem[] = [
    {
      id: 'prg-tel-mech-2026',
      organizationId: 'org-dept-agri-ts',
      organizationName: 'Telangana State Dept. of Agriculture & Mechanization',
      code: 'PRG-TEL-2026-FARM-MECH',
      name: 'Telangana Farm Mechanization & Cluster Spraying Scheme 2026',
      description: '50% direct subsidy for small & marginal farmers on tractor tilling, drone/boom spraying, and rotavator operations across 3 high-priority districts.',
      type: 'GOVERNMENT_SUBSIDY',
      status: 'ACTIVE',
      budgetTotal: 50000000, // 5 Crore INR
      budgetSpent: 18450000, // 1.845 Crore spent
      subsidyRate: 50.0,
      startDate: '2026-01-01T00:00:00Z',
      endDate: '2026-12-31T23:59:59Z',
      totalBeneficiariesTarget: 25000,
      totalBeneficiariesEnrolled: 18420,
      machineryDeployed: 420,
      districtsCovered: ['Mahbubnagar', 'Ranga Reddy', 'Sangareddy'],
      createdAt: '2026-01-01T08:00:00Z',
    },
    {
      id: 'prg-kd-cotton-2026',
      organizationId: 'org-kalyan-fpo',
      organizationName: 'Kalyandurg Cotton & Groundnut Producer Co. Ltd.',
      code: 'PRG-FPO-KD-COTTON-SPRAY',
      name: 'Kalyandurg Monsoon Cotton Integrated Pest Spraying Drive',
      description: 'FPO collective bulk spraying program covering 620+ acres of member cotton fields with synchronized 12-sprayer brigade.',
      type: 'FPO_SCHEME',
      status: 'ACTIVE',
      budgetTotal: 1200000, // 12 Lakhs
      budgetSpent: 540000,
      subsidyRate: 25.0, // 25% FPO member rebate
      startDate: '2026-06-01T00:00:00Z',
      endDate: '2026-09-30T23:59:59Z',
      totalBeneficiariesTarget: 250,
      totalBeneficiariesEnrolled: 212,
      machineryDeployed: 12,
      districtsCovered: ['Mahbubnagar'],
      createdAt: '2026-01-15T09:00:00Z',
    },
    {
      id: 'prg-dec-organic-2026',
      organizationId: 'org-deccan-coop',
      organizationName: 'Deccan Watershed & Organic Farmers Cooperative',
      code: 'PRG-COOP-ORG-SOIL',
      name: 'Chevella Watershed Bio-Fertilizer & Soil Rejuvenation Drive',
      description: 'Cooperative soil health program supplying subsidized bio-inputs and laser land leveling for 120 member farms.',
      type: 'SEASONAL_DRIVE',
      status: 'ACTIVE',
      budgetTotal: 850000,
      budgetSpent: 320000,
      subsidyRate: 30.0,
      startDate: '2026-05-01T00:00:00Z',
      endDate: '2026-10-31T23:59:59Z',
      totalBeneficiariesTarget: 150,
      totalBeneficiariesEnrolled: 118,
      machineryDeployed: 6,
      districtsCovered: ['Ranga Reddy'],
      createdAt: '2026-01-20T11:00:00Z',
    },
  ];

  listPrograms(filter?: { organizationId?: string; status?: string; type?: string }): ProgramItem[] {
    return this.programs.filter((p) => {
      if (filter?.organizationId && p.organizationId !== filter.organizationId) return false;
      if (filter?.status && p.status.toLowerCase() !== filter.status.toLowerCase()) return false;
      if (filter?.type && p.type.toLowerCase() !== filter.type.toLowerCase()) return false;
      return true;
    });
  }

  getProgram(id: string): ProgramItem {
    const prog = this.programs.find((p) => p.id === id || p.code.toLowerCase() === id.toLowerCase());
    if (!prog) {
      throw new NotFoundException(`Program ${id} not found`);
    }
    return prog;
  }

  createProgram(data: {
    organizationId: string;
    organizationName?: string;
    code: string;
    name: string;
    description?: string;
    type: 'GOVERNMENT_SUBSIDY' | 'FPO_SCHEME' | 'NGO_INITIATIVE' | 'SEASONAL_DRIVE' | 'EQUIPMENT_MECHANIZATION';
    budgetTotal: number;
    subsidyRate: number;
    startDate: string;
    endDate: string;
    totalBeneficiariesTarget?: number;
    districtsCovered?: string[];
  }): ProgramItem {
    const exists = this.programs.some((p) => p.code.toLowerCase() === data.code.toLowerCase());
    if (exists) {
      throw new BadRequestException(`Program with code ${data.code} already exists`);
    }

    const newProg: ProgramItem = {
      id: `prg-${data.code.toLowerCase().replace(/[^a-z0-9]/g, '-')}`,
      organizationId: data.organizationId,
      organizationName: data.organizationName || 'Institutional Partner',
      code: data.code.toUpperCase(),
      name: data.name,
      description: data.description,
      type: data.type,
      status: 'ACTIVE',
      budgetTotal: data.budgetTotal,
      budgetSpent: 0,
      subsidyRate: data.subsidyRate,
      startDate: data.startDate,
      endDate: data.endDate,
      totalBeneficiariesTarget: data.totalBeneficiariesTarget || 100,
      totalBeneficiariesEnrolled: 0,
      machineryDeployed: 0,
      districtsCovered: data.districtsCovered || ['Mahbubnagar'],
      createdAt: new Date().toISOString(),
    };

    this.programs.push(newProg);
    return newProg;
  }

  getProgramMetrics(programId: string) {
    const prog = this.getProgram(programId);
    const participants = this.participantService.listParticipants(programId);
    const locations = this.locationService.getLocationsByProgram(programId);

    const budgetUtilizationPct = prog.budgetTotal > 0
      ? Number(((prog.budgetSpent / prog.budgetTotal) * 100).toFixed(1))
      : 0;

    const enrollmentPct = prog.totalBeneficiariesTarget > 0
      ? Number(((prog.totalBeneficiariesEnrolled / prog.totalBeneficiariesTarget) * 100).toFixed(1))
      : 0;

    return {
      programId: prog.id,
      code: prog.code,
      name: prog.name,
      status: prog.status,
      budgetTotal: prog.budgetTotal,
      budgetSpent: prog.budgetSpent,
      budgetRemaining: prog.budgetTotal - prog.budgetSpent,
      budgetUtilizationPct,
      subsidyRate: prog.subsidyRate,
      totalBeneficiariesTarget: prog.totalBeneficiariesTarget,
      totalBeneficiariesEnrolled: prog.totalBeneficiariesEnrolled,
      enrollmentPct,
      machineryDeployed: prog.machineryDeployed,
      districtsCovered: prog.districtsCovered,
      locations,
      participantsSummary: {
        totalEnrolled: participants.length,
        approved: participants.filter((p) => p.status === 'approved').length,
        disbursed: participants.filter((p) => p.status === 'disbursed').length,
        pending: participants.filter((p) => p.status === 'enrolled').length,
      },
    };
  }
}

