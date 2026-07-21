'use client';

import { useState } from 'react';

interface HeaderProps {
  voiceMode: boolean;
  onToggleVoice: () => void;
  onNotifications: () => void;
  statusNote?: string;
  onMenuToggle?: () => void;
  onToggleWellness?: () => void;
}

export default function Header({ voiceMode, onToggleVoice, onNotifications, statusNote, onToggleWellness }: HeaderProps) {
  return (
    <header className="header">
      <div className="header-left">
        <div className="header-logo">M</div>
        <div className="header-avatar">🧠</div>
        <div className="header-info">
          <div className="header-title">MindfulChat</div>
          <div className={`header-sub ${statusNote ? 'degraded' : ''}`}>{statusNote || 'Ready to help'}</div>
        </div>
      </div>
      <div className="header-actions">
        {onToggleWellness && (
          <button className="header-btn header-btn-wellness" onClick={onToggleWellness} title="Wellness Overview">
            📊
          </button>
        )}
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
