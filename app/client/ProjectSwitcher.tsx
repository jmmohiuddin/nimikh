'use client';

import { useRouter } from 'next/navigation';
import type { ProjectView } from '@/lib/projects';

/**
 * Lets a client with more than one project switch which project a billing /
 * workspace page is scoped to. Renders nothing for single-project clients.
 * Navigation keeps the page path and sets ?project=<id>.
 */
export function ProjectSwitcher({ projects, current, basePath }: { projects: ProjectView[]; current: string; basePath: string }) {
  const router = useRouter();
  if (projects.length <= 1) return null;
  return (
    <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '.85rem', color: 'var(--fg-tertiary)' }}>
      Project
      <select
        className="form-input"
        style={{ height: 36, width: 'auto', fontSize: '.85rem' }}
        defaultValue={current}
        onChange={(e) => router.push(`${basePath}?project=${e.target.value}`)}
      >
        {projects.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
      </select>
    </label>
  );
}
