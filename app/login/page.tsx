import type { Metadata } from 'next';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { authenticate, ROLE_HOME } from '@/lib/users';
import { getSession, isAuthConfigured, mintSession, SESSION_COOKIE, SESSION_MAX_AGE } from '@/lib/auth';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = {
  title: 'Sign in',
  description: 'Sign in to your Nimikh admin, creator, or agent dashboard.',
  robots: { index: false, follow: false },
};

function safeNext(next: string | undefined, role: keyof typeof ROLE_HOME): string {
  // Only allow redirecting to a known internal dashboard root.
  if (next && next.startsWith('/') && !next.startsWith('//')) return next;
  return ROLE_HOME[role];
}

async function loginAction(formData: FormData) {
  'use server';
  const email = String(formData.get('email') ?? '');
  const password = String(formData.get('password') ?? '');
  const nextParam = String(formData.get('next') ?? '');

  if (!isAuthConfigured()) {
    redirect('/login?e=unconfigured');
  }
  const user = await authenticate(email, password);
  if (!user) {
    redirect(`/login?e=bad${nextParam ? `&next=${encodeURIComponent(nextParam)}` : ''}`);
  }
  const token = mintSession(user!);
  if (!token) redirect('/login?e=unconfigured');

  const jar = await cookies();
  jar.set(SESSION_COOKIE, token!, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: SESSION_MAX_AGE,
  });
  redirect(safeNext(nextParam || undefined, user!.role));
}

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ e?: string; next?: string }> }) {
  const params = await searchParams;

  // Already signed in → go to the role home.
  const session = await getSession();
  if (session) redirect(ROLE_HOME[session.role]);

  const error =
    params.e === 'bad' ? 'Incorrect email or password.' :
    params.e === 'unconfigured' ? 'Sign-in is temporarily unavailable. Please contact the site administrator.' :
    null;

  return (
    <section className="section" style={{ minHeight: '82vh', display: 'flex', alignItems: 'center' }}>
      <div className="container" style={{ maxWidth: 460 }}>
        <div className="card fade-up" style={{ padding: 'var(--space-32)' }}>
          <div className="section-label"><span className="section-label-line" /><span className="section-label-text">Nimikh</span></div>
          <h1 className="text-h2 mb-8">Sign in</h1>
          <p className="text-body text-sm mb-24" style={{ color: 'var(--fg-secondary)' }}>
            For admins, creators, and agents. The public site stays open to everyone —{' '}
            <Link href="/">go back home</Link>.
          </p>

          {error ? (
            <div role="alert" style={{ background: 'rgba(238,0,0,.08)', border: '1px solid rgba(238,0,0,.25)', color: '#ffb4b4', padding: '10px 14px', borderRadius: 'var(--radius-md)', fontSize: '.85rem', marginBottom: 'var(--space-20)' }}>
              {error}
            </div>
          ) : null}

          <form action={loginAction}>
            <input type="hidden" name="next" value={params.next ?? ''} />
            <div className="form-group" style={{ marginBottom: 'var(--space-16)' }}>
              <label className="form-label" htmlFor="email">Email</label>
              <input id="email" name="email" type="email" required autoComplete="email" className="form-input" autoFocus placeholder="you@nimikh.com" />
            </div>
            <div className="form-group" style={{ marginBottom: 'var(--space-24)' }}>
              <label className="form-label" htmlFor="password">Password</label>
              <input id="password" name="password" type="password" required autoComplete="current-password" className="form-input" />
            </div>
            <button type="submit" className="btn btn-primary w-full" style={{ justifyContent: 'center' }}>Sign in</button>
          </form>

        </div>
      </div>
    </section>
  );
}
