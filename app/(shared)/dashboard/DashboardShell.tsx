'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

export type NavItem = { href: string; label: string; icon: string };
export type NavGroup = { section?: string; items: NavItem[] };

type Props = {
  role: 'admin' | 'creator' | 'agent' | 'client';
  userName: string;
  groups: NavGroup[];
  children: React.ReactNode;
};

/**
 * Shared responsive dashboard chrome for every role. Server layouts do the
 * auth gate then render this with the role's nav. Client-only because it
 * needs usePathname() for active-link state and a mobile drawer toggle —
 * the same three responsibilities SiteNav has on the public site.
 */
export function DashboardShell({ role, userName, groups, children }: Props) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => { setOpen(false); }, [pathname]);
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);
  const initials = userName.split(' ').map((p) => p[0]).slice(0, 2).join('').toUpperCase();

  return (
    <div className="dash">
      {open ? <div className="dash-backdrop" onClick={() => setOpen(false)} aria-hidden /> : null}

      <aside className={`dash-sidebar${open ? ' open' : ''}`} aria-label="Dashboard navigation">
        <div className="dash-brand">
          <span className="dash-brand-mark">N</span>
          Nimikh
          <span className="dash-role-chip">{role}</span>
        </div>
        <nav className="dash-nav">
          {groups.map((g, gi) => (
            <div key={gi}>
              {g.section ? <div className="dash-nav-section">{g.section}</div> : null}
              {g.items.map((it) => (
                <Link key={it.href} href={it.href} className={isActive(it.href) ? 'active' : undefined}>
                  <span className="ico" aria-hidden>{it.icon}</span>
                  {it.label}
                </Link>
              ))}
            </div>
          ))}
        </nav>
        <div className="dash-user">
          <span className="dash-avatar">{initials || 'U'}</span>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: '.85rem', fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{userName}</div>
            <form action="/logout" method="post">
              <button type="submit" style={{ background: 'none', border: 'none', color: 'var(--fg-tertiary)', fontSize: '.75rem', cursor: 'pointer', padding: 0 }}>
                Sign out
              </button>
            </form>
          </div>
        </div>
      </aside>

      <div className="dash-main">
        <header className="dash-topbar">
          <button
            type="button"
            className="dash-menu-btn btn btn-ghost btn-sm"
            aria-label="Open menu"
            aria-expanded={open}
            onClick={() => setOpen(true)}
          >
            ☰
          </button>
          <Link href="/" style={{ fontSize: '.85rem', color: 'var(--fg-tertiary)' }}>← Back to site</Link>
          <div style={{ marginLeft: 'auto', fontSize: '.85rem', color: 'var(--fg-tertiary)' }}>
            {new Date().toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' })}
          </div>
        </header>
        <main className="dash-content">{children}</main>
      </div>
    </div>
  );
}
