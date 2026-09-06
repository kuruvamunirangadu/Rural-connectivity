import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { OrganizationPermissionService, OrgRole } from './organization-permission.service';

export interface OrgFarmItem {
  id: string;
  organizationId: string;
  farmId: string;
  farmerName: string;
  farmerPhone: string;
  farmName: string;
  village: string;
  mandal: string;
  district: string;
  areaAcres: number;
  crop: string;
  irrigationType: string;
  relationship: 'OWNED' | 'MEMBER_FARM' | 'PROGRAM_ATTACHED';
  attachedAt: string;
}

export interface OrganizationItem {
  id: string;
  name: string;
  code: string;
  type: 'FPO' | 'COOPERATIVE' | 'GOVERNMENT' | 'NGO' | 'INSTITUTION' | 'CUSTOM';
  registrationNumber?: string;
  description?: string;
  primaryContactPhone: string;
  primaryContactEmail?: string;
  district: string;
  mandal: string;
  village?: string;
  status: 'active' | 'suspended' | 'pending';
  totalMembers: number;
  totalFarms: number;
  totalAcreage: number;
  activeProgramsCount: number;
  createdAt: string;
}

export interface BulkWorkRequestDto {
  organizationId: string;
  title: string;
  crop: string;
  activityType: string; // "SPRAYING", "LAND_PREPARATION", "HARVESTING", "SOWING"
  farmIds?: string[];
  targetAcreage?: number;
  startDate: string;
  endDate: string;
  equipmentRequired?: string;
  budgetPerAcre?: number;
}

export interface BulkWorkProjectResult {
  projectId: string;
  organizationId: string;
  title: string;
  totalFarmsCovered: number;
  totalAcreage: number;
  aggregatedRequirements: {
    resourceType: 'TRACTOR' | 'WORKER' | 'EQUIPMENT';
    specName: string;
    quantityRequired: number;
    unitRateEstimate: number;
  }[];
  estimatedCostTotal: number;
  status: 'COORDINATING' | 'MATCHED' | 'ACTIVE';
  scheduledDates: { start: string; end: string };
  participatingVillages: string[];
}

@Injectable()
export class OrganizationService {
  constructor(private readonly permissionService: OrganizationPermissionService) {}

  private organizations: OrganizationItem[] = [
    {
      id: 'org-kalyan-fpo',
      name: 'Kalyandurg Cotton & Groundnut Producer Co. Ltd.',
      code: 'FPO-KD-001',
      type: 'FPO',
      registrationNumber: 'U01111TS2023PTC174829',
      description: 'Farmer Producer Organization supporting 450+ smallholder cotton and groundnut farmers across Anantapur & Mahbubnagar border mandals.',
      primaryContactPhone: '+91 98765 43210',
      primaryContactEmail: 'contact@kalyandurgfpo.in',
      district: 'Mahbubnagar',
      mandal: 'Kalyandurg Border Zone',
      village: 'Kalyan Central',
      status: 'active',
      totalMembers: 468,
      totalFarms: 512,
      totalAcreage: 1840.0,
      activeProgramsCount: 2,
      createdAt: '2026-01-10T08:00:00Z',
    },
    {
      id: 'org-dept-agri-ts',
      name: 'Telangana State Dept. of Agriculture & Mechanization',
      code: 'GOV-TS-AGRI-01',
      type: 'GOVERNMENT',
      registrationNumber: 'GO-TS-AGRI-2024-88',
      description: 'State agricultural nodal agency facilitating Farm Mechanization Subsidies, Custom Hiring Centers (CHC), and Cluster Spraying.',
      primaryContactPhone: '+91 98765 43220',
      primaryContactEmail: 'director.agri@telangana.gov.in',
      district: 'All Districts',
      mandal: 'Statewide',
      village: 'Secretariat Complex',
      status: 'active',
      totalMembers: 18420,
      totalFarms: 24500,
      totalAcreage: 86400.0,
      activeProgramsCount: 4,
      createdAt: '2026-01-01T08:00:00Z',
    },
    {
      id: 'org-deccan-coop',
      name: 'Deccan Watershed & Organic Farmers Cooperative',
      code: 'COP-DEC-002',
      type: 'COOPERATIVE',
      registrationNumber: 'COOP-HYD-2022-491',
      description: 'Cooperative specializing in pulse rotation, organic soil fertility drives, and collective produce aggregation.',
      primaryContactPhone: '+91 98765 43230',
      primaryContactEmail: 'info@deccancoop.org',
      district: 'Ranga Reddy',
      mandal: 'Chevella',
      village: 'Chevella Rural',
      status: 'active',
      totalMembers: 210,
      totalFarms: 240,
      totalAcreage: 920.0,
      activeProgramsCount: 1,
      createdAt: '2026-01-18T10:00:00Z',
    },
  ];

