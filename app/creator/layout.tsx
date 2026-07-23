import type { Metadata } from 'next';
import { requireRole } from '@/lib/auth';
import { DashboardShell, type NavGroup } from '@/app/(shared)/dashboard/DashboardShell';

export const metadata: Metadata = {
  title: { template: 'Creator · %s — Nimikh', default: 'Creator — Nimikh' },
  robots: { index: false, follow: false },
};

const nav: NavGroup[] = [
  { items: [
    { href: '/creator', label: 'Overview', icon: '◎' },
    { href: '/creator/earnings', label: 'Earnings', icon: '৳' },
    { href: '/creator/content', label: 'Content', icon: '▦' },
    { href: '/creator/analytics', label: 'Analytics', icon: '📈' },
  ] },
];

export default async function CreatorLayout({ children }: { children: React.ReactNode }) {
  const session = await requireRole('creator', '/creator');
  return <DashboardShell role="creator" userName={session.name} groups={nav}>{children}</DashboardShell>;
}
