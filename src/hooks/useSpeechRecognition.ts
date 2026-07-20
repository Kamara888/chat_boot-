'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

export function useSpeechRecognition(onFinal?: (text: string) => void) {
  const [isListening, setIsListening] = useState(false);
  const [interim, setInterim] = useState('');
  const recognitionRef = useRef<any>(null);
  const keepListeningRef = useRef(false);
  const onFinalRef = useRef(onFinal);
  onFinalRef.current = onFinal;

  const isSupported =
    typeof window !== 'undefined' &&
    ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window);

  const start = useCallback(() => {
    if (!isSupported || recognitionRef.current) return;
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SR();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onstart = () => setIsListening(true);
    recognition.onresult = (event: any) => {
      let finalText = '';
      let interimText = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        if (result.isFinal) finalText += result[0].transcript;
        else interimText += result[0].transcript;
      }
      setInterim(interimText);
      if (finalText.trim()) {
        setInterim('');
        onFinalRef.current?.(finalText.trim());
      }
    };
    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => {
      setIsListening(false);
      if (keepListeningRef.current) {
        try {
          recognition.start();
          setIsListening(true);
        } catch {
          /* noop */
        }
      }
    };

    recognitionRef.current = recognition;
    keepListeningRef.current = true;
    try {
      recognition.start();
      setIsListening(true);
    } catch {
      /* noop */
    }
  }, [isSupported]);

  const stop = useCallback(() => {
    keepListeningRef.current = false;
    try {
      recognitionRef.current?.stop();
    } catch {
      /* noop */
    }
    recognitionRef.current = null;
    setIsListening(false);
    setInterim('');
  }, []);

  useEffect(
    () => () => {
      keepListeningRef.current = false;
      try {
        recognitionRef.current?.stop();
      } catch {
        /* noop */
      }
    },
    []
  );

  return { isListening, interim, start, stop, isSupported };
}
