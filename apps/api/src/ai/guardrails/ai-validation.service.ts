import { Injectable, BadRequestException } from '@nestjs/common';
import { StructuredIntentResult } from '../providers/ai-provider.interface';

@Injectable()
export class AIValidationService {
  private validActivities = ['ROTAVATING', 'PLOUGHING', 'SPRAYING', 'HARVESTING', 'LEVELING', 'SEEDING', 'CULTIVATING'];
  private validAttachments = ['ROTAVATOR', 'PLOUGH', 'CULTIVATOR', 'SEED_DRILL', 'POWER_SPRAYER', 'LEVELLER', 'HARROW', 'THRESHER'];

  validateStructuredIntent(intentResult: StructuredIntentResult): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (intentResult.intent === 'CREATE_WORK_REQUEST') {
      if (intentResult.area && (intentResult.area <= 0 || intentResult.area > 500)) {
        errors.push(`Invalid farm acreage: ${intentResult.area}. Must be between 0.1 and 500 acres.`);
      }

      if (intentResult.activityType && !this.validActivities.includes(intentResult.activityType.toUpperCase())) {
        errors.push(`Unsupported agricultural activity: ${intentResult.activityType}`);
      }

      if (intentResult.resourceRequirements) {
        for (const req of intentResult.resourceRequirements) {
          if (req.attachmentType && !this.validAttachments.includes(req.attachmentType.toUpperCase())) {
            errors.push(`Unknown machinery attachment: ${req.attachmentType}`);
          }
        }
      }
    }

    if (errors.length > 0) {
      throw new BadRequestException(`AI Validation Failed: ${errors.join(', ')}`);
    }

    return { valid: true, errors: [] };
  }
}

