import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { requireSession } from '@/lib/auth';
import { resolveClientProject } from '@/lib/portal';
import { addMessage, listMessages } from '@/lib/messages';
import { createNotification } from '@/lib/notifications';
import { PageHead, SectionCard } from '@/app/(shared)/dashboard/ui';
import { ProjectSwitcher } from '../ProjectSwitcher';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = { title: 'Messages' };

function fmtWhen(d: Date) {
  return new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }).format(new Date(d));
}

async function sendAction(formData: FormData) {
  'use server';
  const session = await requireSession('/client/messages');
  const projectId = String(formData.get('projectId') ?? '');
  const body = String(formData.get('body') ?? '').trim();
  const attachmentUrl = String(formData.get('attachmentUrl') ?? '').trim();
  if (!body) return;
  // Verify the project belongs to this client before attaching a message.
  const { current } = await resolveClientProject(session.uid, projectId);
  if (!current || current.id !== projectId) return;
  await addMessage({ projectId, clientId: session.uid, sender: 'client', authorName: session.name, body, attachmentUrl });
  await createNotification({ clientId: session.uid, projectId, type: 'message', title: 'Message sent', body: 'Your message was sent to the team.', read: true });
  revalidatePath('/client/messages');
}

export default async function ClientMessages({ searchParams }: { searchParams: Promise<{ project?: string }> }) {
  const q = await searchParams;
  const session = await requireSession('/client/messages');
  const { projects, current } = await resolveClientProject(session.uid, q.project);
  if (!current) notFound();

  const messages = await listMessages({ projectId: current.id });

  return (
    <>
      <PageHead
        title="Messages"
        subtitle={`Conversation about ${current.name}`}
        actions={<ProjectSwitcher projects={projects} current={current.id} basePath="/client/messages" />}
      />

      <SectionCard>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-16)', maxHeight: 460, overflowY: 'auto', paddingRight: 4 }}>
          {messages.length === 0 ? (
            <p className="text-body text-sm" style={{ color: 'var(--fg-tertiary)' }}>No messages yet. Say hello 👋</p>
          ) : (
            messages.map((m) => {
              const mine = m.sender === 'client';
              return (
                <div key={m.id} style={{ display: 'flex', justifyContent: mine ? 'flex-end' : 'flex-start' }}>
                  <div style={{ maxWidth: '78%', padding: '10px 14px', borderRadius: 'var(--radius-lg)', background: mine ? 'rgba(94,106,210,.16)' : 'var(--surface-overlay)', border: '1px solid var(--border-hairline)' }}>
                    <div style={{ fontSize: '.72rem', color: 'var(--fg-tertiary)', marginBottom: 2 }}>
                      {mine ? 'You' : m.authorName || 'Team'} · {fmtWhen(m.createdAt)}
                    </div>
                    <div style={{ fontSize: '.9rem', color: 'var(--fg-primary)', whiteSpace: 'pre-wrap' }}>{m.body}</div>
                    {m.attachmentUrl ? <a href={m.attachmentUrl} target="_blank" rel="noopener noreferrer" style={{ fontSize: '.78rem' }}>📎 Attachment ↗</a> : null}
                  </div>
                </div>
              );
            })
          )}
        </div>

        <form action={sendAction} style={{ marginTop: 'var(--space-20)', borderTop: '1px solid var(--border-hairline)', paddingTop: 'var(--space-16)', display: 'flex', flexDirection: 'column', gap: 'var(--space-12)' }}>
          <input type="hidden" name="projectId" value={current.id} />
          <textarea name="body" required maxLength={4000} className="form-input" placeholder="Write a message to the team…" style={{ minHeight: 80 }} />
          <div style={{ display: 'flex', gap: 'var(--space-12)', alignItems: 'center', flexWrap: 'wrap' }}>
            <input name="attachmentUrl" type="url" className="form-input" placeholder="Attachment URL (optional)" style={{ flex: 1, minWidth: 200, height: 38 }} />
            <button type="submit" className="btn btn-primary">Send</button>
          </div>
        </form>
      </SectionCard>
    </>
  );
}
