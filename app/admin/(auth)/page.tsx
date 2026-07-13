import { listFeedback } from '@/lib/feedback';
import { listLeads } from '@/lib/leads';
import { getDb } from '@/lib/db';

export const dynamic = 'force-dynamic';

export default async function AdminDashboard() {
  const db = await getDb();
  const [leads, feedback] = await Promise.all([listLeads(5), listFeedback(5)]);
  const totalLeads = leads.length;
  const openLeads = leads.filter((l) => !l.handled).length;
  const dbStatus = db ? 'connected' : 'log-only mode (set MONGODB_URI)';

  return (
    <div className="container">
      <h1 className="text-h2 mb-8">Overview</h1>
      <p className="text-body text-sm mb-32" style={{ color: 'var(--fg-tertiary)' }}>
        Storage: {dbStatus}
      </p>

      <div className="grid-3 mb-32">
        <div className="card">
          <div style={{ fontSize: '.75rem', color: 'var(--fg-tertiary)', textTransform: 'uppercase', letterSpacing: '.08em' }}>
            Recent leads
          </div>
          <div className="stat-number mt-8">{totalLeads}</div>
        </div>
        <div className="card">
          <div style={{ fontSize: '.75rem', color: 'var(--fg-tertiary)', textTransform: 'uppercase', letterSpacing: '.08em' }}>
            Open (unhandled)
          </div>
          <div className="stat-number mt-8" style={{ color: openLeads > 0 ? '#fbbf24' : 'var(--fg-primary)' }}>
            {openLeads}
          </div>
        </div>
        <div className="card">
          <div style={{ fontSize: '.75rem', color: 'var(--fg-tertiary)', textTransform: 'uppercase', letterSpacing: '.08em' }}>
            Recent feedback
          </div>
          <div className="stat-number mt-8">{feedback.length}</div>
        </div>
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
            <code>MONGODB_DB</code>) in Vercel and redeploy to start saving submissions. Until
            then, submissions succeed for the user and are written to the server log.
          </p>
        </div>
      ) : null}

      <p className="text-body text-sm">
        Jump to <a href="/admin/leads">Leads</a> or <a href="/admin/feedback">Feedback</a>.
      </p>
    </div>
  );
}
