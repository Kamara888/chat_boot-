'use client';

import Sidebar from '@/components/Sidebar';
import MobileBottomBar from '@/components/MobileBottomBar';
import ResourceCard from '@/components/ResourceCard';

const RESOURCES = [
  { title: '4-7-8 Breathing', description: 'Inhale for 4s, hold for 7s, exhale for 8s. A quick way to calm the nervous system.', tag: 'breathing' },
  { title: 'Box Breathing', description: 'Inhale, hold, exhale, hold — each for 4 seconds. Used by athletes and first responders.', tag: 'breathing' },
  { title: '5-4-3-2-1 Grounding', description: 'Name 5 things you see, 4 you touch, 3 you hear, 2 you smell, 1 you taste.', tag: 'mindfulness' },
  { title: 'Body Scan', description: 'Slowly bring attention to each part of your body to release built-up tension.', tag: 'mindfulness' },
  { title: 'Gratitude Journal', description: 'Write down three things you are grateful for each day to shift your focus.', tag: 'mindfulness' },
  { title: 'Progressive Muscle Relaxation', description: 'Tense and release muscle groups from head to toe to ease physical stress.', tag: 'mindfulness' },
  { title: 'Thought Reframing', description: 'Notice unhelpful thoughts and gently challenge them with kinder perspectives.', tag: 'cbt' },
  { title: 'Self-Compassion', description: 'Treat yourself with the same warmth you would offer a good friend.', tag: 'cbt' },
  { title: 'Sleep Hygiene', description: 'Build a calm wind-down routine to improve rest and recovery.', tag: 'mindfulness' },
  { title: 'Mindful Walking', description: 'A short walk paying attention to your steps and surroundings can clear the mind.', tag: 'mindfulness' },
  { title: 'Journaling Prompts', description: 'What went well today? What am I avoiding? Writing helps untangle thoughts.', tag: 'mindfulness' },
  { title: 'Connect with Others', description: 'Reaching out to someone you trust is one of the strongest buffers against stress.', tag: 'crisis' },
];

export default function ResourcesPage() {
  return (
    <div className="page">
      <Sidebar />
      <div className="main">
        <div className="page-head">
          <div className="page-head-icon">📚</div>
          <div>
            <div className="page-title">Resources</div>
            <div className="page-sub">Tools and exercises to support your wellbeing</div>
          </div>
        </div>

        <div className="page-content">
          <div className="page-grid">
            {RESOURCES.map(r => (
              <ResourceCard key={r.title} title={r.title} description={r.description} tag={r.tag} />
            ))}
          </div>
        </div>
      </div>
      <MobileBottomBar />
    </div>
  );
}
