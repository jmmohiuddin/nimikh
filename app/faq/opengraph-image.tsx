import { OG_CONTENT_TYPE, OG_SIZE, ogImage } from '@/lib/og';

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = 'Nimikh FAQ';

export default function Image() {
  return ogImage("Questions? We've got answers.", 'Services, pricing, marketplace, escrow, and how we work.');
}
