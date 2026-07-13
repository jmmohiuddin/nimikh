import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { SESSION_COOKIE, isAdminConfigured, mintSessionToken, verifyAdminPassword, verifySessionToken } from '@/lib/session';

export const metadata: Metadata = {
  title: 'Admin login',
  robots: { index: false, follow: false },
};

async function loginAction(formData: FormData) {
  'use server';
  const password = String(formData.get('password') ?? '');
  const nextParam = String(formData.get('next') ?? '/admin');
  const next = nextParam.startsWith('/admin') ? nextParam : '/admin';

  if (!verifyAdminPassword(password)) {
    redirect(`/admin/login?e=bad&next=${encodeURIComponent(next)}`);
  }
  const token = mintSessionToken();
  if (!token) {
    redirect(`/admin/login?e=unconfigured`);
  }
  const jar = await cookies();
  jar.set(SESSION_COOKIE, token!, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 8,
  });
  redirect(next);
}

export default async function AdminLoginPage({ searchParams }: { searchParams: Promise<{ e?: string; next?: string }> }) {
  const params = await searchParams;
  // If already logged in, skip the form.
  const jar = await cookies();
  if (verifySessionToken(jar.get(SESSION_COOKIE)?.value)) {
    redirect(params.next ?? '/admin');
  }

  const configured = isAdminConfigured();
  const error =
    params.e === 'bad' ? 'Incorrect password.' :
    params.e === 'unconfigured' || !configured
      ? 'Admin is not configured. Set ADMIN_PASSWORD and ADMIN_SESSION_SECRET (min 16 chars) in Vercel and redeploy.'
      : null;

  return (
    <section className="section" style={{ minHeight: '80vh', display: 'flex', alignItems: 'center' }}>
      <div className="container">
        <form
          action={loginAction}
          className="card fade-up"
          style={{ maxWidth: 420, margin: '0 auto', padding: 'var(--space-32)' }}
        >
          <h1 className="text-h2 mb-16">Admin</h1>
          <p className="text-body text-sm mb-24">Password-only sign-in. Sessions last 8 hours.</p>
          {error ? (
            <div
              role="alert"
              style={{
                background: 'rgba(238,0,0,.08)',
                border: '1px solid rgba(238,0,0,.25)',
                color: '#ffb4b4',
                padding: 'var(--space-12) var(--space-16)',
                borderRadius: 'var(--radius-md)',
                fontSize: '.875rem',
                marginBottom: 'var(--space-20)',
              }}
            >
              {error}
            </div>
          ) : null}
          <input type="hidden" name="next" value={params.next ?? '/admin'} />
          <div className="form-group" style={{ marginBottom: 'var(--space-20)' }}>
            <label className="form-label" htmlFor="password">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              required
              autoComplete="current-password"
              className="form-input"
              autoFocus
              disabled={!configured}
            />
          </div>
          <button type="submit" className="btn btn-primary w-full" style={{ justifyContent: 'center' }} disabled={!configured}>
            Sign in
          </button>
        </form>
      </div>
    </section>
  );
}
