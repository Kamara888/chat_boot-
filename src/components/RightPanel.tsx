'use client';

import MoodCheckIn from './MoodCheckIn';
import MoodChart from './MoodChart';
import MoodStats from './MoodStats';
import MoodCalendar from './MoodCalendar';
import ResourceCard from './ResourceCard';

interface Props {
  moodRating?: number;
  onMoodSelect: (rating: number) => void;
  chartData: number[];
  moods: Record<string, number>;
  isMobile?: boolean;
  isOpen?: boolean;
  onClose?: () => void;
}

export default function RightPanel({ moodRating, onMoodSelect, chartData, moods, isMobile, isOpen, onClose }: Props) {
  const totalEntries = Object.values(moods).filter(v => v > 0).length;
  const values = Object.values(moods).filter(v => v > 0);
  const average = values.length ? values.reduce((a, b) => a + b, 0) / values.length : 0;

  const body = (
    <>
      <div className="panel-section">
        <div className="panel-label">Mood Check-in</div>
        <MoodCheckIn onSelect={onMoodSelect} selected={moodRating} />
      </div>

      <div className="panel-section">
        <div className="panel-label">This Week</div>
        <MoodChart data={chartData} />
        <MoodStats
          averageRating={average}
          totalEntries={totalEntries}
          streak={3}
          trend={average >= 4 ? '↑' : average >= 3 ? '→' : '↓'}
        />
      </div>

      <div className="panel-section">
        <div className="panel-label">Monthly View</div>
        <MoodCalendar moods={moods} />
      </div>

      <div className="panel-section">
        <div className="panel-label">Recommendations</div>
        <ResourceCard
          title="4-7-8 Breathing Technique"
          description="Inhale for 4s, hold for 7s, exhale for 8s. Helps reduce anxiety."
          tag="breathing"
        />
        <ResourceCard
          title="Body Scan Meditation"
          description="A 10-minute guided meditation to release tension."
          tag="mindfulness"
        />
      </div>
    </>
  );

  if (isMobile) {
    return (
      <>
        {isOpen && (
          <>
            <div className="mobile-sheet-backdrop" onClick={onClose} />
            <div className="mobile-sheet">
              <div className="mobile-sheet-handle" onClick={onClose}>
                <div className="mobile-sheet-handle-bar" />
              </div>
              <div className="panel-header" style={{ paddingTop: 0 }}>📊 Wellness Overview</div>
              {body}
            </div>
          </>
        )}
      </>
    );
  }

  return (
    <aside className="panel">
      <div className="panel-header">📊 Wellness Overview</div>
      {body}
    </aside>
  );
}
