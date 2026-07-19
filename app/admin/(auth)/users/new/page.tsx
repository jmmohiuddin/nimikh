import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { revalidatePath } from 'next/cache';
import { UserForm } from '../UserForm';
import { createUser } from '@/lib/users';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = { title: 'New user' };

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

async function createAction(formData: FormData) {
  'use server';
  const input = parse(formData);
  const password = String(formData.get('password') ?? '');
  const result = await createUser(input, password);
  if (!result.ok) {
    const params = new URLSearchParams({
      error: result.error,
      ...(result.issues ? { issues: JSON.stringify(result.issues) } : {}),
      ...Object.fromEntries(Object.entries(input).map(([k, v]) => [k, String(v)])),
    });
    redirect(`/admin/users/new?${params.toString()}`);
  }
  revalidatePath('/admin/users');
  redirect('/admin/users?created=1');
}

export default async function NewUserPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const q = await searchParams;
  const one = (k: string) => (Array.isArray(q[k]) ? q[k]?.[0] : q[k]) ?? '';
  const error = one('error') || null;
  const issues = one('issues') ? (JSON.parse(one('issues')) as Record<string, string[] | undefined>) : undefined;

  const initial = {
    id: '', name: one('name'), email: one('email'),
    role: (one('role') as 'creator') || 'creator', status: (one('status') as 'active') || 'active',
    phone: one('phone'), notes: one('notes'), createdAt: new Date(), updatedAt: new Date(),
  };

  return (
    <div className="container">
      <div style={{ marginBottom: 'var(--space-20)' }}>
        <Link href="/admin/users" style={{ fontSize: '.875rem', color: 'var(--fg-tertiary)' }}>← Back to users</Link>
      </div>
      <h1 className="text-h2 mb-24">New user</h1>
      <UserForm action={createAction} initial={initial} submitLabel="Create user" error={error} issues={issues} passwordRequired />
    </div>
  );
}
