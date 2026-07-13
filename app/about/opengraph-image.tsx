import { OG_CONTENT_TYPE, OG_SIZE, ogImage } from '@/lib/og';

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = 'About Nimikh';

export default function Image() {
  return ogImage('We built the agency we wished existed.', 'Our mission, our team, and our values.');
}
