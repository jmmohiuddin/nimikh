import { cookies } from 'next/headers';
import { listLeads } from '@/lib/leads';
import { SESSION_COOKIE, verifySessionToken } from '@/lib/session';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

function csvEscape(v: unknown): string {
  const s = v == null ? '' : String(v);
  if (/[",\n]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
  return s;
}

export async function GET() {
  // Route handlers aren't wrapped by (auth)/layout.tsx, so authenticate here.
  const jar = await cookies();
  if (!verifySessionToken(jar.get(SESSION_COOKIE)?.value)) {
    return new Response('Unauthorized', { status: 401 });
  }

  const leads = await listLeads(10000);
  const header = ['createdAt', 'intent', 'firstName', 'lastName', 'email', 'phone', 'company', 'budget', 'message', 'handled', 'source'];
  const rows = leads.map((l) =>
    [
      l.createdAt.toISOString(),
      l.intent,
      l.firstName,
      l.lastName,
      l.email,
      l.phone ?? '',
      l.company ?? '',
      l.budget ?? '',
      l.message,
      l.handled ? 'yes' : 'no',
      l.source,
    ]
      .map(csvEscape)
      .join(','),
  );
  const body = [header.join(','), ...rows].join('\n') + '\n';
  const today = new Date().toISOString().slice(0, 10);
  return new Response(body, {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="nimikh-leads-${today}.csv"`,
      'Cache-Control': 'no-store',
    },
  });
}
