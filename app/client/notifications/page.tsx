import type { Metadata } from 'next';
import { revalidatePath } from 'next/cache';
import { requireSession } from '@/lib/auth';
import { listNotifications, markAllRead, markNotificationRead, NOTIF_ICON } from '@/lib/notifications';
import { PageHead, SectionCard } from '@/app/(shared)/dashboard/ui';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = { title: 'Notifications' };

function fmtWhen(d: Date) {
  return new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }).format(new Date(d));
}

async function readAllAction() {
  'use server';
  const session = await requireSession('/client/notifications');
  await markAllRead(session.uid);
  revalidatePath('/client/notifications');
}

async function readOneAction(formData: FormData) {
  'use server';
  const session = await requireSession('/client/notifications');
  await markNotificationRead(String(formData.get('id') ?? ''), session.uid);
  revalidatePath('/client/notifications');
}

export default async function ClientNotifications() {
  const session = await requireSession('/client/notifications');
  const notifs = await listNotifications(session.uid, 100);
  const unread = notifs.filter((n) => !n.read).length;

  return (
    <>
      <PageHead
        title="Notifications"
        subtitle={unread > 0 ? `${unread} unread` : 'You’re all caught up'}
        actions={unread > 0 ? (
          <form action={readAllAction}><button className="btn btn-ghost btn-sm">Mark all read</button></form>
        ) : undefined}
      />

      {notifs.length === 0 ? (
        <SectionCard><p className="text-body">No notifications yet.</p></SectionCard>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-8)' }}>
          {notifs.map((n) => (
            <div key={n.id} className="card" style={{ display: 'flex', gap: 14, alignItems: 'flex-start', opacity: n.read ? 0.7 : 1, borderColor: n.read ? undefined : 'rgba(94,106,210,.35)' }}>
              <span aria-hidden style={{ fontSize: '1.3rem' }}>{NOTIF_ICON[n.type]}</span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 600, fontSize: '.92rem' }}>
                  {n.title}{!n.read ? <span className="badge badge-indigo" style={{ marginLeft: 8, fontSize: '.6rem' }}>new</span> : null}
                </div>
                <div style={{ fontSize: '.85rem', color: 'var(--fg-secondary)', marginTop: 2 }}>{n.body}</div>
                <div style={{ fontSize: '.74rem', color: 'var(--fg-tertiary)', marginTop: 4 }}>{fmtWhen(n.createdAt)}</div>
              </div>
              {!n.read ? (
                <form action={readOneAction}>
                  <input type="hidden" name="id" value={n.id} />
                  <button className="btn btn-ghost btn-sm">Mark read</button>
                </form>
              ) : null}
            </div>
          ))}
        </div>
      )}
    </>
  );
}
