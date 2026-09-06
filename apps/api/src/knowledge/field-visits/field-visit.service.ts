import { Injectable, NotFoundException } from '@nestjs/common';
import { AdvisoryService } from '../advisory/advisory.service';
import { KnowledgeArticleService } from '../articles/knowledge-article.service';

export interface FieldObservationDto {
  id: string;
  fieldVisitId: string;
  category: 'CROP_HEALTH' | 'IRRIGATION' | 'SOIL' | 'PEST' | 'DISEASE' | 'WEED' | 'EQUIPMENT' | 'OTHER';
  observation: string; // Factual observation, non-diagnosis
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  photoReference?: string;
  attachedArticleId?: string;
  attachedArticleTitle?: string;
  createdAt: string;
}

export interface FieldVisitDto {
  id: string;
  officerId: string;
  officerName: string;
  organizationId?: string;
  organizationName?: string;
  farmerId: string;
  farmerName: string;
  farmerPhone?: string;
  farmId: string;
  farmName: string;
  cropName: string;
  areaAcres: number;
  visitDate: string;
  purpose: string;
  notes?: string;
  status: 'PLANNED' | 'COMPLETED' | 'CANCELLED';
  observations: FieldObservationDto[];
  createdAt: string;
  updatedAt: string;
}

@Injectable()
export class FieldVisitService {
  constructor(
    private readonly advisoryService: AdvisoryService,
    private readonly articleService: KnowledgeArticleService
  ) {}

  private visits: FieldVisitDto[] = [
    {
      id: 'fv-2026-001',
      officerId: 'usr-officer-99',
      officerName: 'Dr. N. Raghuram (FPO Agronomist)',
      organizationId: 'org-kalyan-fpo',
      organizationName: 'Kalyandurg Cotton Producer Co. Ltd.',
      farmerId: 'usr-ravi-001',
      farmerName: 'Ravi Kumar',
      farmerPhone: '+91 98765 43210',
      farmId: 'farm-ravi-01',
      farmName: 'North Field (5.0 Acres)',
      cropName: 'Cotton (Bt-2)',
      areaAcres: 5.0,
      visitDate: '2026-02-18',
      purpose: 'Mid-vegetative pest scouting and square formation inspection',
      notes: 'Cotton crop is at 45 days. Good vegetative branching observed.',
      status: 'COMPLETED',
      observations: [
        {
          id: 'obs-001',
          fieldVisitId: 'fv-2026-001',
          category: 'PEST',
          observation:
            'Observed leaf curl and minor aphid colonies on undersides of upper canopy leaves (approx 4-6 nymphs/leaf). Square retention is currently 88%.',
          severity: 'MEDIUM',
          attachedArticleId: 'art-cot-spray-guide',
          attachedArticleTitle: 'Cotton Spraying & Protective Agrochemical Stewardship Guide',
          createdAt: '2026-02-18T10:30:00Z',
        },
      ],
      createdAt: '2026-02-17T09:00:00Z',
      updatedAt: '2026-02-18T11:00:00Z',
    },
  ];

  listVisits(filter?: { officerId?: string; farmerId?: string; farmId?: string; status?: string }): FieldVisitDto[] {
    return this.visits.filter((v) => {
      if (filter?.officerId && v.officerId !== filter.officerId) return false;
      if (filter?.farmerId && v.farmerId !== filter.farmerId) return false;
      if (filter?.farmId && v.farmId !== filter.farmId) return false;
      if (filter?.status && v.status !== filter.status) return false;
      return true;
    });
  }

  getVisit(id: string): FieldVisitDto {
    const visit = this.visits.find((v) => v.id === id);
    if (!visit) {
      throw new NotFoundException(`Field visit ${id} not found`);
    }
    return visit;
  }

  createVisit(data: {
    officerId: string;
    officerName?: string;
    organizationId?: string;
    organizationName?: string;
    farmerId: string;
    farmerName?: string;
    farmerPhone?: string;
    farmId: string;
    farmName?: string;
    cropName: string;
    areaAcres?: number;
    visitDate?: string;
    purpose: string;
    notes?: string;
  }): FieldVisitDto {
    const id = `fv-${Date.now().toString(36)}`;
    const now = new Date().toISOString();

    const newVisit: FieldVisitDto = {
      id,
      officerId: data.officerId,
      officerName: data.officerName || 'Certified FPO Field Officer',
      organizationId: data.organizationId,
      organizationName: data.organizationName,
      farmerId: data.farmerId,
      farmerName: data.farmerName || 'Registered Farmer',
      farmerPhone: data.farmerPhone,
      farmId: data.farmId,
      farmName: data.farmName || 'Agricultural Farmland Plot',
      cropName: data.cropName,
      areaAcres: data.areaAcres || 5.0,
      visitDate: data.visitDate || now.split('T')[0],
      purpose: data.purpose,
      notes: data.notes,
      status: 'PLANNED',
      observations: [],
      createdAt: now,
      updatedAt: now,
    };

    this.visits.push(newVisit);
    return newVisit;
  }

  recordObservation(
    visitId: string,
    data: {
      category: 'CROP_HEALTH' | 'IRRIGATION' | 'SOIL' | 'PEST' | 'DISEASE' | 'WEED' | 'EQUIPMENT' | 'OTHER';
      observation: string;
      severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
      photoReference?: string;
      attachedArticleId?: string;
      sendFarmerAdvisory?: boolean;
    }
  ): FieldObservationDto {
    const visit = this.getVisit(visitId);
    const obsId = `obs-${Date.now().toString(36)}`;
    const now = new Date().toISOString();

    let attachedArticleTitle: string | undefined;
    if (data.attachedArticleId) {
      try {
        const article = this.articleService.getArticle(data.attachedArticleId);
        attachedArticleTitle = article.title;
      } catch (e) {
        // Continue
      }
    }

    const newObs: FieldObservationDto = {
      id: obsId,
      fieldVisitId: visit.id,
      category: data.category,
      observation: data.observation,
      severity: data.severity,
      photoReference: data.photoReference,
      attachedArticleId: data.attachedArticleId,
      attachedArticleTitle,
      createdAt: now,
    };

    visit.observations.push(newObs);
    visit.status = 'COMPLETED';
    visit.updatedAt = now;

    // Trigger farmer advisory if requested
    if (data.sendFarmerAdvisory) {
      this.advisoryService.createAdvisory({
        createdForUserId: visit.farmerId,
        createdForUserName: visit.farmerName,
        farmId: visit.farmId,
        farmName: visit.farmName,
        cropName: visit.cropName,
        type: 'FARM_ACTIVITY',
        title: `Field Officer Observation: ${data.category.replace('_', ' ')} (${data.severity})`,
        description: `Field Officer ${visit.officerName} recorded: "${data.observation}". Attached guidance: ${attachedArticleTitle || 'Standard Practice'}.`,
        priority: data.severity === 'CRITICAL' || data.severity === 'HIGH' ? 'HIGH' : 'MEDIUM',
        attachedArticleId: data.attachedArticleId,
        actionPrompt: 'View Attached Agronomic Guide',
      });
    }

    return newObs;
  }
}
