# Mental Health Conversational Assistant - "Sarah"

## Project Overview

AI-powered mental health chat application with an empathetic assistant named **Sarah** that provides emotional support through text and voice conversations, mood tracking, crisis detection, and personalized wellness recommendations.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | Next.js 14 (App Router), React, Tailwind CSS, shadcn/ui |
| **Backend** | Next.js API Routes + Server Actions |
| **Database** | PostgreSQL with Prisma ORM |
| **Authentication** | NextAuth.js (Google OAuth) |
| **AI Engine** | NVIDIA API (z-ai/glm-5.2 model) via OpenAI SDK |
| **Speech-to-Text** | Web Speech API (primary, free) + OpenAI Whisper API (fallback) |
| **Text-to-Speech** | Google Cloud Text-to-Speech API |
| **Charts** | Recharts for mood analytics |
| **State** | Zustand for chat + voice state |

---

## Architecture

`
+----------------------------------------------+
|                  FRONTEND                     |
|  Next.js App Router + Tailwind + shadcn/ui   |
|                                               |
|  +-----------+ +-----------+ +------------+  |
|  |  Chat UI  | |  Mood     | | Dashboard  |  |
|  |  (Sarah)  | |  Tracker  | | & Analytics|  |
|  +-----+-----+ +-----+-----+ +------+-----+  |
|        |              |             |          |
|  +-----+--------------+-------------+------+  |
|  |        Voice Control (Mic/TTS)           |  |
|  |  +-------------+  +------------------+   |  |
|  |  | STT (Whisper|  | TTS (Google TTS) |   |  |
|  |  | or Browser) |  | or Browser TTS   |   |  |
|  |  +-------------+  +------------------+   |  |
|  +------------------------------------------+  |
+----------------------------------------------+
|                  API LAYER                    |
|                                               |
|  +----------+ +----------+ +--------------+  |
|  | Chat API | | Mood API | |  Auth API    |  |
|  |/api/chat | |/api/mood | | /api/auth    |  |
|  +----+-----+ +----+-----+ +------+-------+  |
|       |             |              |           |
|  +----+-------------+--------------+-------+  |
|  |           /api/voice                     |  |
|  |  POST /transcribe  (STT)                 |  |
|  |  POST /synthesize   (TTS)                |  |
|  +------------------------------------------+  |
+----------------------------------------------+
|                  SERVICES                     |
|  +----------+ +----------+ +--------------+  |
|  | NVIDIA   | | Crisis   | |  Sentiment   |  |
|  | AI Svc   | | Detector | |  Analyzer    |  |
|  +----+-----+ +----+-----+ +------+-------+  |
|       |            |               |           |
|  +----+------------+---------------+-------+  |
|  |  Web Speech API   Whisper API  Google   |  |
|  |  (Browser STT)    (Fallback)   Cloud TTS|  |
|  +------------------------------------------+  |
+----------------------------------------------+
|              DATABASE (PostgreSQL)             |
|  Prisma ORM - Users, Messages, Moods,         |
|  Conversations, WellnessTips                  |
+----------------------------------------------+
`

---

## Database Schema (Prisma)

`prisma
model User {
  id            String    @id @default(cuid())
  name          String?
  email         String    @unique
  image         String?
  provider      String    @default("google")
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  conversations Conversation[]
  moods         Mood[]
  preferences   UserPreferences?
}

model Conversation {
  id        String    @id @default(cuid())
  userId    String
  user      User      @relation(fields: [userId], references: [id])
  title     String?
  createdAt DateTime  @default(now())
  updatedAt DateTime  @updatedAt
  messages  Message[]
}

model Message {
  id             String       @id @default(cuid())
  conversationId String
  conversation   Conversation @relation(fields: [conversationId], references: [id])
  role           String
  content        String
  sentiment      String?
  isVoice        Boolean      @default(false)
  createdAt      DateTime     @default(now())
}

model Mood {
  id        String   @id @default(cuid())
  userId    String
  user      User     @relation(fields: [userId], references: [id])
  rating    Int
  emotions  String[]
  note      String?
  source    String   @default("manual")
  createdAt DateTime @default(now())
}

model UserPreferences {
  id               String @id @default(cuid())
  userId           String @unique
  user             User   @relation(fields: [userId], references: [id])
  notificationTime String?
  tonePreference   String @default("empathetic")
  voiceEnabled     Boolean @default(true)
  voiceSpeed       Float   @default(1.0)
  voiceId          String?
  topics           String[]
}
`

---

## Implementation Phases

### Phase 1: Project Setup and Configuration

