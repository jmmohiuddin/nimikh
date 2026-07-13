import { OG_CONTENT_TYPE, OG_SIZE, ogImage } from '@/lib/og';

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = 'Software Development at Nimikh';

export default function Image() {
  return ogImage('We engineer software your business runs on.', 'Websites, e-commerce stores, and web applications — delivered on time.');
}
