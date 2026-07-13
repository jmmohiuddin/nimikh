import { OG_CONTENT_TYPE, OG_SIZE, ogImage } from '@/lib/og';

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = 'Nimikh Creator Marketplace';

export default function Image() {
  return ogImage('Affordable creative talent. Ready to work.', '240+ verified local creators, escrow-protected hiring.');
}
