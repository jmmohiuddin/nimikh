import { OG_CONTENT_TYPE, OG_SIZE, ogImage } from '@/lib/og';

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = 'Contact Nimikh';

export default function Image() {
  return ogImage("Let's build something together.", 'We respond within 24 hours.');
}