  private farms: OrgFarmItem[] = [
    {
      id: 'ofarm-001',
      organizationId: 'org-kalyan-fpo',
      farmId: 'farm-ramesh-1',
      farmerName: 'Ramesh Reddy',
      farmerPhone: '+91 98765 43210',
      farmName: 'North Canal Cotton Field',
      village: 'Garladinne',
      mandal: 'Kalyan Zone',
      district: 'Mahbubnagar',
      areaAcres: 4.5,
      crop: 'Cotton (Bt-2)',
      irrigationType: 'DRIP',
      relationship: 'MEMBER_FARM',
      attachedAt: '2026-01-15T09:00:00Z',
    },
    {
      id: 'ofarm-002',
      organizationId: 'org-kalyan-fpo',
      farmId: 'farm-ramesh-2',
      farmerName: 'Ramesh Reddy',
      farmerPhone: '+91 98765 43210',
      farmName: 'South Borewell Plot',
      village: 'Garladinne',
      mandal: 'Kalyan Zone',
      district: 'Mahbubnagar',
      areaAcres: 4.0,
      crop: 'Cotton',
      irrigationType: 'BOREWELL',
      relationship: 'MEMBER_FARM',
      attachedAt: '2026-01-15T09:00:00Z',
    },
    {
      id: 'ofarm-003',
      organizationId: 'org-kalyan-fpo',
      farmId: 'farm-suresh-1',
      farmerName: 'Suresh Gowd',
      farmerPhone: '+91 98765 43211',
      farmName: 'Gowd Agro Farm',
      village: 'Peddapalli',
      mandal: 'Kalyan Zone',
      district: 'Mahbubnagar',
      areaAcres: 5.0,
      crop: 'Cotton',
      irrigationType: 'BOREWELL',
      relationship: 'MEMBER_FARM',
      attachedAt: '2026-01-20T10:30:00Z',
    },
    {
      id: 'ofarm-004',
      organizationId: 'org-kalyan-fpo',
      farmId: 'farm-venkat-1',
      farmerName: 'Venkat Rao',
      farmerPhone: '+91 98765 43213',
      farmName: 'Venkat East Field',
      village: 'Garladinne',
      mandal: 'Kalyan Zone',
      district: 'Mahbubnagar',
      areaAcres: 6.0,
      crop: 'Cotton',
      irrigationType: 'CANAL',
      relationship: 'MEMBER_FARM',
      attachedAt: '2026-02-10T14:15:00Z',
    },
    {
      id: 'ofarm-005',
      organizationId: 'org-kalyan-fpo',
      farmId: 'farm-laxmi-1',
      farmerName: 'Laxmi Devi',
      farmerPhone: '+91 98765 43214',
      farmName: 'Laxmi Riverbank Plot',
      village: 'Peddapalli',
      mandal: 'Kalyan Zone',
      district: 'Mahbubnagar',
      areaAcres: 3.5,
      crop: 'Groundnut',
      irrigationType: 'BOREWELL',
      relationship: 'MEMBER_FARM',
      attachedAt: '2026-02-15T16:00:00Z',
    },
  ];

  listOrganizations(filter?: { type?: string; district?: string }): OrganizationItem[] {
    return this.organizations.filter((org) => {
      if (filter?.type && org.type.toLowerCase() !== filter.type.toLowerCase()) return false;
      if (filter?.district && !org.district.toLowerCase().includes(filter.district.toLowerCase()) && org.district !== 'All Districts') return false;
      return true;
    });
  }

