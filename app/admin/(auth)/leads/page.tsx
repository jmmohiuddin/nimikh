import { revalidatePath } from 'next/cache';
import { listLeads, markLeadHandled } from '@/lib/leads';

export const dynamic = 'force-dynamic';

async function toggleHandledAction(formData: FormData) {
  'use server';
  const id = String(formData.get('id') ?? '');
  const handled = String(formData.get('handled') ?? '') === 'true';
  await markLeadHandled(id, handled);
  revalidatePath('/admin/leads');
}

function fmt(d: Date) {
  return new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'Asia/Dhaka',
  }).format(d);
}

export default async function AdminLeadsPage() {
  const leads = await listLeads(200);

  return (
    <div className="container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 'var(--space-24)' }}>
        <div>
          <h1 className="text-h2 mb-4">Leads</h1>
          <p className="text-body text-sm" style={{ color: 'var(--fg-tertiary)' }}>
            {leads.length} shown
          </p>
        </div>
        <a href="/admin/leads/export.csv" className="btn btn-ghost btn-sm">Download CSV</a>
      </div>

      {leads.length === 0 ? (
        <div className="card"><p className="text-body">No leads yet.</p></div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-12)' }}>
          {leads.map((l) => {
            const id = (l as unknown as { _id?: { toHexString: () => string } })._id?.toHexString() ?? '';
            return (
              <div
                key={id || `${l.email}-${l.createdAt.toString()}`}
                className="card"
                style={{ borderColor: l.handled ? 'var(--border-hairline)' : 'rgba(94,106,210,.4)' }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 'var(--space-16)', flexWrap: 'wrap' }}>
                  <div>
                    <div style={{ fontWeight: 600 }}>
                      {l.firstName} {l.lastName}{' '}
                      <span className="badge badge-indigo" style={{ marginLeft: 6 }}>{l.intent}</span>
                      {l.handled ? <span className="badge badge-green" style={{ marginLeft: 6 }}>Handled</span> : null}
                    </div>
                    <div style={{ fontSize: '.875rem', color: 'var(--fg-secondary)', marginTop: 4 }}>
                      <a href={`mailto:${l.email}`}>{l.email}</a>
                      {l.phone ? ` · ${l.phone}` : ''}
                      {l.company ? ` · ${l.company}` : ''}
                    </div>
                    <div style={{ fontSize: '.75rem', color: 'var(--fg-tertiary)', marginTop: 4 }}>
                      {fmt(l.createdAt)} {l.budget ? ` · ${l.budget}` : ''}
                    </div>
                  </div>
                  {id ? (
                    <form action={toggleHandledAction}>
                      <input type="hidden" name="id" value={id} />
                      <input type="hidden" name="handled" value={l.handled ? 'false' : 'true'} />
                      <button type="submit" className="btn btn-ghost btn-sm">
                        {l.handled ? 'Mark open' : 'Mark handled'}
                      </button>
                    </form>
                  ) : null}
                </div>
                <p className="text-body text-sm mt-16" style={{ whiteSpace: 'pre-wrap' }}>{l.message}</p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
