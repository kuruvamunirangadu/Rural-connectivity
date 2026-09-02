export interface StructuredIntentResult {
  intent: 'CREATE_WORK_REQUEST' | 'FARM_PLAN_QUERY' | 'PRICE_ESTIMATE' | 'RESOURCE_SEARCH' | 'UNKNOWN';
  requiresConfirmation: boolean;
  activityType?: string;
  crop?: string;
  area?: number;
  areaUnit?: string;
  resourceRequirements?: Array<{
    resourceType: string;
    attachmentType?: string;
    skillCategory?: string;
    quantity?: number;
  }>;
  date?: string;
  timePreference?: string;
  summary: string;
}

export interface AIProvider {
  interpretIntent(message: string): Promise<StructuredIntentResult>;
  generateExplanation(topic: string, context: Record<string, any>): Promise<string>;
}
