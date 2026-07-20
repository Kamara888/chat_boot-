'use client';

import type { ChatMessage as ChatMessageType } from '@/types';

interface Props {
  message: ChatMessageType;
}

export default function ChatMessage({ message }: Props) {
  const time = message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <div className={`msg ${message.role === 'user' ? 'outgoing' : 'incoming'}`}>
      <div className="msg-avatar">
        {message.role === 'user' ? '👤' : '🧠'}
      </div>
      <div>
        <div className="msg-content">{message.content}</div>
        <div className="msg-time">{time}</div>
      </div>
    </div>
  );
}
