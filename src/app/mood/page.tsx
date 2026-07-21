'use client';

import { useEffect, useMemo, useState } from 'react';
import Sidebar from '@/components/Sidebar';
import MoodCheckIn from '@/components/MoodCheckIn';
import MoodChart from '@/components/MoodChart';
import MoodStats from '@/components/MoodStats';
import MoodCalendar from '@/components/MoodCalendar';

interface Entry {
  rating: number;
  emotions: string[];
  note: string;
}

const EMOTIONS = [
  'stressed', 'anxious', 'sad', 'angry', 'lonely', 'hopeful',
  'grateful', 'calm', 'overwhelmed', 'happy', 'motivated', 'tired',
];

const SEED: Record<string, Entry> = {
  '0': { rating: 3, emotions: ['tired'], note: '' },
  '1': { rating: 4, emotions: ['calm'], note: '' },
  '2': { rating: 2, emotions: ['anxious', 'stressed'], note: '' },
  '4': { rating: 5, emotions: ['happy', 'grateful'], note: '' },
  '5': { rating: 4, emotions: ['hopeful'], note: '' },
};

function getTodayIndex(): number {
  const d = new Date().getDay();
  return d === 0 ? 6 : d - 1;
}

export default function MoodPage() {
  const [entries, setEntries] = useState<Record<string, Entry>>({});
  const [selectedMood, setSelectedMood] = useState<number | undefined>();
  const [emotions, setEmotions] = useState<string[]>([]);
  const [note, setNote] = useState('');
  const today = getTodayIndex();

  useEffect(() => {
    const stored = typeof window !== 'undefined' ? localStorage.getItem('mc_mood_entries') : null;
    const initial = stored ? JSON.parse(stored) : SEED;
    setEntries(initial);
    const t = initial[String(today)];
    if (t) {
      setSelectedMood(t.rating);
      setEmotions(t.emotions || []);
      setNote(t.note || '');
    }
  }, [today]);

  const save = (next: Record<string, Entry>) => {
    setEntries(next);
    if (typeof window !== 'undefined') localStorage.setItem('mc_mood_entries', JSON.stringify(next));
  };

  const handleMoodSelect = (rating: number) => {
    setSelectedMood(rating);
    const next = { ...entries, [String(today)]: { rating, emotions, note } };
    save(next);
  };

  const toggleEmotion = (emotion: string) => {
    const nextEmotions = emotions.includes(emotion)
      ? emotions.filter(e => e !== emotion)
      : [...emotions, emotion];
    setEmotions(nextEmotions);
    const next = { ...entries, [String(today)]: { rating: selectedMood || 0, emotions: nextEmotions, note } };
    save(next);
  };

  const handleNote = (value: string) => {
    setNote(value);
    const next = { ...entries, [String(today)]: { rating: selectedMood || 0, emotions, note: value } };
    save(next);
  };

  const ratings = useMemo(
    () => Array.from({ length: 7 }, (_, i) => entries[String(i)]?.rating || 0),
    [entries]
  );
  const ratingsMap = useMemo(
    () => Object.fromEntries(ratings.map((v, i) => [String(i), v])),
    [ratings]
  );
  const values = ratings.filter(v => v > 0);
  const average = values.length ? values.reduce((a, b) => a + b, 0) / values.length : 0;
  const trend = average >= 4 ? '↑' : average >= 3 ? '→' : '↓';

  return (
    <div className="page">
      <Sidebar />
      <div className="main">
        <div className="page-head">
          <div className="page-head-icon">😊</div>
          <div>
            <div className="page-title">Mood Tracker</div>
            <div className="page-sub">Track how you feel, one day at a time</div>
          </div>
        </div>

        <div className="page-content">
          <div className="page-grid">
            <div className="card card-accent">
              <MoodCheckIn onSelect={handleMoodSelect} selected={selectedMood} />
              <div className="section-title" style={{ marginTop: 18 }}>What else are you feeling?</div>
              <div className="emotion-row">
                {EMOTIONS.map(e => (
                  <button
                    key={e}
                    className={`emotion-chip ${emotions.includes(e) ? 'selected' : ''}`}
                    onClick={() => toggleEmotion(e)}
                  >
                    {e}
                  </button>
                ))}
              </div>
              <textarea
                className="note-input"
                placeholder="Add a note about your day (optional)…"
                value={note}
                onChange={e => handleNote(e.target.value)}
              />
            </div>

            <div className="card">
              <div className="section-title">This Week</div>
              <MoodChart data={ratings} />
              <MoodStats
                averageRating={average}
                totalEntries={values.length}
                streak={values.length}
                trend={trend}
              />
            </div>

            <div className="card">
              <div className="section-title">Monthly View</div>
              <MoodCalendar moods={ratingsMap} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
