import type { Metadata } from 'next';
import Link from 'next/link';
import { requireSession } from '@/lib/auth';
import { conversionRate, countLeadsByStage, listAgentLeads, OPEN_STAGES } from '@/lib/agentLeads';
import { summarize, taka } from '@/lib/payments';
import { PageHead, StatGrid, SectionCard, StatusBadge, type Tile } from '@/app/(shared)/dashboard/ui';
import { Meter } from '@/app/(shared)/dashboard/Charts';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = { title: 'Overview' };

function isToday(d: Date | null | undefined) {
  if (!d) return false;
  const x = new Date(d); const n = new Date();
  return x.getFullYear() === n.getFullYear() && x.getMonth() === n.getMonth() && x.getDate() === n.getDate();
}
function isPastOrToday(d: Date | null | undefined) {
  if (!d) return false;
  return new Date(d).getTime() <= new Date().setHours(23, 59, 59, 999);
}

export default async function AgentOverview() {
  const session = await requireSession('/agent');
  const [counts, ledger, leads] = await Promise.all([
    countLeadsByStage(session.uid),
    summarize({ agentId: session.uid }),
    listAgentLeads({ agentId: session.uid, limit: 500 }),
  ]);

  const dueFollowUps = leads
    .filter((l) => OPEN_STAGES.includes(l.stage) && isPastOrToday(l.followUpAt))
    .sort((a, b) => +new Date(a.followUpAt ?? 0) - +new Date(b.followUpAt ?? 0));
  const todaysCalls = leads.filter((l) => isToday(l.followUpAt)).length;
  const rate = conversionRate(counts);

  const tiles: Tile[] = [
    { label: 'Active pipeline', value: counts.open, icon: '☎', accent: 'indigo', sub: `${counts.total} total leads` },
    { label: 'Converted', value: counts.converted, accent: 'green' },
    { label: 'Conversion rate', value: `${rate}%`, accent: 'amber' },
    { label: 'Commission (total)', value: taka(ledger.agentCommissions.total), accent: 'green', href: '/agent/commissions', sub: `${taka(ledger.agentCommissions.pending)} pending` },
  ];

  return (
    <>
      <PageHead
        title={`Good to see you, ${session.name.split(' ')[0]}`}
        subtitle="Your leads, follow-ups, and commissions at a glance."
        actions={<Link href="/agent/leads" className="btn btn-primary btn-sm">Work my leads →</Link>}
      />
      <StatGrid tiles={tiles} />

      <div className="grid-2" style={{ marginTop: 'var(--space-24)', alignItems: 'start' }}>
        <SectionCard title={`Follow-ups due (${dueFollowUps.length})`} action={<Link href="/agent/leads" className="btn btn-ghost btn-sm">All leads</Link>}>
          {dueFollowUps.length === 0 ? (
            <p className="text-body text-sm" style={{ color: 'var(--fg-tertiary)' }}>Nothing due. {todaysCalls} scheduled for today.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {dueFollowUps.slice(0, 6).map((l) => (
                <div key={l.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
                  <div style={{ minWidth: 0 }}>
                    <Link href={`/agent/leads?focus=${l.id}`} style={{ fontWeight: 600, fontSize: '.9rem' }}>{l.name}</Link>
                    <div style={{ fontSize: '.78rem', color: 'var(--fg-tertiary)' }}>{l.company || l.phone}</div>
                  </div>
                  <StatusBadge label={l.stage} tone={l.stage === 'followup' ? 'amber' : 'indigo'} />
                </div>
              ))}
            </div>
          )}
        </SectionCard>

        <SectionCard title="Pipeline health">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-16)' }}>
            <Meter label="Conversion rate" value={rate} tone="green" />
            <div className="stat-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
              {(['new', 'contacted', 'followup'] as const).map((s) => (
                <div key={s} className="stat-tile" style={{ padding: 12 }}>
                  <div className="label" style={{ textTransform: 'capitalize' }}>{s}</div>
                  <div className="value" style={{ fontSize: '1.4rem' }}>{counts[s]}</div>
                </div>
              ))}
            </div>
            <p className="text-sm" style={{ color: 'var(--fg-tertiary)', fontSize: '.78rem' }}>
              Every conversion pays you {Math.round(0.25 * 100)}% of the customer payment.
            </p>
          </div>
        </SectionCard>
      </div>
    </>
  );
}
