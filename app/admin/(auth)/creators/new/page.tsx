import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { revalidatePath } from 'next/cache';
import { CreatorForm } from '../CreatorForm';
import { createCreator } from '@/lib/creators';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = { title: 'New creator' };

function parseFormData(formData: FormData) {
  const chipsRaw = String(formData.get('chips') ?? '').trim();
  const reviewsRaw = String(formData.get('reviews') ?? '0');
  return {
    name: String(formData.get('name') ?? ''),
    role: String(formData.get('role') ?? ''),
    category: String(formData.get('category') ?? 'video'),
    status: String(formData.get('status') ?? 'draft'),
    initial: String(formData.get('initial') ?? '').toUpperCase(),
    bg: String(formData.get('bg') ?? ''),
    emoji: String(formData.get('emoji') ?? '🎬'),
    rate: String(formData.get('rate') ?? ''),
    rating: String(formData.get('rating') ?? '5.0'),
    reviews: Number.parseInt(reviewsRaw, 10) || 0,
    chips: chipsRaw ? chipsRaw.split(',').map((s) => s.trim()).filter(Boolean) : [],
    portfolioUrl: String(formData.get('portfolioUrl') ?? ''),
    email: String(formData.get('email') ?? ''),
    notes: String(formData.get('notes') ?? ''),
  };
}

async function createCreatorAction(formData: FormData) {
  'use server';
  const input = parseFormData(formData);
  const result = await createCreator(input);
  if (!result.ok) {
    const params = new URLSearchParams({
      error: result.error,
      ...(result.issues ? { issues: JSON.stringify(result.issues) } : {}),
      ...Object.fromEntries(
        Object.entries(input).map(([k, v]) => [
          k,
          Array.isArray(v) ? v.join(', ') : String(v),
        ]),
      ),
    });
    redirect(`/admin/creators/new?${params.toString()}`);
  }
  revalidatePath('/admin/creators');
  revalidatePath('/marketplace');
  redirect(result.id ? `/admin/creators/${result.id}?created=1` : '/admin/creators?created=1');
}

export default async function NewCreatorPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const q = await searchParams;
  const one = (k: string) => (Array.isArray(q[k]) ? q[k]?.[0] : q[k]) ?? '';
  const error = one('error') || null;
  const issues = one('issues') ? (JSON.parse(one('issues')) as Record<string, string[] | undefined>) : undefined;

  const initial = {
    name: one('name') || '',
    role: one('role') || '',
    category: (one('category') as 'video') || 'video',
    status: (one('status') as 'draft') || 'draft',
    initial: one('initial') || '',
    bg: one('bg') || 'linear-gradient(135deg,#5e6ad2,#7c3aed)',
    emoji: one('emoji') || '🎬',
    rate: one('rate') || '',
    rating: one('rating') || '5.0',
    reviews: Number(one('reviews')) || 0,
    chips: (one('chips') || '').split(',').map((s) => s.trim()).filter(Boolean),
    portfolioUrl: one('portfolioUrl') || '',
    email: one('email') || '',
    notes: one('notes') || '',
  };

  return (
    <div className="container">
      <div style={{ marginBottom: 'var(--space-20)' }}>
        <Link href="/admin/creators" style={{ fontSize: '.875rem', color: 'var(--fg-tertiary)' }}>← Back to creators</Link>
      </div>
      <h1 className="text-h2 mb-24">New creator</h1>
      <CreatorForm action={createCreatorAction} initial={initial} submitLabel="Create creator" error={error} issues={issues} />
    </div>
  );
}
