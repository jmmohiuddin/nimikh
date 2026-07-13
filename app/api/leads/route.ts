import { LeadInputSchema, saveLead } from '@/lib/leads';
import { checkRateLimit, clientIp } from '@/lib/rate-limit';

// Runs on Node runtime because the mongodb driver isn't Edge-compatible.
export const runtime = 'nodejs';

export async function POST(req: Request) {
  // Rate limit — 5/min per IP with burst of 3. Prevents scripted floods
  // without blocking a legit user who mistypes and resubmits twice.
  const ip = clientIp(req);
  const rl = checkRateLimit(`leads:${ip}`, { capacity: 3, refillPerSec: 1 / 12 });
  if (!rl.ok) {
    return Response.json(
      { ok: false, error: 'Too many requests. Please wait a moment and try again.' },
      { status: 429, headers: { 'Retry-After': String(rl.retryAfterSec) } },
    );
  }

  let raw: unknown;
  try {
    raw = await req.json();
  } catch {
    return Response.json({ ok: false, error: 'Invalid JSON' }, { status: 400 });
  }

  const parsed = LeadInputSchema.safeParse(raw);
  if (!parsed.success) {
    return Response.json(
      { ok: false, error: 'Validation failed', issues: parsed.error.flatten().fieldErrors },
      { status: 400 },
    );
  }

  // Honeypot: any value in `website` means bot. Return 200 to not tip them off.
  if (parsed.data.website && parsed.data.website.length > 0) {
    return Response.json({ ok: true, persisted: false });
  }

  const userAgent = req.headers.get('user-agent') ?? undefined;
  const result = await saveLead(parsed.data, { userAgent, ip, source: 'contact-form' });
  if (!result.ok) {
    return Response.json({ ok: false, error: result.error }, { status: 500 });
  }
  return Response.json({ ok: true, persisted: result.persisted });
}
