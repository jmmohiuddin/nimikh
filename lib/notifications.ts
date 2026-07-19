import type { ObjectId } from 'mongodb';
import { COLLECTIONS, getDb } from './db';

/**
 * Client notifications — the portal's activity feed. Emitted by admin
 * actions (invoice generated, payment received, milestone completed, file
 * uploaded, project delivered) and by scheduled reminders (installment due,
 * overdue). Kept deliberately simple: one flat collection scoped by
 * clientId, with a read flag.
 */

export const NOTIFICATION_TYPES = [
  'invoice', 'payment', 'due-soon', 'overdue', 'milestone', 'message', 'file', 'delivered',
] as const;
export type NotificationType = (typeof NOTIFICATION_TYPES)[number];

export const NOTIF_ICON: Record<NotificationType, string> = {
  invoice: '🧾', payment: '✅', 'due-soon': '⏰', overdue: '⚠️', milestone: '🚩', message: '💬', file: '📎', delivered: '🚀',
};

export type Notification = {
  _id?: ObjectId;
  clientId: string;
  projectId?: string;
  type: NotificationType;
  title: string;
  body: string;
  read: boolean;
  createdAt: Date;
};
export type NotificationView = Omit<Notification, '_id'> & { id: string };

function toView(n: Notification): NotificationView {
  const { _id, ...rest } = n;
  return { ...rest, id: _id ? _id.toHexString() : '' };
}

async function requireCol() {
  const db = await getDb();
  if (!db) return null;
  const col = db.collection<Notification>(COLLECTIONS.notifications);
  await col.createIndex({ clientId: 1, createdAt: -1 }).catch(() => {});
  return col;
}

export async function createNotification(n: Omit<Notification, '_id' | 'read' | 'createdAt'> & { read?: boolean }): Promise<boolean> {
  const col = await requireCol();
  if (!col) return false;
  await col.insertOne({ ...n, read: n.read ?? false, createdAt: new Date() });
  return true;
}

export async function listNotifications(clientId: string, limit = 50): Promise<NotificationView[]> {
  const col = await requireCol();
  if (!col) return demoNotifications().filter((n) => n.clientId === clientId).slice(0, limit);
  const docs = await col.find({ clientId }, { sort: { createdAt: -1 }, limit }).toArray();
  return docs.map(toView);
}

export async function countUnread(clientId: string): Promise<number> {
  const col = await requireCol();
  if (!col) return demoNotifications().filter((n) => n.clientId === clientId && !n.read).length;
  return col.countDocuments({ clientId, read: false });
}

export async function markNotificationRead(id: string, clientId: string): Promise<boolean> {
  const col = await requireCol();
  if (!col) return false;
  const { ObjectId } = await import('mongodb');
  const res = await col.updateOne({ _id: new ObjectId(id), clientId }, { $set: { read: true } });
  return res.matchedCount > 0;
}

export async function markAllRead(clientId: string): Promise<boolean> {
  const col = await requireCol();
  if (!col) return false;
  await col.updateMany({ clientId, read: false }, { $set: { read: true } });
  return true;
}

let _notifs: NotificationView[] | null = null;
function demoNotifications(): NotificationView[] {
  if (_notifs) return _notifs;
  const now = new Date();
  const hrs = (h: number) => new Date(now.getTime() - h * 3600_000);
  const rows: Array<Omit<NotificationView, 'id'>> = [
    { clientId: 'demo-client', projectId: 'demo-project-1', type: 'due-soon', title: 'Installment 3 due soon', body: 'Your next payment of ৳40,000 is due shortly.', read: false, createdAt: hrs(3) },
    { clientId: 'demo-client', projectId: 'demo-project-1', type: 'milestone', title: 'Development started', body: 'Your project moved to the Development stage.', read: false, createdAt: hrs(30) },
    { clientId: 'demo-client', projectId: 'demo-project-1', type: 'file', title: 'New design uploaded', body: 'Homepage Design v3 is available in Documents.', read: false, createdAt: hrs(54) },
    { clientId: 'demo-client', projectId: 'demo-project-1', type: 'payment', title: 'Payment received', body: 'We received your installment 2 payment. Thank you!', read: true, createdAt: hrs(24 * 30) },
    { clientId: 'demo-client', projectId: 'demo-project-2', type: 'delivered', title: 'Brand Identity delivered', body: 'Your brand kit is ready to download.', read: true, createdAt: hrs(24 * 88) },
  ];
  _notifs = rows.map((r, i) => ({ ...r, id: `demo-notif-${i}` }));
  return _notifs;
}
