import { XML_HEADERS, renderSitemapIndex } from '@/lib/sitemap';

export function GET() {
  return new Response(renderSitemapIndex(), { headers: XML_HEADERS });
}
