'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

export function useSpeechSynthesis() {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const voicesRef = useRef<SpeechSynthesisVoice[]>([]);

  useEffect(() => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    setIsSupported(true);
    const load = () => {
      voicesRef.current = window.speechSynthesis.getVoices();
    };
    load();
    window.speechSynthesis.onvoiceschanged = load;
    return () => {
      window.speechSynthesis.onvoiceschanged = null;
    };
  }, []);

  const pickVoice = useCallback(() => {
    const voices = voicesRef.current;
    if (!voices.length) return null;
    return (
      voices.find(v => /female|samantha|zira|google us english/i.test(v.name)) ||
      voices.find(v => v.lang?.startsWith('en')) ||
      voices[0]
    );
  }, []);

  const speak = useCallback(
    (text: string) => {
      return new Promise<void>(resolve => {
        if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
          resolve();
          return;
        }
        window.speechSynthesis.cancel();
        const u = new SpeechSynthesisUtterance(text);
        const voice = pickVoice();
        if (voice) u.voice = voice;
        u.rate = 1;
        u.pitch = 1;
        u.onstart = () => setIsSpeaking(true);
        u.onend = () => {
          setIsSpeaking(false);
          resolve();
        };
        u.onerror = () => {
          setIsSpeaking(false);
          resolve();
        };
        window.speechSynthesis.speak(u);
      });
    },
    [pickVoice]
  );

  const stop = useCallback(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsSpeaking(false);
  }, []);

  return { isSpeaking, isSupported, speak, stop };
}
