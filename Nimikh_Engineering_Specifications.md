# Nimikh — Engineering Specifications & Implementation Tickets

**Target stack:** Next.js 15 (App Router) • React 19 • TypeScript (strict) • Tailwind CSS • PostgreSQL • Contentful (CMS) • AWS CloudFront • GitHub Actions
**Deliverable:** Ready-to-work engineering tickets. Every ticket has scope, acceptance criteria, dependencies, and technical notes.
**Reference:** `Nimikh_Organic_Growth_Strategy.md` §§ 3–17
**Convention:** Ticket IDs `NIM-XXX`. Priority P0–P3 matches the strategy. Effort in eng-days (1d = 6 focused hours).

---

## Table of Epics

| Epic | Name | Ticket Range | Total Effort |
|---|---|---|---|
| E01 | Core Infrastructure & Routing | NIM-001 to NIM-008 | 18d |
| E02 | Schema & Structured Data | NIM-010 to NIM-018 | 22d |
| E03 | Content Model & CMS | NIM-020 to NIM-028 | 26d |
| E04 | Page Templates & Rendering | NIM-030 to NIM-040 | 34d |
| E05 | Performance & Core Web Vitals | NIM-045 to NIM-051 | 15d |
| E06 | SEO Meta Layer | NIM-055 to NIM-061 | 12d |
| E07 | Internal Linking System | NIM-065 to NIM-069 | 10d |
| E08 | AEO / GEO Layer | NIM-075 to NIM-082 | 16d |
| E09 | Analytics & Measurement | NIM-085 to NIM-091 | 14d |
| E10 | Trust, Legal & Compliance | NIM-095 to NIM-099 | 8d |
| E11 | CI/CD Quality Gates | NIM-105 to NIM-110 | 10d |
| E12 | Internationalization | NIM-115 to NIM-118 | 8d |

**Total:** ~193 engineer-days across ~68 tickets. Assumes 2 mid+ full-stack engineers plus 1 devops contractor. Duration ≈ 5 calendar months to complete P0/P1.

---

## Global Engineering Conventions

Applies to every ticket unless overridden.

- **Language:** TypeScript, strict mode. No `any`. `unknown` at boundaries with parse validation via Zod.
- **Runtime:** Next.js App Router. Server Components by default. Client components only when interactivity requires it.
- **Data fetching:** RSC-first. `fetch()` with `next.revalidate` for ISR. No `useEffect` for data loading.
- **State:** Server state via server components. Client state via React state / URL params. No Redux, no global stores.
- **Styling:** Tailwind CSS. Design tokens as CSS variables. No inline styles except dynamic values.
- **Testing:** Vitest unit + Playwright E2E. Every acceptance criterion maps to a test.
- **Accessibility:** WCAG 2.2 AA baseline. Axe checks in CI.
- **Definition of Done (every ticket):**
  - Code merged to `main` behind feature flag if user-facing
  - Unit and E2E tests passing in CI
  - Lighthouse budget passing
  - Schema validation passing (where applicable)
  - Documentation added to `/docs/architecture/`
  - PR reviewed and approved by second engineer
  - Deployed to staging and verified

---

## Epic E01 — Core Infrastructure & Routing

### NIM-001 — Project scaffold and repository conventions
- **Priority:** P0 • **Effort:** 2d • **Owner:** Frontend Lead
- **Depends on:** —
- **Description:** Establish the Next.js 15 monorepo, TypeScript config, ESLint/Prettier, commit hooks, and branch protection rules.
- **Technical Approach:**
  - `next@15` App Router with TypeScript 5.4+ strict mode
  - `turbo` for monorepo orchestration; workspaces: `apps/web`, `packages/ui`, `packages/schema`, `packages/analytics`, `packages/content`
  - ESLint with `@next/eslint-config-next`, `eslint-plugin-tailwindcss`, `eslint-plugin-jsx-a11y`
  - Husky pre-commit: lint-staged runs ESLint + Prettier + TypeScript project references check
  - Conventional Commits enforced via commitlint
- **Acceptance Criteria:**
  - `pnpm dev` starts the site on port 3000 within 8 seconds cold
  - `pnpm build` completes with zero warnings
  - `pnpm lint` runs eslint + tsc across all workspaces
  - `main` branch requires signed commits + 1 review + green CI
- **Testing:** N/A (foundation)

### NIM-002 — Canonical URL routing structure
- **Priority:** P0 • **Effort:** 2d • **Owner:** Frontend
- **Depends on:** NIM-001
- **Description:** Implement the canonical URL structure from Strategy §3.4 as the App Router folder tree.
- **Technical Approach:**
  - Segment structure per strategy: `/services/[slug]`, `/industries/[slug]`, `/case-studies/[slug]`, `/insights/[category]/[slug]`, `/glossary/[term]`, `/compare/[a]-vs-[b]`, `/founders/[slug]`, `/legal/[page]`
  - `generateStaticParams` on every dynamic segment for full pre-rendering
  - Trailing slash policy: NO trailing slashes (Next 15 config: `trailingSlash: false`)
  - All URLs lowercase; middleware rewrites uppercase to lowercase 301
- **Acceptance Criteria:**
  - Every route in strategy §3.4 renders 200 with placeholder content
  - Uppercase URLs 301 to lowercase
  - Trailing-slash URLs 301 to non-trailing-slash equivalents
  - `pnpm build` outputs static routes for at least the top 10 canonical URLs
- **Testing:** Playwright E2E tests one route per pattern

### NIM-003 — Global redirect map system
- **Priority:** P0 • **Effort:** 1d • **Owner:** Frontend
- **Depends on:** NIM-002
- **Description:** Central `redirects.json` file consumed by `next.config.js` for all 301 and 410 responses.
- **Technical Approach:**
  - Schema: `{ source: string, destination: string, permanent: boolean, statusCode?: number }`
  - Validated at build time via Zod; broken schema fails the build
  - Support wildcards and regex paths for silo restructures
  - Log all redirects in `/docs/redirects.md` with rationale and date added
- **Acceptance Criteria:**
  - Ten seed redirects (defined by content team) return correct status codes
  - Build fails if `redirects.json` has invalid schema
  - Redirects are visible in Search Console within 48h of deploy
- **Testing:** Unit test the schema parser; E2E test each seed redirect

