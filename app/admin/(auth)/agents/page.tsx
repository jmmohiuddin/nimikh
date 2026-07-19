import type { Metadata } from 'next';
import Link from 'next/link';
import { revalidatePath } from 'next/cache';
import { listUsers, setUserStatus } from '@/lib/users';
import { conversionRate, countLeadsByStage } from '@/lib/agentLeads';
import { summarize, taka } from '@/lib/payments';
import { getDb } from '@/lib/db';
import { PageHead, StatGrid, SectionCard, StatusBadge, type Tile } from '@/app/(shared)/dashboard/ui';
import { Meter } from '@/app/(shared)/dashboard/Charts';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = { title: 'Agents' };

async function statusAction(formData: FormData) {
  'use server';
  await setUserStatus(String(formData.get('id') ?? ''), String(formData.get('status') ?? 'active') === 'active' ? 'active' : 'suspended');
  revalidatePath('/admin/agents');
}

export default async function AdminAgentsPage() {
  const db = await getDb();
  const agents = await listUsers({ role: 'agent', limit: 200 });

  const rows = await Promise.all(agents.map(async (a) => {
    const [counts, ledger] = await Promise.all([countLeadsByStage(a.id), summarize({ agentId: a.id })]);
    return { agent: a, counts, rate: conversionRate(counts), commission: ledger.agentCommissions };
  }));

  const totalCommission = rows.reduce((s, r) => s + r.commission.total, 0);
  const totalConverted = rows.reduce((s, r) => s + r.counts.converted, 0);
  const totalOpen = rows.reduce((s, r) => s + r.counts.open, 0);

  const tiles: Tile[] = [
    { label: 'Agents', value: agents.length, icon: '☎' },
    { label: 'Total conversions', value: totalConverted, accent: 'green' },
    { label: 'Active pipeline', value: totalOpen, accent: 'indigo' },
    { label: 'Commissions owed', value: taka(rows.reduce((s, r) => s + r.commission.pending, 0)), accent: 'amber' },
  ];

  return (
    <div className="container">
      <PageHead title="Agents" subtitle="Monitor performance, conversion rates, commissions, and assigned leads." />
      <StatGrid tiles={tiles} />
      <p className="text-body text-sm" style={{ color: 'var(--fg-tertiary)', margin: '12px 0 24px' }}>
        Total commissions across all agents: <strong style={{ color: 'var(--fg-primary)' }}>{taka(totalCommission)}</strong>
      </p>

      {!db ? (
        <div className="card" style={{ borderColor: 'rgba(245,158,11,.4)', background: 'rgba(245,158,11,.06)', marginBottom: 'var(--space-20)' }}>
          <p className="text-body text-sm">Demo mode — sample agent + pipeline shown. Connect <code>MONGODB_URI</code> to manage real agents.</p>
        </div>
      ) : null}

      {rows.length === 0 ? (
        <div className="card"><p className="text-body">No agents yet. <Link href="/admin/users/new">Create an agent account →</Link></p></div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-16)' }}>
          {rows.map(({ agent, counts, rate, commission }) => (
            <SectionCard key={agent.id}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 'var(--space-16)', flexWrap: 'wrap' }}>
                <div>
                  <div style={{ fontWeight: 600, fontSize: '1rem', display: 'flex', alignItems: 'center', gap: 8 }}>
                    {agent.name}
                    <StatusBadge label={agent.status === 'active' ? 'enabled' : 'disabled'} tone={agent.status === 'active' ? 'green' : 'default'} />
                  </div>
                  <div style={{ fontSize: '.85rem', color: 'var(--fg-secondary)', marginTop: 4 }}><a href={`mailto:${agent.email}`}>{agent.email}</a></div>
                </div>
                <div style={{ display: 'flex', gap: 6 }}>
                  <Link href={`/admin/users/${agent.id}`} className="btn btn-ghost btn-sm">Edit</Link>
                  <form action={statusAction}>
                    <input type="hidden" name="id" value={agent.id} />
                    <input type="hidden" name="status" value={agent.status === 'active' ? 'suspended' : 'active'} />
                    <button className="btn btn-ghost btn-sm">{agent.status === 'active' ? 'Disable' : 'Enable'}</button>
                  </form>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: 'var(--space-12)', marginTop: 'var(--space-16)' }}>
                <Metric label="Total leads" value={counts.total} />
                <Metric label="Converted" value={counts.converted} />
                <Metric label="Active" value={counts.open} />
                <Metric label="Commission" value={taka(commission.total)} />
                <Metric label="Pending" value={taka(commission.pending)} />
              </div>
              <div style={{ marginTop: 'var(--space-16)' }}>
                <Meter label="Conversion rate" value={rate} tone="green" />
              </div>
            </SectionCard>
          ))}
        </div>
      )}
    </div>
  );
}

function Metric({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div>
      <div style={{ fontSize: '.68rem', textTransform: 'uppercase', letterSpacing: '.06em', color: 'var(--fg-tertiary)' }}>{label}</div>
      <div style={{ fontSize: '1.05rem', fontWeight: 700, marginTop: 2 }}>{value}</div>
    </div>
  );
}
