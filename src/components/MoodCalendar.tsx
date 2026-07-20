'use client';

interface Props {
  moods: Record<string, number>;
}

const DAYS = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

function getMoodClass(rating: number): string {
  if (rating === 0) return '';
  return `mood-${rating}`;
}

function getToday(): number {
  const d = new Date().getDay();
  return d === 0 ? 6 : d - 1;
}

export default function MoodCalendar({ moods }: Props) {
  const today = getToday();

  return (
    <div>
      <div className="week-labels">
        {DAYS.map((d, i) => (
          <div key={i} className="week-label">{d}</div>
        ))}
      </div>
      <div className="mood-grid">
        {DAYS.map((_, i) => {
          const mood = moods[String(i)] || 0;
          return (
            <div
              key={i}
              className={`mood-day ${getMoodClass(mood)} ${i === today ? 'today' : ''}`}
              title={mood ? `${DAYS[i]}: ${mood}/6` : `${DAYS[i]}: No entry`}
            >
              {mood > 0 ? ['', '', '😟', '😐', '🙂', '😊', '😄'][mood] : ''}
            </div>
          );
        })}
      </div>
    </div>
  );
}
