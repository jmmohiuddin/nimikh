import { notFound, redirect } from 'next/navigation';
import Link from 'next/link';
import { revalidatePath } from 'next/cache';
import { CreatorForm } from '../CreatorForm';
import { deleteCreator, getCreator, updateCreator } from '@/lib/creators';

export const dynamic = 'force-dynamic';

type Params = { params: Promise<{ id: string }>; searchParams: Promise<Record<string, string | string[] | undefined>> };

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

export default async function EditCreatorPage({ params, searchParams }: Params) {
  const { id } = await params;
  const q = await searchParams;
  const creator = await getCreator(id);
  if (!creator) notFound();

  const one = (k: string) => (Array.isArray(q[k]) ? q[k]?.[0] : q[k]) ?? '';
  const createdFlag = one('created') === '1';
  const savedFlag = one('saved') === '1';
  const error = one('error') || null;
  const issues = one('issues') ? (JSON.parse(one('issues')) as Record<string, string[] | undefined>) : undefined;

  async function saveAction(formData: FormData) {
    'use server';
    const input = parseFormData(formData);
    const result = await updateCreator(id, input);
    if (!result.ok) {
      const params = new URLSearchParams({
        error: result.error,
        ...(result.issues ? { issues: JSON.stringify(result.issues) } : {}),
      });
      redirect(`/admin/creators/${id}?${params.toString()}`);
    }
    revalidatePath('/admin/creators');
    revalidatePath(`/admin/creators/${id}`);
    revalidatePath('/marketplace');
    redirect(`/admin/creators/${id}?saved=1`);
  }

  async function deleteAction() {
    'use server';
    await deleteCreator(id);
    revalidatePath('/admin/creators');
    revalidatePath('/marketplace');
    redirect('/admin/creators');
  }

  return (
    <div className="container">
      <div style={{ marginBottom: 'var(--space-20)' }}>
        <Link href="/admin/creators" style={{ fontSize: '.875rem', color: 'var(--fg-tertiary)' }}>← Back to creators</Link>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: 'var(--space-16)', flexWrap: 'wrap', marginBottom: 'var(--space-24)' }}>
        <h1 className="text-h2">{creator.name}</h1>
        <form action={deleteAction}>
          <button
            type="submit"
            className="btn btn-ghost btn-sm"
            style={{ color: 'var(--status-error)', borderColor: 'rgba(238,0,0,.25)' }}
          >
            Delete
          </button>
        </form>
      </div>

      {(createdFlag || savedFlag) ? (
        <div
          role="status"
          style={{
            background: 'rgba(52,211,153,.08)',
            border: '1px solid rgba(52,211,153,.25)',
            color: '#a7f3d0',
            padding: 'var(--space-12) var(--space-16)',
            borderRadius: 'var(--radius-md)',
            fontSize: '.875rem',
            marginBottom: 'var(--space-20)',
          }}
        >
          {createdFlag ? 'Creator created.' : 'Changes saved.'} {creator.status === 'published' ? 'Live on /marketplace.' : 'Not yet visible on /marketplace — publish when ready.'}
        </div>
      ) : null}

      <CreatorForm action={saveAction} initial={creator} submitLabel="Save changes" error={error} issues={issues} />
    </div>
  );
}
