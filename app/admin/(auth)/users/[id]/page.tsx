import type { Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';
import Link from 'next/link';
import { revalidatePath } from 'next/cache';
import { UserForm } from '../UserForm';
import { getUserById, updateUser } from '@/lib/users';
import { getDb } from '@/lib/db';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = { title: 'Edit user' };

function parse(formData: FormData) {
  return {
    name: String(formData.get('name') ?? ''),
    email: String(formData.get('email') ?? ''),
    role: String(formData.get('role') ?? 'creator'),
    status: String(formData.get('status') ?? 'active'),
    phone: String(formData.get('phone') ?? ''),
    notes: String(formData.get('notes') ?? ''),
  };
}

export default async function EditUserPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { id } = await params;
  const q = await searchParams;
  const one = (k: string) => (Array.isArray(q[k]) ? q[k]?.[0] : q[k]) ?? '';

  const user = await getUserById(id);
  if (!user) notFound();

  const db = await getDb();
  const isDemo = !db || id.startsWith('demo-');

  async function updateAction(formData: FormData) {
    'use server';
    const input = parse(formData);
    const password = String(formData.get('password') ?? '');
    const result = await updateUser(id, input, password || undefined);
    if (!result.ok) {
      const p = new URLSearchParams({ error: result.error, ...(result.issues ? { issues: JSON.stringify(result.issues) } : {}) });
      redirect(`/admin/users/${id}?${p.toString()}`);
    }
    revalidatePath('/admin/users');
    redirect('/admin/users?updated=1');
  }

  const error = one('error') || null;
  const issues = one('issues') ? (JSON.parse(one('issues')) as Record<string, string[] | undefined>) : undefined;

  return (
    <div className="container">
      <div style={{ marginBottom: 'var(--space-20)' }}>
        <Link href="/admin/users" style={{ fontSize: '.875rem', color: 'var(--fg-tertiary)' }}>← Back to users</Link>
      </div>
      <h1 className="text-h2 mb-8">Edit user</h1>
      <p className="text-body text-sm mb-24" style={{ color: 'var(--fg-tertiary)' }}>{user.email}</p>

      {isDemo ? (
        <div className="card" style={{ borderColor: 'rgba(245,158,11,.4)', background: 'rgba(245,158,11,.06)', marginBottom: 'var(--space-20)' }}>
          <p className="text-body text-sm">This is a demo account — edits won&apos;t persist without a database. Connect <code>MONGODB_URI</code> to manage real users.</p>
        </div>
      ) : null}

      <UserForm action={updateAction} initial={user} submitLabel="Save changes" error={error} issues={issues} />
    </div>
  );
}
