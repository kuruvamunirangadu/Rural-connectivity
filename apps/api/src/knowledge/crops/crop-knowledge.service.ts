import { Injectable, NotFoundException } from '@nestjs/common';

export interface CropDto {
  id: string;
  name: string;
  scientificName?: string;
  category: string;
  description: string;
  status: string;
  stages: { stage: string; displayName: string; dayOffsetRange: string }[];
}

export interface CropKnowledgeLinkDto {
  id: string;
  cropId: string;
  cropName: string;
  articleId: string;
  articleTitle: string;
  stage: string;
  activityType: string;
  priority: number;
}

@Injectable()
export class CropKnowledgeService {
  private crops: CropDto[] = [
    {
      id: 'crop-cotton',
      name: 'Cotton',
      scientificName: 'Gossypium hirsutum',
      category: 'CASH_CROP',
      description: 'Major commercial fiber crop grown extensively across Telangana black and red soils.',
      status: 'ACTIVE',
      stages: [
        { stage: 'LAND_PREPARATION', displayName: 'Land Preparation & Basal Tilling', dayOffsetRange: '-20 to -1 days' },
        { stage: 'SOWING', displayName: 'Sowing & Germination', dayOffsetRange: '0 to 15 days' },
        { stage: 'VEGETATIVE', displayName: 'Vegetative Growth & Branching', dayOffsetRange: '15 to 45 days' },
        { stage: 'FLOWERING_SQUARE', displayName: 'Square Formation & Flowering', dayOffsetRange: '45 to 80 days' },
        { stage: 'BOLL_DEVELOPMENT', displayName: 'Boll Formation & Maturation', dayOffsetRange: '80 to 130 days' },
        { stage: 'HARVEST_BURSTING', displayName: 'Boll Bursting & Picking', dayOffsetRange: '130 to 180 days' },
      ],
    },
    {
      id: 'crop-paddy',
      name: 'Paddy / Rice',
      scientificName: 'Oryza sativa',
      category: 'CEREAL',
      description: 'Staple grain crop cultivated in command areas and borewell irrigated wetlands.',
      status: 'ACTIVE',
      stages: [
        { stage: 'NURSERY_PUDDLING', displayName: 'Nursery & Mainfield Puddling', dayOffsetRange: '-25 to 0 days' },
        { stage: 'TRANSPLANTING', displayName: 'Transplanting & Tillering', dayOffsetRange: '0 to 35 days' },
        { stage: 'PANICLE_INITIATION', displayName: 'Panicle Initiation & Booting', dayOffsetRange: '35 to 65 days' },
        { stage: 'GRAIN_FILLING', displayName: 'Flowering & Milking / Dough Stage', dayOffsetRange: '65 to 95 days' },
        { stage: 'HARVESTING', displayName: 'Maturity & Mechanical Harvesting', dayOffsetRange: '95 to 125 days' },
      ],
    },
    {
      id: 'crop-groundnut',
      name: 'Groundnut',
      scientificName: 'Arachis hypogaea',
      category: 'OILSEED',
      description: 'High-oil content legume crop resilient in light well-drained sandy loam and red soils.',
      status: 'ACTIVE',
      stages: [
        { stage: 'SOWING_GERMINATION', displayName: 'Sowing & Emergence', dayOffsetRange: '0 to 12 days' },
        { stage: 'FLOWERING_PEGGING', displayName: 'Flowering & Peg Penetration', dayOffsetRange: '30 to 55 days' },
        { stage: 'POD_DEVELOPMENT', displayName: 'Pod Development & Gypsum Top-Dressing', dayOffsetRange: '55 to 85 days' },
        { stage: 'POD_HARVEST', displayName: 'Harvesting & Pod Stripping', dayOffsetRange: '85 to 110 days' },
      ],
    },
    {
      id: 'crop-chilli',
      name: 'Red Chilli',
      scientificName: 'Capsicum annuum',
      category: 'HORTICULTURE',
      description: 'Commercial spice crop with high export valuation and intensive pest management needs.',
      status: 'ACTIVE',
      stages: [
        { stage: 'NURSERY_TRANSPLANT', displayName: 'Transplanting & Root Establishment', dayOffsetRange: '0 to 20 days' },
        { stage: 'FLOWERING_FRUITING', displayName: 'Flowering & Fruit Setting', dayOffsetRange: '40 to 80 days' },
        { stage: 'PICKING_CURING', displayName: 'Red Ripe Picking & Sun Drying', dayOffsetRange: '80 to 150 days' },
      ],
    },
  ];

  private links: CropKnowledgeLinkDto[] = [
    {
      id: 'link-cot-spray',
      cropId: 'crop-cotton',
      cropName: 'Cotton',
      articleId: 'art-cot-spray-guide',
      articleTitle: 'Cotton Spraying & Protective Chemical Stewardship Guide',
      stage: 'FLOWERING_SQUARE',
      activityType: 'SPRAYING',
      priority: 1,
    },
    {
      id: 'link-cot-safety',
      cropId: 'crop-cotton',
      cropName: 'Cotton',
      articleId: 'art-sprayer-ppe-safety',
      articleTitle: 'Operator Personal Protective Equipment (PPE) & Calibration Checklist',
      stage: 'VEGETATIVE',
      activityType: 'SPRAYING',
      priority: 1,
    },
    {
      id: 'link-pad-water',
      cropId: 'crop-paddy',
      cropName: 'Paddy / Rice',
      articleId: 'art-paddy-awd-irrigation',
      articleTitle: 'Alternate Wetting and Drying (AWD) Water Conservation in Paddy',
      stage: 'TRANSPLANTING',
      activityType: 'IRRIGATION',
      priority: 1,
    },
  ];

  listCrops(): CropDto[] {
    return this.crops;
  }

  getCrop(idOrName: string): CropDto {
    const crop = this.crops.find(
      (c) => c.id === idOrName || c.name.toLowerCase() === idOrName.toLowerCase()
    );
    if (!crop) {
      throw new NotFoundException(`Crop ${idOrName} not found in master catalog`);
    }
    return crop;
  }

  getKnowledgeForCrop(cropIdOrName: string): CropKnowledgeLinkDto[] {
    const crop = this.getCrop(cropIdOrName);
    return this.links.filter((l) => l.cropId === crop.id);
  }
}
