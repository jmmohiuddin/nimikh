import type { Metadata } from 'next';
import { requireRole } from '@/lib/auth';
import { countUnread } from '@/lib/notifications';
import { DashboardShell, type NavGroup } from '@/app/(shared)/dashboard/DashboardShell';

export const metadata: Metadata = {
  title: { template: 'Client · %s — Nimikh', default: 'Client Portal — Nimikh' },
  robots: { index: false, follow: false },
};

export default async function ClientLayout({ children }: { children: React.ReactNode }) {
  const session = await requireRole('client', '/client');
  const unread = await countUnread(session.uid);

  const nav: NavGroup[] = [
    { items: [
      { href: '/client', label: 'Overview', icon: '◎' },
      { href: '/client/project', label: 'Project', icon: '🗂' },
    ] },
    { section: 'Billing', items: [
      { href: '/client/installments', label: 'Installments', icon: '📅' },
      { href: '/client/payments', label: 'Payments', icon: '৳' },
    ] },
    { section: 'Workspace', items: [
      { href: '/client/documents', label: 'Documents', icon: '📎' },
      { href: '/client/messages', label: 'Messages', icon: '💬' },
      { href: '/client/notifications', label: unread > 0 ? `Notifications (${unread})` : 'Notifications', icon: '🔔' },
    ] },
  ];

  return <DashboardShell role="client" userName={session.name} groups={nav}>{children}</DashboardShell>;
}
