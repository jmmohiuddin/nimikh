# Redirect log

Every redirect lives in [`redirects.json`](../redirects.json), validated against a
Zod schema at build time (`lib/redirects.ts`) — a malformed entry fails `npm run build`.
This file is the human-readable rationale log required by NIM-003. Add a row here whenever
you add a redirect.

| Date added | Source | Destination | Type | Rationale |
|---|---|---|---|---|
| 2026-07-13 | `/index.html` | `/` | 301 | Legacy static-site URL retired in the Next.js migration. |
| 2026-07-13 | `/about.html` | `/about` | 301 | Legacy static-site URL. |
| 2026-07-13 | `/services.html` | `/services` | 301 | Legacy static-site URL. |
| 2026-07-13 | `/services/software.html` | `/services/software` | 301 | Legacy static-site URL. |
| 2026-07-13 | `/services/marketing.html` | `/services/marketing` | 301 | Legacy static-site URL. |
| 2026-07-13 | `/services/creative.html` | `/services/creative` | 301 | Legacy static-site URL. |
| 2026-07-13 | `/marketplace.html` | `/marketplace` | 301 | Legacy static-site URL. |
| 2026-07-13 | `/pricing.html` | `/pricing` | 301 | Legacy static-site URL. |
| 2026-07-13 | `/case-studies.html` | `/case-studies` | 301 | Legacy static-site URL. |
| 2026-07-13 | `/contact.html` | `/contact` | 301 | Legacy static-site URL. |
| 2026-07-13 | `/faq.html` | `/faq` | 301 | Legacy static-site URL. |

## Notes

- **Trailing slashes** are normalised by Next.js config (`trailingSlash: false`), not by
  this file.
- **Uppercase paths** are lowercased by `middleware.ts` (301), not by this file.
- **Tracking params** (`utm_*`, `gclid`, `fbclid`, …) are stripped by `middleware.ts` (301),
  not by this file.
- `permanent: true` emits a 308 in Next.js (method-preserving permanent). Use the optional
  `statusCode: 301` field if you specifically need a classic 301.
