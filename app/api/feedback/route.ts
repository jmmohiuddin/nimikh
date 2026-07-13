import { FeedbackInputSchema, saveFeedback } from '@/lib/feedback';
import { checkRateLimit, clientIp } from '@/lib/rate-limit';

export const runtime = 'nodejs';

export async function POST(req: Request) {
  const ip = clientIp(req);
  const rl = checkRateLimit(`feedback:${ip}`, { capacity: 5, refillPerSec: 1 / 6 });
  if (!rl.ok) {
    return Response.json(
      { ok: false, error: 'Too many requests. Please slow down.' },
      { status: 429, headers: { 'Retry-After': String(rl.retryAfterSec) } },
    );
  }

  let raw: unknown;
  try {
    raw = await req.json();
  } catch {
    return Response.json({ ok: false, error: 'Invalid JSON' }, { status: 400 });
  }

  const parsed = FeedbackInputSchema.safeParse(raw);
  if (!parsed.success) {
    return Response.json(
      { ok: false, error: 'Validation failed', issues: parsed.error.flatten().fieldErrors },
      { status: 400 },
    );
  }
  if (parsed.data.website && parsed.data.website.length > 0) {
    return Response.json({ ok: true, persisted: false });
  }

  const userAgent = req.headers.get('user-agent') ?? undefined;
  const result = await saveFeedback(parsed.data, { userAgent, ip });
  if (!result.ok) {
    return Response.json({ ok: false, error: result.error }, { status: 500 });
  }
  return Response.json({ ok: true, persisted: result.persisted });
}
