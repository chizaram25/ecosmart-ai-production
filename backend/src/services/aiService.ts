import Anthropic from '@anthropic-ai/sdk'; 
import { ENV } from '../config/env';

const client = new Anthropic({ apiKey: ENV.ANTHROPIC_KEY });

const SYSTEM_PROMPT = `You are EcoSmart AI, a waste classification assistant for urban Nigeria.
Given a waste description or image, respond ONLY with valid JSON:
{
  "category": "plastic|paper|metal|ewaste|organic|glass|rubber|unknown",
  "confidence": 0-100,
  "wasteTitle": "short name (max 3 words)",
  "disposalGuidance": "specific actionable tip for Nigerian context",
  "climateImpact": "one sentence climate fact",
  "earningsEstimate": { "min": number, "max": number, "unit": "per kg" }
}`;

export async function classifyWaste(text: string): Promise<Record<string, unknown>> {
  const msg = await client.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 400,
    system: SYSTEM_PROMPT,
    messages: [{ role: 'user', content: `Waste: "${text}"` }],
  });

  const raw = msg.content.map(b => ('text' in b ? b.text : '')).join('');
  return JSON.parse(raw.replace(/```json|```/g, '').trim());
}
