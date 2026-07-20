export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  sentiment?: string;
  isVoice?: boolean;
}

export interface MoodEntry {
  id: string;
  rating: number;
  emotions: string[];
  note?: string;
  source: 'manual' | 'chat-detected';
  createdAt: Date;
}

export interface MoodStats {
  averageRating: number;
  totalEntries: number;
  emotionCounts: Record<string, number>;
  streak: number;
}