**Files to create:**
`
HEALTHCHAT/
+-- .env.local
+-- .gitignore
+-- next.config.js
+-- tailwind.config.js
+-- postcss.config.js
+-- tsconfig.json
+-- package.json
+-- prisma/
|   +-- schema.prisma
+-- src/
    +-- app/
    |   +-- layout.tsx
    |   +-- page.tsx
    |   +-- globals.css
    |   +-- chat/page.tsx
    |   +-- dashboard/page.tsx
    |   +-- mood/page.tsx
    |   +-- api/
    |       +-- auth/[...nextauth]/route.ts
    |       +-- chat/route.ts
    |       +-- mood/route.ts
    |       +-- voice/transcribe/route.ts
    |       +-- voice/synthesize/route.ts
    +-- components/
    |   +-- ui/
    |   +-- ChatMessage.tsx
    |   +-- ChatInput.tsx
    |   +-- VoiceControl.tsx
    |   +-- MoodTracker.tsx
    |   +-- MoodChart.tsx
    |   +-- CrisisAlert.tsx
    |   +-- Sidebar.tsx
    |   +-- Navbar.tsx
    +-- lib/
    |   +-- prisma.ts
    |   +-- auth.ts
    |   +-- nvidia.ts
    |   +-- whisper.ts
    |   +-- google-tts.ts
    |   +-- crisis-detection.ts
    |   +-- sentiment.ts
    +-- hooks/
    |   +-- useChat.ts
    |   +-- useMood.ts
    |   +-- useSpeechRecognition.ts
    |   +-- useSpeechSynthesis.ts
    |   +-- useVoice.ts
    +-- types/
        +-- index.ts
`

**Steps:**
1. Initialize Next.js project with TypeScript
2. Install dependencies
3. Configure environment variables
4. Set up Tailwind with calming theme
5. Initialize Prisma with PostgreSQL

---

### Phase 2: Database Schema and Authentication

**Steps:**
1. Create Prisma schema
2. Run 
px prisma db push
3. Set up NextAuth.js with Google OAuth
4. Create auth middleware
5. Build sign-in/sign-up pages
6. Create user session management

---

### Phase 3: AI Chat Engine with Sarah

**Sarah's System Prompt:**
`
You are Sarah, a compassionate and supportive mental health assistant.
Your role is to:
- Listen empathetically to users' feelings and concerns
- Validate their emotions without judgment
- Offer evidence-based coping strategies
- Encourage healthy perspective-taking
- Detect signs of crisis and provide appropriate resources
- Never diagnose or replace professional therapy
- Use a warm, gentle, and supportive tone

Guidelines:
- Keep responses concise but caring (2-4 sentences)
- Ask follow-up questions to understand better
- Remember context from the conversation
- If you detect severe distress, gently suggest professional help
- Use phrases like "I hear you", "That sounds difficult", "Your feelings are valid"
`

---

### Phase 4: Speech-to-Speech (Voice Conversation)

This phase adds full voice conversation capability to Sarah.

#### 4A. Speech-to-Text (STT) - User Speaking to Sarah

**Dual-Engine Strategy:**

| Engine | When Used | Cost | Accuracy |
|--------|-----------|------|----------|
| **Web Speech API** | Default, primary | Free | Good |
| **OpenAI Whisper** | Fallback if browser unsupported | ~.006/min | Excellent |

**Web Speech API Hook:**
`	ypescript
// src/hooks/useSpeechRecognition.ts
'use client';
import { useState, useCallback, useRef } from 'react';

export function useSpeechRecognition() {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [interimTranscript, setInterimTranscript] = useState('');
  const recognitionRef = useRef<any>(null);

  const isSupported = typeof window !== 'undefined' &&
    ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window);

  const startListening = useCallback(() => {
    if (!isSupported) return;

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();

    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onstart = () => setIsListening(true);

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let interim = '';
      let final = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        if (result.isFinal) {
          final += result[0].transcript;
        } else {
          interim += result[0].transcript;
        }
      }
      if (final) setTranscript(prev => prev + final);
      setInterimTranscript(interim);
    };

    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);

    recognitionRef.current = recognition;
    recognition.start();
  }, [isSupported]);

  const stopListening = useCallback(() => {
    recognitionRef.current?.stop();
    setIsListening(false);
  }, []);

  const resetTranscript = useCallback(() => {
    setTranscript('');
    setInterimTranscript('');
  }, []);

  return { isListening, transcript, interimTranscript, startListening, stopListening, resetTranscript, isSupported };
}
`

**Whisper API Fallback:**
`	ypescript
// src/lib/whisper.ts
import OpenAI from 'openai';

const client = new OpenAI({
  baseURL: 'https://integrate.api.nvidia.com/v1',
  apiKey: process.env.NVIDIA_API_KEY,
});

export async function transcribeWithWhisper(audioBlob: Blob): Promise<string> {
  const file = new File([audioBlob], 'audio.webm', { type: 'audio/webm' });
  const response = await client.audio.transcriptions.create({
    model: 'openai/whisper-large-v3',
    file: file,
    language: 'en',
  });
  return response.text;
}
`

