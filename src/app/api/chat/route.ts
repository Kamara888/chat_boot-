import { NextResponse } from 'next/server';
import { getSarahResponse } from '@/lib/nvidia';
import { detectCrisis } from '@/lib/crisis-detection';

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: 'Messages array required' }, { status: 400 });
    }

    const lastUserMessage = messages.filter((m: any) => m.role === 'user').pop()?.content || '';
    const crisisCheck = detectCrisis(lastUserMessage);

    const { content, sentiment, degraded } = await getSarahResponse(messages);

    return NextResponse.json({
      content,
      sentiment,
      isCrisis: crisisCheck.isCrisis,
      crisisSeverity: crisisCheck.severity,
      degraded: degraded || false,
    });
  } catch (error: any) {
    console.error('Chat API error:', error?.message || error);
    return NextResponse.json(
      { error: 'Failed to get response', detail: error?.message },
      { status: 500 }
    );
  }
}