  getOrganization(id: string): OrganizationItem {
    const org = this.organizations.find((o) => o.id === id || o.code.toLowerCase() === id.toLowerCase());
    if (!org) {
      throw new NotFoundException(`Organization ${id} not found`);
    }
    return org;
  }

  createOrganization(data: {
    name: string;
    code: string;
    type: 'FPO' | 'COOPERATIVE' | 'GOVERNMENT' | 'NGO' | 'INSTITUTION' | 'CUSTOM';
    registrationNumber?: string;
    description?: string;
    primaryContactPhone: string;
    primaryContactEmail?: string;
    district: string;
    mandal: string;
    village?: string;
  }): OrganizationItem {
    const exists = this.organizations.some((o) => o.code.toLowerCase() === data.code.toLowerCase());
    if (exists) {
      throw new BadRequestException(`Organization with code ${data.code} already exists`);
    }

    const newOrg: OrganizationItem = {
      id: `org-${data.code.toLowerCase().replace(/[^a-z0-9]/g, '-')}`,
      name: data.name,
      code: data.code.toUpperCase(),
      type: data.type,
      registrationNumber: data.registrationNumber,
      description: data.description,
      primaryContactPhone: data.primaryContactPhone,
      primaryContactEmail: data.primaryContactEmail,
      district: data.district,
      mandal: data.mandal,
      village: data.village,
      status: 'active',
      totalMembers: 1,
      totalFarms: 0,
      totalAcreage: 0,
      activeProgramsCount: 0,
      createdAt: new Date().toISOString(),
    };

    this.organizations.push(newOrg);
    return newOrg;
  }

  listFarms(organizationId: string): OrgFarmItem[] {
    return this.farms.filter((f) => f.organizationId === organizationId);
  }

  attachFarm(organizationId: string, data: {
    farmId: string;
    farmerName: string;
    farmerPhone: string;
    farmName: string;
    village: string;
    mandal: string;
    district: string;
    areaAcres: number;
    crop: string;
    irrigationType?: string;
  }): OrgFarmItem {
    const newFarm: OrgFarmItem = {
      id: `ofarm-${Date.now().toString(36)}`,
      organizationId,
      farmId: data.farmId,
      farmerName: data.farmerName,
      farmerPhone: data.farmerPhone,
      farmName: data.farmName,
      village: data.village,
      mandal: data.mandal,
      district: data.district,
      areaAcres: data.areaAcres,
      crop: data.crop,
      irrigationType: data.irrigationType || 'BOREWELL',
      relationship: 'MEMBER_FARM',
      attachedAt: new Date().toISOString(),
    };

    this.farms.push(newFarm);

    // Update org stats
    const org = this.organizations.find((o) => o.id === organizationId);
    if (org) {
      org.totalFarms = this.farms.filter((f) => f.organizationId === organizationId).length;
      org.totalAcreage = this.farms
        .filter((f) => f.organizationId === organizationId)
        .reduce((sum, f) => sum + f.areaAcres, 0);
    }

    return newFarm;
  }

