'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import { useState } from 'react';

const TABS = [
  { href: '/chat', label: 'Chat', icon: '💬' },
  { href: '/mood', label: 'Mood', icon: '😊' },
  { href: '/crisis', label: 'Crisis', icon: '🆘' },
  { href: '/resources', label: 'Resources', icon: '📚' },
];

export default function MobileBottomBar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const user = session?.user;
  const [profileOpen, setProfileOpen] = useState(false);

  const isActive = (href: string) => pathname === href;

  return (
    <>
      <nav className="mobile-bottom-bar">
        {TABS.map(tab => (
          <Link
            key={tab.href}
            href={tab.href}
            className={`mobile-bottom-tab ${isActive(tab.href) ? 'active' : ''}`}
          >
            <span className="mobile-bottom-tab-icon">{tab.icon}</span>
            <span className="mobile-bottom-tab-label">{tab.label}</span>
          </Link>
        ))}
        <button className="mobile-bottom-tab" onClick={() => setProfileOpen(v => !v)}>
          <span className="mobile-bottom-tab-icon">{user?.name?.charAt(0) || '👤'}</span>
          <span className="mobile-bottom-tab-label">Profile</span>
        </button>
      </nav>

      {profileOpen && (
        <>
          <div className="mobile-sheet-backdrop" onClick={() => setProfileOpen(false)} />
          <div className="mobile-sheet">
            <div className="mobile-sheet-handle" onClick={() => setProfileOpen(false)}>
              <div className="mobile-sheet-handle-bar" />
            </div>
            <div style={{ padding: '4px 20px 20px' }}>
              {user ? (
                <>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                    <div style={{
                      width: 44, height: 44, borderRadius: '50%',
                      background: 'linear-gradient(135deg,var(--calm),var(--accent))',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 16, fontWeight: 600, color: '#0b0e14',
                    }}>
                      {user.name?.charAt(0) || 'U'}
                    </div>
                    <div>
                      <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--text)' }}>{user.name || 'User'}</div>
                      <div style={{ fontSize: 12, color: 'var(--text2)', marginTop: 2 }}>{user.email}</div>
                    </div>
                  </div>
                  <button
                    onClick={() => signOut()}
                    style={{
                      width: '100%', height: 42, borderRadius: 'var(--radius-sm)',
                      border: '1px solid var(--border)', background: 'transparent',
                      color: 'var(--danger)', fontSize: 13.5, fontWeight: 500,
                      cursor: 'pointer', fontFamily: 'inherit',
                    }}
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--text)', marginBottom: 4 }}>Guest</div>
                  <div style={{ fontSize: 12, color: 'var(--text2)', marginBottom: 16 }}>
                    Sign in to save your progress across devices
                  </div>
                  <Link
                    href="/login"
                    style={{
                      display: 'block', textAlign: 'center', height: 42, lineHeight: '42px',
                      borderRadius: 'var(--radius-sm)', background: 'var(--accent)',
                      color: '#0b0e14', fontSize: 13.5, fontWeight: 600, textDecoration: 'none',
                    }}
                  >
                    Sign In
                  </Link>
                </>
              )}
            </div>
          </div>
        </>
      )}
    </>
  );
}
