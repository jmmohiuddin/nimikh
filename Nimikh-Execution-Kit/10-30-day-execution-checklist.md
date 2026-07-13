# 30-Day Execution Checklist — Ready to Run

Every item below is a concrete action. Owner is either **CEO** (Mohiuddin), **CXO** (Maruf), **ENG** (engineering lead), or **DELEGATE** (external contractor or new hire). Check off as you go.

---

## Week 1 — Technical foundation + entity groundwork

### Engineering (ENG)

- [ ] Confirm canonical host: `nimikh.com` (no www). 301 www to canonical.
- [ ] Enforce HTTPS + HSTS (see `02-technical/security-headers.md`).
- [ ] Deploy `02-technical/robots.txt` to `/robots.txt`.
- [ ] Deploy `02-technical/llms.txt` to `/llms.txt`.
- [ ] Deploy `02-technical/sitemap-index.xml` and stand up dynamic child sitemaps.
- [ ] Inject the four JSON-LD schemas globally: Organization (`03-schema/01-organization.jsonld`), LocalBusiness (`02-localbusiness.jsonld`), Person × 2 (`03-schema/03-person-mohiuddin.jsonld`, `04-person-maruf-shezad.jsonld`).
- [ ] Wire security headers per `02-technical/security-headers.md`.
- [ ] Wire `web-vitals` reporter → GA4 or a logging endpoint.
- [ ] Set up GA4 via server-side GTM.
- [ ] Set up Google Search Console (DNS TXT verification).
- [ ] Set up Bing Webmaster Tools.
- [ ] Wire IndexNow ping on publish.
- [ ] Validate every JSON-LD via Rich Results Test + Schema Markup Validator.
- [ ] Confirm 404 pages return 404 status (not 200).
- [ ] Baseline Lighthouse scores on top 20 URLs.

### CEO

- [ ] Confirm domain registrar + DNS access.
- [ ] Confirm Inter Variable licensing (SIL OFL — safe). Confirm Berkeley Mono licensing (commercial — needed if used publicly).
- [ ] Ship `00-GOLDEN-RECORD.md` to every team member. Anyone touching Nimikh public copy uses these values.
- [ ] Duplicate `01-directory-tracker.csv` into a live Google Sheet; grant edit access.
- [ ] Send case-study sign-off email (template in `06-content/case-study-01-social-commerce-portal.md`) to the pilot client.
- [ ] Book RJSC incorporation appointment / lawyer follow-up.

### CXO

- [ ] Prepare brand asset kit at required resolutions:
  - Logo SVG + PNG 512×512 (transparent).
  - Favicons at 16, 32, 180, 192, 512.
  - OG cover images (1200×630) for home, each service, insights, contact.
  - Cover images (1584×396) for LinkedIn.
  - Founder headshots (Mohiuddin, Maruf) at 512×512 minimum.
  - Dhaka HQ photo.
- [ ] Ship all assets to a shared Drive / Cowork folder.

---

## Week 2 — Baseline content + directory sweep starts

### CEO / CXO / DELEGATE

- [ ] Deploy website copy from `05-website-copy/`:
  - Homepage.
  - `/company/`, `/team/`, `/contact/`.
  - Five service pillars.
- [ ] Set meta title + description on every route per `02-technical/meta-tags-per-page.csv`.
- [ ] Set OG images on every route.
- [ ] LinkedIn Company Page completion per `04-directory-submissions/tier1-submission-pack.md`.
- [ ] Facebook Business Page completion (same file).
- [ ] Submit sitemap to Google Search Console.
- [ ] Submit sitemap to Bing Webmaster Tools.
- [ ] Verify all internal links resolve; no 404s.
- [ ] Publish first Mohiuddin LinkedIn post (Post 1 from `07-founder-content/mohiuddin-linkedin-starter-pack.md`).
- [ ] Publish first Maruf LinkedIn post (Post 1 from `07-founder-content/maruf-linkedin-starter-pack.md`).

---

## Week 3 — Directory Tier 1 + case study

