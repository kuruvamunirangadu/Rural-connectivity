import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';

export interface ActivityTemplateItem {
  id: string;
  cropName: string;
  activityType: string;
  name: string;
  description: string;
  sequence: number;
  defaultDayOffset: number; // Days after planting date
  defaultRequirements: Array<{
    resourceType: 'TRACTOR' | 'WORKER' | 'EQUIPMENT' | 'PRODUCT';
    quantity: number;
    tractorHpMin?: number;
    attachmentType?: string;
    skillId?: string;
    equipmentType?: string;
    productCategory?: string;
    productName?: string;
    notes?: string;
  }>;
  isActive: boolean;
}

export const SEED_TEMPLATES: ActivityTemplateItem[] = [
  // --- COTTON TEMPLATES ---
  {
    id: 'tmpl-cotton-1',
    cropName: 'Cotton',
    activityType: 'LAND_PREPARATION',
    name: 'Land Preparation & Tilling',
    description: 'Deep ploughing and rotavator pulverization to prepare ideal seed bed.',
    sequence: 1,
    defaultDayOffset: -15, // 15 days before sowing
    defaultRequirements: [
      { resourceType: 'TRACTOR', quantity: 1, tractorHpMin: 45, attachmentType: 'ROTAVATOR', notes: '45+ HP tractor with rotavator implement' },
    ],
    isActive: true,
  },
  {
    id: 'tmpl-cotton-2',
    cropName: 'Cotton',
    activityType: 'SOWING',
    name: 'Precision Sowing',
    description: 'Line sowing with calibrated seed drill and basal fertilizer application.',
    sequence: 2,
    defaultDayOffset: 0, // Day 0
    defaultRequirements: [
      { resourceType: 'TRACTOR', quantity: 1, tractorHpMin: 45, attachmentType: 'SEED_DRILL', notes: 'Tractor mounted seed drill' },
      { resourceType: 'PRODUCT', quantity: 5, productCategory: 'SEED', productName: 'Bt-Cotton Hybrid Seeds', notes: '5 packets per 5 acres' },
    ],
    isActive: true,
  },
  {
    id: 'tmpl-cotton-3',
    cropName: 'Cotton',
    activityType: 'IRRIGATION',
    name: 'First Irrigation Cycle',
    description: 'Furrow irrigation to support germination and seedling establishment.',
    sequence: 3,
    defaultDayOffset: 12,
    defaultRequirements: [
      { resourceType: 'EQUIPMENT', quantity: 1, equipmentType: 'PUMP', notes: '7.5 HP Agricultural water pump' },
      { resourceType: 'WORKER', quantity: 1, skillId: 'IRRIGATION_WORKER', notes: 'Skilled irrigation worker for furrow channels' },
    ],
    isActive: true,
  },
  {
    id: 'tmpl-cotton-4',
    cropName: 'Cotton',
    activityType: 'SPRAYING',
    name: 'Protective Agrochemical Spraying',
    description: 'Calibrated crop protection spray against sucking pests and bollworm.',
    sequence: 4,
    defaultDayOffset: 35,
    defaultRequirements: [
      { resourceType: 'EQUIPMENT', quantity: 1, equipmentType: 'SPRAYER', notes: '500L Power Sprayer' },
      { resourceType: 'WORKER', quantity: 1, skillId: 'SPRAYER_OPERATOR', notes: 'Certified sprayer operator' },
    ],
    isActive: true,
  },
  {
    id: 'tmpl-cotton-5',
    cropName: 'Cotton',
    activityType: 'FERTILIZATION',
    name: 'Top Dressing Fertilization',
    description: 'Secondary nitrogenous top dressing for vegetative branching and boll formation.',
    sequence: 5,
    defaultDayOffset: 50,
    defaultRequirements: [
      { resourceType: 'PRODUCT', quantity: 5, productCategory: 'FERTILIZER', productName: 'Urea 46% N', notes: '5 bags for 5 acres' },
      { resourceType: 'WORKER', quantity: 2, skillId: 'GENERAL_AGRICULTURAL_WORKER', notes: 'Manual fertilizer broadcasting' },
    ],
    isActive: true,
  },
  {
    id: 'tmpl-cotton-6',
    cropName: 'Cotton',
    activityType: 'WEEDING',
    name: 'Inter-cultivation & Manual Weeding',
    description: 'Inter-row cultivation and root aerating to suppress weeds.',
    sequence: 6,
    defaultDayOffset: 65,
    defaultRequirements: [
      { resourceType: 'WORKER', quantity: 4, skillId: 'GENERAL_AGRICULTURAL_WORKER', notes: 'Field weeding labor team' },
    ],
    isActive: true,
  },
  {
    id: 'tmpl-cotton-7',
    cropName: 'Cotton',
    activityType: 'HARVESTING',
    name: 'First Cotton Picking / Harvest',
    description: 'Manual picking of mature open bolls and temporary bagging.',
    sequence: 7,
    defaultDayOffset: 120,
    defaultRequirements: [
      { resourceType: 'WORKER', quantity: 6, skillId: 'GENERAL_AGRICULTURAL_WORKER', notes: 'Experienced cotton pickers' },
    ],
    isActive: true,
  },
];

