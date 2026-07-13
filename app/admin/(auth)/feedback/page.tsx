import { listFeedback } from '@/lib/feedback';

export const dynamic = 'force-dynamic';

function fmt(d: Date) {
  return new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'Asia/Dhaka',
  }).format(d);
}

const kindColor: Record<string, string> = {
  bug: 'badge-amber',
  feature: 'badge-indigo',
  rating: 'badge-green',
  general: 'badge-default',
};

export default async function AdminFeedbackPage() {
  const feedback = await listFeedback(200);

  return (
    <div className="container">
      <h1 className="text-h2 mb-24">Feedback</h1>

      {feedback.length === 0 ? (
        <div className="card"><p className="text-body">No feedback yet.</p></div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-12)' }}>
          {feedback.map((f, i) => (
            <div key={i} className="card">
              <div style={{ display: 'flex', gap: 'var(--space-12)', alignItems: 'center', flexWrap: 'wrap' }}>
                <span className={`badge ${kindColor[f.kind] ?? 'badge-default'}`}>{f.kind}</span>
                {f.rating ? <span style={{ color: '#f59e0b', fontSize: '.875rem' }}>{'★'.repeat(f.rating)}</span> : null}
                {f.pagePath ? <span style={{ fontSize: '.75rem', color: 'var(--fg-tertiary)' }}>on {f.pagePath}</span> : null}
                <span style={{ fontSize: '.75rem', color: 'var(--fg-tertiary)', marginLeft: 'auto' }}>{fmt(f.createdAt)}</span>
              </div>
              <p className="text-body text-sm mt-16" style={{ whiteSpace: 'pre-wrap' }}>{f.message}</p>
              {f.email ? (
                <div style={{ fontSize: '.75rem', color: 'var(--fg-tertiary)', marginTop: 8 }}>
                  From <a href={`mailto:${f.email}`}>{f.email}</a>
                </div>
              ) : null}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
