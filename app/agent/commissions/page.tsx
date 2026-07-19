import type { Metadata } from 'next';
import { getSession } from '@/lib/auth';
import { listPayments, summarize, taka, COMMISSION_RATE, type PaymentStatus } from '@/lib/payments';
import { PageHead, StatGrid, SectionCard, StatusBadge, type Tile } from '@/app/(shared)/dashboard/ui';
import { BarChart } from '@/app/(shared)/dashboard/Charts';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = { title: 'Commissions' };

function fmt(d: Date) {
  return new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }).format(new Date(d));
}
const tone: Record<PaymentStatus, 'green' | 'amber'> = { completed: 'green', pending: 'amber' };

export default async function AgentCommissions() {
  const session = (await getSession())!;
  const [ledger, history] = await Promise.all([
    summarize({ agentId: session.uid }),
    listPayments({ agentId: session.uid, type: 'agent_commission', limit: 200 }),
  ]);

  const tiles: Tile[] = [
    { label: 'Total commission', value: taka(ledger.agentCommissions.total), accent: 'green', icon: '৳', sub: `${Math.round(COMMISSION_RATE * 100)}% of each conversion` },
    { label: 'Paid', value: taka(ledger.agentCommissions.completed) },
    { label: 'Pending', value: taka(ledger.agentCommissions.pending), accent: 'amber' },
    { label: 'Conversions', value: history.length },
  ];

  return (
    <>
      <PageHead title="Commissions" subtitle={`You earn ${Math.round(COMMISSION_RATE * 100)}% of every customer payment you convert.`} />
      <StatGrid tiles={tiles} />

      <SectionCard title="Commission by month" className="mt-24">
        <BarChart data={ledger.monthly.map((m) => ({ label: m.label, a: m.commissions }))} aLabel="Commission" format={taka} />
      </SectionCard>

      <SectionCard title="Commission history" className="mt-24">
        {history.length === 0 ? (
          <p className="text-body text-sm" style={{ color: 'var(--fg-tertiary)' }}>No commissions yet — convert a lead to start earning.</p>
        ) : (
          <div className="table-wrap">
            <table className="data-table">
              <thead>
                <tr><th>Date</th><th>Customer</th><th className="num">Commission</th><th>Status</th></tr>
              </thead>
              <tbody>
                {history.map((p) => (
                  <tr key={p.id}>
                    <td style={{ whiteSpace: 'nowrap' }}>{fmt(p.createdAt)}</td>
                    <td>{p.customerName || '—'}</td>
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