@Injectable()
export class FarmPlansService {
  private seasons = [
    { id: 'cs-kharif-2026', name: 'Kharif 2026', year: 2026, seasonType: 'KHARIF', startDate: '2026-06-01', endDate: '2026-11-30' },
    { id: 'cs-rabi-2026', name: 'Rabi 2026-27', year: 2026, seasonType: 'RABI', startDate: '2026-10-15', endDate: '2027-03-31' },
  ];

  private farmCrops = [
    {
      id: 'fcrop-001',
      farmId: 'farm-001',
      cropName: 'Cotton',
      cropVariety: 'Bt Cotton (RCH-659)',
      area: 5.0,
      areaUnit: 'ACRE',
      seasonId: 'cs-kharif-2026',
      plantingDate: '2026-06-20',
      expectedHarvestDate: '2026-11-15',
      status: 'ACTIVE',
    },
  ];

  private farmPlans = [
    {
      id: 'plan-001',
      farmId: 'farm-001',
      farmCropId: 'fcrop-001',
      name: "Ravi's Kharif Cotton Plan 2026",
      seasonId: 'cs-kharif-2026',
      startDate: '2026-06-05',
      endDate: '2026-11-30',
      status: 'ACTIVE',
      createdById: 'usr-ravi-001',
      createdAt: new Date(),
    },
  ];

  private farmActivities: any[] = [];
  private templates: ActivityTemplateItem[] = [...SEED_TEMPLATES];

  // 1. Seasons
  async createSeason(dto: any) {
    const season = {
      id: `cs-${Date.now()}`,
      name: dto.name || 'Season',
      year: Number(dto.year) || 2026,
      seasonType: dto.seasonType || 'KHARIF',
      startDate: dto.startDate || '2026-06-01',
      endDate: dto.endDate || '2026-11-30',
    };
    this.seasons.push(season);
    return season;
  }

  async getSeasons() {
    return this.seasons;
  }

  async getSeasonById(id: string) {
    const s = this.seasons.find((item) => item.id === id);
    if (!s) throw new NotFoundException(`CropSeason ${id} not found`);
    return s;
  }

  async updateSeason(id: string, dto: any) {
    const s = await this.getSeasonById(id);
    Object.assign(s, dto);
    return s;
  }

  async deleteSeason(id: string) {
    this.seasons = this.seasons.filter((item) => item.id !== id);
    return { success: true, deletedId: id };
  }

  // 2. Farm Crops
  async addFarmCrop(farmId: string, dto: any) {
    const newCrop = {
      id: `fcrop-${Date.now()}`,
      farmId,
      cropName: dto.cropName || 'Cotton',
      cropVariety: dto.cropVariety || 'Hybrid Standard',
      area: Number(dto.area) || 5.0,
      areaUnit: dto.areaUnit || 'ACRE',
      seasonId: dto.seasonId || 'cs-kharif-2026',
      plantingDate: dto.plantingDate || '2026-06-20',
      expectedHarvestDate: dto.expectedHarvestDate || '2026-11-15',
      status: 'ACTIVE',
    };
    this.farmCrops.push(newCrop);
    return newCrop;
  }

  async getFarmCrops(farmId: string) {
    return this.farmCrops.filter((c) => c.farmId === farmId);
  }

  async getFarmCropById(id: string) {
    const c = this.farmCrops.find((item) => item.id === id);
    if (!c) throw new NotFoundException(`FarmCrop ${id} not found`);
    return c;
  }

  async updateFarmCrop(id: string, dto: any) {
    const c = await this.getFarmCropById(id);
    Object.assign(c, dto);
    return c;
  }

  async deleteFarmCrop(id: string) {
    this.farmCrops = this.farmCrops.filter((item) => item.id !== id);
    return { success: true, deletedId: id };
  }