**STT API Route:**
`	ypescript
// src/app/api/voice/transcribe/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { transcribeWithWhisper } from '@/lib/whisper';

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const audio = formData.get('audio') as Blob;
  if (!audio) {
    return NextResponse.json({ error: 'No audio provided' }, { status: 400 });
  }
  const text = await transcribeWithWhisper(audio);
  return NextResponse.json({ text });
}
`

#### 4B. Text-to-Speech (TTS) - Sarah Speaking Back

**Google Cloud TTS:**
`	ypescript
// src/lib/google-tts.ts
import textToSpeech from '@google-cloud/text-to-speech';

const client = new textToSpeech.TextToSpeechClient();

export async function synthesizeSpeech(options: {
  text: string;
  voiceName?: string;
  speed?: number;
}) {
  const { text, voiceName = 'en-US-Neural2-F', speed = 1.0 } = options;

  const [response] = await client.synthesizeSpeech({
    input: { text },
    voice: {
      languageCode: 'en-US',
      name: voiceName,
      ssmlGender: 'FEMALE',
    },
    audioConfig: {
      audioEncoding: 'MP3',
      speakingRate: speed,
    },
  });

  return response.audioContent;
}
`

**Recommended Google TTS Voices for Sarah:**
| Voice Name | Style | Best For |
|------------|-------|----------|
| en-US-Neural2-F | Warm, professional | Default Sarah voice |
| en-US-Neural2-H | Soft, gentle | Calming conversations |
| en-US-Neural2-J | Youthful, friendly | Young adult users |
| en-GB-Neural2-F | British accent | Alternative personality |

**TTS API Route:**
`	ypescript
// src/app/api/voice/synthesize/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { synthesizeSpeech } from '@/lib/google-tts';

export async function POST(req: NextRequest) {
  const { text, voiceName, speed } = await req.json();
  if (!text) {
    return NextResponse.json({ error: 'No text provided' }, { status: 400 });
  }
  const audioBuffer = await synthesizeSpeech({ text, voiceName, speed });
  return new NextResponse(audioBuffer, {
    headers: {
      'Content-Type': 'audio/mpeg',
      'Cache-Control': 'public, max-age=3600',
    },
  });
}
`

#### 4C. Voice Control UI Component

`	ypescript
// src/components/VoiceControl.tsx
'use client';
import { useState, useRef, useEffect } from 'react';
import { useSpeechRecognition } from '@/hooks/useSpeechRecognition';

interface VoiceControlProps {
  onTranscript: (text: string) => void;
  onSpeak: (text: string) => void;
  isSpeaking: boolean;
}

export function VoiceControl({ onTranscript, onSpeak, isSpeaking }: VoiceControlProps) {
  const { isListening, transcript, interimTranscript, startListening, stopListening, isSupported } = useSpeechRecognition();
  const [audioLevel, setAudioLevel] = useState(0);
  const analyserRef = useRef<AnalyserNode | null>(null);

  useEffect(() => {
    if (transcript) {
      onTranscript(transcript);
    }
  }, [transcript, onTranscript]);

  const toggleListening = async () => {
    if (isListening) {
      stopListening();
    } else {
      // Request microphone for audio visualization
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const audioContext = new AudioContext();
      const source = audioContext.createMediaStreamSource(stream);
      analyserRef.current = audioContext.createAnalyser();
      source.connect(analyserRef.current);
      startListening();
    }
  };

  return (
    <div className="flex items-center gap-3">
      {/* Mic Button with Pulse Animation */}
      <button
        onClick={toggleListening}
        disabled={!isSupported || isSpeaking}
        className={
          relative p-4 rounded-full transition-all duration-300
          
          disabled:opacity-50 disabled:cursor-not-allowed
        }
      >
        <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z"/>
          <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z"/>
        </svg>
        {isListening && (
          <span className="absolute inset-0 rounded-full bg-red-400 animate-ping opacity-75" />
        )}
      </button>

      {/* Audio Visualizer Bars */}
      {isListening && (
        <div className="flex items-center gap-1 h-8">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="w-1 bg-teal-400 rounded-full animate-bounce"
              style={{
                height: ${Math.random() * 24 + 8}px,
                animationDelay: ${i * 0.1}s,
              }}
            />
          ))}
        </div>
      )}

      {/* Interim Transcript Display */}
      {interimTranscript && (
        <p className="text-sm text-gray-400 italic truncate max-w-xs">
          {interimTranscript}
        </p>
      )}

      {/* Status Indicator */}
      <span className="text-xs text-gray-500">
        {isListening ? 'Listening...' : isSpeaking ? 'Sarah speaking...' : 'Click mic to speak'}
      </span>
    </div>
  );
}
`

