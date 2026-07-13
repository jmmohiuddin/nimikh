import { OG_CONTENT_TYPE, OG_SIZE, ogImage } from '@/lib/og';

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = 'Nimikh Pricing';

export default function Image() {
  return ogImage('Transparent pricing. No surprises.', 'Project-based builds, monthly retainers, and pay-per-project creative.');
}
