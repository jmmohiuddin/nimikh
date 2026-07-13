import { OG_CONTENT_TYPE, OG_SIZE, ogImage } from '@/lib/og';

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = 'Creative Studio at Nimikh';

export default function Image() {
  return ogImage('Content that stops the scroll.', 'Short-form video, motion graphics, design, and photography.');
}
