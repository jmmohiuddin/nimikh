import type { Metadata } from 'next';
import { getSession } from '@/lib/auth';
import { listPayments, summarize, taka, type PaymentStatus } from '@/lib/payments';
import { PageHead, StatGrid, SectionCard, StatusBadge, type Tile } from '@/app/(shared)/dashboard/ui';
import { BarChart } from '@/app/(shared)/dashboard/Charts';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = { title: 'Earnings' };

function fmt(d: Date) {
  return new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }).format(new Date(d));
}
const tone: Record<PaymentStatus, 'green' | 'amber'> = { completed: 'green', pending: 'amber' };

export default async function CreatorEarnings() {
  const session = (await getSession())!;
  const [ledger, history] = await Promise.all([
    summarize({ creatorId: session.uid }),
    listPayments({ creatorId: session.uid, type: 'creator_payout', limit: 100 }),
  ]);

  const tiles: Tile[] = [
    { label: 'Total earnings', value: taka(ledger.creatorPayouts.total), accent: 'green', icon: '৳' },
    { label: 'Paid out', value: taka(ledger.creatorPayouts.completed) },
    { label: 'Pending', value: taka(ledger.creatorPayouts.pending), accent: 'amber' },
    { label: 'Payments', value: history.length },
  ];

  return (
    <>
      <PageHead title="Earnings" subtitle="Your payouts across all completed and pending work." />
      <StatGrid tiles={tiles} />

      <SectionCard title="Monthly earnings" className="mt-24">
        <BarChart data={ledger.monthly.map((m) => ({ label: m.label, a: Math.round(m.revenue * 0.65) }))} aLabel="Earnings" format={taka} />
      </SectionCard>

      <SectionCard title="Payment history" className="mt-24">
        {history.length === 0 ? (
          <p className="text-body text-sm" style={{ color: 'var(--fg-tertiary)' }}>No payouts yet.</p>
        ) : (
          <div className="table-wrap">
            <table className="data-table">
              <thead>
                <tr><th>Date</th><th>Customer</th><th>Description</th><th className="num">Amount</th><th>Status</th></tr>
              </thead>
              <tbody>
                {history.map((p) => (
                  <tr key={p.id}>
                    <td style={{ whiteSpace: 'nowrap' }}>{fmt(p.createdAt)}</td>
                    <td>{p.customerName || '—'}</td>
                    <td>{p.description || '—'}</td>
                    <td className="num" style={{ color: 'var(--fg-primary)', fontWeight: 600 }}>{taka(p.amount)}</td>
                    <td><StatusBadge label={p.status} tone={tone[p.status]} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </SectionCard>
    </>
  );
}
