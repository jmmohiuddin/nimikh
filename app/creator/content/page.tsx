import type { Metadata } from 'next';
import { revalidatePath } from 'next/cache';
import { requireSession } from '@/lib/auth';
import { addPortfolioItem, deletePortfolioItem, listPortfolio } from '@/lib/portfolio';
import { PageHead, SectionCard } from '@/app/(shared)/dashboard/ui';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = { title: 'Content' };

async function addAction(formData: FormData) {
  'use server';
  const session = await requireSession('/creator/content');
  const tags = String(formData.get('tags') ?? '').split(',').map((t) => t.trim()).filter(Boolean).slice(0, 8);
  await addPortfolioItem({
    creatorId: session.uid,
    title: String(formData.get('title') ?? ''),
    imageUrl: String(formData.get('imageUrl') ?? ''),
    emoji: String(formData.get('emoji') ?? '🖼️') || '🖼️',
    tags,
  });
  revalidatePath('/creator/content');
}

async function deleteAction(formData: FormData) {
  'use server';
  const session = await requireSession('/creator/content');
  await deletePortfolioItem(String(formData.get('id') ?? ''), session.uid);
  revalidatePath('/creator/content');
}

export default async function CreatorContent() {
  const session = await requireSession('/creator/content');
  const items = await listPortfolio(session.uid);

  return (
    <>
      <PageHead title="Content" subtitle="Upload, manage, and remove the work shown on your profile." />

      <div className="grid-2" style={{ alignItems: 'start' }}>
        <SectionCard title="Add content">
          <form action={addAction} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-16)' }}>
            <div className="form-group">
              <label className="form-label" htmlFor="title">Title</label>
              <input id="title" name="title" required maxLength={160} className="form-input" placeholder="e.g. Eid Campaign Reel" />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="imageUrl">Image URL <span style={{ color: 'var(--fg-tertiary)' }}>(optional)</span></label>
              <input id="imageUrl" name="imageUrl" type="url" className="form-input" placeholder="https://…" />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '80px 1fr', gap: 'var(--space-12)' }}>
              <div className="form-group">
                <label className="form-label" htmlFor="emoji">Icon</label>
                <input id="emoji" name="emoji" maxLength={4} className="form-input" placeholder="🎬" defaultValue="🎬" />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="tags">Tags <span style={{ color: 'var(--fg-tertiary)' }}>(comma-separated)</span></label>
                <input id="tags" name="tags" className="form-input" placeholder="Reels, Food" />
              </div>
            </div>
            <button type="submit" className="btn btn-primary" style={{ justifyContent: 'center' }}>Add to portfolio</button>
            <p className="text-sm" style={{ color: 'var(--fg-tertiary)', fontSize: '.75rem' }}>
              Items reference a hosted image URL — direct file uploads can be enabled later without changing this screen.
            </p>
          </form>
        </SectionCard>

        <SectionCard title={`Portfolio (${items.length})`}>
          {items.length === 0 ? (
            <p className="text-body text-sm" style={{ color: 'var(--fg-tertiary)' }}>No content yet. Add your first item.</p>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: 'var(--space-12)' }}>
              {items.map((it) => (
                <div key={it.id} style={{ borderRadius: 'var(--radius-lg)', overflow: 'hidden', border: '1px solid var(--border-hairline)' }}>
                  <div style={{ height: 96, background: it.imageUrl ? `center/cover no-repeat url(${it.imageUrl})` : it.bg, display: 'grid', placeItems: 'center', fontSize: '1.6rem' }}>
                    {it.imageUrl ? '' : it.emoji}
                  </div>
                  <div style={{ padding: '10px 12px' }}>
                    <div style={{ fontSize: '.82rem', fontWeight: 600, lineHeight: 1.3 }}>{it.title}</div>
                    {it.tags.length ? <div style={{ fontSize: '.7rem', color: 'var(--fg-tertiary)', marginTop: 4 }}>{it.tags.join(' · ')}</div> : null}
                    <form action={deleteAction} style={{ marginTop: 8 }}>
                      <input type="hidden" name="id" value={it.id} />
                      <button type="submit" className="btn btn-ghost btn-sm" style={{ width: '100%', justifyContent: 'center' }}>Delete</button>
                    </form>
                  </div>
                </div>
              ))}
            </div>
          )}
        </SectionCard>
      </div>
    </>
  );
}
