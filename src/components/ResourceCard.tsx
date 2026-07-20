'use client';

interface Props {
  title: string;
  description: string;
  tag?: string;
}

export default function ResourceCard({ title, description, tag }: Props) {
  return (
    <div className="resource-card">
      <div className="resource-card-title">{title}</div>
      <div className="resource-card-desc">{description}</div>
      {tag && <span className={`resource-card-tag tag-${tag}`}>{tag}</span>}
    </div>
  );
}
