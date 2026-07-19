import { NextResponse } from 'next/server';
import { SESSION_COOKIE } from '@/lib/auth';
import { SESSION_COOKIE as LEGACY_ADMIN_COOKIE } from '@/lib/session';
import { absoluteUrl } from '@/lib/site';

export const runtime = 'nodejs';

/** Unified sign-out: clears both the role session and the legacy admin cookie. */
export async function POST(req: Request) {
  const res = NextResponse.redirect(new URL('/login', req.url ?? absoluteUrl('/')), 303);
  res.cookies.set(SESSION_COOKIE, '', { path: '/', maxAge: 0 });
  res.cookies.set(LEGACY_ADMIN_COOKIE, '', { path: '/', maxAge: 0 });
  return res;
}
