'use client';

interface Props {
  isCrisis: boolean;
}

export default function CrisisBanner({ isCrisis }: Props) {
  if (!isCrisis) return null;

  return (
    <div className="crisis-banner visible">
      <span className="icon">🆘</span>
      <span className="text">
        <strong>Immediate Support Available</strong> — If you're in crisis, please reach out now.
      </span>
      <a href="tel:988" className="hotline">
        Call 988
      </a>
    </div>
  );
}
