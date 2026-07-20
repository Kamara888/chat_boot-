'use client';

interface Props {
  onSelect: (text: string) => void;
}

const QUICK_REPLIES = [
  'Feeling anxious',
  'Feeling sad',
  'Need to relax',
  'Track my mood',
];

export default function QuickReplies({ onSelect }: Props) {
  return (
    <div className="quick-replies">
      {QUICK_REPLIES.map(text => (
        <button key={text} className="quick-reply" onClick={() => onSelect(text)}>
          {text}
        </button>
      ))}
    </div>
  );
}
