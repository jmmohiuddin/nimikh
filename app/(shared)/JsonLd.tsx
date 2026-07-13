/**
 * Renders a JSON-LD payload as a script tag. Server component — zero
 * client JS. JSON.stringify with `<` escaped so page content can never
 * break out of the script element (XSS hardening for future CMS data).
 */
export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, '\\u003c'),
      }}
    />
  );
}
