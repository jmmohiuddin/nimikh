import { OG_CONTENT_TYPE, OG_SIZE, ogImage } from '@/lib/og';

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = 'Growth Marketing at Nimikh';

export default function Image() {
  return ogImage('Marketing that earns its own budget.', 'Performance campaigns on Meta, Google, and TikTok — anchored to real KPIs.');
}