### CEO

- [ ] Submit Google Business Profile per pack; start postcard verification.
- [ ] Prepare Bing Places account (import from GBP once verified).
- [ ] Submit Crunchbase.
- [ ] Set up Clutch profile per pack (do not request reviews yet — wait for case study #1 client sign-off).
- [ ] Mirror to GoodFirms.
- [ ] Publish first case study `/case-studies/social-commerce-portal/` (pending sign-off).
- [ ] Publish Mohiuddin LinkedIn Post 2 (PDPA 2026 primer teaser).
- [ ] Publish Maruf LinkedIn Post 2 (typography opinion).

### ENG

- [ ] Case study template with Article + Case Study schema deployed.
- [ ] Glossary route + `DefinedTerm` schema ready to accept content.

---

## Week 4 — First insights + outreach cadence starts

### CEO / DELEGATE

- [ ] Publish `06-content/insight-01-pdpa-2026-primer.md` at `/insights/pdpa-2026-primer/`.
- [ ] Publish `06-content/insight-02-headless-vs-shopify.md` at `/insights/headless-commerce-vs-shopify/`.
- [ ] Publish glossary hub with 20 of the 30 terms from `06-content/glossary-v1.md`.
- [ ] Start HARO/Qwoted daily (15 min/day) — use templates in `08-outreach/haro-qwoted-response-templates.md`.
- [ ] Send first guest-post pitch (Smashing Magazine per `08-outreach/guest-post-and-podcast-pitches.md`).
- [ ] Send first podcast pitch (Software Engineering Daily).
- [ ] Publish Mohiuddin LinkedIn Post 3 (Shopify vs headless).
- [ ] Publish Maruf LinkedIn Post 3 (dark-first design).
- [ ] If GBP postcard arrived, complete verification. If not, follow up with Google support.

### ENG

- [ ] All Service JSON-LD deployed on respective service pages.
- [ ] FAQPage JSON-LD on every service page (customize questions to the page's FAQ).
- [ ] BreadcrumbList JSON-LD on every non-root page.
- [ ] Article JSON-LD template on insight pages, with correct author/publisher.
- [ ] Chromatic on Storybook (if not already live) for design-system pages.
- [ ] Fix any Lighthouse red items on top 10 URLs.

---

## End-of-30-Day Deliverables Snapshot

- ~15 URLs live: home, about, team, contact, services hub, 5 service pillars, 2 insights, 1 case study, glossary hub.
- All URLs indexed (verify in GSC by day 30).
- All URLs have title, meta description, OG image, canonical, correct JSON-LD.
- LinkedIn Company Page + Facebook Business Page complete.
- GBP verified (or postcard in transit).
- Bing Places set up.
- Crunchbase, Clutch, GoodFirms live.
- 4 LinkedIn posts each from Mohiuddin and Maruf.
- 15+ HARO responses sent.
- 4 guest-post pitches sent.
- 4 podcast pitches sent.
- Case study #1 published (assuming client sign-off).
- Directory tracker up to date.

---

## Weekly ops cadence going forward

- **Monday morning (30 min):** review directory tracker, publish schedule, backlink acquisitions from Ahrefs/Semrush, GSC impressions delta.
- **Tuesday:** Mohiuddin LinkedIn post + one insight article published.
- **Wednesday:** guest-post pitch + podcast pitch sent.
- **Thursday:** Maruf LinkedIn post + one design/UX asset published.
- **Friday:** monthly-view GSC + Bing report; update the tracker sheet; queue next week.

## Blockers to escalate

| Blocker | Escalate to | Deadline |
|---|---|---|
| RJSC incorporation | CEO | Week 4 |
| Case study #1 client sign-off | CEO / PM | Week 4 |
| Google Business Profile postcard | CEO (Google support if not received by day 14) | Week 3 |
| Berkeley Mono licensing decision | CXO | Week 2 |
| Pilot client cases #2 and #3 | CEO (start conversations Q2 for Q3 publication) | Q2 |
