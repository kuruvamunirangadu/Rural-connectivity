export interface FarmActivitySuggestion {
  activityType: string;
  crop: string;
  season: string;
  recommendedTimeframe: string;
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
  confidence: 'HIGH' | 'MEDIUM' | 'LOW';
  reason: string;
  requiredResources: Array<{
    type: 'TRACTOR' | 'EQUIPMENT' | 'WORKER' | 'INPUT';
    specification: string;
    estimatedQuantity: number;
  }>;
}

export interface FarmPlanSuggestionsResult {
  farmId: string;
  crop: string;
  area: number;
  suggestions: FarmActivitySuggestion[];
  generatedAt: string;
}

