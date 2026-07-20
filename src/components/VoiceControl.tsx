'use client';

interface Props {
  isListening: boolean;
  isSpeaking: boolean;
  interim: string;
  onToggle: () => void;
}

export default function VoiceControl({ isListening, isSpeaking, interim, onToggle }: Props) {
  const status = isSpeaking
    ? 'Sarah is speaking…'
    : isListening
      ? 'Listening — tap to pause'
      : 'Voice paused';

  return (
    <div className="voice-control">
      <button
        className={`voice-mic ${isListening ? 'listening' : ''} ${isSpeaking ? 'speaking' : ''}`}
        onClick={onToggle}
        title={isListening ? 'Stop listening' : 'Start listening'}
      >
        <span className="voice-ring" />
        <span className="voice-mic-icon">{isSpeaking ? '🔊' : '🎤'}</span>
      </button>

      <div className="voice-info">
        <div className="voice-status-text">{status}</div>
        {interim && <div className="voice-interim">“{interim}”</div>}
      </div>

      <div className="voice-wave">
        {[0, 1, 2, 3, 4].map(i => (
          <span
            key={i}
            className={`voice-bar ${isListening || isSpeaking ? 'active' : ''}`}
            style={{ animationDelay: `${i * 0.12}s` }}
          />
        ))}
      </div>
    </div>
  );
}
