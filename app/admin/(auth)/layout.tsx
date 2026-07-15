import type { Metadata } from 'next';
import Link from 'next/link';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { SESSION_COOKIE, verifySessionToken } from '@/lib/session';

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

/**
 * Server-side auth gate for the authed admin tree (ADR-03).
 *
 * Route grouping matters: this layout wraps only /admin/(auth)/**, so
 * /admin/login and /admin/logout are NOT wrapped by it — otherwise an
 * unauthenticated user hitting /admin/login would infinite-redirect.
 */
export default async function AuthedAdminLayout({ children }: { children: React.ReactNode }) {
  const jar = await cookies();
  if (!verifySessionToken(jar.get(SESSION_COOKIE)?.value)) {
    redirect('/admin/login');
  }

  return (
    <div style={{ minHeight: '100vh' }}>
      <div
        style={{
          borderBottom: '1px solid var(--border-hairline)',
          background: 'rgba(15,16,17,.75)',
          backdropFilter: 'blur(24px)',
          position: 'sticky',
          top: 0,
          zIndex: 10,
        }}
      >
        <div
          className="container"
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 0' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-24)' }}>
            <Link href="/admin" style={{ fontWeight: 700, letterSpacing: '-.02em' }}>Nimikh Admin</Link>
            <nav
              aria-label="Admin sections"
              style={{ display: 'flex', gap: 'var(--space-16)', fontSize: '.875rem' }}
            >
              <Link href="/admin/leads" style={{ color: 'var(--fg-secondary)' }}>Leads</Link>
              <Link href="/admin/clients" style={{ color: 'var(--fg-secondary)' }}>Clients</Link>
              <Link href="/admin/creators" style={{ color: 'var(--fg-secondary)' }}>Creators</Link>
              <Link href="/admin/feedback" style={{ color: 'var(--fg-secondary)' }}>Feedback</Link>
            </nav>
          </div>
          <form action="/admin/logout" method="post">
            <button type="submit" className="btn btn-ghost btn-sm">Sign out</button>
          </form>
        </div>
      </div>
      <div style={{ padding: 'var(--space-48) 0' }}>{children}</div>
    </div>
  );
}
