import Link from 'next/link';
import { revalidatePath } from 'next/cache';
import { CREATOR_STATUS, type CreatorStatus, listCreators, setCreatorStatus } from '@/lib/creators';

export const dynamic = 'force-dynamic';

async function statusAction(formData: FormData) {
  'use server';
  const id = String(formData.get('id') ?? '');
  const status = String(formData.get('status') ?? '') as CreatorStatus;
  if (!(CREATOR_STATUS as readonly string[]).includes(status)) return;
  await setCreatorStatus(id, status);
  revalidatePath('/admin/creators');
  revalidatePath('/marketplace');
}

const badgeForStatus: Record<CreatorStatus, string> = {
  published: 'badge-green',
  draft: 'badge-indigo',
  suspended: 'badge-amber',
};

export default async function AdminCreatorsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const q = await searchParams;
  const filterStatus = (CREATOR_STATUS as readonly string[]).includes(q.status ?? '')
    ? (q.status as CreatorStatus)
    : undefined;
  const creators = await listCreators({ status: filterStatus });

  return (
    <div className="container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 'var(--space-16)', marginBottom: 'var(--space-24)' }}>
        <div>
          <h1 className="text-h2 mb-4">Creators</h1>
          <p className="text-body text-sm" style={{ color: 'var(--fg-tertiary)' }}>
            {creators.length} shown{filterStatus ? ` · filtered to ${filterStatus}` : ''}
          </p>
        </div>
        <div style={{ display: 'flex', gap: 'var(--space-8)' }}>
          <Link href="/marketplace" className="btn btn-ghost btn-sm" target="_blank" rel="noopener">
            View public marketplace ↗
          </Link>
          <Link href="/admin/creators/new" className="btn btn-primary btn-sm">＋ New creator</Link>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 'var(--space-8)', flexWrap: 'wrap', marginBottom: 'var(--space-20)' }}>
        <FilterLink href="/admin/creators" label="All" active={!filterStatus} />
        {CREATOR_STATUS.map((s) => (
          <FilterLink key={s} href={`/admin/creators?status=${s}`} label={s} active={filterStatus === s} />
        ))}
      </div>

      {creators.length === 0 ? (
        <div className="card">
          <p className="text-body">
            No creators in the database yet. The public /marketplace page shows the seed directory (from{' '}
            <code>content/marketplace.ts</code>) until you publish at least one creator here — then the DB
            takes over completely.
          </p>
          <Link href="/admin/creators/new" className="btn btn-primary btn-sm mt-16">Add first creator</Link>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 'var(--space-16)' }}>
          {creators.map((c) => (
            <div key={c.id} className="card">
              <div style={{ display: 'flex', gap: 'var(--space-12)', alignItems: 'center', marginBottom: 'var(--space-12)' }}>
                <div
                  style={{
                    width: 44, height: 44, borderRadius: '50%', background: c.bg,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '1rem', fontWeight: 700, color: 'white', flexShrink: 0,
                  }}
                  aria-hidden="true"
                >
                  {c.initial}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 600, fontSize: '.9375rem' }}>
                    <Link href={`/admin/creators/${c.id}`}>{c.name}</Link>
                  </div>
                  <div style={{ fontSize: '.75rem', color: 'var(--fg-tertiary)' }}>{c.role}</div>
                </div>
                <span className={`badge ${badgeForStatus[c.status]}`}>{c.status}</span>
              </div>
              <div className="chip-group mb-16">
                <span className="chip">{c.category}</span>
                {c.chips.slice(0, 3).map((chip) => <span key={chip} className="chip">{chip}</span>)}
              </div>
              <div style={{ fontSize: '.8125rem', color: 'var(--fg-secondary)' }}>
                {c.rate} · ★ {c.rating} ({c.reviews} reviews)
              </div>
              <div style={{ display: 'flex', gap: 'var(--space-8)', marginTop: 'var(--space-16)', flexWrap: 'wrap' }}>
                <Link href={`/admin/creators/${c.id}`} className="btn btn-ghost btn-sm">Edit</Link>
                {c.status !== 'published' ? (
                  <QuickStatus id={c.id} to="published" label="Publish" />
                ) : (
                  <QuickStatus id={c.id} to="draft" label="Unpublish" />
                )}
                {c.status !== 'suspended' ? (
                  <QuickStatus id={c.id} to="suspended" label="Suspend" />
                ) : (
                  <QuickStatus id={c.id} to="draft" label="Unsuspend" />
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  function QuickStatus({ id, to, label }: { id: string; to: CreatorStatus; label: string }) {
    return (
      <form action={statusAction}>
        <input type="hidden" name="id" value={id} />
        <input type="hidden" name="status" value={to} />
        <button type="submit" className="btn btn-ghost btn-sm">{label}</button>
      </form>
    );
  }
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
