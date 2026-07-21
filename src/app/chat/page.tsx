'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import ChatMessage from '@/components/ChatMessage';
import ChatInput from '@/components/ChatInput';
import TypingIndicator from '@/components/TypingIndicator';
import QuickReplies from '@/components/QuickReplies';
import CrisisBanner from '@/components/CrisisBanner';
import RightPanel from '@/components/RightPanel';
import MobileBottomBar from '@/components/MobileBottomBar';
import VoiceControl from '@/components/VoiceControl';
import { useSpeechRecognition } from '@/hooks/useSpeechRecognition';
import { useSpeechSynthesis } from '@/hooks/useSpeechSynthesis';
import { useSession } from 'next-auth/react';
import { ChatMessage as ChatMessageType } from '@/types';

export default function ChatPage() {
  const [messages, setMessages] = useState<ChatMessageType[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isCrisis, setIsCrisis] = useState(false);
  const [voiceMode, setVoiceMode] = useState(false);
  const [moodRating, setMoodRating] = useState<number | undefined>();
  const [moods, setMoods] = useState<Record<string, number>>({});
  const [showDashboard, setShowDashboard] = useState(true);
  const [aiDegraded, setAiDegraded] = useState(false);
  const [wellnessOpen, setWellnessOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesRef = useRef<ChatMessageType[]>([]);
  const voiceActiveRef = useRef(false);
  const awaitingNameRef = useRef(false);
  const startedRef = useRef(false);
  const lastReplyRef = useRef('');
  const echoLockRef = useRef(false);
  const echoTimerRef = useRef<any>(null);

  const { data: session, status: sessionStatus } = useSession();

  const tts = useSpeechSynthesis();

  const pushAssistant = useCallback((content: string) => {
    const msg: ChatMessageType = {
      id: crypto.randomUUID(),
      role: 'assistant',
      content,
      timestamp: new Date(),
    };
    const updated = [...messagesRef.current, msg];
    setMessages(updated);
    messagesRef.current = updated;
  }, []);

  const sendMessageInternal = useCallback(
    async (text: string, speak: boolean) => {
      if (awaitingNameRef.current) {
        awaitingNameRef.current = false;
        const name = text.trim();
        const userMsg: ChatMessageType = {
          id: crypto.randomUUID(),
          role: 'user',
          content: text,
          timestamp: new Date(),
        };
        const history = [...messagesRef.current, userMsg];
        setMessages(history);
        messagesRef.current = history;

        const reply = `It's so lovely to meet you, ${name}! 💙 I'm Sarah, your wellness companion. I'm here to listen without judgment and support you through whatever you're feeling. How are you doing today?`;
        const assistantMsg: ChatMessageType = {
          id: crypto.randomUUID(),
          role: 'assistant',
          content: reply,
          timestamp: new Date(),
        };
        const updated = [...history, assistantMsg];
        setMessages(updated);
        messagesRef.current = updated;
        lastReplyRef.current = reply;
        if (typeof window !== 'undefined') {
          localStorage.setItem('mc_username', name);
          localStorage.setItem(`mc_onboarded_${session?.user?.email || 'guest'}`, '1');
        }
        if (speak && voiceActiveRef.current) {
          await tts.speak(reply);
          beginListeningAfterSpeak();
        }
        return;
      }

      const userMsg: ChatMessageType = {
        id: crypto.randomUUID(),
        role: 'user',
        content: text,
        timestamp: new Date(),
      };
      const history = [...messagesRef.current, userMsg];
      setMessages(history);
      messagesRef.current = history;
      setIsLoading(true);

      try {
        const res = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            messages: history.map(m => ({ role: m.role, content: m.content })),
          }),
        });

        const data = await res.json();

        const assistantMsg: ChatMessageType = {
          id: crypto.randomUUID(),
          role: 'assistant',
          content: data.content || "I'm here for you. Tell me more.",
          timestamp: new Date(),
          sentiment: data.sentiment,
        };
        const updated = [...history, assistantMsg];
        setMessages(updated);
        messagesRef.current = updated;
        lastReplyRef.current = assistantMsg.content;

        if (data.isCrisis) setIsCrisis(true);
        if (data.degraded) setAiDegraded(true);

        if (speak && voiceActiveRef.current) {
          await tts.speak(assistantMsg.content);
          beginListeningAfterSpeak();
        }
      } catch {
        const errMsg: ChatMessageType = {
          id: crypto.randomUUID(),
          role: 'assistant',
          content: "I'm sorry, I had trouble connecting. Please try again.",
          timestamp: new Date(),
        };
        const updated = [...history, errMsg];
        setMessages(updated);
        messagesRef.current = updated;
        lastReplyRef.current = errMsg.content;
        setAiDegraded(true);
        if (speak && voiceActiveRef.current) {
          await tts.speak(errMsg.content);
          beginListeningAfterSpeak();
        }
      } finally {
        setIsLoading(false);
      }
    },
    [tts]
  );

  const normalize = (s: string) => s.toLowerCase().replace(/[^a-z0-9 ]/g, '').replace(/\s+/g, ' ').trim();

  const isEcho = (text: string) => {
    const t = normalize(text);
    const last = normalize(lastReplyRef.current);
    if (!last || !t) return false;
    if (t.length >= 8 && (last.includes(t) || t.includes(last.slice(0, Math.min(last.length, t.length))))) {
      return true;
    }
    return false;
  };

  const recognition = useSpeechRecognition((text: string) => {
    if (!voiceActiveRef.current) return;
    if (echoLockRef.current) return;
    if (isEcho(text)) return;
    recognition.stop();
    sendMessageInternal(text, true);
  });

  const beginListeningAfterSpeak = useCallback(() => {
    if (!voiceActiveRef.current) return;
    echoLockRef.current = true;
    recognition.start();
    if (echoTimerRef.current) clearTimeout(echoTimerRef.current);
    echoTimerRef.current = setTimeout(() => {
      echoLockRef.current = false;
    }, 1500);
  }, [recognition]);

  const sendMessage = useCallback(
    (text: string) => {
      sendMessageInternal(text, false);
    },
    [sendMessageInternal]
  );

  const toggleVoice = useCallback(() => {
    const next = !voiceMode;
    setVoiceMode(next);
    voiceActiveRef.current = next;
    if (next) {
      const greeting =
        awaitingNameRef.current && lastReplyRef.current
          ? lastReplyRef.current
          : messagesRef.current.length === 0
            ? "Hi, I'm Sarah, your wellness companion. How are you feeling today?"
            : "I'm listening.";
      lastReplyRef.current = greeting;
      tts.speak(greeting).then(() => {
        beginListeningAfterSpeak();
      });
    } else {
      recognition.stop();
      tts.stop();
    }
  }, [voiceMode, tts, recognition, messages, beginListeningAfterSpeak]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  useEffect(() => {
    if (startedRef.current) return;
    if (sessionStatus === 'loading') return;
    startedRef.current = true;

    if (typeof window === 'undefined') return;
    const key = `mc_onboarded_${session?.user?.email || 'guest'}`;
    if (localStorage.getItem(key)) return;
    if (messagesRef.current.length > 0) return;

    const knownName = session?.user?.name;
    if (knownName) {
      pushAssistant(
        `Hi ${knownName}! I'm Sarah, your wellness companion. 💙 I'm here to listen without judgment and support you through whatever you're feeling. How are you doing today?`
      );
      localStorage.setItem(key, '1');
    } else {
      pushAssistant(
        "Hi there! I'm Sarah, your wellness companion. 💙 Before we begin, I'd love to know what to call you. What's your name?"
      );
      awaitingNameRef.current = true;
    }
  }, [session, sessionStatus, pushAssistant]);

  const getChartData = useCallback(() => {
    return Array.from({ length: 7 }, (_, i) => moods[String(i)] || 0);
  }, [moods]);

  const handleMoodSelect = (rating: number) => {
    setMoodRating(rating);
    const day = new Date().getDay();
    const key = day === 0 ? '6' : String(day - 1);
    setMoods(prev => ({ ...prev, [key]: rating }));
  };

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', backgroundImage: 'linear-gradient(rgba(11,14,20,0.5),rgba(11,14,20,0.5)), url("/aik.jpg")', backgroundSize: 'cover', backgroundPosition: 'center', backgroundAttachment: 'fixed' }}>
      <Sidebar onToggleDashboard={() => setShowDashboard(v => !v)} />
      <div className={`main ${voiceMode ? 'voice-active' : ''}`}>
        <Header
          voiceMode={voiceMode}
          onToggleVoice={toggleVoice}
          onNotifications={() => {}}
          statusNote={aiDegraded ? 'Offline mode — limited responses' : undefined}
        />
        <CrisisBanner isCrisis={isCrisis} />
        <div className="content">
          <div className="chat-area">
            <div className="messages">
              {messages.length === 0 && (
                <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--text3)' }}>
                  <div style={{ fontSize: 48, marginBottom: 16 }}>🧠</div>
                  <div style={{ fontSize: 18, fontWeight: 600, color: 'var(--text)', marginBottom: 8 }}>
                    Welcome to MindfulChat
                  </div>
                  <div style={{ fontSize: 13 }}>
                    I&apos;m Sarah, your wellness companion. How are you feeling today?
                  </div>
                </div>
              )}
              {messages.map(msg => (
                <ChatMessage key={msg.id} message={msg} />
              ))}
              {isLoading && <TypingIndicator />}
              <div ref={messagesEndRef} />
            </div>
            {voiceMode ? (
              <VoiceControl
                isListening={recognition.isListening}
                isSpeaking={tts.isSpeaking}
                interim={recognition.interim}
                onToggle={toggleVoice}
              />
            ) : (
              <>
                <QuickReplies onSelect={sendMessage} />
                <ChatInput onSend={sendMessage} disabled={isLoading} />
              </>
            )}
          </div>
          {!isMobile && showDashboard && (
            <RightPanel
              moodRating={moodRating}
              onMoodSelect={handleMoodSelect}
              chartData={getChartData()}
              moods={moods}
            />
          )}
        </div>
        {isMobile && (
          <button className="mobile-fab mobile-fab-pulse" onClick={() => setWellnessOpen(v => !v)} aria-label="Wellness dashboard">
            📊
          </button>
        )}
        <RightPanel
          moodRating={moodRating}
          onMoodSelect={handleMoodSelect}
          chartData={getChartData()}
          moods={moods}
          isMobile={isMobile}
          isOpen={wellnessOpen}
          onClose={() => setWellnessOpen(false)}
        />
      </div>
      {isMobile && <MobileBottomBar />}
    </div>
  );
}
