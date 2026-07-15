import type { Metadata } from 'next';
import Link from 'next/link';
import { revalidatePath } from 'next/cache';
import { CLIENT_STATUS, type ClientStatus, listClients, setClientArchived } from '@/lib/clients';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = { title: 'Clients' };

async function toggleArchivedAction(formData: FormData) {
  'use server';
  const id = String(formData.get('id') ?? '');
  const archived = String(formData.get('archived') ?? '') === 'true';
  await setClientArchived(id, archived);
  revalidatePath('/admin/clients');
}

function fmt(d: Date) {
  return new Intl.DateTimeFormat('en-GB', {
    day: 'numeric', month: 'short', year: 'numeric', timeZone: 'Asia/Dhaka',
  }).format(d);
}

const badgeForStatus: Record<ClientStatus, string> = {
  active: 'badge-green',
  prospect: 'badge-indigo',
  past: 'badge-default',
  dormant: 'badge-default',
};

export default async function AdminClientsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; archived?: string }>;
}) {
  const q = await searchParams;
  const filterStatus = (CLIENT_STATUS as readonly string[]).includes(q.status ?? '')
    ? (q.status as ClientStatus)
    : undefined;
  const includeArchived = q.archived === '1';
  const clients = await listClients({ status: filterStatus, includeArchived });

  return (
    <div className="container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 'var(--space-16)', marginBottom: 'var(--space-24)' }}>
        <div>
          <h1 className="text-h2 mb-4">Clients</h1>
          <p className="text-body text-sm" style={{ color: 'var(--fg-tertiary)' }}>
            {clients.length} shown{filterStatus ? ` · filtered to ${filterStatus}` : ''}{includeArchived ? ' · including archived' : ''}
          </p>
        </div>
        <Link href="/admin/clients/new" className="btn btn-primary btn-sm">＋ New client</Link>
      </div>

      <div style={{ display: 'flex', gap: 'var(--space-8)', flexWrap: 'wrap', marginBottom: 'var(--space-20)' }}>
        <FilterLink href="/admin/clients" label="All" active={!filterStatus} />
        {CLIENT_STATUS.map((s) => (
          <FilterLink key={s} href={`/admin/clients?status=${s}`} label={s} active={filterStatus === s} />
        ))}
        <div style={{ marginLeft: 'auto' }}>
          <FilterLink
            href={includeArchived ? '/admin/clients' : '/admin/clients?archived=1'}
            label={includeArchived ? '✓ Show archived' : 'Show archived'}
            active={includeArchived}
          />
        </div>
      </div>

      {clients.length === 0 ? (
        <div className="card"><p className="text-body">No clients yet. Create one, or convert a lead from <Link href="/admin/leads">/admin/leads</Link>.</p></div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-12)' }}>
          {clients.map((c) => (
            <div key={c.id} className="card" style={{ opacity: c.archived ? 0.6 : 1 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 'var(--space-16)', flexWrap: 'wrap' }}>
                <div>
                  <div style={{ fontWeight: 600, fontSize: '1rem' }}>
                    <Link href={`/admin/clients/${c.id}`}>{c.company}</Link>{' '}
                    <span className={`badge ${badgeForStatus[c.status]}`} style={{ marginLeft: 6 }}>{c.status}</span>
                    {c.archived ? <span className="badge badge-default" style={{ marginLeft: 6 }}>archived</span> : null}
                  </div>
                  <div style={{ fontSize: '.875rem', color: 'var(--fg-secondary)', marginTop: 4 }}>
                    {c.contactName ? `${c.contactName} · ` : ''}<a href={`mailto:${c.email}`}>{c.email}</a>
                    {c.phone ? ` · ${c.phone}` : ''}
                    {c.industry ? ` · ${c.industry}` : ''}
                  </div>
                  <div style={{ fontSize: '.75rem', color: 'var(--fg-tertiary)', marginTop: 4 }}>
                    Updated {fmt(c.updatedAt)}
                    {c.services.length ? ` · ${c.services.join(', ')}` : ''}
                    {c.fromLeadId ? ' · from lead' : ''}
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 'var(--space-8)' }}>
                  <Link href={`/admin/clients/${c.id}`} className="btn btn-ghost btn-sm">Edit</Link>
                  <form action={toggleArchivedAction}>
                    <input type="hidden" name="id" value={c.id} />
                    <input type="hidden" name="archived" value={c.archived ? 'false' : 'true'} />
                    <button type="submit" className="btn btn-ghost btn-sm">
                      {c.archived ? 'Restore' : 'Archive'}
                    </button>
                  </form>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function FilterLink({ href, label, active }: { href: string; label: string; active: boolean }) {
  return (
    <Link
      href={href}
      className={`filter-tab${active ? ' active' : ''}`}
      style={{ textTransform: 'capitalize', textDecoration: 'none' }}
    >
      {label}
    </Link>
  );
}