  // 3. Farm Plans
  async createPlan(dto: any) {
    const newPlan = {
      id: `plan-${Date.now()}`,
      farmId: dto.farmId || 'farm-001',
      farmCropId: dto.farmCropId || 'fcrop-001',
      name: dto.name || 'Seasonal Farm Plan',
      seasonId: dto.seasonId || 'cs-kharif-2026',
      startDate: dto.startDate || '2026-06-05',
      endDate: dto.endDate || '2026-11-30',
      status: 'ACTIVE',
      createdById: dto.createdById || 'usr-ravi-001',
      createdAt: new Date(),
    };
    this.farmPlans.push(newPlan);
    return newPlan;
  }

  async getPlans(farmId?: string) {
    if (farmId) return this.farmPlans.filter((p) => p.farmId === farmId);
    return this.farmPlans;
  }

  async getPlanById(id: string) {
    const p = this.farmPlans.find((item) => item.id === id);
    if (!p) throw new NotFoundException(`FarmPlan ${id} not found`);
    const activities = this.farmActivities.filter((a) => a.farmPlanId === id);
    return { ...p, activities };
  }

  async updatePlan(id: string, dto: any) {
    const p = this.farmPlans.find((item) => item.id === id);
    if (!p) throw new NotFoundException(`FarmPlan ${id} not found`);
    Object.assign(p, dto);
    return p;
  }

  async deletePlan(id: string) {
    this.farmPlans = this.farmPlans.filter((item) => item.id !== id);
    this.farmActivities = this.farmActivities.filter((a) => a.farmPlanId !== id);
    return { success: true, deletedId: id };
  }

  // 4. Activity Templates & Generation
  async getTemplates(cropName?: string) {
    if (cropName) {
      return this.templates.filter((t) => t.cropName.toLowerCase() === cropName.toLowerCase() && t.isActive);
    }
    return this.templates.filter((t) => t.isActive);
  }

  async getTemplateById(id: string) {
    const t = this.templates.find((item) => item.id === id);
    if (!t) throw new NotFoundException(`ActivityTemplate ${id} not found`);
    return t;
  }

  async createTemplate(dto: any) {
    const newTmpl: ActivityTemplateItem = {
      id: `tmpl-${Date.now()}`,
      cropName: dto.cropName || 'Cotton',
      activityType: dto.activityType || 'LAND_PREPARATION',
      name: dto.name || 'Activity Name',
      description: dto.description || '',
      sequence: Number(dto.sequence) || 1,
      defaultDayOffset: Number(dto.defaultDayOffset) || 0,
      defaultRequirements: dto.defaultRequirements || [],
      isActive: true,
    };
    this.templates.push(newTmpl);
    return newTmpl;
  }

  async generateActivitiesFromTemplates(planId: string, farmCropId: string) {
    const plan = await this.getPlanById(planId);
    const crop = await this.getFarmCropById(farmCropId);

    // Prevent duplicate generation for same plan
    const existing = this.farmActivities.filter((a) => a.farmPlanId === planId);
    if (existing.length > 0) {
      return {
        message: 'Activities already generated for this plan.',
        activities: existing,
      };
    }

    const relevantTemplates = this.templates
      .filter((t) => t.cropName.toLowerCase() === crop.cropName.toLowerCase() && t.isActive)
      .sort((a, b) => a.sequence - b.sequence);

    if (relevantTemplates.length === 0) {
      throw new BadRequestException(`No active activity templates found for crop '${crop.cropName}'.`);
    }

    const plantingDate = new Date(crop.plantingDate);
    const generated: any[] = [];

    for (const tmpl of relevantTemplates) {
      const plannedDate = new Date(plantingDate);
      plannedDate.setDate(plannedDate.getDate() + tmpl.defaultDayOffset);

      const activityId = `act-${planId}-${tmpl.sequence}`;
      const activityRequirements = tmpl.defaultRequirements.map((req, idx) => ({
        id: `actreq-${activityId}-${idx + 1}`,
        activityId,
        resourceType: req.resourceType,
        quantity: req.quantity,
        tractorHpMin: req.tractorHpMin,
        attachmentType: req.attachmentType,
        skillId: req.skillId,
        equipmentType: req.equipmentType,
        productCategory: req.productCategory,
        productName: req.productName,
        notes: req.notes,
        status: 'OPEN',
      }));

      const newActivity = {
        id: activityId,
        farmPlanId: planId,
        farmCropId: crop.id,
        templateId: tmpl.id,
        activityType: tmpl.activityType,
        name: tmpl.name,
        description: tmpl.description,
        plannedDate: plannedDate.toISOString().split('T')[0],
        startTime: '07:00 AM',
        status: 'PLANNED',
        requirements: activityRequirements,
        workRequestsGenerated: false,
        notes: `Auto-generated from ${crop.cropName} cultivation template.`,
        completedAt: null,
      };

      this.farmActivities.push(newActivity);
      generated.push(newActivity);
    }

    return {
      success: true,
      planId,
      cropName: crop.cropName,
      generatedCount: generated.length,
      activities: generated,
    };
  }

