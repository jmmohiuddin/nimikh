import type { Metadata } from 'next';
import Link from 'next/link';
import { revalidatePath } from 'next/cache';
import {
  listPayments, setPaymentStatus, summarize, taka,
  PAYMENT_TYPES, PAYMENT_STATUS, type PaymentType, type PaymentStatus,
} from '@/lib/payments';
import { getDb } from '@/lib/db';
import { PageHead, StatGrid, StatusBadge, type Tile } from '@/app/(shared)/dashboard/ui';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = { title: 'Payments' };

const typeLabel: Record<PaymentType, string> = {
  customer_payment: 'Customer payment',
  creator_payout: 'Creator payout',
  agent_commission: 'Agent commission',
};

async function markCompletedAction(formData: FormData) {
  'use server';
  await setPaymentStatus(String(formData.get('id') ?? ''), 'completed');
  revalidatePath('/admin/payments');
}

function fmt(d: Date) {
  return new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }).format(new Date(d));
}

export default async function AdminPaymentsPage({ searchParams }: { searchParams: Promise<{ type?: string; status?: string }> }) {
  const q = await searchParams;
  const db = await getDb();
  const typeFilter = (PAYMENT_TYPES as readonly string[]).includes(q.type ?? '') ? (q.type as PaymentType) : undefined;
  const statusFilter = (PAYMENT_STATUS as readonly string[]).includes(q.status ?? '') ? (q.status as PaymentStatus) : undefined;

  const [payments, ledger] = await Promise.all([
    listPayments({ type: typeFilter, status: statusFilter, limit: 500 }),
    summarize(),
  ]);

  const tiles: Tile[] = [
    { label: 'Revenue', value: taka(ledger.revenue.total), accent: 'green', icon: '৳' },
    { label: 'Creator payouts', value: taka(ledger.creatorPayouts.total), sub: `${taka(ledger.creatorPayouts.pending)} pending` },
    { label: 'Agent commissions', value: taka(ledger.agentCommissions.total), sub: `${taka(ledger.agentCommissions.pending)} pending` },
    { label: 'Pending total', value: taka(ledger.creatorPayouts.pending + ledger.agentCommissions.pending), accent: 'amber' },
  ];

  const exportHref = `/admin/payments/export.csv${typeFilter || statusFilter ? `?${new URLSearchParams({ ...(typeFilter ? { type: typeFilter } : {}), ...(statusFilter ? { status: statusFilter } : {}) })}` : ''}`;

  return (
    <div className="container">
      <PageHead
        title="Payments"
        subtitle="All customer payments, creator payouts, and agent commissions."
        actions={<a href={exportHref} className="btn btn-secondary btn-sm">⭳ Export CSV</a>}
      />
      <StatGrid tiles={tiles} />

      <div className="filter-tabs" style={{ marginTop: 'var(--space-24)' }}>
        <Link href="/admin/payments" className={`filter-tab${!typeFilter && !statusFilter ? ' active' : ''}`}>All</Link>
        {PAYMENT_TYPES.map((t) => (
          <Link key={t} href={`/admin/payments?type=${t}`} className={`filter-tab${typeFilter === t ? ' active' : ''}`}>{typeLabel[t]}</Link>
        ))}
        <span style={{ width: 1, background: 'var(--border-hairline)', margin: '0 4px' }} />
        {PAYMENT_STATUS.map((s) => (
          <Link key={s} href={`/admin/payments?status=${s}`} className={`filter-tab${statusFilter === s ? ' active' : ''}`} style={{ textTransform: 'capitalize' }}>{s}</Link>
        ))}
      </div>

      {!db ? (
        <div className="card" style={{ borderColor: 'rgba(245,158,11,.4)', background: 'rgba(245,158,11,.06)', marginBottom: 'var(--space-20)' }}>
          <p className="text-body text-sm">Demo ledger shown. Connect <code>MONGODB_URI</code> to record and settle real payments.</p>
        </div>
      ) : null}

      {payments.length === 0 ? (
        <div className="card"><p className="text-body">No payments match this filter.</p></div>
      ) : (
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr><th>Date</th><th>Type</th><th>Party</th><th>Customer</th><th className="num">Amount</th><th>Status</th><th></th></tr>
            </thead>
            <tbody>
              {payments.map((p) => (
                <tr key={p.id}>
                  <td style={{ whiteSpace: 'nowrap' }}>{fmt(p.createdAt)}</td>
                  <td>{typeLabel[p.type]}</td>
                  <td>{p.creatorName || p.agentName || '—'}</td>
                  <td>{p.customerName || '—'}</td>
                  <td className="num" style={{ color: 'var(--fg-primary)', fontWeight: 600 }}>{taka(p.amount)}</td>
                  <td><StatusBadge label={p.status} tone={p.status === 'completed' ? 'green' : 'amber'} /></td>
                  <td style={{ textAlign: 'right' }}>
                    {p.status === 'pending' && db ? (
                      <form action={markCompletedAction}>
                        <input type="hidden" name="id" value={p.id} />
                        <button className="btn btn-ghost btn-sm">Mark paid</button>
                      </form>
                    ) : null}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
