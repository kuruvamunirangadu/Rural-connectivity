export function buildPlanningPrompt(crop: string, area: number, season = 'Kharif', existingActivities: string[] = []): string {
  return `
Generate an actionable farm activity schedule for:
- Crop: ${crop}
- Farm Area: ${area} Acres
- Season: ${season}
- Existing Planned Activities: ${existingActivities.join(', ') || 'None'}

Rules:
1. Identify next critical agricultural stages (e.g., Sowing, Weed Control, Spraying, Fertilization, Harvesting).
2. Specify required machinery (e.g. Tractor with Rotavator, Laser Leveler, Power Sprayer) and labor.
3. Assign priority (HIGH, MEDIUM, LOW) and agricultural rationale.
`;
}

