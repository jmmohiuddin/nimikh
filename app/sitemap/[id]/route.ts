import { NextResponse } from 'next/server';
import { SITEMAP_BUCKETS, type SitemapId, XML_HEADERS, renderUrlset } from '@/lib/sitemap';

/**
 * Split sitemaps served at /sitemap/{id}.xml. The `id` route segment
 * carries the `.xml` suffix (e.g. "pages.xml") — we strip it before
 * looking up the bucket.
 */
type Params = { params: Promise<{ id: string }> };

export async function GET(_req: Request, ctx: Params) {
  const { id: rawId } = await ctx.params;
  const id = rawId.endsWith('.xml') ? rawId.slice(0, -4) : rawId;
  if (!(id in SITEMAP_BUCKETS)) {
    return NextResponse.json({ error: 'Unknown sitemap' }, { status: 404 });
  }
  const entries = SITEMAP_BUCKETS[id as SitemapId];
  return new Response(renderUrlset(entries), { headers: XML_HEADERS });
}

export function generateStaticParams() {
  return Object.keys(SITEMAP_BUCKETS).map((id) => ({ id: `${id}.xml` }));
}
