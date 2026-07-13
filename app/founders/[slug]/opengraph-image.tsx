import { getFounder, founders } from '@/lib/founders';
import { OG_CONTENT_TYPE, OG_SIZE, ogImage } from '@/lib/og';

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = 'Nimikh founder';

export function generateImageMetadata() {
  return founders.map((f) => ({ id: f.slug, alt: `${f.name}, ${f.jobTitle} at Nimikh` }));
}

type Props = { params: { slug: string }; id: string };

export default function Image({ params }: Props) {
  const f = getFounder(params.slug);
  if (!f) return ogImage('Nimikh', 'Founder');
  return ogImage(f.name, `${f.jobTitle}, Nimikh`);
}
