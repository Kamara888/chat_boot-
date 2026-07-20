'use client';

export default function TypingIndicator() {
  return (
    <div className="typing-indicator">
      <div className="msg-avatar" style={{ width: 28, height: 28, borderRadius: '50%', background: 'linear-gradient(135deg, var(--calm), var(--accent))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, color: '#0b0e14' }}>
        🧠
      </div>
      <div>
        <div className="typing-dots">
          <span /><span /><span />
        </div>
        <div className="typing-label">Sarah is thinking...</div>
      </div>
    </div>
  );
}
