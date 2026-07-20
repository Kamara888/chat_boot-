'use client';

import { useState } from 'react';

interface Props {
  onSelect: (rating: number) => void;
  selected?: number;
}

const MOODS = [
  { rating: 1, emoji: '😢', label: 'Terrible' },
  { rating: 2, emoji: '😟', label: 'Bad' },
  { rating: 3, emoji: '😐', label: 'Okay' },
  { rating: 4, emoji: '🙂', label: 'Good' },
  { rating: 5, emoji: '😊', label: 'Great' },
  { rating: 6, emoji: '😄', label: 'Amazing' },
];

export default function MoodCheckIn({ onSelect, selected }: Props) {
  return (
    <div className="check-in-card">
      <div className="check-in-title">How are you feeling?</div>
      <div className="check-in-desc">Tap to log your mood</div>
      <div className="mood-selector">
        {MOODS.map(mood => (
          <button
            key={mood.rating}
            className={`mood-option ${selected === mood.rating ? 'selected' : ''}`}
            onClick={() => onSelect(mood.rating)}
            title={mood.label}
          >
            {mood.emoji}
          </button>
        ))}
      </div>
    </div>
  );
}
