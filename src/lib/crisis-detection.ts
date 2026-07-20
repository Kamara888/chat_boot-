const CRISIS_KEYWORDS = [
  'suicide', 'kill myself', 'end my life', 'want to die', 'self-harm',
  'hurt myself', 'no reason to live', 'better off dead', 'end it all',
  '988', 'crisis',
];

const SEVERITY_MAP: Record<string, string> = {
  'suicide': 'critical',
  'kill myself': 'critical',
  'end my life': 'critical',
  'want to die': 'high',
  'self-harm': 'high',
  'hurt myself': 'high',
  'no reason to live': 'high',
  'better off dead': 'high',
  'end it all': 'medium',
  '988': 'low',
  'crisis': 'medium',
};

export function detectCrisis(text: string): { isCrisis: boolean; severity: string; keywords: string[] } {
  const lower = text.toLowerCase();
  const found = CRISIS_KEYWORDS.filter(kw => lower.includes(kw));

  if (found.length === 0) return { isCrisis: false, severity: 'none', keywords: [] };

  const severity = found.reduce((highest, kw) => {
    const s = SEVERITY_MAP[kw] || 'low';
    const order = { critical: 4, high: 3, medium: 2, low: 1 };
    return (order[s as keyof typeof order] || 0) > (order[highest as keyof typeof order] || 0) ? s : highest;
  }, 'low');

  return { isCrisis: true, severity, keywords: found };
}
