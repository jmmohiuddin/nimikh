# Nimikh — Organic Growth & Discoverability Execution Kit

Everything in this folder is ready to deploy, paste, or submit. Nothing is a placeholder unless clearly marked. Copy is sourced from your Master Company Knowledge Graph; where facts are missing, the file flags them.

**Companion strategy document:** `../Nimikh-Organic-Growth-Strategy.md` (the 16-section master strategy).

---

## What's here

### 00 — Golden Record
- `00-GOLDEN-RECORD.md` — canonical company facts. Use these values verbatim across every surface. Do not drift.

### 01 — Directory Tracker
- `01-directory-tracker.csv` — the full submission queue (Tiers 1–5). Duplicate to Google Sheets and track live.

### 02 — Technical foundation
- `02-technical/robots.txt` — deploy to `/robots.txt`.
- `02-technical/llms.txt` — deploy to `/llms.txt` (LLM discovery standard).
- `02-technical/sitemap-index.xml` — deploy to `/sitemap.xml`. Wire child sitemaps dynamically.
- `02-technical/security-headers.md` — Next.js config snippet + CSP starter.
- `02-technical/meta-tags-per-page.csv` — meta title / description / OG per canonical URL.

### 03 — JSON-LD schema pack
Ready-to-inject `<script type="application/ld+json">` blocks. Inject the Organization, LocalBusiness, and Person schemas globally; inject Service on each service page; Article on insights + case studies; FAQ on any page with an FAQ section; BreadcrumbList on every non-root page.

- `01-organization.jsonld`
- `02-localbusiness.jsonld`
- `03-person-mohiuddin.jsonld`
- `04-person-maruf-shezad.jsonld`
- `05-service-headless-commerce.jsonld`
- `06-service-mobile-engineering.jsonld`
- `07-service-saas-engineering.jsonld`
- `08-service-ai-automation.jsonld`
- `09-service-uiux-design.jsonld`
- `10-faqpage-template.jsonld`
- `11-breadcrumb-template.jsonld`
- `12-article-template.jsonld`

### 04 — Directory submissions
- `04-directory-submissions/tier1-submission-pack.md` — Google Business Profile, Bing Places, LinkedIn, Clutch, GoodFirms, Crunchbase, Wikidata, BASIS, G2, Facebook. Every field filled from the Golden Record. Submission order at the bottom.

### 05 — Website copy
- `05-website-copy/homepage.md`
- `05-website-copy/about-team-contact.md` — Company / Team / Contact pages.
- `05-website-copy/service-headless-commerce.md`
- `05-website-copy/service-saas-engineering.md`
- `05-website-copy/service-mobile-engineering.md`
- `05-website-copy/service-ai-automation.md`
- `05-website-copy/service-uiux-design.md`

### 06 — Launch content
- `06-content/case-study-01-social-commerce-portal.md` — Dhaka social commerce, pending client sign-off. Sign-off email template inside.
- `06-content/insight-01-pdpa-2026-primer.md` — publishable article for Cluster 6 (Compliance).
- `06-content/insight-02-headless-vs-shopify.md` — publishable article for Cluster 1 (Headless).
- `06-content/glossary-v1.md` — 30 defined terms with schema template.

### 07 — Founder content
- `07-founder-content/mohiuddin-linkedin-starter-pack.md` — 10 posts + templates.
- `07-founder-content/maruf-linkedin-starter-pack.md` — 10 posts + templates.

### 08 — Outreach
- `08-outreach/haro-qwoted-response-templates.md` — 5 response templates + rules.
- `08-outreach/guest-post-and-podcast-pitches.md` — pitch templates + follow-up.
- `08-outreach/target-publications-and-podcasts.md` — pitch queue for six months.

### 10 — 30-Day Execution Checklist
- `10-30-day-execution-checklist.md` — every action, week by week, owner assigned.

---

## How to use this kit

**Day 1.** Read `00-GOLDEN-RECORD.md` and share with anyone who publishes for Nimikh. Read `10-30-day-execution-checklist.md`. Assign owners.

**Week 1.** Engineering ships the technical foundation (`02-technical/*`) and JSON-LD (`03-schema/*`). CEO confirms domain access and Golden Record distribution. CXO prepares brand assets.

**Week 2.** Deploy website copy from `05-website-copy/`. Set meta tags from `02-technical/meta-tags-per-page.csv`. Start LinkedIn cadence.

**Week 3.** Directory Tier 1 sweep per `04-directory-submissions/tier1-submission-pack.md`. Ship case study once sign-off is in.

**Week 4.** Publish first two insights and glossary v1. Start HARO and guest-post pitches. Verify GBP.

**Every week thereafter.** Follow the ops cadence at the bottom of `10-30-day-execution-checklist.md`.

---

## Blocked items (require external action)

Three items in the strategy require your action outside this kit:

1. **RJSC corporate incorporation + BIN.** Unblocks BASIS, Wikidata credibility, tier-1 procurement, and USD invoicing without local remittance friction. Owner: CEO. Deadline: Week 4.
2. **Case study #1 client sign-off.** Draft is ready. Send the email in `06-content/case-study-01-social-commerce-portal.md`. Owner: CEO / PM. Deadline: Week 4.
3. **Berkeley Mono commercial license** (if used publicly). Owner: CXO. Deadline: Week 2. Inter Variable is SIL OFL and safe.

---

## What this kit does NOT do

- **Deploy code to nimikh.com** — your engineering team runs the deploy.
- **Submit directory listings for you** — the submissions require your accounts and postcard verifications.
- **Verify Search Console** — requires DNS access.
- **Publish content on your CMS** — the copy is ready; you paste and hit publish.
- **Guarantee rankings or lead volume** — everything is measured on inputs and leading indicators tied to your Master Metrics Matrix (3 → 15 leads/month target).

---

## Reference tools you'll want

- **Google Search Console** — https://search.google.com/search-console
- **Bing Webmaster Tools** — https://www.bing.com/webmasters
- **Rich Results Test** — https://search.google.com/test/rich-results
- **Schema Markup Validator** — https://validator.schema.org/
- **PageSpeed Insights** — https://pagespeed.web.dev/
- **Ahrefs / Semrush** — for backlink tracking and competitive research.
- **HARO / Qwoted / SourceBottle** — for journalist requests.
- **Otterly / Peec / Profound** — for AI-answer citation monitoring (as they mature in 2026).

---

Iterate this kit as you learn what works. The strategy is durable; the tactics evolve.
