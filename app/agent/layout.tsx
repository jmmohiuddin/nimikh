import type { Metadata } from 'next';
import { requireRole } from '@/lib/auth';
import { DashboardShell, type NavGroup } from '@/app/(shared)/dashboard/DashboardShell';

export const metadata: Metadata = {
  title: { template: 'Agent · %s — Nimikh', default: 'Agent — Nimikh' },
  robots: { index: false, follow: false },
};

const nav: NavGroup[] = [
  { items: [
    { href: '/agent', label: 'Overview', icon: '◎' },
    { href: '/agent/leads', label: 'Leads', icon: '☎' },
    { href: '/agent/commissions', label: 'Commissions', icon: '৳' },
    { href: '/agent/performance', label: 'Performance', icon: '📈' },
  ] },
];

export default async function AgentLayout({ children }: { children: React.ReactNode }) {
  const session = await requireRole('agent', '/agent');
  return <DashboardShell role="agent" userName={session.name} groups={nav}>{children}</DashboardShell>;
}
