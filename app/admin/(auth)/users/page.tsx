import type { Metadata } from 'next';
import Link from 'next/link';
import { revalidatePath } from 'next/cache';
import { deleteUser, listUsers, ROLES, setUserStatus, type Role } from '@/lib/users';
import { getDb } from '@/lib/db';
import { PageHead, StatusBadge } from '@/app/(shared)/dashboard/ui';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = { title: 'Users' };

async function statusAction(formData: FormData) {
  'use server';
  await setUserStatus(String(formData.get('id') ?? ''), String(formData.get('status') ?? 'active') === 'active' ? 'active' : 'suspended');
  revalidatePath('/admin/users');
}

async function deleteAction(formData: FormData) {
  'use server';
  await deleteUser(String(formData.get('id') ?? ''));
  revalidatePath('/admin/users');
}

const roleTone: Record<Role, 'indigo' | 'green' | 'amber' | 'default'> = { admin: 'indigo', creator: 'green', agent: 'amber', client: 'default' };

export default async function AdminUsersPage({ searchParams }: { searchParams: Promise<{ role?: string; q?: string }> }) {
  const q = await searchParams;
  const db = await getDb();
  const roleFilter = (ROLES as readonly string[]).includes(q.role ?? '') ? (q.role as Role) : undefined;
  const search = (q.q ?? '').trim().toLowerCase();

  let users = await listUsers({ role: roleFilter, limit: 500 });
  if (search) users = users.filter((u) => u.name.toLowerCase().includes(search) || u.email.toLowerCase().includes(search));

  return (
    <div className="container">
      <PageHead
        title="Users"
        subtitle={`${users.length} shown${roleFilter ? ` · ${roleFilter}s` : ''}`}
        actions={<Link href="/admin/users/new" className="btn btn-primary btn-sm">＋ New user</Link>}
      />

      <div className="filter-tabs">
        <Link href="/admin/users" className={`filter-tab${!roleFilter ? ' active' : ''}`}>All</Link>
        {ROLES.map((r) => (
          <Link key={r} href={`/admin/users?role=${r}`} className={`filter-tab${roleFilter === r ? ' active' : ''}`} style={{ textTransform: 'capitalize' }}>{r}s</Link>
        ))}
        <form method="get" style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
          {roleFilter ? <input type="hidden" name="role" value={roleFilter} /> : null}
          <input name="q" defaultValue={q.q ?? ''} placeholder="Search name or email" className="form-input" style={{ height: 34, width: 220, fontSize: '.85rem' }} />
          <button className="btn btn-secondary btn-sm">Search</button>
        </form>
      </div>

      {!db ? (
        <div className="card" style={{ borderColor: 'rgba(245,158,11,.4)', background: 'rgba(245,158,11,.06)', marginBottom: 'var(--space-20)' }}>
          <p className="text-body text-sm">Demo mode — showing the built-in demo accounts. Connect <code>MONGODB_URI</code> to create and manage real users (create/edit/delete then persist).</p>
        </div>
      ) : null}

      {users.length === 0 ? (
        <div className="card"><p className="text-body">No users found.</p></div>
      ) : (
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr><th>Name</th><th>Email</th><th>Role</th><th>Status</th><th style={{ textAlign: 'right' }}>Actions</th></tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id}>
                  <td style={{ color: 'var(--fg-primary)', fontWeight: 600 }}>{u.name}</td>
                  <td><a href={`mailto:${u.email}`}>{u.email}</a></td>
                  <td><StatusBadge label={u.role} tone={roleTone[u.role]} /></td>
                  <td><StatusBadge label={u.status} tone={u.status === 'active' ? 'green' : 'default'} /></td>
                  <td>
                    <div style={{ display: 'flex', gap: 6, justifyContent: 'flex-end', flexWrap: 'wrap' }}>
                      <Link href={`/admin/users/${u.id}`} className="btn btn-ghost btn-sm">Edit</Link>
                      <form action={statusAction}>
                        <input type="hidden" name="id" value={u.id} />
                        <input type="hidden" name="status" value={u.status === 'active' ? 'suspended' : 'active'} />
                        <button className="btn btn-ghost btn-sm">{u.status === 'active' ? 'Suspend' : 'Activate'}</button>
                      </form>
                      <form action={deleteAction}>
                        <input type="hidden" name="id" value={u.id} />
                        <button className="btn btn-ghost btn-sm" style={{ color: '#ffb4b4' }}>Delete</button>
                      </form>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
