export function buildRecommendationExplanationPrompt(candidate: Record<string, any>, requirement: Record<string, any>): string {
  return `
Explain why the following provider was selected by the matching engine:
- Candidate: ${candidate.providerName} (${candidate.machineModel})
- Horsepower: ${candidate.horsepower} HP
- Attached Implement: ${candidate.attachment}
- Distance: ${candidate.distanceKm} km
- Completion Rate: ${candidate.completionRate}%
- Rating: ${candidate.rating} / 5.0
- Work Requirement: ${requirement.activityType} for ${requirement.acres} acres

Provide a concise, 2-sentence explanation highlighting capability match, distance efficiency, and proven reliability.
`;
}

