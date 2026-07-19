import type { Metadata } from 'next';
import Link from 'next/link';
import { getSession } from '@/lib/auth';
import { getUserById } from '@/lib/users';
import { listPayments, summarize, taka } from '@/lib/payments';
import { PageHead, StatGrid, SectionCard, type Tile } from '@/app/(shared)/dashboard/ui';
import { BarChart } from '@/app/(shared)/dashboard/Charts';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = { title: 'Overview' };

export default async function CreatorOverview() {
  const session = (await getSession())!;
  const [profile, ledger, recent] = await Promise.all([
    getUserById(session.uid),
    summarize({ creatorId: session.uid }),
    listPayments({ creatorId: session.uid, type: 'creator_payout', limit: 5 }),
  ]);

  const tiles: Tile[] = [
    { label: 'Total earnings', value: taka(ledger.creatorPayouts.total), icon: '৳', accent: 'green', sub: 'All-time payouts' },
    { label: 'Paid', value: taka(ledger.creatorPayouts.completed), accent: 'default' },
    { label: 'Pending', value: taka(ledger.creatorPayouts.pending), accent: 'amber' },
    { label: 'Payments', value: recent.length ? `${recent.length}+` : '0', sub: 'Recent settlements', href: '/creator/earnings' },
  ];

  return (
    <>
      <PageHead
        title={`Welcome back, ${session.name.split(' ')[0]}`}
        subtitle="Here's how your work is performing on Nimikh."
        actions={<Link href="/creator/content" className="btn btn-primary btn-sm">＋ Add content</Link>}
      />

      <StatGrid tiles={tiles} />

      <div className="grid-2" style={{ marginTop: 'var(--space-24)', alignItems: 'start' }}>
        <SectionCard title="Monthly earnings" action={<Link href="/creator/earnings" className="btn btn-ghost btn-sm">Details</Link>}>
          <BarChart
            data={ledger.monthly.map((m) => ({ label: m.label, a: Math.round(m.revenue * 0.65) }))}
            aLabel="Earnings"
            format={taka}
          />
        </SectionCard>

        <SectionCard title="Your profile">
          <dl style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', rowGap: 10, columnGap: 16, fontSize: '.9rem' }}>
            <dt style={{ color: 'var(--fg-tertiary)' }}>Name</dt><dd>{profile?.name ?? session.name}</dd>
            <dt style={{ color: 'var(--fg-tertiary)' }}>Email</dt><dd>{profile?.email ?? session.email}</dd>
            <dt style={{ color: 'var(--fg-tertiary)' }}>Role</dt><dd style={{ textTransform: 'capitalize' }}>Creator</dd>
            <dt style={{ color: 'var(--fg-tertiary)' }}>Status</dt><dd><span className="badge badge-green">Active</span></dd>
          </dl>
          <div style={{ marginTop: 'var(--space-20)', display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <Link href="/creator/content" className="btn btn-secondary btn-sm">Manage content</Link>
            <Link href="/creator/analytics" className="btn btn-ghost btn-sm">View analytics</Link>
          </div>
        </SectionCard>
      </div>
    </>
  );
}
