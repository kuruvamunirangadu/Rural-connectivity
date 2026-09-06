import { Injectable, NotFoundException } from '@nestjs/common';

export interface ChecklistStepDto {
  stepNumber: number;
  phase: 'BEFORE_WORK' | 'EQUIPMENT_PPE' | 'APPLICATION' | 'AFTER_WORK';
  title: string;
  instruction: string;
  isMandatory: boolean;
}

export interface ActivityGuideDto {
  id: string;
  activityType: string;
  cropName?: string;
  title: string;
  description: string;
  articleId: string;
  articleSlug: string;
  sequence: number;
  checklists: ChecklistStepDto[];
  isActive: boolean;
}

@Injectable()
export class ActivityGuideService {
  private guides: ActivityGuideDto[] = [
    {
      id: 'guide-spraying-cotton',
      activityType: 'SPRAYING',
      cropName: 'Cotton',
      title: 'Cotton Protective Spraying & Safety Protocol',
      description: 'End-to-end operational checklist for spraying operations on cotton fields.',
      articleId: 'art-cot-spray-guide',
      articleSlug: 'cotton-spraying-guide',
      sequence: 1,
      isActive: true,
      checklists: [
        {
          stepNumber: 1,
          phase: 'BEFORE_WORK',
          title: 'Field ETL & Weather Inspection',
          instruction: 'Inspect 20 random cotton plants for economic threshold levels. Confirm wind speed < 12 km/h and no rain forecast for 4 hours.',
          isMandatory: true,
        },
        {
          stepNumber: 2,
          phase: 'EQUIPMENT_PPE',
          title: 'Sprayer Calibration & PPE Donning',
          instruction: 'Verify nozzle discharge (hollow cone, 40 PSI). Put on N95 mask, nitrile chemical gloves, safety goggles, and protective apron.',
          isMandatory: true,
        },
        {
          stepNumber: 3,
          phase: 'APPLICATION',
          title: 'Downwind Spray Traversal',
          instruction: 'Walk with the wind blowing across or away from operator; never walk directly into chemical spray mist. Maintain uniform walking pace.',
          isMandatory: true,
        },
        {
          stepNumber: 4,
          phase: 'AFTER_WORK',
          title: 'Triple Rinse & Operator Hygiene',
          instruction: 'Triple rinse spray tank with clean water. Puncture empty containers. Operator must immediately bathe with soap and wash clothing separately.',
          isMandatory: true,
        },
      ],
    },
    {
      id: 'guide-irrigation-paddy',
      activityType: 'IRRIGATION',
      cropName: 'Paddy / Rice',
      title: 'Paddy AWD Irrigation & Pump Operation Guide',
      description: 'Water management steps for Alternate Wetting and Drying (AWD) in rice.',
      articleId: 'art-paddy-awd-irrigation',
      articleSlug: 'paddy-awd-water-conservation',
      sequence: 2,
      isActive: true,
      checklists: [
        {
          stepNumber: 1,
          phase: 'BEFORE_WORK',
          title: 'Check Field Pani Pipe Level',
          instruction: 'Inspect water tube; re-irrigate only when water drops to 15 cm below ground level during tillering phase.',
          isMandatory: true,
        },
        {
          stepNumber: 2,
          phase: 'EQUIPMENT_PPE',
          title: 'Electrical & Pump Priming Check',
          instruction: 'Check capacitor and starter switch. Prime centrifugal pump with water to prevent air locking.',
          isMandatory: true,
        },
        {
          stepNumber: 3,
          phase: 'APPLICATION',
          title: 'Controlled Furrow Inflow',
          instruction: 'Inundate field plots up to 5 cm depth. Maintain perimeter bunds to prevent runoff losses.',
          isMandatory: false,
        },
        {
          stepNumber: 4,
          phase: 'AFTER_WORK',
          title: 'Main Sluice Valve Closure',
          instruction: 'Close inlet valves tightly and record pump run hours for electricity budget tracking.',
          isMandatory: true,
        },
      ],
    },
  ];

  listGuides(filter?: { activityType?: string; cropName?: string }): ActivityGuideDto[] {
    return this.guides.filter((g) => {
      if (filter?.activityType && g.activityType.toUpperCase() !== filter.activityType.toUpperCase()) {
        return false;
      }
      if (filter?.cropName && g.cropName && !g.cropName.toLowerCase().includes(filter.cropName.toLowerCase())) {
        return false;
      }
      return true;
    });
  }

  getGuideForActivity(activityType: string, cropName?: string): ActivityGuideDto | undefined {
    return this.guides.find((g) => {
      if (g.activityType.toUpperCase() !== activityType.toUpperCase()) return false;
      if (cropName && g.cropName && !g.cropName.toLowerCase().includes(cropName.toLowerCase())) {
        return false;
      }
      return true;
    });
  }
}
