import { listProjects, type ProjectView } from './projects';

/**
 * Resolve which project a client page is looking at. Clients can own
 * several projects; billing/workspace pages accept a `?project=<id>` and
 * default to the most recently updated one. Always scoped to the client's
 * own uid, and the requested id is verified to belong to them — a client
 * can never address another client's project by guessing an id.
 */
export async function resolveClientProject(
  clientId: string,
  requestedId?: string,
): Promise<{ projects: ProjectView[]; current: ProjectView | null }> {
  const projects = await listProjects({ clientId });
  if (projects.length === 0) return { projects, current: null };
  const requested = requestedId ? projects.find((p) => p.id === requestedId) : undefined;
  return { projects, current: requested ?? projects[0] };
}
