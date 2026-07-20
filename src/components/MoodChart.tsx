'use client';

interface Props {
  data: number[];
}

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export default function MoodChart({ data }: Props) {
  const max = Math.max(...data, 1);

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
        {DAYS.map((day, i) => (
          <span key={day} style={{ fontSize: 10, color: 'var(--text3)', flex: 1, textAlign: 'center' }}>{day}</span>
        ))}
      </div>
      <div className="chart">
        {data.map((val, i) => (
          <div
            key={i}
            className="chart-bar"
            style={{ height: `${(val / max) * 100}%`, opacity: val > 0 ? 0.6 : 0.15 }}
            title={`${DAYS[i]}: ${val}/6`}
          />
        ))}
      </div>
    </div>
  );
}
