'use client';

interface Props {
  averageRating: number;
  totalEntries: number;
  streak: number;
  trend: string;
}

export default function MoodStats({ averageRating, totalEntries, streak, trend }: Props) {
  return (
    <div className="mood-stats">
      <div className="mood-stat">
        <div className="mood-stat-value">{averageRating.toFixed(1)}</div>
        <div className="mood-stat-label">Average</div>
      </div>
      <div className="mood-stat">
        <div className="mood-stat-value">{totalEntries}</div>
        <div className="mood-stat-label">Check-ins</div>
      </div>
      <div className="mood-stat">
        <div className="mood-stat-value">{streak}</div>
        <div className="mood-stat-label">Day Streak</div>
      </div>
      <div className="mood-stat">
        <div className="mood-stat-value">{trend}</div>
        <div className="mood-stat-label">Trend</div>
      </div>
    </div>
  );
}
