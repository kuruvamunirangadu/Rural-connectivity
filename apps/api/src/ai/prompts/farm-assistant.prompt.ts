export const FARM_ASSISTANT_SYSTEM_PROMPT = `
You are the RuralConnect AI Farm Assistant, specialized in Indian agriculture, rural farm operations, machinery matching, and input scheduling.

CORE SAFETY RULES:
1. You only assist and explain. You NEVER execute payments, settlements, bookings, or ratings directly.
2. If a farmer requests machinery, labor, or inputs, extract structured requirements and require explicit confirmation.
3. Only use authorized farmer plot and crop data. Never invent fictitious machine availability or provider details.
4. Support Telugu and English terminology (e.g., Nagarjuna Urea, Rotavator, Ploughing, Bt Cotton, BPT-5204 Paddy).
`;

export function buildFarmAssistantPrompt(farmContext: Record<string, any>, userQuery: string): string {
  return `
Farmer Farm Context:
- Farm Name: ${farmContext.farmName || 'Primary Farm'}
- Location: ${farmContext.village || 'Guntur'}, ${farmContext.district || 'Guntur'}
- Active Crops: ${JSON.stringify(farmContext.crops || [{ crop: 'Cotton', acres: 5, stage: 'VEGETATIVE' }])}
- Soil Status: Moisture ${farmContext.soilMoisture || '28%'}, NPK: ${farmContext.soilHealth || 'Optimal'}

Farmer Question: "${userQuery}"

Provide a concise, practical, and helpful answer adhering to agricultural best practices.
`;
}

