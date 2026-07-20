'use client';

import { useState } from 'react';

interface HeaderProps {
  voiceMode: boolean;
  onToggleVoice: () => void;
  onNotifications: () => void;
  statusNote?: string;
}

export default function Header({ voiceMode, onToggleVoice, onNotifications, statusNote }: HeaderProps) {
  return (
    <header className="header">
      <div className="header-left">
        <div className="header-avatar">🧠</div>
        <div className="header-info">
          <div className="header-title">MindfulChat Wellness Companion</div>
          <div className={`header-sub ${statusNote ? 'degraded' : ''}`}>{statusNote || 'Ready to help'}</div>
        </div>
      </div>
      <div className="header-actions">
        <button className={`header-btn ${voiceMode ? 'active' : ''}`} onClick={onToggleVoice} title="Toggle voice mode">
          🎤
        </button>
        <button className="header-btn" onClick={onNotifications} title="Notifications">
          🔔
        </button>
      </div>
    </header>
  );
}
