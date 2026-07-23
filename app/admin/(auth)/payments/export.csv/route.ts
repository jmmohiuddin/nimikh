import { cookies } from 'next/headers';
import {
  listPayments, PAYMENT_TYPES, PAYMENT_STATUS, type PaymentType, type PaymentStatus,
} from '@/lib/payments';
import { getSession } from '@/lib/auth';
import { SESSION_COOKIE as LEGACY_COOKIE, verifySessionToken } from '@/lib/session';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

function csvEscape(v: unknown): string {
  const s = v == null ? '' : String(v);
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

async function isAdmin(): Promise<boolean> {
  const jar = await cookies();
  if (verifySessionToken(jar.get(LEGACY_COOKIE)?.value)) return true;
  const session = await getSession();
  return session?.role === 'admin';
}

export async function GET(req: Request) {
  // Route handlers aren't wrapped by (auth)/layout.tsx, so authenticate here.
  if (!(await isAdmin())) return new Response('Unauthorized', { status: 401 });

  const url = new URL(req.url);
  const typeParam = url.searchParams.get('type') ?? '';
  const statusParam = url.searchParams.get('status') ?? '';
  const type = (PAYMENT_TYPES as readonly string[]).includes(typeParam) ? (typeParam as PaymentType) : undefined;
  const status = (PAYMENT_STATUS as readonly string[]).includes(statusParam) ? (statusParam as PaymentStatus) : undefined;

  const payments = await listPayments({ type, status, limit: 10000 });
  const header = ['createdAt', 'type', 'status', 'amount', 'currency', 'creatorName', 'agentName', 'customerName', 'description'];
  const rows = payments.map((p) => [
    new Date(p.createdAt).toISOString(), p.type, p.status, p.amount, p.currency,
    p.creatorName, p.agentName, p.customerName, p.description,
  ].map(csvEscape).join(','));

  const body = [header.join(','), ...rows].join('\n') + '\n';
  const today = new Date().toISOString().slice(0, 10);
  return new Response(body, {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="nimikh-payments-${today}.csv"`,
      'Cache-Control': 'no-store',
    },
  });
}
