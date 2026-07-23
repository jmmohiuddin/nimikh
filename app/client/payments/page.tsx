import type { Metadata } from 'next';
import { requireSession } from '@/lib/auth';
import { listProjects } from '@/lib/projects';
import { listInstallments } from '@/lib/installments';
import { taka } from '@/lib/payments';
import { PageHead, StatGrid, SectionCard, StatusBadge, type Tile } from '@/app/(shared)/dashboard/ui';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = { title: 'Payments' };

function fmtDate(s: string) {
  if (!s) return '—';
  return new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }).format(new Date(`${s}T00:00:00`));
}
const methodLabel: Record<string, string> = {
  bkash: 'bKash', nagad: 'Nagad', 'bank-transfer': 'Bank transfer', card: 'Card', cash: 'Cash', cheque: 'Cheque', other: 'Other',
};

export default async function ClientPayments() {
  const session = await requireSession('/client/payments');
  const [projects, all] = await Promise.all([
    listProjects({ clientId: session.uid }),
    listInstallments({ clientId: session.uid, limit: 1000 }),
  ]);
  const projectName = new Map(projects.map((p) => [p.id, p.name]));
  const paid = all.filter((i) => i.state === 'paid').sort((a, b) => (b.paidDate || '').localeCompare(a.paidDate || ''));
  const totalPaid = paid.reduce((s, i) => s + i.amount, 0);

  const tiles: Tile[] = [
    { label: 'Payments made', value: paid.length, icon: '✅' },
    { label: 'Total paid', value: taka(totalPaid), accent: 'green' },
    { label: 'Receipts available', value: paid.filter((i) => i.receiptAvailable).length },
  ];

  return (
    <>
      <PageHead title="Payment history" subtitle="Every payment you've made, with invoices and receipts to download." />
      <StatGrid tiles={tiles} />

      <SectionCard title="Payments" className="mt-24">
        {paid.length === 0 ? (
          <p className="text-body text-sm" style={{ color: 'var(--fg-tertiary)' }}>No payments recorded yet.</p>
        ) : (
          <div className="table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Date</th><th>Project</th><th>Invoice</th><th className="num">Amount</th>
                  <th>Method</th><th>Reference</th><th>Status</th><th>Receipt</th>
                </tr>
              </thead>
              <tbody>
                {paid.map((i) => (
                  <tr key={i.id}>
                    <td style={{ whiteSpace: 'nowrap' }}>{fmtDate(i.paidDate || '')}</td>
                    <td>{projectName.get(i.projectId) ?? '—'}</td>
                    <td>{i.invoiceNumber || '—'}</td>
                    <td className="num" style={{ color: 'var(--fg-primary)', fontWeight: 600 }}>{taka(i.amount)}</td>
                    <td>{i.method ? methodLabel[i.method] ?? i.method : '—'}</td>
                    <td>{i.reference || '—'}</td>
                    <td><StatusBadge label="Paid" tone="green" /></td>
                    <td>
                      {i.receiptAvailable ? (
                        <a href={`/client/invoices/${i.id}?type=receipt`} target="_blank" rel="noopener noreferrer" style={{ fontSize: '.82rem' }}>Download ↗</a>
                      ) : <span style={{ color: 'var(--fg-tertiary)' }}>—</span>}
                    </td>
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