### NIM-004 — Middleware for edge-level policies
- **Priority:** P0 • **Effort:** 2d • **Owner:** Frontend
- **Depends on:** NIM-002
- **Description:** Edge middleware enforcing HTTPS, canonicalization, geo-based currency, and bot allowlisting.
- **Technical Approach:**
  - `middleware.ts` at repo root; matcher excludes `/_next/*`, `/api/*`, static assets
  - HSTS header: `max-age=63072000; includeSubDomains; preload`
  - `Content-Security-Policy` with strict-dynamic and nonces
  - `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, `Permissions-Policy` locking down camera/mic/geolocation
  - Set `x-country` request header from `req.geo.country` for downstream currency selection
  - Bot handling: allowlist `GPTBot`, `ClaudeBot`, `PerplexityBot`, `Google-Extended`, `CCBot`, `Applebot-Extended` without rate limits
- **Acceptance Criteria:**
  - `securityheaders.com` scan returns grade A
  - CSP does not break Framer Motion, GA4, HubSpot, or Contentful preview
  - `x-country` header appears in RSC props via `headers()`
  - LLM bot user agents are not blocked or challenged
- **Testing:** Unit tests for CSP builder; integration test verifying header presence on all response types

### NIM-005 — Robots.txt with LLM allowlist
- **Priority:** P0 • **Effort:** 0.5d • **Owner:** Frontend
- **Depends on:** NIM-001
- **Description:** Programmatically generated `robots.txt` at `/robots.txt` per strategy §3.2.
- **Technical Approach:**
  - Use App Router `app/robots.ts` with `MetadataRoute.Robots`
  - Allow all crawlers by default; disallow `/api/*`, `/preview/*`, `/*?*` query-string variants
  - Explicit `User-agent` entries for GPTBot, ClaudeBot, PerplexityBot, Google-Extended, CCBot, Applebot-Extended, Bytespider all set to `Allow: /`
  - Reference all sitemaps
- **Acceptance Criteria:**
  - `curl https://nimikh.com/robots.txt` returns valid syntax
  - Verified via Google Search Console robots.txt tester
- **Testing:** Snapshot test on the generated file

### NIM-006 — Sitemap generation, split by content type
- **Priority:** P0 • **Effort:** 1.5d • **Owner:** Frontend
- **Depends on:** NIM-002, NIM-020
- **Description:** Generate five sitemaps per strategy §3.2: services, industries, insights, case-studies, glossary. Plus a root sitemap index.
- **Technical Approach:**
  - `app/sitemap.ts` returns the sitemap index
  - Sub-sitemaps at `app/sitemap-{type}/sitemap.ts`
  - Auto-populated from Contentful queries at build time and revalidated hourly
  - `lastModified` from Contentful `sys.updatedAt`
  - Priority scoring: `1.0` homepage, `0.9` service pillars, `0.8` industry hubs, `0.7` case studies, `0.6` insights, `0.4` glossary
- **Acceptance Criteria:**
  - All five sitemaps validate at `xml-sitemaps.com`
  - Sitemap index is discoverable from `robots.txt`
  - IndexNow ping fires on every sitemap update (see NIM-078)
- **Testing:** Integration test asserts every published Contentful entry appears in the correct sitemap

### NIM-007 — Design token system as CSS variables
- **Priority:** P0 • **Effort:** 2d • **Owner:** Frontend
- **Depends on:** NIM-001
- **Description:** Ship the design token system referenced in the knowledge graph. JSON tokens compiled to CSS variables and Tailwind theme.
- **Technical Approach:**
  - Tokens in `packages/ui/tokens/*.json` (colors, spacing, radius, typography)
  - `style-dictionary` compile step emits `tokens.css` and `tailwind.config.tokens.ts`
  - CSS variables scoped to `:root` (light) and `[data-theme="dark"]` (dark)
  - Default theme dark (aligned with visual direction)
- **Acceptance Criteria:**
  - Colors from strategy source of truth (`#08090a`, `#0f1011`, `#171717`, `#ffffff`, `#5e6ad2`, `#ee0000`) present as CSS vars
  - Inter Variable Typeface loaded with `font-display: swap` and `preload`
  - No hardcoded color hex in components (ESLint rule enforces)
- **Testing:** Storybook snapshot; visual regression via Chromatic

### NIM-008 — Dhaka+US timezone-aware content publishing
- **Priority:** P1 • **Effort:** 1d • **Owner:** Frontend
- **Depends on:** NIM-020
- **Description:** Publish schedule uses BST for authoring but converts to UTC for `datePublished` and `dateModified` schema.
- **Technical Approach:**
  - All timestamps stored UTC in Contentful
  - Display in reader's local timezone via `Intl.DateTimeFormat`
  - Schema uses ISO 8601 UTC
- **Acceptance Criteria:** Timestamps identical across schema, sitemap, and UI
- **Testing:** Unit tests for the timezone conversion utility

---

## Epic E02 — Schema & Structured Data

### NIM-010 — Schema graph library (`packages/schema`)
- **Priority:** P0 • **Effort:** 3d • **Owner:** Frontend Lead
- **Depends on:** NIM-001
- **Description:** Typed schema builder module producing valid JSON-LD for every entity type in strategy §7.
- **Technical Approach:**
  - `packages/schema/src/entities/*.ts` — one file per schema type (`Organization`, `ProfessionalService`, `Service`, `Person`, `Article`, `TechArticle`, `FAQPage`, `HowTo`, `DefinedTerm`, `BreadcrumbList`, `WebSite`, `JobPosting`, `SoftwareApplication`, `ContactPage`, `Review`, `AggregateRating`)
  - Stable `@id` scheme: `https://nimikh.com/#{entity-slug}` — deduplicated across pages
  - Each builder function is fully typed; TypeScript rejects missing required fields
  - Runtime validation via Zod schemas mirroring schema.org shape
- **Acceptance Criteria:**
  - Every entity type from strategy §7 has a typed builder function
  - Google Rich Results Test passes for every generated payload
  - Type mismatches fail at compile time (verified by intentional test cases)
- **Testing:** Vitest unit tests generate a payload per entity and assert schema.org validity

### NIM-011 — Root layout injects global schema
- **Priority:** P0 • **Effort:** 1d • **Owner:** Frontend
- **Depends on:** NIM-010
- **Description:** Inject `Organization`, `ProfessionalService`, `WebSite` schemas as a `@graph` array in root layout.
- **Technical Approach:**
  - Server component in `app/(shared)/schema/GlobalSchema.tsx`
  - Renders single `<script type="application/ld+json">` combining all site-wide entities
  - `@id` references used cross-graph (e.g., `Person.worksFor` → `Organization.@id`)
- **Acceptance Criteria:**
  - Single JSON-LD blob at document `<head>`, no duplicates
  - Passes Google Rich Results Test on homepage
  - `@id` references resolve to entities in the same graph
- **Testing:** Playwright test asserts one JSON-LD block per page with the expected `@id`s

### NIM-012 — BreadcrumbList schema on every non-root page
- **Priority:** P1 • **Effort:** 1d • **Owner:** Frontend
- **Depends on:** NIM-010, NIM-002
- **Description:** Auto-generate breadcrumbs from URL segments; emit `BreadcrumbList` schema.
- **Technical Approach:**
  - Utility `deriveBreadcrumbs(pathname)` returns typed segments with human-readable labels
  - Label overrides via Contentful for slugs that need custom titles
  - Visible UI breadcrumb matches the schema verbatim
- **Acceptance Criteria:**
  - Breadcrumb renders on every non-root page
  - Schema and visible breadcrumb are identical (Google requires this)
- **Testing:** E2E asserts schema and DOM breadcrumbs match on 5 sampled routes

### NIM-013 — Service page schema (`Service` + `Offer`)
- **Priority:** P1 • **Effort:** 1d • **Owner:** Frontend
- **Depends on:** NIM-010, NIM-020
- **Description:** Every `/services/[slug]` page emits `Service` schema with nested `Provider`, `AreaServed`, `HasOfferCatalog`.
- **Acceptance Criteria:**
  - `Service.provider` references `Organization.@id`
  - `Service.areaServed` includes BD, US, GB, DE, SG at minimum
  - `Service.hasOfferCatalog.itemListElement` includes at least one `Offer` per pricing tier
- **Testing:** Unit test the schema builder for one seed service; E2E validates the head for that route

### NIM-014 — Case study page schema (`Article` + `about` product)
- **Priority:** P1 • **Effort:** 1.5d • **Owner:** Frontend
- **Depends on:** NIM-010, NIM-020
- **Description:** Case studies emit `Article` schema with `about` → client `Organization`, `mentions` → deployed technologies, and quantitative metrics as `QuantitativeValue` inside `Article.mentions`.
- **Technical Approach:**
  - Custom fields on Contentful `CaseStudy`: `quantitativeMetrics: [{ label, value, unit }]`
  - Rendered into schema as `PropertyValue` / `QuantitativeValue`
  - Client logo permissions surfaced via Contentful boolean flag; schema omits `about.image` if not permitted
- **Acceptance Criteria:**
  - Passes Rich Results Test
  - Metrics visible in UI match schema exactly
  - Draft mode hides schema until publish
- **Testing:** Snapshot test on seed case study

### NIM-015 — Insight article schema (`TechArticle` with Author + Reviewer)
- **Priority:** P1 • **Effort:** 1d • **Owner:** Frontend
- **Depends on:** NIM-010, NIM-025
- **Description:** All `/insights/*` articles emit `TechArticle` with `author`, `reviewer`, `datePublished`, `dateModified`, `citation[]`, `wordCount`, `dependencies` (for technical prerequisites).
- **Acceptance Criteria:**
  - Author schema references a `Person` entity with `sameAs` array
  - Reviewer schema present on all technical articles (validated in CMS)
  - Rich Results Test passes for Article eligibility
- **Testing:** E2E across 3 seed articles

### NIM-016 — FAQPage schema block component
- **Priority:** P1 • **Effort:** 1d • **Owner:** Frontend
- **Depends on:** NIM-010
- **Description:** Reusable `<FAQBlock>` component. Content editors add Q/A pairs in Contentful; component renders visible accordion + `FAQPage` schema.
- **Technical Approach:**
  - Server component; no JS for schema
  - Accordion behavior via `<details>`/`<summary>` (no client JS required)
  - Content editors constrained to ≤ 60-word answers via character count (soft warning at 60, hard fail at 100)
- **Acceptance Criteria:**
  - Q/A rendered in DOM exactly match schema
  - Passes Rich Results Test
  - Zero JS payload for expand/collapse
- **Testing:** Component test + E2E schema check

### NIM-017 — DefinedTerm schema for glossary
- **Priority:** P1 • **Effort:** 1d • **Owner:** Frontend
- **Depends on:** NIM-010, NIM-020
- **Description:** Every glossary entry emits `DefinedTerm` referencing a site-wide `DefinedTermSet` at `/glossary`.
- **Acceptance Criteria:**
  - `DefinedTermSet` schema exists at `/glossary` root
  - Every term links to it via `inDefinedTermSet`
- **Testing:** Unit test the set builder; E2E on 3 glossary URLs

### NIM-018 — Founder / Person schema
- **Priority:** P1 • **Effort:** 1d • **Owner:** Frontend
- **Depends on:** NIM-010
- **Description:** `/founders/[slug]` pages emit `Person` schema with full `sameAs`, `alumniOf`, `knowsAbout`, `worksFor` linkage.
- **Acceptance Criteria:**
  - Mohiuddin and Maruf Shezad each have populated schema per knowledge graph
  - `sameAs` includes LinkedIn, GitHub, personal site, Twitter/X where applicable
- **Testing:** Rich Results Test on both founder URLs

---

## Epic E03 — Content Model & CMS

### NIM-020 — Contentful space and content model
- **Priority:** P0 • **Effort:** 3d • **Owner:** Content Engineer
- **Depends on:** NIM-001
- **Description:** Define the Contentful content model that serves every page template.
- **Technical Approach:**
  - Content types: `Service`, `Industry`, `CaseStudy`, `InsightArticle`, `InsightCategory`, `GlossaryTerm`, `ComparisonPage`, `FounderProfile`, `TeamMember`, `LegalPage`, `FAQEntry`, `Client`, `Technology`, `Author`
  - Every type has: `slug` (unique, validated), `seoTitle`, `metaDescription`, `ogImage`, `noindex` (default false), `lastReviewedDate`
  - Cross-references: `InsightArticle.author → Author`, `InsightArticle.reviewer → Author`, `CaseStudy.client → Client`, `CaseStudy.technologies → Technology[]`
  - Rich-text field uses Contentful `RichText` type; validated allow-list of embedded entries (Callout, CodeBlock, ImageWithCaption, PullQuote, ComparisonTable, FAQBlock, MetricCard)
- **Acceptance Criteria:**
  - Content model exported as JSON to `packages/content/schema.json` and version controlled
  - All content types have required-field validation
  - Contentful `contentful-cli` migration file committed
- **Testing:** Migration runs cleanly against a fresh space

### NIM-021 — Contentful preview + live draft mode
- **Priority:** P1 • **Effort:** 2d • **Owner:** Frontend
- **Depends on:** NIM-020, NIM-002
- **Description:** Editors preview unpublished content on staging via Next.js Draft Mode.
- **Technical Approach:**
  - `/api/preview` route enables draft mode with a signed token
  - Draft mode disables ISR and pulls live from Contentful preview API
  - Visible "PREVIEW" banner in draft mode
- **Acceptance Criteria:**
  - Editors preview unpublished changes end-to-end
  - Draft mode cannot leak to public URLs
- **Testing:** E2E of the preview flow

### NIM-022 — Typed Contentful client with GraphQL codegen
- **Priority:** P1 • **Effort:** 2d • **Owner:** Frontend Lead
- **Depends on:** NIM-020
- **Description:** All Contentful queries use GraphQL with generated TypeScript types.
- **Technical Approach:**
  - Contentful GraphQL Content API
  - `@graphql-codegen/cli` generates types from queries
  - Central `contentfulFetch` wrapper handles ISR revalidation and preview mode
- **Acceptance Criteria:**
  - All query responses are typed end-to-end
  - Missing/misnamed fields fail at build time
- **Testing:** Type checking passes; runtime unit test on the wrapper

### NIM-023 — Content freshness workflow
- **Priority:** P2 • **Effort:** 1.5d • **Owner:** Content Engineer
- **Depends on:** NIM-020
- **Description:** Enforce Strategy §5.3 "last reviewed" freshness policy — every article older than 180 days appears in a content-decay report.
- **Technical Approach:**
  - Scheduled GitHub Action runs weekly; queries Contentful for entries with `lastReviewedDate < now - 180d`
  - Report posted to `#content-ops` Slack + GitHub issue
  - Editor UI shows "Review overdue" badge in Contentful sidebar via App Framework
- **Acceptance Criteria:**
  - Weekly report generated
  - Editor sees overdue badge without leaving Contentful
- **Testing:** Manual test with a backdated entry

### NIM-024 — Author profile linked across articles
- **Priority:** P1 • **Effort:** 1d • **Owner:** Content Engineer
- **Depends on:** NIM-020
- **Description:** Author entity with full profile drives E-E-A-T signals on every article.
- **Technical Approach:**
  - `Author` fields: `name`, `role`, `bio`, `credentials`, `linkedIn`, `github`, `personalSite`, `twitter`, `photo`, `expertiseAreas[]`
  - `expertiseAreas` restricted to a controlled vocabulary matched to silo categories
- **Acceptance Criteria:**
  - Every published article has an author selected (validation enforced)
  - Author bio card renders at article footer
- **Testing:** Manual QA on 3 articles

### NIM-025 — Reviewer credit on technical articles
- **Priority:** P1 • **Effort:** 0.5d • **Owner:** Content Engineer
- **Depends on:** NIM-024
- **Description:** Technical articles require a distinct reviewer.
- **Acceptance Criteria:**
  - `InsightArticle` category `engineering`, `ai-automation`, `compliance-and-security` require `reviewer` field
  - Reviewer displayed with "Technically reviewed by …" attribution
- **Testing:** Publishing a technical article without a reviewer fails validation

### NIM-026 — Contentful field for original citations
- **Priority:** P2 • **Effort:** 1d • **Owner:** Content Engineer
- **Depends on:** NIM-020
- **Description:** Structured `citations[]` field on every article — each citation has title, url, publisher, date. Rendered as a references section and injected into schema `citation[]`.
- **Acceptance Criteria:**
  - Minimum 3 external authoritative citations per deep-dive
  - Citations render as an accessible list with rel="noopener"
- **Testing:** Sample deep-dive article passes both the visible list and schema check

### NIM-027 — Structured claim / metric block
- **Priority:** P2 • **Effort:** 1d • **Owner:** Content Engineer
- **Depends on:** NIM-020
- **Description:** Reusable "verifiable claim" block per Strategy §8.3 — every quantitative claim (e.g., "65% cycle reduction") uses a structured block with source, method, sample size.
- **Technical Approach:**
  - Embedded Contentful entry `MetricCard`: `{ label, value, unit, sourceUrl, method, sampleSize, asOfDate }`
  - Rendered with visible attribution
  - Feeds into `Article.mentions` schema as `PropertyValue`
- **Acceptance Criteria:**
  - MetricCards appear in schema
  - Editors receive a warning if a metric card has no source
- **Testing:** Snapshot on seed content

### NIM-028 — Case study client permission workflow
- **Priority:** P1 • **Effort:** 0.5d • **Owner:** Content Engineer
- **Depends on:** NIM-020
- **Description:** `Client` entity has `logoPermission`, `nameDisclosurePermission`, `permissionExpiresAt` fields. Case studies auto-anonymize when permission expires.
- **Acceptance Criteria:**
  - Case study renders anonymized labels ("Series-A FinTech") when disclosure = false
  - Sitemap includes anonymized case studies
- **Testing:** Toggle the permission and verify the render change without redeploy

---

## Epic E04 — Page Templates & Rendering

### NIM-030 — Homepage template
- **Priority:** P0 • **Effort:** 3d • **Owner:** Frontend
- **Depends on:** NIM-011, NIM-022
- **Description:** SSR homepage with hero, five service cards linking to silo pillars, case study strip, industries grid, trust bar, and CTA.
- **Technical Approach:**
  - LCP element: hero H1 (static SSR HTML, no motion wrapper)
  - Framer Motion allowed only on non-LCP elements, and only under `prefers-reduced-motion: no-preference`
  - Service cards use CSS Grid with intrinsic sizing (no CLS)
- **Acceptance Criteria:**
  - LCP ≤ 1.5s on Fast 3G at 75th percentile
  - CLS = 0
  - Every service, industry, and case study link visible above the fold on desktop
- **Testing:** Lighthouse CI, Playwright visual snapshot, axe accessibility scan

### NIM-031 — Service pillar template
- **Priority:** P1 • **Effort:** 3d • **Owner:** Frontend
- **Depends on:** NIM-013, NIM-022
- **Description:** Reusable `/services/[slug]` template rendering the pillar content model.
- **Technical Approach:**
  - Sections: Hero → Problem → Solution architecture → Deliverables → Process → Case studies → Tech stack → FAQ → Related industries → CTA
  - Related content sourced via Contentful references, not hand-authored
  - Sticky right-rail TOC on desktop (progressive enhancement, no JS required for baseline)
- **Acceptance Criteria:**
  - Renders correctly for all 5 seed services
  - FAQ block emits `FAQPage` schema (NIM-016)
  - At least one internal link to a sibling service, one to an industry, one to a related case study
- **Testing:** Playwright E2E on all 5 services

### NIM-032 — Industry hub template
- **Priority:** P1 • **Effort:** 2d • **Owner:** Frontend
- **Depends on:** NIM-022
- **Description:** `/industries/[slug]` renders vertical-framed content linking to all five service pillars.
- **Acceptance Criteria:**
  - Every industry hub links to all 5 services with vertical-specific anchor text ("headless commerce for D2C")
  - Includes at least 2 vertical case studies when available
- **Testing:** Snapshot on 3 seed industries

### NIM-033 — Case study template
- **Priority:** P1 • **Effort:** 2.5d • **Owner:** Frontend
- **Depends on:** NIM-014, NIM-028
- **Description:** `/case-studies/[slug]` renders challenge → solution → metrics → tech → outcome narrative.
- **Technical Approach:**
  - MetricCards prominent above the fold
  - Client logo shown only when `logoPermission = true`
- **Acceptance Criteria:**
  - Passes Article Rich Results Test
  - Anonymization works when permission is revoked
- **Testing:** E2E with permission toggle

### NIM-034 — Insight article template
- **Priority:** P1 • **Effort:** 3d • **Owner:** Frontend
- **Depends on:** NIM-015, NIM-024
- **Description:** `/insights/[category]/[slug]` renders deep-dive articles per the Strategy §8.1 extraction-first contract.
- **Technical Approach:**
  - First 100 words must include target keyword and "Nimikh" (linter warns if missing)
  - Auto-inserted "Key takeaways" block if editor adds `keyTakeaways[]` field
  - Table of contents auto-generated from H2/H3
  - Reading time computed from word count
- **Acceptance Criteria:**
  - Passes Rich Results Test
  - Score on Grammarly readability ≥ 70
  - Every H2/H3 appears in TOC
- **Testing:** Playwright + axe

### NIM-035 — Glossary term template
- **Priority:** P1 • **Effort:** 1.5d • **Owner:** Frontend
- **Depends on:** NIM-017
- **Description:** `/glossary/[term]` renders definition-first content in the extraction-friendly format.
- **Technical Approach:**
  - Single H1 = term name
  - Line 1 of body = one-sentence definition (validated in CMS)
  - Related terms rendered as a linked list at the bottom
- **Acceptance Criteria:**
  - Every entry has a definition ≤ 30 words in Line 1
  - `DefinedTerm` schema present and validated
- **Testing:** Playwright on 5 sampled terms

### NIM-036 — Comparison page template
- **Priority:** P2 • **Effort:** 2d • **Owner:** Frontend
- **Depends on:** NIM-022
- **Description:** `/compare/[a]-vs-[b]` renders side-by-side comparison tables.
- **Technical Approach:**
  - `ComparisonPage` content type stores structured criteria rows: `{ criterion, optionA, optionB, notes, winner? }`
  - Reusable `<ComparisonTable>` handles rendering + accessibility
  - Schema: `Article` with `about[]` referencing both entities
- **Acceptance Criteria:**
  - Table is fully keyboard navigable
  - Data table meets WCAG 1.3.1
- **Testing:** axe accessibility scan; Playwright keyboard nav

### NIM-037 — Founder profile template
- **Priority:** P1 • **Effort:** 2d • **Owner:** Frontend
- **Depends on:** NIM-018, NIM-024
- **Description:** `/founders/[slug]` renders the founder's bio, timeline, publications, speaking record, and `sameAs` linkages.
- **Acceptance Criteria:**
  - Both founders shipped with `Person` schema validated
  - Publications list auto-populated from articles where they are `author`
- **Testing:** Rich Results Test on both founder URLs

### NIM-038 — Legal / compliance page template
- **Priority:** P0 • **Effort:** 1.5d • **Owner:** Frontend
- **Depends on:** NIM-022
- **Description:** `/legal/*` renders regulatory pages with a version-history block and `dateModified` schema.
- **Acceptance Criteria:**
  - `Privacy`, `Security`, `Compliance`, `Entity`, `Terms` all present
  - Change log visible at the bottom of every page
- **Testing:** Snapshot per legal page

### NIM-039 — 404 and 410 pages
- **Priority:** P1 • **Effort:** 1d • **Owner:** Frontend
- **Depends on:** NIM-002
- **Description:** Branded 404 and 410 error pages that suggest related content and return correct status codes.
- **Acceptance Criteria:**
  - 404 returns HTTP 404 (not soft 404)
  - 410 returns HTTP 410 for permanently gone URLs (configurable in `redirects.json`)
  - Suggests 5 popular pages
- **Testing:** Integration test on missing routes

### NIM-040 — Category listing pages
- **Priority:** P2 • **Effort:** 2d • **Owner:** Frontend
- **Depends on:** NIM-034
- **Description:** `/insights`, `/insights/[category]`, `/glossary`, `/case-studies`, `/compare` listing pages with filter + pagination.
- **Technical Approach:**
  - Pagination via `/page/[n]` (avoid query strings for SEO)
  - Filter state in URL params
  - Every paginated page has a self-canonical
- **Acceptance Criteria:**
  - Paginated pages are indexable with proper canonicals
  - Filter deep-links share cleanly
- **Testing:** E2E of pagination and filtering

---

## Epic E05 — Performance & Core Web Vitals

### NIM-045 — Lighthouse budget file with CI gate
- **Priority:** P0 • **Effort:** 1d • **Owner:** DevOps
- **Depends on:** NIM-001
- **Description:** `lighthouse-budget.json` enforced in CI via `@lhci/cli`.
- **Technical Approach:**
  - Budgets aligned to Strategy §3.1: LCP ≤ 1800ms, INP ≤ 150ms, CLS ≤ 0.05, TTFB ≤ 400ms, JS main ≤ 180KB gzipped
  - Runs against 5 sample URLs per PR: `/`, `/services/headless-commerce-development`, `/insights/[seed]`, `/case-studies/[seed]`, `/founders/mohiuddin`
- **Acceptance Criteria:**
  - PR fails if any budget breached
  - Report posted to PR as a comment
- **Testing:** Intentionally break a budget to verify the gate

### NIM-046 — LCP asset preloading strategy
- **Priority:** P0 • **Effort:** 1d • **Owner:** Frontend
- **Depends on:** NIM-030
- **Description:** Every template declares its LCP asset. Hero images preloaded with `fetchpriority="high"`.
- **Technical Approach:**
  - `next/image` with `priority` on LCP elements
  - Explicit width/height to prevent CLS
  - AVIF-first with WebP fallback via Next.js Image
- **Acceptance Criteria:** LCP element loads within 1.8s at p75 on Slow 4G
- **Testing:** WebPageTest CI run on 5 seed URLs

### NIM-047 — Font loading optimization
- **Priority:** P0 • **Effort:** 0.5d • **Owner:** Frontend
- **Depends on:** NIM-007
- **Description:** Inter Variable + Berkeley Mono self-hosted with subsetting and preload.
- **Technical Approach:**
  - `next/font/local` with subset (Latin + Latin Extended)
  - Preload declaration in `<head>` for above-the-fold text
  - `font-display: swap` on all faces
- **Acceptance Criteria:**
  - No FOIT (Flash of Invisible Text)
  - CLS contribution from font swap < 0.01
- **Testing:** WebPageTest first paint check

### NIM-048 — Image pipeline (Contentful → Next Image)
- **Priority:** P1 • **Effort:** 1.5d • **Owner:** Frontend
- **Depends on:** NIM-022
- **Description:** All Contentful images served through Next.js Image with correct `sizes` per breakpoint.
- **Technical Approach:**
  - `contentfulLoader` custom loader for Next.js Image
  - AVIF preferred, WebP fallback
  - Automatic `alt` field validation in Contentful — publish blocked if missing
- **Acceptance Criteria:**
  - No PageSpeed image warnings on top 20 URLs
  - Every image has non-empty alt (or explicit `alt=""` for decorative)
- **Testing:** axe + Lighthouse

### NIM-049 — Third-party script strategy
- **Priority:** P1 • **Effort:** 1d • **Owner:** Frontend
- **Depends on:** NIM-085
- **Description:** All third-party scripts (GA4, HubSpot, LinkedIn Insight, etc.) loaded via `next/script` with `strategy="lazyOnload"` unless critical.
- **Acceptance Criteria:**
  - No third-party script blocks main-thread for >50ms
  - TBT (Total Blocking Time) < 200ms at p75
- **Testing:** Lighthouse CI

### NIM-050 — Edge caching + ISR configuration
- **Priority:** P1 • **Effort:** 2d • **Owner:** DevOps
- **Depends on:** NIM-002
- **Description:** CloudFront edge caching with proper `Cache-Control` per route class.
- **Technical Approach:**
  - Static assets: `Cache-Control: public, max-age=31536000, immutable`
  - HTML: `Cache-Control: public, max-age=0, s-maxage=86400, stale-while-revalidate=86400`
  - `/api/preview`: `Cache-Control: no-store`
  - ISR revalidate: 24h for insights, 1h for case studies, 15min for homepage
  - On-demand revalidation via Contentful webhook → `/api/revalidate`
- **Acceptance Criteria:**
  - CloudFront hit rate ≥ 92% on top 100 URLs
  - Content publishes reflect on production within 2 minutes
- **Testing:** Load test + webhook trigger verification

### NIM-051 — Web Vitals RUM reporting
- **Priority:** P1 • **Effort:** 1d • **Owner:** Frontend
- **Depends on:** NIM-085
- **Description:** Real-user monitoring via `web-vitals` shipped to GA4.
- **Technical Approach:**
  - `reportWebVitals` in root layout sends to GA4 as `web_vitals` events
  - Alert threshold: INP p75 > 200ms triggers PagerDuty
- **Acceptance Criteria:**
  - GA4 receives LCP, INP, CLS, FCP, TTFB for every session
- **Testing:** Manual RUM validation from three global locations

---

## Epic E06 — SEO Meta Layer

### NIM-055 — Metadata API baseline per page
- **Priority:** P0 • **Effort:** 1d • **Owner:** Frontend
- **Depends on:** NIM-022
- **Description:** Every page exports a typed `generateMetadata` function that pulls from Contentful.
- **Acceptance Criteria:**
  - All pages have unique `<title>` and `<meta description>`
  - Missing meta fields fail Contentful publishing
- **Testing:** Snapshot metadata for all seed pages

### NIM-056 — Canonical URL enforcement
- **Priority:** P0 • **Effort:** 0.5d • **Owner:** Frontend
- **Depends on:** NIM-055
- **Description:** Every page declares an absolute `<link rel="canonical">`.
- **Acceptance Criteria:**
  - Zero pages without canonical
  - Canonical always includes protocol + domain
- **Testing:** Post-deploy crawler pass

### NIM-057 — OpenGraph + Twitter Card
- **Priority:** P1 • **Effort:** 1d • **Owner:** Frontend
- **Depends on:** NIM-055
- **Description:** Unique `og:image` per page. Generated via `@vercel/og` for pages without a hero image.
- **Technical Approach:**
  - Dynamic OG image generator route `/api/og?title=&type=`
  - Image cached for 7 days at CDN
- **Acceptance Criteria:**
  - No shared social card across pages
  - Twitter card validator passes for 10 sample URLs
- **Testing:** Facebook debugger + Twitter validator

### NIM-058 — Meta character limits enforced in CMS
- **Priority:** P1 • **Effort:** 0.5d • **Owner:** Content Engineer
- **Depends on:** NIM-020
- **Description:** Contentful field validation blocks publish when `seoTitle > 60` or `metaDescription > 160` chars.
- **Acceptance Criteria:** Publish fails with a clear error message
- **Testing:** Attempt publish with over-length values

### NIM-059 — noindex/nofollow governance
- **Priority:** P1 • **Effort:** 0.5d • **Owner:** Frontend
- **Depends on:** NIM-055
- **Description:** `noindex` toggle per page in Contentful; draft mode content always noindex.
- **Acceptance Criteria:**
  - Draft URLs always noindex
  - `noindex = true` results in `<meta name="robots" content="noindex, follow">` and exclusion from sitemap
- **Testing:** Toggle and verify

### NIM-060 — Structured heading hierarchy audit
- **Priority:** P2 • **Effort:** 1d • **Owner:** Frontend
- **Depends on:** NIM-030
- **Description:** ESLint rule prevents multiple H1s per page; a11y-driven heading skip check.
- **Acceptance Criteria:**
  - Zero pages with 0 or 2+ H1s
  - Heading levels never skip (H1 → H3 disallowed)
- **Testing:** ESLint rule + axe

### NIM-061 — Prohibit query-string canonicalization
- **Priority:** P2 • **Effort:** 1d • **Owner:** Frontend
- **Depends on:** NIM-002
- **Description:** Middleware strips known tracking params (`utm_*`, `gclid`, `fbclid`) from URLs on GET requests and 301-redirects to clean URL.
- **Acceptance Criteria:** UTMs preserved in analytics but stripped from displayed URL
- **Testing:** E2E of a tracked URL end-to-end

---

## Epic E07 — Internal Linking System

### NIM-065 — Contextual link resolver
- **Priority:** P1 • **Effort:** 2d • **Owner:** Frontend
- **Depends on:** NIM-022
- **Description:** Central utility that resolves a Contentful reference to a URL, ensuring URL patterns stay consistent even if slugs change.
- **Technical Approach:**
  - `resolveUrl(entry)` handles all content types
  - Unit tested against every content type
  - Broken references caught at build time via Contentful graph traversal
- **Acceptance Criteria:** Build fails on any broken internal reference
- **Testing:** Broken-ref test in CI

### NIM-066 — Related content selector
- **Priority:** P1 • **Effort:** 2d • **Owner:** Frontend
- **Depends on:** NIM-020
- **Description:** Each page template pulls related content from Contentful (curated) or via a fallback tag-similarity function.
- **Technical Approach:**
  - Editor's curated `relatedEntries[]` takes priority
  - Fallback: tag intersection score with recency tie-break
- **Acceptance Criteria:**
  - Every article shows 3–5 related entries
  - No related entry is the current article
- **Testing:** Snapshot on 5 articles

### NIM-067 — Auto-glossary link injection
- **Priority:** P2 • **Effort:** 2d • **Owner:** Frontend
- **Depends on:** NIM-035
- **Description:** First occurrence of any glossary term in an article auto-links to the glossary entry.
- **Technical Approach:**
  - Build-time RichText transform walks the AST and inserts links
  - Editors can opt out per term or per article
  - Only first occurrence is linked (avoids anchor spam)
- **Acceptance Criteria:**
  - 3 seed articles show correctly injected glossary links
  - No double-linking of the same term
- **Testing:** Unit tests on the transformer

### NIM-068 — Orphan page detector (CI)
- **Priority:** P1 • **Effort:** 1d • **Owner:** DevOps
- **Depends on:** NIM-066
- **Description:** Nightly Screaming Frog-style crawl of the site graph flags orphans in service/industry/case study silos.
- **Technical Approach:** Custom crawler using `next-sitemap` + `linkedom` traversal
- **Acceptance Criteria:**
  - Report posted daily
  - Zero-tolerance policy for orphan services, industries, case studies (build warning)
- **Testing:** Introduce orphan URL, verify detection

### NIM-069 — Link equity flow visualization
- **Priority:** P3 • **Effort:** 3d • **Owner:** Frontend
- **Depends on:** NIM-068
- **Description:** Internal dashboard showing link count per URL and internal PageRank estimate.
- **Acceptance Criteria:** Renders reasonable estimates for 500-page site
- **Testing:** Manual QA

---

## Epic E08 — AEO / GEO Layer

### NIM-075 — llms.txt generator
- **Priority:** P1 • **Effort:** 1d • **Owner:** Frontend
- **Depends on:** NIM-020
- **Description:** Auto-generate `/llms.txt` per Strategy §9.2 from Contentful content.
- **Technical Approach:**
  - `app/llms.txt/route.ts` returns text/plain
  - Sourced from a "Featured in llms.txt" boolean on core content types
- **Acceptance Criteria:**
  - Format matches the spec at llmstxt.org
  - Regenerates on Contentful publish
- **Testing:** Format validator

### NIM-076 — llms-full.txt generator
- **Priority:** P2 • **Effort:** 1.5d • **Owner:** Frontend
- **Depends on:** NIM-075
- **Description:** `/llms-full.txt` concatenates full-text of the top 30 pages.
- **Technical Approach:**
  - Server route renders Markdown extract of published content
  - Compressed with `br` at CDN
- **Acceptance Criteria:** File < 5MB uncompressed
- **Testing:** Manual byte-size check

### NIM-077 — Extraction-first article renderer
- **Priority:** P1 • **Effort:** 2d • **Owner:** Frontend
- **Depends on:** NIM-034
- **Description:** Enforce Strategy §8.1 rules at render time.
- **Technical Approach:**
  - Auto-insert "Key takeaways" as first H2 if `keyTakeaways[]` is populated
  - Warning if Line 1 exceeds 40 words
  - Warning if the primary keyword doesn't appear in the first 100 words
- **Acceptance Criteria:**
  - Content editors receive real-time warnings in Contentful preview
- **Testing:** Manual QA with intentional violations

### NIM-078 — IndexNow ping integration
- **Priority:** P1 • **Effort:** 1d • **Owner:** Backend
- **Depends on:** NIM-006
- **Description:** On Contentful publish/unpublish, ping IndexNow to notify Bing, Yandex, and other participating engines.
- **Technical Approach:**
  - Contentful webhook → `/api/indexnow`
  - Signed with the site's IndexNow key hosted at `/{key}.txt`
- **Acceptance Criteria:**
  - Bing Webmaster Tools shows IndexNow pings within 15 min
- **Testing:** Publish and verify in BWT

### NIM-079 — Structured claim schema exposure
- **Priority:** P2 • **Effort:** 1d • **Owner:** Frontend
- **Depends on:** NIM-027
- **Description:** MetricCards feed `Claim` markup (schema.org draft) plus `Article.mentions` with `PropertyValue`.
- **Acceptance Criteria:** MetricCards produce schema that validates
- **Testing:** Schema validator

### NIM-080 — LLM citation audit dashboard
- **Priority:** P2 • **Effort:** 3d • **Owner:** Backend + Growth
- **Depends on:** NIM-085
- **Description:** Internal dashboard runs a weekly prompt set against LLM APIs and tracks Nimikh citation rate.
- **Technical Approach:**
  - Scheduled worker in `apps/audit` calls OpenAI, Anthropic, Perplexity, Gemini APIs
  - Standard prompt set from Strategy §9.3 stored in Contentful
  - Detection: exact-match of "Nimikh" or nimikh.com URL in response
  - Store results in Postgres; render dashboard
- **Acceptance Criteria:**
  - Weekly report generated automatically
  - Trend line per prompt visible
- **Testing:** Backfill 4 weeks and verify chart

### NIM-081 — Machine-readable knowledge endpoint
- **Priority:** P3 • **Effort:** 2d • **Owner:** Backend
- **Depends on:** NIM-020
- **Description:** JSON endpoint at `/api/knowledge` with structured facts about Nimikh (services, industries, credentials) — an LLM-friendly digest.
- **Acceptance Criteria:** Valid JSON, ETag-cached, no auth
- **Testing:** Schema validation

### NIM-082 — Author attribution boilerplate component
- **Priority:** P1 • **Effort:** 0.5d • **Owner:** Frontend
- **Depends on:** NIM-024
- **Description:** Reusable footer component with author + credentials + LinkedIn. This block is the one LLMs extract.
- **Acceptance Criteria:**
  - Appears at the end of every published article
  - Matches Author schema fields exactly
- **Testing:** Snapshot

---

## Epic E09 — Analytics & Measurement

### NIM-085 — GA4 server-side via Tag Manager Server Container
- **Priority:** P0 • **Effort:** 3d • **Owner:** DevOps
- **Depends on:** NIM-004
- **Description:** Server-side GTM container on a subdomain proxies events to GA4, Meta CAPI, LinkedIn CAPI.
- **Technical Approach:**
  - `sgtm.nimikh.com` cname → Google Tag Manager server container
  - Client-side tag sends events to `sgtm.nimikh.com`
  - Cookieless attribution using enhanced conversions where available
- **Acceptance Criteria:**
  - GA4 receiving `page_view`, `scroll`, `outbound_click`, `form_submit`
  - Meta CAPI dedup with pixel via `event_id`
- **Testing:** GTM preview + Meta Test Events

### NIM-086 — LLM referral segment
- **Priority:** P1 • **Effort:** 0.5d • **Owner:** DevOps
- **Depends on:** NIM-085
- **Description:** GA4 custom dimension classifying sessions where referrer or entry UA matches ChatGPT, Perplexity, Claude, Gemini, Bing Copilot.
- **Acceptance Criteria:** Segment populated within 24h of implementation
- **Testing:** Manually referral-simulate

### NIM-087 — HubSpot CRM integration
- **Priority:** P1 • **Effort:** 2d • **Owner:** Backend
- **Depends on:** NIM-085
- **Description:** Form submissions POST to HubSpot with UTM, page path, and LLM-referral segment.
- **Acceptance Criteria:** HubSpot contact created within 30s of form submit
- **Testing:** Submit test lead, verify

### NIM-088 — Search Console + Bing Webmaster integration
- **Priority:** P0 • **Effort:** 1d • **Owner:** DevOps
- **Depends on:** NIM-006
- **Description:** Verify site in Search Console (all property types: URL, domain), Bing Webmaster, Yandex, Naver.
- **Acceptance Criteria:** Verified property + first crawl request submitted
- **Testing:** Manual verification

### NIM-089 — Consent management platform
- **Priority:** P0 • **Effort:** 2d • **Owner:** Frontend
- **Depends on:** NIM-004
- **Description:** GDPR + PDPA 2026 compliant consent flow.
- **Technical Approach:**
  - Cookiebot or self-hosted TCF v2.2 solution
  - Consent Mode v2 signal passed to GA4 and Ads
  - No cookies dropped before consent (with limited exceptions for functional)
- **Acceptance Criteria:**
  - Consent banner visible for all EU + UK + BD users
  - Consent Mode reflected in GA4
- **Testing:** VPN test from three regions

### NIM-090 — RUM alerting to Slack/PagerDuty
- **Priority:** P2 • **Effort:** 1d • **Owner:** DevOps
- **Depends on:** NIM-051
- **Description:** Threshold breaches route to Slack `#engineering-alerts` and PagerDuty for INP/LCP p75 regressions.
- **Acceptance Criteria:** Alert fires on synthetic regression
- **Testing:** Trigger threshold breach

### NIM-091 — Rank tracking hookup
- **Priority:** P2 • **Effort:** 1d • **Owner:** Growth
- **Depends on:** NIM-088
- **Description:** Ahrefs/Semrush projects configured; keyword lists per silo mapped to responsible content owner.
- **Acceptance Criteria:** Ranks tracked with weekly delta report
- **Testing:** Manual QA

---

## Epic E10 — Trust, Legal & Compliance Pages

### NIM-095 — /legal/entity page
- **Priority:** P0 • **Effort:** 1d • **Owner:** Content Engineer + Legal
- **Depends on:** NIM-038
- **Description:** Corporate entity page with RJSC registration number, BASIS membership, dual-entity Delaware/Singapore holding, tax IDs.
- **Acceptance Criteria:** All entities present with jurisdiction citations
- **Testing:** Legal sign-off checklist

### NIM-096 — /legal/security page
- **Priority:** P0 • **Effort:** 2d • **Owner:** Engineering Lead
- **Depends on:** NIM-038
- **Description:** Security posture page documenting ISO 9001, ISO 27001, GDPR, PDPA 2026 alignment plus sovereign cloud architecture diagram.
- **Acceptance Criteria:**
  - Diagram is a real image, not stock art
  - Contact for security disclosure listed
  - Corresponds to `/.well-known/security.txt`
- **Testing:** Peer review

### NIM-097 — /legal/privacy page
- **Priority:** P0 • **Effort:** 1d • **Owner:** Content + Legal
- **Depends on:** NIM-038
- **Description:** Privacy policy explicitly citing GDPR, PDPA 2026, CPRA where applicable. DPO contact listed.
- **Acceptance Criteria:** Legal sign-off; policy version tracked
- **Testing:** Legal QA

### NIM-098 — security.txt at /.well-known/
- **Priority:** P0 • **Effort:** 0.5d • **Owner:** DevOps
- **Depends on:** NIM-096
- **Description:** RFC 9116 security.txt with contact, encryption key link, canonical URL, expires date.
- **Acceptance Criteria:** Passes `securitytxt.org` validator
- **Testing:** Automated validator

### NIM-099 — Cookie policy + preferences management
- **Priority:** P0 • **Effort:** 1d • **Owner:** Frontend
- **Depends on:** NIM-089
- **Description:** Cookie preferences page allowing users to revoke consent per category.
- **Acceptance Criteria:** Revocation propagates to GA4 within 60s
- **Testing:** E2E revocation flow

---

## Epic E11 — CI/CD Quality Gates

### NIM-105 — GitHub Actions pipeline
- **Priority:** P0 • **Effort:** 2d • **Owner:** DevOps
- **Depends on:** NIM-001
- **Description:** Full CI: install → typecheck → lint → unit test → build → E2E → Lighthouse → schema validation → deploy.
- **Acceptance Criteria:** CI completes < 10 min on cache hit; < 20 min cold
- **Testing:** Verified on multiple PRs

### NIM-106 — Playwright E2E test suite
- **Priority:** P0 • **Effort:** 3d • **Owner:** QA
- **Depends on:** NIM-030
- **Description:** E2E covering nav, forms, page templates, schema presence, sitemap generation.
- **Acceptance Criteria:** ≥ 80% critical path coverage
- **Testing:** N/A

### NIM-107 — Schema validation in CI
- **Priority:** P0 • **Effort:** 1d • **Owner:** DevOps
- **Depends on:** NIM-010
- **Description:** Every PR runs schema payloads through schema.org validator + Google Rich Results API.
- **Acceptance Criteria:** Invalid schema fails PR
- **Testing:** Break schema intentionally

### NIM-108 — Visual regression via Chromatic
- **Priority:** P1 • **Effort:** 1.5d • **Owner:** Frontend
- **Depends on:** NIM-007
- **Description:** Storybook + Chromatic per the knowledge graph's referenced DevOps stack.
- **Acceptance Criteria:** Chromatic runs on every PR with baseline established
- **Testing:** N/A

### NIM-109 — Preview deployments per PR
- **Priority:** P1 • **Effort:** 1d • **Owner:** DevOps
- **Depends on:** NIM-105
- **Description:** Vercel or AWS Amplify preview URL per PR with Draft Mode preconfigured.
- **Acceptance Criteria:** Preview URL posted to PR within 5 min
- **Testing:** Verified

### NIM-110 — Broken-link and axe accessibility gates
- **Priority:** P1 • **Effort:** 1.5d • **Owner:** QA
- **Depends on:** NIM-106
- **Description:** Playwright pass runs axe-core on top 20 URLs; internal broken-link check post-deploy.
- **Acceptance Criteria:** PR fails on any critical/serious axe violation or any broken internal link
- **Testing:** Trip both gates deliberately

---

## Epic E12 — Internationalization

### NIM-115 — hreflang matrix implementation
- **Priority:** P2 • **Effort:** 1.5d • **Owner:** Frontend
- **Depends on:** NIM-055
- **Description:** hreflang tags only for the pages that have language variants; `x-default` on global English.
- **Acceptance Criteria:** Search Console international targeting report clean
- **Testing:** Merkle hreflang tool

### NIM-116 — Bangla `/bn/` route scaffold
- **Priority:** P2 • **Effort:** 2d • **Owner:** Frontend
- **Depends on:** NIM-002
- **Description:** `/bn/*` mirror of route structure; localized content authored separately.
- **Technical Approach:**
  - Do NOT machine-translate
  - Locked route until 15+ published entries exist in Bangla
- **Acceptance Criteria:** Route works; `/bn/` is `noindex` until content ships
- **Testing:** Manual QA

### NIM-117 — Currency detection and display
- **Priority:** P2 • **Effort:** 1.5d • **Owner:** Frontend
- **Depends on:** NIM-004
- **Description:** BDT for BD IPs, USD default. User toggle stored in cookie.
- **Acceptance Criteria:**
  - No URL redirect between currencies (would break AI crawlers)
  - Toggle persists across sessions
- **Testing:** VPN test from BD and US

### NIM-118 — Global date, number, and unit formatting
- **Priority:** P3 • **Effort:** 1d • **Owner:** Frontend
- **Depends on:** NIM-008
- **Description:** `Intl` API used everywhere; no hardcoded date/number formats.
- **Acceptance Criteria:** Locale-appropriate formats render correctly
- **Testing:** Snapshot per locale

---

## Sprint Assembly (Suggested)

Assumes 2 engineers + 1 DevOps contractor. Two-week sprints. All P0 tickets complete before P1s begin.

| Sprint | Tickets | Deliverable |
|---|---|---|
| **S1** | NIM-001, 002, 003, 004, 005, 006, 007, 105 | Foundation live on staging |
| **S2** | NIM-010, 011, 012, 020, 022, 030, 038 | Homepage + service page template + schema graph |
| **S3** | NIM-013, 014, 015, 016, 017, 018, 031, 032, 033 | Service + case study + industry templates |
| **S4** | NIM-021, 024, 025, 026, 027, 028, 034, 035, 037 | Insights + glossary + founders live |
| **S5** | NIM-045, 046, 047, 048, 049, 050, 051, 085, 088, 089 | Performance + analytics + consent ready for public launch |
| **S6** | NIM-055, 056, 057, 058, 059, 065, 066, 075, 078, 095, 096, 097, 098, 099 | SEO meta + trust pages + AEO/GEO foundations — **PUBLIC LAUNCH** |
| **S7+** | Remaining P1/P2 tickets in RICE-priority order | Content velocity phase |

---

## Cross-Cutting Concerns

- **Feature flags:** Use `@vercel/flags` or LaunchDarkly. Every P1+ user-facing change ships behind a flag until measurement is validated.
- **Observability:** Sentry for error tracking. Datadog RUM optional; Web Vitals to GA4 is minimum.
- **Secrets:** All secrets in Vercel/AWS SSM. No secrets in the repo. Rotate quarterly.
- **PII flow:** Any lead form data flows only through server-side APIs. No PII in URL or client analytics.
- **Rollback:** All production deploys reversible in one command via Vercel/AWS Amplify. Every deploy tagged; deploy notes autogenerated from PRs.

---

## Handoff Checklist to PM Tool

When this document is imported into Linear/Jira/ClickUp/Notion:

- Each ticket above becomes a top-level issue
- Epic labels: `epic:E01` through `epic:E12`
- Priority labels: `p0`, `p1`, `p2`, `p3`
- Dependency links captured via "Blocks" / "Blocked by"
- Effort captured as Estimate (days)
- Owner as Assignee (or team label)
- Acceptance Criteria copied verbatim into ticket body
- Technical Approach and Testing become subsections of the ticket
- Definition of Done added as a template comment on every ticket

Once the Linear / Notion / Atlassian MCP connectors are authorized (see note below), these tickets can be programmatically created with dependencies preserved.

---

*This specification is the single engineering source of truth. Any change to page templates, schema shape, or content model must land here first, then propagate to Contentful migrations and application code.*
