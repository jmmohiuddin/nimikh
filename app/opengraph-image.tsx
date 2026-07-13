import { OG_CONTENT_TYPE, OG_SIZE, ogImage } from '@/lib/og';

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = 'Nimikh — Build. Market. Create.';

export default function Image() {
  return ogImage(
    'Every business deserves a digital powerhouse.',
    'Software, marketing, and creative talent under one roof — Dhaka, Bangladesh.',
  );
}
