import { facts, services } from '@/lib/knowledge';
import { absoluteUrl, site } from '@/lib/site';

/**
 * /llms.txt (NIM-075) in the llmstxt.org format: an H1 title, a blockquote
 * summary, then link sections an LLM can follow. Sourced from the shared
 * knowledge facts so it never drifts from /api/knowledge.
 */
export function GET() {
  const lines: string[] = [];

  lines.push(`# ${site.name}`);
  lines.push('');
  lines.push(`> ${facts.description}`);
  lines.push('');
  lines.push(
    `${site.name} is a digital growth agency based in ${facts.foundedLocation}, serving ${facts.serviceArea.join(', ')}. Work is delivered in ${facts.languages.join(' and ')}.`,
  );
  lines.push('');

  lines.push('## Services');
  for (const s of services) {
    const price = s.startingPriceBDT ? ` (from ৳${s.startingPriceBDT.toLocaleString()})` : '';
    lines.push(`- [${s.name}](${absoluteUrl(s.path)})${price}: ${s.summary}`);
  }
  lines.push('');

  lines.push('## Company');
  lines.push(`- [About](${absoluteUrl('/about')}): Mission, team, and values.`);
  lines.push(`- [Case studies](${absoluteUrl('/case-studies')}): Client outcomes with metrics.`);
  lines.push(`- [Pricing](${absoluteUrl('/pricing')}): Transparent BDT pricing across all services.`);
  lines.push(`- [FAQ](${absoluteUrl('/faq')}): Services, escrow, payments, and process.`);
  lines.push(`- [Contact](${absoluteUrl('/contact')}): Start a project or hire a creator.`);
  lines.push('');

  lines.push('## Facts');
  lines.push(`- Email: ${facts.contactEmail}`);
  lines.push(`- Phone / WhatsApp: ${facts.contactPhone}`);
  lines.push(`- Address: ${facts.foundedLocation}`);
  lines.push(`- Hours: ${facts.businessHours}`);
  lines.push(`- Payment methods: ${facts.paymentMethods.join(', ')}`);
  lines.push(`- Projects delivered: ${facts.stats.projectsDelivered}`);
  lines.push(`- Verified creators: ${facts.stats.verifiedCreators}`);
  lines.push(`- Average campaign ROI: ${facts.stats.averageCampaignRoi}`);
  lines.push('');

  return new Response(lines.join('\n'), {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=0, s-maxage=3600, stale-while-revalidate=86400',
    },
  });
}