#### 4D. Combined Voice Hook

`	ypescript
// src/hooks/useVoice.ts
'use client';
import { useState, useCallback } from 'react';
import { useSpeechRecognition } from './useSpeechRecognition';

export function useVoice() {
  const speechRecognition = useSpeechRecognition();
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);

  const speak = useCallback(async (text: string) => {
    setIsSpeaking(true);
    try {
      const response = await fetch('/api/voice/synthesize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      });
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      setAudioUrl(url);

      const audio = new Audio(url);
      audio.onended = () => {
        setIsSpeaking(false);
        URL.revokeObjectURL(url);
        setAudioUrl(null);
      };
      audio.onerror = () => setIsSpeaking(false);
      await audio.play();
    } catch (error) {
      console.error('TTS failed:', error);
      // Fallback to browser TTS
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.onend = () => setIsSpeaking(false);
      speechSynthesis.speak(utterance);
    }
  }, []);

  const stopSpeaking = useCallback(() => {
    speechSynthesis.cancel();
    setIsSpeaking(false);
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
      setAudioUrl(null);
    }
  }, [audioUrl]);

  return {
    ...speechRecognition,
    isSpeaking,
    speak,
    stopSpeaking,
    audioUrl,
  };
}
`

---

### Phase 5: Mood Tracking System

**Features:**
1. Manual Mood Logging - emoji/rating + emotions + note
2. Chat-Based Detection - AI auto-logs mood from conversations
3. Mood History - past entries with filters

**Mood Scale:**
- 1: Very Low
- 2: Low
- 3: Neutral
- 4: Good
- 5: Great

**Emotion Tags:** stressed, anxious, sad, angry, lonely, hopeful, grateful, calm, overwhelmed, happy, motivated, tired

**API Endpoints:**
- POST /api/mood - Log a mood entry
- GET /api/mood - Get mood history
- GET /api/mood/stats - Get mood statistics

---

### Phase 6: Dashboard and Analytics

**Charts:**
1. Mood Trend Line - line chart over time (7/30/90 days)
2. Emotion Distribution - pie/donut chart
3. Weekly Summary - average mood per week
4. Streak Tracker - consecutive logging days

---

### Phase 7: Crisis Detection and Safety

**Detection Methods:**
1. Keyword Matching - crisis keywords/phrases
2. Sentiment Analysis - extreme negative scores
3. Pattern Detection - repeated negative patterns

**Response Protocol:**
1. Acknowledge feelings with empathy
2. Gently express concern
3. Provide immediate resources:
   - National Suicide Prevention Lifeline: 988
   - Crisis Text Line: Text HOME to 741741
   - IASP: https://www.iasp.info/resources/Crisis_Centres/
4. Suggest contacting trusted person
5. Offer to help find local professional support

---

### Phase 8: UI/UX Polish and Testing

**Design Principles:**
- Calming color palette (soft blues, greens, lavender)
- Clean, minimal interface
- Responsive design (mobile-first)
- Accessible (WCAG 2.1)
- Dark mode support

**Pages:**
1. Landing Page - hero, features, about Sarah
2. Chat Page - full conversation + voice interface
3. Dashboard - mood analytics
4. Mood Log - quick entry
5. Settings - voice preferences, notifications

---

## Environment Variables (.env.local)

`env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/healthchat"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-here"

# Google OAuth
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# NVIDIA AI
NVIDIA_API_KEY="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"

# Google Cloud TTS (optional, falls back to browser TTS)
GOOGLE_APPLICATION_CREDENTIALS="./credentials.json"
`

---

## Development Commands

`ash
# Setup
npm install
npx prisma generate
npx prisma db push

# Development
npm run dev

# Build
npm run build

# Database
npx prisma studio
npx prisma db push
npx prisma migrate dev
`

---

## Estimated Timeline

| Phase | Duration | Priority |
|-------|----------|----------|
| Phase 1: Setup | 1-2 hours | High |
| Phase 2: Auth + DB | 2-3 hours | High |
| Phase 3: AI Chat | 3-4 hours | High |
| Phase 4: Voice (STT+TTS) | 4-5 hours | High |
| Phase 5: Mood Tracking | 2-3 hours | Medium |
| Phase 6: Dashboard | 2-3 hours | Medium |
| Phase 7: Crisis Detection | 1-2 hours | High |
| Phase 8: Polish | 2-3 hours | Medium |
| **Total** | **17-25 hours** | |

---

## Key Considerations

1. Privacy - conversations encrypted, GDPR compliant
2. Security - API keys in env vars only
3. Disclaimer - Sarah is not a replacement for professional help
4. Performance - streaming responses for real-time feel
5. Accessibility - screen reader support, keyboard navigation
6. Voice - graceful fallbacks when APIs unavailable
7. Mobile - responsive design, touch-friendly mic controls