  // 5. Farm Activities & Requirements CRUD
  async createActivity(planId: string, dto: any) {
    const activity = {
      id: `act-${Date.now()}`,
      farmPlanId: planId,
      farmCropId: dto.farmCropId || 'fcrop-001',
      templateId: dto.templateId || null,
      activityType: dto.activityType || 'OTHER',
      name: dto.name || 'Custom Farm Activity',
      description: dto.description || '',
      plannedDate: dto.plannedDate || '2026-09-18',
      startTime: dto.startTime || '07:00 AM',
      status: 'PLANNED',
      requirements: dto.requirements || [],
      workRequestsGenerated: false,
      notes: dto.notes || '',
      completedAt: null,
    };
    this.farmActivities.push(activity);
    return activity;
  }

  async getActivities(planId: string) {
    return this.farmActivities.filter((a) => a.farmPlanId === planId);
  }

  async getActivityById(id: string) {
    const act = this.farmActivities.find((a) => a.id === id);
    if (!act) throw new NotFoundException(`FarmActivity ${id} not found`);
    return act;
  }

  async updateActivity(id: string, dto: any) {
    const act = await this.getActivityById(id);
    Object.assign(act, dto);
    if (dto.status === 'COMPLETED' && !act.completedAt) {
      act.completedAt = new Date().toISOString();
    }
    return act;
  }

  async deleteActivity(id: string) {
    this.farmActivities = this.farmActivities.filter((a) => a.id !== id);
    return { success: true, deletedId: id };
  }

  // 6. Convert Activity Requirements to Work Requests
  async createWorkRequestsForActivity(activityId: string) {
    const act = await this.getActivityById(activityId);

    const serviceRequirements = act.requirements.filter((r: any) =>
      ['TRACTOR', 'WORKER', 'EQUIPMENT'].includes(r.resourceType)
    );

    if (serviceRequirements.length === 0) {
      throw new BadRequestException('This activity has no service resource requirements to convert into WorkRequests.');
    }

    const generatedRequests = serviceRequirements.map((req: any, idx: number) => ({
      id: `wr-act-${activityId}-${idx + 1}`,
      activityId: act.id,
      farmPlanId: act.farmPlanId,
      activityName: act.name,
      plannedDate: act.plannedDate,
      time: act.startTime,
      resourceType: req.resourceType,
      quantity: req.quantity,
      tractorHpMin: req.tractorHpMin,
      attachmentType: req.attachmentType,
      skillId: req.skillId,
      equipmentType: req.equipmentType,
      status: 'OPEN',
      notes: req.notes,
    }));

    act.status = 'RESOURCE_SEARCH';
    act.workRequestsGenerated = true;

    return {
      success: true,
      activityId: act.id,
      activityStatus: act.status,
      message: `Generated ${generatedRequests.length} WorkRequest(s) for activity '${act.name}'. Matching engine ready.`,
      workRequests: generatedRequests,
    };
  }

  // 7. Plan Timeline
  async getPlanTimeline(planId: string) {
    const plan = await this.getPlanById(planId);
    const activities = this.farmActivities.filter((a) => a.farmPlanId === planId);

    const timelineMonths: Record<string, any[]> = {};

    for (const act of activities) {
      const date = new Date(act.plannedDate);
      const monthKey = date.toLocaleString('default', { month: 'long', year: 'numeric' });
      if (!timelineMonths[monthKey]) {
        timelineMonths[monthKey] = [];
      }
      timelineMonths[monthKey].push({
        id: act.id,
        name: act.name,
        activityType: act.activityType,
        plannedDate: act.plannedDate,
        status: act.status,
        requirementsSummary: act.requirements.map((r: any) => `${r.quantity}x ${r.resourceType}`).join(', '),
      });
    }

    return {
      planId: plan.id,
      planName: plan.name,
      totalActivities: activities.length,
      timeline: timelineMonths,
    };
  }
}
