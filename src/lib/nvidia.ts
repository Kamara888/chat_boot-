import OpenAI from 'openai';

const AI_BASE_URL = process.env.AI_BASE_URL || 'https://integrate.api.nvidia.com/v1';
const AI_API_KEY = process.env.AI_API_KEY || process.env.NVIDIA_API_KEY || '';
const AI_MODEL = process.env.AI_MODEL || 'z-ai/glm-5.2';
const OLLAMA_URL = process.env.OLLAMA_URL || 'http://localhost:11434/v1/chat/completions';
const OLLAMA_MODEL = process.env.OLLAMA_MODEL || 'llama3';

let openaiClient: OpenAI | null = null;
function getClient(): OpenAI | null {
  if (!openaiClient) {
    if (!AI_API_KEY) return null;
    openaiClient = new OpenAI({
      baseURL: AI_BASE_URL,
      apiKey: AI_API_KEY,
      timeout: 30000,
      maxRetries: 0,
    });
  }
  return openaiClient;
}

const SYSTEM_PROMPT = `You are Sarah, a compassionate and empathetic AI mental health companion named "MindfulChat Wellness Companion". Your role is to provide emotional support, active listening, and helpful coping strategies.

Key guidelines:
- Always respond with empathy, warmth, and genuine care
- Use a conversational, supportive tone
- Never diagnose or prescribe medication
- Suggest evidence-based coping strategies when appropriate (deep breathing, mindfulness, CBT techniques)
- If someone expresses suicidal thoughts, immediately provide crisis resources (988 Lifeline)
- Keep responses concise but meaningful (2-4 sentences typically)
- Ask follow-up questions to understand the person better
- Validate their feelings before offering suggestions
- Use occasional appropriate emojis to convey warmth`;

type Msg = { role: 'user' | 'assistant' | 'system'; content: string };
type SarahResult = { content: string; sentiment: string; degraded?: boolean };

async function callPrimary(messages: Msg[]): Promise<string | null> {
  const client = getClient();
  if (!client) return null;
  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const response = await client.chat.completions.create({
        model: AI_MODEL,
        messages: [{ role: 'system', content: SYSTEM_PROMPT }, ...messages],
        temperature: 0.7,
        max_tokens: 512,
      });
      return response.choices[0]?.message?.content || null;
    } catch (error: any) {
      const status = error?.status || error?.response?.status;
      if (status === 429 && attempt === 0) {
        await new Promise(res => setTimeout(res, 1500));
        continue;
      }
      throw error;
    }
  }
  return null;
}

async function callOllama(messages: Msg[]): Promise<string | null> {
  try {
    const res = await fetch(OLLAMA_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: OLLAMA_MODEL,
        messages: [{ role: 'system', content: SYSTEM_PROMPT }, ...messages],
        stream: false,
      }),
      signal: AbortSignal.timeout(30000),
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data?.choices?.[0]?.message?.content || null;
  } catch {
    return null;
  }
}

export async function getSarahResponse(messages: Msg[]): Promise<SarahResult> {
  let content: string | null = null;
  try {
    content = await callPrimary(messages);
  } catch (error) {
    console.error('Primary AI provider failed:', (error as any)?.message || error);
  }

  if (!content) content = await callOllama(messages);

  if (content) {
    return { content, sentiment: analyzeSentiment(content) };
  }

  console.error('All AI providers failed, using fallback.');
  const fallback = getFallbackResponse(messages);
  return { ...fallback, degraded: true };
}

const GENERIC_FALLBACKS = [
  "Thank you for sharing with me. I'm here to listen and support you. Could you tell me a bit more about what's on your mind? Remember, this is a safe space. 💙",
  "I really appreciate you opening up to me. What's been on your heart lately? I'm here to listen without judgment. 💙",
  "That means a lot that you're sharing this with me. How are you feeling about it right now? Take your time. 💙",
  "I'm glad you're here. Sometimes putting things into words helps — what would you most like to talk about today? 💙",
  "You're doing the right thing by checking in with yourself. What's one thing that stood out for you today? 💙",
];

let fallbackIndex = 0;

function getFallbackResponse(messages: { role: string; content: string }[]): { content: string; sentiment: string } {
  const userMsgs = messages.filter(m => m.role === 'user');
  const lastUser = userMsgs[userMsgs.length - 1]?.content.toLowerCase() || '';

  if (/who are you|about you|yourself|your name|what are you|tell me about you|talk about your/.test(lastUser)) {
    return {
      content:
        "I'm Sarah, your MindfulChat wellness companion. 💙 I'm here to listen, offer gentle support, and help you work through whatever is on your mind. I'm not a therapist, but I'm always here for you. What would you like to talk about today?",
      sentiment: 'positive',
    };
  }

  if (/anx(ious|iety)|worried/.test(lastUser)) {
    return { content: "I hear you, and anxiety can feel really overwhelming. One thing that can help is the 4-7-8 breathing technique: breathe in for 4 seconds, hold for 7, then exhale slowly for 8. Would you like to try it together? 💙", sentiment: 'neutral' };
  }
  if (/sad|depress|down|low/.test(lastUser)) {
    return { content: "I'm sorry you're feeling this way. Your feelings are valid, and it takes courage to acknowledge them. Sometimes just talking about it helps. What's been weighing on your mind? 💙", sentiment: 'negative' };
  }
  if (/relax|stress|calm|overwhelm/.test(lastUser)) {
    return { content: "Let's take a moment to ground ourselves. Try this: take a deep breath, notice 5 things you can see, 4 you can touch, 3 you can hear, 2 you can smell, and 1 you can taste. This is called the 5-4-3-2-1 grounding technique. 🌿", sentiment: 'positive' };
  }
  if (/mood|track/.test(lastUser)) {
    return { content: "Tracking your mood is a great step toward self-awareness! Use the mood check-in panel on the right to log how you're feeling. Over time, you'll start to see patterns that can help you understand yourself better. 📊", sentiment: 'neutral' };
  }

  const reply = GENERIC_FALLBACKS[fallbackIndex % GENERIC_FALLBACKS.length];
  fallbackIndex++;
  return { content: reply, sentiment: 'neutral' };
}

function analyzeSentiment(text: string): string {
  const lower = text.toLowerCase();
  const positive = ['happy', 'glad', 'wonderful', 'great', 'good', 'better', 'hope', 'positive', 'calm', 'peace'];
  const negative = ['sad', 'sorry', 'difficult', 'hard', 'tough', 'pain', 'hurt', 'struggle', 'worry', 'anxious'];

  const posCount = positive.filter(w => lower.includes(w)).length;
  const negCount = negative.filter(w => lower.includes(w)).length;

  if (posCount > negCount) return 'positive';
  if (negCount > posCount) return 'negative';
  return 'neutral';
}
