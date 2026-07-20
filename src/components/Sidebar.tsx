'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';

interface SidebarProps {
  onToggleDashboard?: () => void;
}

export default function Sidebar({ onToggleDashboard }: SidebarProps) {
  const pathname = usePathname();
  const { data: session } = useSession();
  const user = session?.user;

  const navItems = [
    { href: '/chat', icon: '💬', label: 'Chat' },
    { href: '/mood', icon: '😊', label: 'Mood Tracker' },
    { href: '/crisis', icon: '🆘', label: 'Crisis Help' },
    { href: '/resources', icon: '📚', label: 'Resources' },
  ];

  return (
    <aside className="sidebar">
      <div
        className="sidebar-header clickable"
        onClick={onToggleDashboard}
        title="Toggle dashboard panel"
        role="button"
        tabIndex={0}
        onKeyDown={e => {
          if ((e.key === 'Enter' || e.key === ' ') && onToggleDashboard) onToggleDashboard();
        }}
      >
        <div className="logo-icon">M</div>
        <div>
          <div className="logo-text">Mindful<span>Chat</span></div>
          <div className="logo-sub">Wellness Assistant</div>
        </div>
      </div>

      <nav className="nav">
        {navItems.map(item => (
          <Link
            key={item.href}
            href={item.href}
            className={`nav-item ${pathname === item.href ? 'active' : ''}`}
          >
            <span className="icon">{item.icon}</span>
            {item.label}
          </Link>
        ))}
      </nav>

      <div className="sidebar-footer">
        {user ? (
          <div className="user-card">
            <div className="user-avatar">
              {user.name?.charAt(0) || 'U'}
            </div>
            <div className="user-info">
              <div className="user-name">{user.name || 'User'}</div>
              <div className="user-status">
                <span className="status-dot online" />
                Online
              </div>
            </div>
          </div>
        ) : (
          <div className="user-card">
            <div className="user-avatar">G</div>
            <div className="user-info">
              <div className="user-name">Guest</div>
              <div className="user-status">
                <Link href="/login" style={{ color: 'var(--accent)', textDecoration: 'none', fontSize: '11px' }}>
                  Sign in to save progress
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
