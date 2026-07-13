import { z } from 'zod';
import redirectsData from '../redirects.json';

/**
 * next.config's `redirects()` typing is a discriminated union that TS
 * struggles to narrow through our Zod-validated data. We type our own
 * shape and let Next infer the return of the config function.
 */
type OutRedirect = {
  source: string;
  destination: string;
  permanent: boolean;
  statusCode?: 301 | 302 | 307 | 308;
};

/**
 * Central redirect map loader (NIM-003). All 301 responses live in
 * redirects.json so content ops can PR a redirect without touching TS.
 * Zod validates at build time; a malformed entry fails `next build`
 * before it can ship to production.
 */
const RedirectSchema = z.object({
  source: z.string().min(1),
  destination: z.string().min(1),
  permanent: z.boolean(),
  /** Optional override — 308 for permanent-preserve-method, 307 for temporary-preserve-method. */
  statusCode: z.union([z.literal(301), z.literal(302), z.literal(307), z.literal(308)]).optional(),
  /** Non-functional, kept in the file for humans reading the diff. */
  note: z.string().optional(),
});

const RedirectsSchema = z.array(RedirectSchema);

export type Redirect = z.infer<typeof RedirectSchema>;

export function getRedirects(): OutRedirect[] {
  const parsed = RedirectsSchema.safeParse(redirectsData);
  if (!parsed.success) {
    throw new Error(
      `redirects.json failed schema validation:\n${parsed.error.issues
        .map((i) => `  • ${i.path.join('.')}: ${i.message}`)
        .join('\n')}`,
    );
  }
  return parsed.data.map((r) => {
    const base: OutRedirect = {
      source: r.source,
      destination: r.destination,
      permanent: r.permanent,
    };
    if (!r.permanent && r.statusCode !== undefined) {
      base.statusCode = r.statusCode;
    }
    return base;
  });
}
