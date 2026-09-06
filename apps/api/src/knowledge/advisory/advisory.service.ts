import { Injectable, NotFoundException } from '@nestjs/common';
import { KnowledgeArticleService } from '../articles/knowledge-article.service';

export interface AdvisoryDto {
  id: string;
  createdForUserId: string;
  createdForUserName: string;
  farmId?: string;
  farmName?: string;
  cropName?: string;
  activityId?: string;
  activityType?: string;
  attachedArticleId?: string;
  attachedArticleTitle?: string;
  attachedArticleSlug?: string;
  type: 'GENERAL' | 'FARM_ACTIVITY' | 'CROP_STAGE' | 'EQUIPMENT' | 'INPUT' | 'WEATHER' | 'MARKETPLACE' | 'SAFETY' | 'PROGRAM';
  title: string;
  description: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  status: 'NEW' | 'VIEWED' | 'ACKNOWLEDGED' | 'DISMISSED' | 'EXPIRED';
  actionPrompt?: string; // e.g. "Find Certified Sprayer" or "Check Pani Pipe"
  createdAt: string;
  expiresAt?: string;
}

@Injectable()
export class AdvisoryService {
  constructor(private readonly articleService: KnowledgeArticleService) {}

  private advisories: AdvisoryDto[] = [
    {
      id: 'adv-cotton-01',
      createdForUserId: 'usr-ravi-001',
      createdForUserName: 'Ravi Kumar',
      farmId: 'farm-ravi-01',
      farmName: 'North Field (5.0 Acres)',
      cropName: 'Cotton',
      activityId: 'act-plan-cotton-04',
      activityType: 'SPRAYING',
      attachedArticleId: 'art-cot-spray-guide',
      attachedArticleTitle: 'Cotton Spraying & Protective Agrochemical Stewardship Guide',
      attachedArticleSlug: 'cotton-spraying-guide',
      type: 'FARM_ACTIVITY',
      title: 'Upcoming Crop Protection: Cotton Spraying Preparation',
      description:
        'Your 5-acre Cotton plot has a scheduled protective spraying activity. Review economic threshold levels (ETL), equipment calibration, and operator PPE before commencing.',
      priority: 'HIGH',
      status: 'NEW',
      actionPrompt: 'Find Sprayer & Operator on Grid',
      createdAt: '2026-02-20T08:00:00Z',
    },
    {
      id: 'adv-safety-02',
      createdForUserId: 'usr-ravi-001',
      createdForUserName: 'Ravi Kumar',
      farmId: 'farm-ravi-01',
      farmName: 'North Field (5.0 Acres)',
      attachedArticleId: 'art-sprayer-ppe-safety',
      attachedArticleTitle: 'Operator Personal Protective Equipment (PPE) & Chemical Safety Checklist',
      attachedArticleSlug: 'sprayer-ppe-safety-checklist',
      type: 'SAFETY',
      title: 'Mandatory Operator PPE & Decontamination Protocol',
      description:
        'Ensure power sprayer operators wear approved N95 mask, nitrile gloves, and chemical goggles. Never spray into headwind.',
      priority: 'HIGH',
      status: 'NEW',
      actionPrompt: 'View Safety Checklist',
      createdAt: '2026-02-20T08:00:00Z',
    },
  ];

  listAdvisories(filter?: { userId?: string; farmId?: string; status?: string }): AdvisoryDto[] {
    return this.advisories.filter((a) => {
      if (filter?.userId && a.createdForUserId !== filter.userId) return false;
      if (filter?.farmId && a.farmId !== filter.farmId) return false;
      if (filter?.status && a.status !== filter.status) return false;
      return true;
    });
  }

  getAdvisory(id: string): AdvisoryDto {
    const advisory = this.advisories.find((a) => a.id === id);
    if (!advisory) {
      throw new NotFoundException(`Advisory ${id} not found`);
    }
    return advisory;
  }

  createAdvisory(data: {
    createdForUserId: string;
    createdForUserName?: string;
    farmId?: string;
    farmName?: string;
    cropName?: string;
    activityId?: string;
    activityType?: string;
    attachedArticleId?: string;
    type?: 'GENERAL' | 'FARM_ACTIVITY' | 'CROP_STAGE' | 'EQUIPMENT' | 'INPUT' | 'WEATHER' | 'MARKETPLACE' | 'SAFETY' | 'PROGRAM';
    title: string;
    description: string;
    priority?: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
    actionPrompt?: string;
  }): AdvisoryDto {
    const id = `adv-${Date.now().toString(36)}`;
    let attachedTitle: string | undefined;
    let attachedSlug: string | undefined;

    if (data.attachedArticleId) {
      try {
        const article = this.articleService.getArticle(data.attachedArticleId);
        attachedTitle = article.title;
        attachedSlug = article.slug;
      } catch (e) {
        // Continue if not found
      }
    }

    const newAdvisory: AdvisoryDto = {
      id,
      createdForUserId: data.createdForUserId,
      createdForUserName: data.createdForUserName || 'Registered Farmer',
      farmId: data.farmId,
      farmName: data.farmName,
      cropName: data.cropName,
      activityId: data.activityId,
      activityType: data.activityType,
      attachedArticleId: data.attachedArticleId,
      attachedArticleTitle: attachedTitle,
      attachedArticleSlug: attachedSlug,
      type: data.type || 'GENERAL',
      title: data.title,
      description: data.description,
      priority: data.priority || 'MEDIUM',
      status: 'NEW',
      actionPrompt: data.actionPrompt,
      createdAt: new Date().toISOString(),
    };

    this.advisories.push(newAdvisory);
    return newAdvisory;
  }

  acknowledgeAdvisory(id: string): AdvisoryDto {
    const adv = this.getAdvisory(id);
    adv.status = 'ACKNOWLEDGED';
    return adv;
  }

  dismissAdvisory(id: string): AdvisoryDto {
    const adv = this.getAdvisory(id);
    adv.status = 'DISMISSED';
    return adv;
  }
}
