import type { Metadata } from 'next';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { SESSION_COOKIE as LEGACY_COOKIE, verifySessionToken } from '@/lib/session';
import { getSession } from '@/lib/auth';
import { ROLE_HOME } from '@/lib/users';
import { DashboardShell, type NavGroup } from '@/app/(shared)/dashboard/DashboardShell';

export const metadata: Metadata = {
  title: { template: 'Admin · %s — Nimikh', default: 'Admin — Nimikh' },
  robots: { index: false, follow: false },
};

const nav: NavGroup[] = [
  { items: [{ href: '/admin', label: 'Overview', icon: '◎' }] },
  { section: 'People', items: [
    { href: '/admin/users', label: 'Users', icon: '👥' },
    { href: '/admin/creators', label: 'Creators', icon: '🎨' },
    { href: '/admin/agents', label: 'Agents', icon: '☎' },
    { href: '/admin/clients', label: 'Clients', icon: '🏢' },
  ] },
  { section: 'Delivery', items: [
    { href: '/admin/projects', label: 'Projects', icon: '🗂' },
  ] },
  { section: 'Revenue', items: [
    { href: '/admin/finance', label: 'Finance', icon: '📊' },
    { href: '/admin/payments', label: 'Payments', icon: '৳' },
  ] },
  { section: 'Inbox', items: [
    { href: '/admin/leads', label: 'Leads', icon: '✉' },
    { href: '/admin/feedback', label: 'Feedback', icon: '💬' },
  ] },
];

/**
 * Auth gate for the admin tree. Accepts EITHER the new role-based session
 * (role === 'admin') or the legacy password-only admin cookie, so the
 * pre-existing /admin/login flow keeps working while the unified /login
 * flow is the primary path. A non-admin session is bounced to its own home.
 */
export default async function AuthedAdminLayout({ children }: { children: React.ReactNode }) {
  const jar = await cookies();
  const legacy = verifySessionToken(jar.get(LEGACY_COOKIE)?.value);
  const session = await getSession();

  if (!legacy && !session) redirect('/login?next=/admin');
  if (!legacy && session && session.role !== 'admin') redirect(ROLE_HOME[session.role]);

  const name = session?.role === 'admin' ? session.name : 'Admin';
  return <DashboardShell role="admin" userName={name} groups={nav}>{children}</DashboardShell>;
}
