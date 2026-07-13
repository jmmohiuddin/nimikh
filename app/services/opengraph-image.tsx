import { OG_CONTENT_TYPE, OG_SIZE, ogImage } from '@/lib/og';

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = 'Nimikh Services';

export default function Image() {
  return ogImage('Three services. One team.', 'Software development, growth marketing, and creative production.');
}
