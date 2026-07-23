import type { Metadata } from 'next';
import Link from 'next/link';
import { listProjects } from '@/lib/projects';
import { financeOverview, listInstallments, listRecentFinanceActivity, rollupProject } from '@/lib/installments';
import { taka } from '@/lib/payments';
import { getDb } from '@/lib/db';
import { PageHead, StatGrid, SectionCard, StatusBadge, type Tile } from '@/app/(shared)/dashboard/ui';
import { BarChart, Meter } from '@/app/(shared)/dashboard/Charts';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = { title: 'Finance' };

function fmtDate(s: string) {
  if (!s) return '—';
  return new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }).format(new Date(`${s}T00:00:00`));
}
function fmtWhen(d: Date) {
  return new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }).format(new Date(d));
}

export default async function AdminFinance() {
  const db = await getDb();
  const [overview, projects, allInstallments, activity] = await Promise.all([
    financeOverview(),
    listProjects({ limit: 500 }),
    listInstallments({ limit: 10000 }),
    listRecentFinanceActivity(12),
  ]);

  const projectName = new Map(projects.map((p) => [p.id, { name: p.name, client: p.clientName }]));
  const overdue = allInstallments.filter((i) => i.state === 'overdue').sort((a, b) => a.dueDate.localeCompare(b.dueDate));

  // Per-client payment trend (paid totals) — top clients by contracted value.
  const byClient = new Map<string, { name: string; contracted: number; received: number }>();
  for (const p of projects) {
    const f = rollupProject(allInstallments.filter((i) => i.projectId === p.id));
    const key = p.clientId;
    const cur = byClient.get(key) ?? { name: p.clientName || key, contracted: 0, received: 0 };
    cur.contracted += f.total; cur.received += f.paid;
    byClient.set(key, cur);
  }
  const clientTrends = Array.from(byClient.values()).sort((a, b) => b.contracted - a.contracted).slice(0, 6);

  const tiles: Tile[] = [
    { label: 'Contracted revenue', value: taka(overview.contracted), icon: '📄', sub: 'All installment plans' },
    { label: 'Revenue received', value: taka(overview.received), accent: 'green' },
    { label: 'Outstanding balance', value: taka(overview.outstanding), accent: 'amber' },
    { label: 'Overdue', value: taka(overview.overdueAmount), accent: overview.overdueCount > 0 ? 'amber' : 'default', sub: `${overview.overdueCount} installment${overview.overdueCount === 1 ? '' : 's'}` },
    { label: 'Upcoming (30d)', value: taka(overview.upcomingAmount), accent: 'indigo', sub: `${overview.upcomingCount} due` },
    { label: 'Collection rate', value: `${overview.collectionRate}%`, accent: 'green' },
  ];

  return (
    <div className="container">
      <PageHead title="Financial overview" subtitle={`Company cash position · storage: ${db ? 'connected' : 'demo / log-only'}`} />
      <StatGrid tiles={tiles} />

      <div className="grid-2" style={{ marginTop: 'var(--space-24)', alignItems: 'start' }}>
        <SectionCard title="Monthly cash flow (received)">
          <BarChart data={overview.monthly.map((m) => ({ label: m.label, a: m.received }))} aLabel="Received" format={taka} />
        </SectionCard>
        <SectionCard title="Collection performance">
          <Meter label={`${taka(overview.received)} of ${taka(overview.contracted)} collected`} value={overview.collectionRate} tone="green" />
          <div style={{ marginTop: 'var(--space-20)' }}>
            <div style={{ fontSize: '.8rem', color: 'var(--fg-tertiary)', marginBottom: 8 }}>Client payment trends (received / contracted)</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {clientTrends.map((c, i) => (
                <Meter key={i} label={`${c.name} — ${taka(c.received)}/${taka(c.contracted)}`} value={c.contracted ? Math.round((c.received / c.contracted) * 100) : 0} tone={c.received >= c.contracted ? 'green' : 'indigo'} />
              ))}
            </div>
          </div>
        </SectionCard>
      </div>

      <SectionCard title={`Overdue installments (${overdue.length})`} className="mt-24">
        {overdue.length === 0 ? (
          <p className="text-body text-sm" style={{ color: 'var(--fg-tertiary)' }}>Nothing overdue. 🎉</p>
        ) : (
          <div className="table-wrap">
            <table className="data-table">
              <thead><tr><th>Project</th><th>Client</th><th>Invoice</th><th>Due</th><th className="num">Amount</th><th></th></tr></thead>
              <tbody>
                {overdue.map((i) => (
                  <tr key={i.id}>
                    <td>{projectName.get(i.projectId)?.name ?? i.projectId}</td>
                    <td>{projectName.get(i.projectId)?.client ?? '—'}</td>
                    <td>{i.invoiceNumber}</td>
                    <td style={{ whiteSpace: 'nowrap' }}><StatusBadge label={fmtDate(i.dueDate)} tone="amber" /></td>
                    <td className="num" style={{ color: 'var(--fg-primary)', fontWeight: 600 }}>{taka(i.amount)}</td>
                    <td style={{ textAlign: 'right' }}><Link href={`/admin/projects/${i.projectId}`} className="btn btn-ghost btn-sm">Manage</Link></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </SectionCard>

      <SectionCard title="Recent financial activity (audit)" className="mt-24">
        {activity.length === 0 ? (
          <p className="text-body text-sm" style={{ color: 'var(--fg-tertiary)' }}>No activity yet.</p>
        ) : (
          <ul style={{ display: 'flex', flexDirection: 'column', gap: 8, fontSize: '.85rem' }}>
            {activity.map((a, i) => (
              <li key={i} style={{ display: 'flex', justifyContent: 'space-between', gap: 12, borderBottom: '1px solid var(--border-hairline)', paddingBottom: 8 }}>
                <span><strong>{a.invoiceNumber}</strong> — {a.detail}</span>
                <span style={{ color: 'var(--fg-tertiary)', whiteSpace: 'nowrap' }}>{fmtWhen(a.at)}</span>
              </li>
            ))}
          </ul>
        )}
      </SectionCard>
    </div>
  );
}
