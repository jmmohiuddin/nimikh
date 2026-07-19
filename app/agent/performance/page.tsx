import type { Metadata } from 'next';
import { getSession } from '@/lib/auth';
import { conversionRate, countLeadsByStage, listAgentLeads } from '@/lib/agentLeads';
import { summarize, taka } from '@/lib/payments';
import { PageHead, StatGrid, SectionCard, type Tile } from '@/app/(shared)/dashboard/ui';
import { BarChart, Meter } from '@/app/(shared)/dashboard/Charts';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = { title: 'Performance' };

export default async function AgentPerformance() {
  const session = (await getSession())!;
  const [counts, ledger, leads] = await Promise.all([
    countLeadsByStage(session.uid),
    summarize({ agentId: session.uid }),
    listAgentLeads({ agentId: session.uid, limit: 500 }),
  ]);
  const rate = conversionRate(counts);

  // Conversions per month from converted leads.
  const now = new Date();
  const buckets = Array.from({ length: 6 }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1);
    return { key: `${d.getFullYear()}-${d.getMonth()}`, label: d.toLocaleString('en-GB', { month: 'short' }), a: 0 };
  });
  const idx = new Map(buckets.map((b) => [b.key, b]));
  for (const l of leads) {
    if (l.stage !== 'converted' || !l.convertedAt) continue;
    const d = new Date(l.convertedAt);
    const b = idx.get(`${d.getFullYear()}-${d.getMonth()}`);
    if (b) b.a += 1;
  }

  const tiles: Tile[] = [
    { label: 'Total leads', value: counts.total, icon: '☎' },
    { label: 'Converted', value: counts.converted, accent: 'green' },
    { label: 'Conversion rate', value: `${rate}%`, accent: 'amber' },
    { label: 'Earnings', value: taka(ledger.agentCommissions.total), accent: 'green' },
  ];

  return (
    <>
      <PageHead title="Performance" subtitle="Your conversion and earnings trend over the last 6 months." />
      <StatGrid tiles={tiles} />

      <div className="grid-2" style={{ marginTop: 'var(--space-24)', alignItems: 'start' }}>
        <SectionCard title="Conversions per month">
          <BarChart data={buckets.map((b) => ({ label: b.label, a: b.a }))} aLabel="Conversions" />
        </SectionCard>
        <SectionCard title="Commission earnings per month">
          <BarChart data={ledger.monthly.map((m) => ({ label: m.label, a: m.commissions }))} aLabel="Commission" format={taka} />
        </SectionCard>
      </div>

      <SectionCard title="Funnel" className="mt-24">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-16)' }}>
          <Meter label={`New (${counts.new})`} value={counts.total ? Math.round((counts.new / counts.total) * 100) : 0} tone="indigo" />
          <Meter label={`Contacted (${counts.contacted})`} value={counts.total ? Math.round((counts.contacted / counts.total) * 100) : 0} tone="indigo" />
          <Meter label={`Follow-up (${counts.followup})`} value={counts.total ? Math.round((counts.followup / counts.total) * 100) : 0} tone="amber" />
          <Meter label={`Converted (${counts.converted})`} value={counts.total ? Math.round((counts.converted / counts.total) * 100) : 0} tone="green" />
        </div>
      </SectionCard>
    </>
  );
}
