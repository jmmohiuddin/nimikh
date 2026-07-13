import { OG_CONTENT_TYPE, OG_SIZE, ogImage } from '@/lib/og';

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = 'Nimikh Case Studies';

export default function Image() {
  return ogImage('Real results for real businesses.', 'The problem, our approach, and the outcome — in numbers.');
}
