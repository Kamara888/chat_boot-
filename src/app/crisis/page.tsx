'use client';

import Sidebar from '@/components/Sidebar';
import MobileBottomBar from '@/components/MobileBottomBar';
import ResourceCard from '@/components/ResourceCard';

export default function CrisisPage() {
  return (
    <div className="page">
      <Sidebar />
      <div className="main">
        <div className="page-head">
          <div className="page-head-icon">🆘</div>
          <div>
            <div className="page-title">Crisis Help</div>
            <div className="page-sub">You are not alone — support is available right now</div>
          </div>
        </div>

        <div className="page-content">
          <div className="crisis-banner visible" style={{ borderRadius: 'var(--radius)', marginBottom: 20 }}>
            <span className="icon">🆘</span>
            <div className="text">
              <strong>If you are in immediate danger, call emergency services (911) now.</strong>
              {' '}The resources below are free, confidential, and available 24/7.
            </div>
          </div>

          <div className="page-grid">
            <div className="card card-warm">
              <div className="card-title">📞 Crisis Lifeline</div>
              <div className="card-desc">Free, confidential support for people in distress, available 24 hours a day.</div>
              <a className="hotline-num" href="tel:074833724">Call 074 833 724</a>
            </div>

            <div className="card card-warm">
              <div className="card-title">📞 Local Crisis Line</div>
              <div className="card-desc">Your official local crisis helpline, staffed by trained counselors. Free and confidential.</div>
              <a className="hotline-num" href="tel:074990606">Call 074 990 606</a>
            </div>

            <div className="card card-warm">
              <div className="card-title">💬 Crisis Text Line</div>
              <div className="card-desc">Text with a trained crisis counselor. Available 24/7.</div>
              <a className="hotline-num warm" href="sms:032137062?&body=HOME">Text HOME to 032137062</a>
            </div>

            <div className="card card-warm">
              <div className="card-title">🌐 IASP Crisis Centres</div>
              <div className="card-desc">Find a local crisis helpline anywhere in the world.</div>
              <a className="hotline-num" href="https://www.iasp.info/resources/Crisis_Centres/" target="_blank" rel="noreferrer">Visit iasp.info</a>
            </div>

            <div className="card">
              <div className="card-title">🧘 5-4-3-2-1 Grounding</div>
              <div className="card-desc">
                When thoughts feel overwhelming, anchor to the present:
                <br />• <strong>5</strong> things you can see
                <br />• <strong>4</strong> things you can touch
                <br />• <strong>3</strong> things you can hear
                <br />• <strong>2</strong> things you can smell
                <br />• <strong>1</strong> thing you can taste
              </div>
            </div>

            <div className="card">
              <div className="card-title">🌬️ 4-7-8 Breathing</div>
              <div className="card-desc">
                Breathe in for <strong>4</strong> seconds, hold for <strong>7</strong>, then exhale slowly for <strong>8</strong>.
                Repeat four times to calm your nervous system.
              </div>
            </div>

            <div className="card">
              <div className="section-title" style={{ marginTop: 0 }}>Talk to Sarah</div>
              <div className="card-desc">
                You can always return to <strong>Chat</strong> and tell Sarah what you&apos;re going through.
                She is here to listen without judgment, any time.
              </div>
              <div style={{ marginTop: 12 }}>
                <ResourceCard
                  title="Reach out in Chat"
                  description="Sarah is ready whenever you need to talk."
                  tag="crisis"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <MobileBottomBar />
    </div>
  );
}
