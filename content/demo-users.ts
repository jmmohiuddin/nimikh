/**
 * Demo user fallback (mirrors the content/marketplace.ts seed pattern).
 *
 * When MONGODB_URI is not set, the `users` collection can't exist, so the
 * platform would have nobody to log in as. These demo accounts let anyone
 * evaluate the full role-based experience out-of-the-box. The credentials
 * are documented in README.md (never shown in the UI).
 *
 * Passwords are stored in the `plain$…` demo format understood by
 * lib/auth/password.ts. The moment a real database is provisioned and a
 * user is created through the admin UI, DB accounts take over and these
 * are only used if the collection is still empty.
 *
 * DO NOT ship these as real credentials — they exist purely so the UI is
 * navigable before onboarding real, hashed accounts.
 */

import type { Role, UserStatus } from '@/lib/users';

export type DemoUser = {
  id: string;
  email: string;
  password: string; // plaintext, demo-only
  role: Role;
  name: string;
  status: UserStatus;
};

export const demoUsers: DemoUser[] = [
  {
    id: 'demo-admin',
    email: 'admin@nimikh.com',
    password: 'admin1234',
    role: 'admin',
    name: 'Platform Admin',
    status: 'active',
  },
  {
    id: 'demo-creator',
    email: 'creator@nimikh.com',
    password: 'creator1234',
    role: 'creator',
    name: 'Riya Ahmed',
    status: 'active',
  },
  {
    id: 'demo-agent',
    email: 'agent@nimikh.com',
    password: 'agent1234',
    role: 'agent',
    name: 'Rafiq Hasan',
    status: 'active',
  },
  {
    id: 'demo-client',
    email: 'client@nimikh.com',
    password: 'client1234',
    role: 'client',
    name: 'Imran Chowdhury',
    status: 'active',
  },
];
