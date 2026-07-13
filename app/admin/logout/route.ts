import { NextResponse } from 'next/server';
import { SESSION_COOKIE } from '@/lib/session';
import { absoluteUrl } from '@/lib/site';

export const runtime = 'nodejs';

export async function POST(req: Request) {
  const res = NextResponse.redirect(new URL('/admin/login', req.url ?? absoluteUrl('/')), 303);
  res.cookies.set(SESSION_COOKIE, '', { path: '/', maxAge: 0 });
  return res;
}
