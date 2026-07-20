import { NextResponse } from 'next/server';
import textToSpeech from '@google-cloud/text-to-speech';

export const runtime = 'nodejs';

const client = new textToSpeech.TextToSpeechClient();

export async function POST(req: Request) {
  try {
    const { text, voiceName = 'en-US-Neural2-F', speed = 1.0 } = await req.json();

    if (!text) {
      return NextResponse.json({ error: 'Text required' }, { status: 400 });
    }

    const [response] = await client.synthesizeSpeech({
      input: { text },
      voice: { languageCode: 'en-US', name: voiceName, ssmlGender: 'FEMALE' },
      audioConfig: { audioEncoding: 'MP3', speakingRate: speed },
    });

    const audio = response.audioContent;
    if (!audio) {
      return NextResponse.json({ error: 'No audio generated' }, { status: 500 });
    }

    return new NextResponse(Buffer.from(audio as Uint8Array), {
      headers: {
        'Content-Type': 'audio/mpeg',
        'Cache-Control': 'public, max-age=3600',
      },
    });
  } catch (error: any) {
    console.error('TTS error:', error?.message || error);
    return NextResponse.json(
      { error: 'TTS failed', detail: error?.message || 'Google credentials not configured' },
      { status: 500 }
    );
  }
}
