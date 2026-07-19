import type { Metadata } from 'next';
import Link from 'next/link';
import { countClientsByStatus } from '@/lib/clients';
import { countCreatorsByStatus } from '@/lib/creators';
import { countUsersByRole } from '@/lib/users';
import { countLeadsByStage } from '@/lib/agentLeads';
import { summarize, taka } from '@/lib/payments';
import { listLeads } from '@/lib/leads';
import { getDb } from '@/lib/db';
import { PageHead, StatGrid, SectionCard, type Tile } from '@/app/(shared)/dashboard/ui';
import { BarChart } from '@/app/(shared)/dashboard/Charts';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = { title: 'Overview' };

export default async function AdminDashboard() {
  const db = await getDb();
  const [ledger, users, creators, clients, pipeline, marketingLeads] = await Promise.all([
    summarize(),
    countUsersByRole(),
    countCreatorsByStatus(),
    countClientsByStatus(),
    countLeadsByStage(),
    listLeads(5),
  ]);

  const pendingPayouts = ledger.creatorPayouts.pending + ledger.agentCommissions.pending;
  const openLeads = marketingLeads.filter((l) => !l.handled).length;

  const tiles: Tile[] = [
    { label: 'Total revenue', value: taka(ledger.revenue.total), icon: '৳', accent: 'green', sub: `${taka(ledger.revenue.pending)} pending` },
    { label: 'Total creators', value: creators.total, icon: '🎨', href: '/admin/creators' },
    { label: 'Total agents', value: users.agent, icon: '☎', href: '/admin/agents' },
    { label: 'Total customers', value: clients.total, icon: '🏢', href: '/admin/clients' },
    { label: 'Total conversions', value: pipeline.converted, icon: '✓', accent: 'indigo' },
    { label: 'Total commissions', value: taka(ledger.agentCommissions.total), icon: '💸' },
    { label: 'Pending payouts', value: taka(pendingPayouts), accent: 'amber', href: '/admin/payments?status=pending' },
    { label: 'Platform users', value: users.total, icon: '👥', href: '/admin/users', sub: `${users.suspended} suspended` },
  ];

  return (
    <div className="container">
      <PageHead title="Overview" subtitle={`Storage: ${db ? 'connected' : 'demo / log-only mode (set MONGODB_URI)'}`} />

      <StatGrid tiles={tiles} />

      <div className="grid-2" style={{ marginTop: 'var(--space-24)', alignItems: 'start' }}>
        <SectionCard title="Monthly revenue & commissions">
          <BarChart
            data={ledger.monthly.map((m) => ({ label: m.label, a: m.revenue, b: m.commissions }))}
            aLabel="Revenue"
            bLabel="Commissions"
            format={taka}
          />
        </SectionCard>

        <SectionCard title="What needs attention">
          <ul style={{ display: 'flex', flexDirection: 'column', gap: 10, fontSize: '.9rem' }}>
            {openLeads > 0 ? <li><Link href="/admin/leads">Reply to {openLeads} open lead{openLeads === 1 ? '' : 's'} →</Link></li> : null}
            {pendingPayouts > 0 ? <li><Link href="/admin/payments?status=pending">Settle {taka(pendingPayouts)} in pending payouts →</Link></li> : null}
            {pipeline.open > 0 ? <li><Link href="/admin/agents">Monitor {pipeline.open} active pipeline lead{pipeline.open === 1 ? '' : 's'} →</Link></li> : null}
            {users.creator === 0 ? <li><Link href="/admin/users/new">Add your first creator account →</Link></li> : null}
            <li><Link href="/admin/users/new">Create a user (admin / creator / agent) →</Link></li>
          </ul>
          {!db ? (
            <p className="text-sm" style={{ color: 'var(--fg-tertiary)', marginTop: 'var(--space-16)', fontSize: '.78rem' }}>
              Demo data shown. Connect <code>MONGODB_URI</code> to persist users, payments, and leads.
            </p>
          ) : null}
        </SectionCard>
      </div>
    </div>
  );
}
