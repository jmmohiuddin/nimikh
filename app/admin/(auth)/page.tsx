import type { Metadata } from 'next';
import Link from 'next/link';
import { countClientsByStatus } from '@/lib/clients';
import { countCreatorsByStatus } from '@/lib/creators';
import { listFeedback } from '@/lib/feedback';
import { listLeads } from '@/lib/leads';
import { getDb } from '@/lib/db';

export const dynamic = 'force-dynamic';
// Explicit prefix — the (auth) layout's title.template doesn't reach this
// direct sibling page (Next 15 metadata quirk); nested pages under
// /admin/leads etc. inherit the "Admin · %s" template just fine.
export const metadata: Metadata = { title: 'Admin · Overview' };

export default async function AdminDashboard() {
  const db = await getDb();
  const [leads, feedback, clientCounts, creatorCounts] = await Promise.all([
    listLeads(5),
    listFeedback(5),
    countClientsByStatus(),
    countCreatorsByStatus(),
  ]);
  const openLeads = leads.filter((l) => !l.handled).length;
  const dbStatus = db ? 'connected' : 'log-only mode (set MONGODB_URI)';

  const tiles = [
    { label: 'Recent leads', value: leads.length, href: '/admin/leads' },
    { label: 'Open (unhandled)', value: openLeads, href: '/admin/leads', warn: openLeads > 0 },
    { label: 'Recent feedback', value: feedback.length, href: '/admin/feedback' },
    { label: 'Clients (total)', value: clientCounts.total, href: '/admin/clients' },
    { label: 'Active clients', value: clientCounts.active, href: '/admin/clients?status=active' },
    { label: 'Prospects', value: clientCounts.prospect, href: '/admin/clients?status=prospect' },
    { label: 'Creators (published)', value: creatorCounts.published, href: '/admin/creators?status=published' },
    { label: 'Creators (draft)', value: creatorCounts.draft, href: '/admin/creators?status=draft' },
  ];

  return (
    <div className="container">
      <h1 className="text-h2 mb-8">Overview</h1>
      <p className="text-body text-sm mb-32" style={{ color: 'var(--fg-tertiary)' }}>
        Storage: {dbStatus}
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 'var(--space-16)', marginBottom: 'var(--space-32)' }}>
        {tiles.map((t) => (
          <Link
            key={t.label}
            href={t.href}
            className="card"
            style={{ textDecoration: 'none', display: 'block' }}
          >
            <div style={{ fontSize: '.7rem', color: 'var(--fg-tertiary)', textTransform: 'uppercase', letterSpacing: '.08em' }}>
              {t.label}
            </div>
            <div className="stat-number mt-8" style={{ color: t.warn ? '#fbbf24' : 'var(--fg-primary)' }}>
              {t.value}
            </div>
          </Link>
        ))}
      </div>

      {!db ? (
        <div
          className="card"
          style={{
            borderColor: 'rgba(245,158,11,.4)',
            background: 'rgba(245,158,11,.06)',
            marginBottom: 'var(--space-32)',
          }}
        >
          <div style={{ fontWeight: 600, marginBottom: 8 }}>Log-only mode</div>
          <p className="text-body text-sm">
            Nothing is being persisted. Set <code>MONGODB_URI</code> (and optionally{' '}
            <code>MONGODB_DB</code>) in Vercel and redeploy to start saving submissions, clients, and
            creators. Until then: form submissions succeed for the user and are written to the server log;
            /admin CRUD operations succeed but nothing is stored.
          </p>
        </div>
      ) : null}

      <div className="grid-2" style={{ gap: 'var(--space-16)' }}>
        <div className="card">
          <div style={{ fontWeight: 600, marginBottom: 8 }}>What&apos;s next</div>
          <ul style={{ display: 'flex', flexDirection: 'column', gap: 8, fontSize: '.875rem' }}>
            {openLeads > 0 ? (
              <li>
                <Link href="/admin/leads">Reply to {openLeads} open lead{openLeads === 1 ? '' : 's'} →</Link>
              </li>
            ) : null}
            {creatorCounts.published === 0 && creatorCounts.total === 0 ? (
              <li>
                <Link href="/admin/creators/new">Publish your first creator to replace the seed marketplace →</Link>
              </li>
            ) : null}
            {clientCounts.total === 0 ? (
              <li>
                <Link href="/admin/clients/new">Add your first client, or convert a lead →</Link>
              </li>
            ) : null}
          </ul>
        </div>
        <div className="card">
          <div style={{ fontWeight: 600, marginBottom: 8 }}>Public marketplace source</div>
          <p className="text-body text-sm">
            {creatorCounts.published > 0
              ? <>Serving {creatorCounts.published} published creator{creatorCounts.published === 1 ? '' : 's'} from the database.</>
              : <>No published creators yet — /marketplace shows the seed list from <code>content/marketplace.ts</code>. Publish any creator here to switch over.</>
            }
          </p>
        </div>
      </div>
    </div>
  );
}