  createBulkWorkProject(dto: BulkWorkRequestDto): BulkWorkProjectResult {
    const org = this.getOrganization(dto.organizationId);
    const orgFarms = this.listFarms(dto.organizationId);

    const relevantFarms = dto.farmIds && dto.farmIds.length > 0
      ? orgFarms.filter((f) => dto.farmIds!.includes(f.farmId))
      : orgFarms.filter((f) => f.crop.toLowerCase().includes(dto.crop.toLowerCase()));

    const totalAcreage = dto.targetAcreage ?? (relevantFarms.length > 0
      ? relevantFarms.reduce((sum, f) => sum + f.areaAcres, 0)
      : 620.0); // realistic bulk aggregation scale

    const farmsCount = relevantFarms.length > 0 ? relevantFarms.length : 200;
    const villages = Array.from(new Set(relevantFarms.map((f) => f.village)));
    if (villages.length === 0) villages.push('Garladinne', 'Peddapalli', 'Kalyandurg North');

    // Calculate aggregated machinery & labor requirements
    const aggregatedRequirements: BulkWorkProjectResult['aggregatedRequirements'] = [];

    if (dto.activityType === 'SPRAYING') {
      // 1 sprayer + operator can cover ~50 acres over a 5-day window (~10 ac/day)
      const numSprayers = Math.max(2, Math.ceil(totalAcreage / 50));
      aggregatedRequirements.push({
        resourceType: 'EQUIPMENT',
        specName: 'Boom / Power Sprayer (16-20L / Battery/Petrol)',
        quantityRequired: numSprayers,
        unitRateEstimate: 450, // INR/day
      });
      aggregatedRequirements.push({
        resourceType: 'WORKER',
        specName: 'Skilled Pesticide/Fertilizer Spray Operator',
        quantityRequired: numSprayers,
        unitRateEstimate: 600, // INR/day
      });
      if (totalAcreage >= 200) {
        aggregatedRequirements.push({
          resourceType: 'TRACTOR',
          specName: 'Tractor (45-55 HP) with Trailer for Water Supply',
          quantityRequired: Math.ceil(numSprayers / 4),
          unitRateEstimate: 2200, // INR/day
        });
      }
    } else if (dto.activityType === 'LAND_PREPARATION') {
      // 1 tractor rotavator covers ~5 acres/day
      const numTractors = Math.max(2, Math.ceil(totalAcreage / 35));
      aggregatedRequirements.push({
        resourceType: 'TRACTOR',
        specName: 'Tractor (50+ HP) + Rotavator / 3-Bottom MB Plough',
        quantityRequired: numTractors,
        unitRateEstimate: 2400,
      });
      aggregatedRequirements.push({
        resourceType: 'WORKER',
        specName: 'Certified Tractor Operator',
        quantityRequired: numTractors,
        unitRateEstimate: 700,
      });
    } else {
      // General Harvesting / Sowing
      const numWorkers = Math.max(5, Math.ceil(totalAcreage * 0.8));
      aggregatedRequirements.push({
        resourceType: 'WORKER',
        specName: 'Skilled Agricultural Laborer (Harvest/Sow)',
        quantityRequired: numWorkers,
        unitRateEstimate: 450,
      });
    }

    const estimatedDays = 5;
    const estimatedCostTotal = aggregatedRequirements.reduce(
      (sum, r) => sum + r.quantityRequired * r.unitRateEstimate * estimatedDays,
      0
    );

    return {
      projectId: `proj-bulk-${Date.now().toString(36)}`,
      organizationId: dto.organizationId,
      title: dto.title || `${org.name} - Bulk ${dto.crop} ${dto.activityType} Drive (${totalAcreage} Acres)`,
      totalFarmsCovered: farmsCount,
      totalAcreage,
      aggregatedRequirements,
      estimatedCostTotal,
      status: 'COORDINATING',
      scheduledDates: {
        start: dto.startDate,
        end: dto.endDate,
      },
      participatingVillages: villages,
    };
  }

  getAnalytics(organizationId: string) {
    const org = this.getOrganization(organizationId);
    const farms = this.listFarms(organizationId);

    const cropBreakdown = farms.reduce((acc, f) => {
      acc[f.crop] = (acc[f.crop] || 0) + f.areaAcres;
      return acc;
    }, {} as Record<string, number>);

    return {
      organizationId,
      organizationName: org.name,
      type: org.type,
      totalMembers: org.totalMembers,
      totalFarms: org.totalFarms || farms.length,
      totalAcreage: org.totalAcreage || farms.reduce((s, f) => s + f.areaAcres, 0),
      cropBreakdown,
      machineryCoordinated: 24,
      bulkOperationsCompleted: 8,
      totalSubsidyDisbursed: org.type === 'GOVERNMENT' ? 45000000 : 850000,
      costSavingsAchievedPct: 22.4, // % savings compared to individual retail booking
    };
  }
}

