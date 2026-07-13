# Nimikh

Digital growth agency website — software development, growth marketing, and a creator marketplace connecting small businesses with affordable local creative talent. Based in Dhaka, Bangladesh.

🌐 **Live:** [nimikh.tech](https://nimikh.tech) · [nimikh.vercel.app](https://nimikh.vercel.app)

## Stack

- [Next.js 15](https://nextjs.org) App Router · React 19 · TypeScript (strict)
- Tailwind CSS wired to CSS-variable design tokens (`app/globals.css`)
- Server components by default; client components only where interactivity requires it (`app/(shared)/`)
- Zod-validated redirect map (`redirects.json`), edge middleware with security headers, split sitemaps, LLM-crawler-friendly `robots.txt`
- GitHub Actions CI: typecheck → lint → build → Lighthouse budget

## Routes

| Route | Description |
|-------|-------------|
| `/` | Homepage — hero, services bento grid, pricing, testimonials |
| `/about` | Mission, team, and values |
| `/services` | Overview of all three service pillars |
| `/services/software` | Software development detail |
| `/services/marketing` | Growth marketing detail |
| `/services/creative` | Creative studio + marketplace |
| `/marketplace` | Filterable creator directory with escrow info |
| `/pricing` | Full pricing and comparison table |
| `/case-studies` | Client case studies with metrics |
| `/contact` | Contact form with inquiry routing |
| `/faq` | Categorized FAQ |
| `/founders/[slug]` | Founder profiles with Person schema |
| `/legal/*` | Privacy, terms, security, entity, compliance |

Machine-readable surfaces: `/robots.txt`, `/sitemap.xml` (+ split sitemaps), `/llms.txt`, `/api/knowledge`, `/.well-known/security.txt`.

## Development

```bash
npm install
npm run dev        # http://localhost:3000
npm run typecheck  # tsc --noEmit
npm run lint
npm run build
npm run audit:seo  # boots the built site and checks indexability invariants
```

## Getting into Google

Deploying indexable code is necessary but not sufficient — you must verify the site
in Google Search Console and submit the sitemap. Step-by-step: [`docs/getting-indexed.md`](docs/getting-indexed.md).

## Architecture notes

- `lib/site.ts` — single source of truth for name, URL, nav, contact
- `lib/pages.ts` — static content manifest feeding sitemaps (swaps for CMS queries when Contentful lands)
- `lib/schema.ts` — typed JSON-LD builders (Organization, WebSite, ProfessionalService, FAQPage)
- `redirects.json` — all redirects; schema-validated at build, logged in `docs/redirects.md`
- Engineering roadmap: `Nimikh_Engineering_Specifications.md`

## Deployment

Pushes to `main` auto-deploy via Vercel.

---

© 2026 Nimikh. All rights reserved.
