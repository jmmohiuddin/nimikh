# Nimikh SEO Audit — Phase 1 & 2

**Date:** 18 July 2026
**Scope:** Full codebase crawl of `nimikh.com` (Next.js App Router), live-site verification, competitor landscape (Bangladesh / UAE / international).
**Method:** Every finding below was read directly out of the repo or fetched from the live site. Where a number is an estimate rather than a measurement, it is labelled **[ESTIMATE]**. Nothing here is invented.

**What this document is not:** it contains no search volumes or keyword difficulty scores. You confirmed no paid keyword tool is available, so those figures would be fabricated. Phase 3–4 will build the keyword database from SERP evidence instead, and label confidence honestly.

---

## 0. Executive summary — the five things that matter

Ranked by impact on organic traffic and leads, not by effort.

| # | Finding | Severity | Why it matters |
|---|---------|----------|----------------|
| 1 | **Three conflicting versions of what Nimikh is** exist across the repo, the live site, and your brief to me | Critical | Entity ambiguity. Google and LLMs cannot decide what to rank you for. Everything downstream depends on fixing this first. |
| 2 | **NAP inconsistency between the site and your Facebook page** — different address, phone, and email | Critical | Directly blocks local pack and Knowledge Panel eligibility. |
| 3 | **Zero blog, zero individual case-study pages, zero solution pages** — 14 indexable URLs total | Critical | The money SERPs in your market are won by content pages, not homepages. You have no pieces on the board. |
| 4 | **Meta titles carry no commercial or geographic modifiers** — `Software Development — Nimikh` | High | You are not targeting a single query anyone actually types. |
| 5 | **No `Service`, `Review`, `Article`, or `AggregateRating` schema** — and named testimonials sit on the page unmarked | High | Free rich-result and AI-citation surface being left on the table. |

**The good news, stated plainly:** the technical foundation is genuinely strong — better than most agencies twice your size. Server-rendered HTML, correct canonicals on every page, a sitemap index with split children, an LLM-friendly `robots.txt`, security headers, tracking-param stripping, an entity `@graph` with stable `@id`s, and an `llms.txt`. Whoever built this knew what they were doing. **The problem is not the machine. The problem is that there is almost nothing in it, and it is not sure what it is.**

---

## 1. Site inventory (verified)

Indexable public routes, read from `lib/pages.ts` and the App Router tree:

| URL | Type | Notes |
|---|---|---|
| `/` | Home | Priority 1.0 |
| `/about` | Company | |
| `/services` | Pillar hub | |
| `/services/software` | Service pillar | |
| `/services/marketing` | Service pillar | |
| `/services/creative` | Service pillar | |
| `/marketplace` | Product | Creator marketplace |
| `/pricing` | Commercial | |
| `/case-studies` | Index | **Index only — no child pages exist** |
| `/contact` | Conversion | |
| `/faq` | Support | |
| `/feedback` | Utility | Should be `noindex` — see §5 |
| `/founders/[slug]` | Person | Derived from `lib/founders.ts` |
| `/legal/[page]` | Legal | `noindex` until sign-off — correct behaviour |

**Total meaningful indexable URLs: ~14.**

For reference, `bdtask.com` — a direct Bangladeshi competitor — publishes **60+ solution pages** in its sitemap, each targeting one vertical: `hospital-management-system`, `inventory-management-system`, `restaurant-management-system`, `hrms-software`, `jewelry-store-management-software`, `campus-management-system`, `agro-erp-software`, `cement-erp-software`, `construction-cost-estimating-software`, and so on. Plus a `/blog` and a Dubai-specific landing page.

That is the entire game in this market, and it is being played without you.

---

## 2. Finding 1 — Nimikh is currently three different companies

This is the most consequential thing in the audit, so it goes first.

**Version A — `Nimikh-Execution-Kit/00-GOLDEN-RECORD.md` (in your repo):**
- Tagline: *"Where engineering meets visual fluidity."*
- Positioning: enterprise custom software, headless commerce, SaaS engineering, AI automation, UI/UX
- Geographies: United States, United Kingdom, EU, Bangladesh, Singapore
- Industries: FinTech, HealthTech, BFSI, PropTech, Legal
- Schema files exist for services that **have no page on the live site**: `05-service-headless-commerce`, `06-service-mobile-engineering`, `07-service-saas-engineering`, `08-service-ai-automation`, `09-service-uiux-design`

**Version B — the live site (`lib/site.ts`, `app/page.tsx`):**
- Tagline: *"Build. Market. Create."*
- Positioning: Dhaka SMB digital agency — software + marketing + creative + a 240-creator marketplace with escrow
- Hero badge reads *"Digital Growth Agency — Dhaka, Bangladesh"*
- Pricing in BDT, from ৳25,000

**Version C — your brief in this conversation:**
- Two services only: Software Development and Affordable Marketing
- SMB focus
- Explicit product list: CRM, ERP, POS, inventory, HR & payroll, business automation
- **The creator marketplace is not mentioned at all** — despite being in your primary nav, your footer, your `llms.txt`, and 13 internal links

These are not variations on a theme. Enterprise FinTech consultancy serving US/UK/EU is a fundamentally different business from a Dhaka SMB agency with a gig marketplace.

**Why this is fatal to SEO specifically:** Google builds an entity for your brand by reconciling your site, your schema, your directory listings, and third-party mentions. When those sources disagree, it does not average them — it lowers confidence and ranks you for nothing in particular. LLMs behave the same way, and worse: your `llms.txt` currently teaches ChatGPT and Claude Version B while your Execution Kit prepares directory submissions describing Version A. You would be actively training the models toward a contradiction.

**This must be resolved before any other work.** Not because it is tidy, but because titles, schema, site architecture, keyword targeting, and directory submissions all inherit from it. I have raised this as a decision for you rather than picking one myself — see the questions at the end.

---

## 3. Finding 2 — NAP inconsistency (local SEO blocker)

| Source | Address | Phone | Email |
|---|---|---|---|
| `lib/site.ts` + `LocalBusiness` schema | Road 1, Building No 30, Dhaka Uddan, Mohammadpur, Dhaka 1207 | +880 1335 857104 | hey@nimikh.com |
| Your public Facebook page | Road No. 6, Mohammadia Housing Society, Dhaka | +880 1779-911491 | nimikh.marketing@gmail.com |

Three fields, three mismatches. NAP (Name–Address–Phone) consistency is one of the load-bearing local ranking signals, and Facebook is a high-trust source Google actively reads.

**Related, and worse:** a brand search for "Nimikh digital agency Dhaka" surfaces the **Facebook page, not nimikh.com**. Your own brand SERP is being won by a third-party profile carrying the wrong contact details. That is lost leads today, not theoretically.

**Also:** `lib/site.ts` has `socials: []` — empty. So the `Organization` schema emits no `sameAs` array at all. The code comment correctly notes that a fake `sameAs` is worse than none, which is right, but the consequence is that Google has no verified link between nimikh.com and your Facebook/LinkedIn presence. The footer compounds this by rendering Facebook / Instagram / LinkedIn / Twitter as `href="#"` — four dead links on every page, visible to users and crawlers.

---

## 4. Finding 3 — the content gap, and what the SERPs actually reward

I checked what genuinely ranks for your target queries rather than assuming. Two patterns emerged, and both are exploitable.

**Pattern A: the head terms are listicle SERPs, not homepage SERPs.**

For *"best software development companies in Bangladesh 2026"*, page one is almost entirely **blog posts published by the competitors themselves** — Kaz, Brain Station 23, Vivasoft, Bdtask, Technext, Ontik, Nextzen, Daffodil, Kolpolok, MyPiHR each run their own "Top 20 Software Companies in Bangladesh" article. They rank by writing the list they appear on.

Two consequences. First, you cannot rank a services page for that query — the SERP does not want one. Second, and more importantly for AI visibility: **these listicles are the corpus LLMs cite** when someone asks ChatGPT "who are the best software companies in Bangladesh?" Nimikh appears in none of them. Getting listed in existing ones is outreach work; publishing a genuinely better one is content work. Both are on the table.

**Pattern B: SMB demand is expressed as products, not services.**

Searches for *inventory management software Bangladesh* and *POS software small business* return **productised solutions** — AmarSolution, Shohoz, Financfy, Troyee, E-hishab, Biznify, Nexchar, Smart Software — not custom-development agencies. Real buyer language, drawn from those SERPs: VAT compliance, multi-branch, super shop, pharmacy, real-time stock, BDT pricing, local support.

Your brief lists inventory, POS, CRM, ERP, and HR/payroll as core offerings. Right now those words appear **nowhere on your site** — not in a heading, not in a title, not in a URL. `/services/software` talks about "Business Websites, E-Commerce Stores, Custom Web Applications, API Integrations." That is how an agency describes itself. It is not how a Bangladeshi retailer searches.

**The gap you can actually own:** the productised players sell rigid off-the-shelf systems. The custom agencies price for enterprise. Nobody is credibly occupying *"affordable custom-built business software for SMBs"* — which is precisely your stated positioning. It is a real gap. It is currently undefended. And you have zero pages addressing it.

**Third-party ranking pressure worth knowing:** Clutch, GoodFirms, DesignRush, TechBehemoths, Sortlist, and SuperbCompanies rank on page one for nearly every commercial query in this space, in both Bangladesh and UAE. You will not outrank them. You get listed on them. Your Execution Kit already contains `04-directory-submissions/tier1-submission-pack.md` — that work is correctly scoped and should be executed early, but **only after the positioning is settled**, or you will submit the wrong description to a dozen high-authority sites and have to unwind it.

---

## 5. Technical SEO audit

### Working correctly — verified, leave alone

- **Server-side rendering.** Fetched the live homepage: full content in the HTML, no JS execution required. Crawlers and LLM bots see everything.
- **Canonicals.** Present and self-referencing on every page via `alternates.canonical`.
- **Sitemap architecture.** `/sitemap.xml` index → split children. Returns `application/xml` correctly.
- **`robots.txt`.** Explicitly allows GPTBot, ClaudeBot, PerplexityBot, Google-Extended, CCBot, Applebot-Extended, Bytespider. This is a deliberate, correct, and unusually forward-looking choice.
- **`llms.txt`.** Present, well-formed, generated from `lib/knowledge.ts` so it cannot drift. Genuinely ahead of the market.
- **Legacy redirects.** All 11 `.html` → clean-URL 301s in `redirects.json`. Correct.
- **Security headers + HSTS preload.** Set in `middleware.ts`.
- **Tracking-param stripping.** UTM/gclid/fbclid removed at the edge — prevents duplicate-URL dilution.
- **OG images.** Dynamic `opengraph-image.tsx` per route with correct dimensions and alt text.
- **Entity `@graph`.** `Organization`, `LocalBusiness`, `WebSite`, `ProfessionalService` with stable `@id`s, emitted site-wide.
- **Breadcrumbs.** Rendered with `BreadcrumbList` JSON-LD.

### Issues found

| # | Issue | Severity | Evidence | Recommendation |
|---|---|---|---|---|
| T1 | `robots.txt` disallows `/*?*` — blocks **all** URLs with query strings | High | `app/robots.ts` | `/contact?intent=…&role=…` is a real route (`app/contact/page.tsx` reads `searchParams`) and is currently uncrawlable. Blanket param-blocking is a blunt instrument; replace with targeted rules. |
| T2 | Homepage canonical is `https://nimikh.com` (no trailing slash), URL resolves to `https://nimikh.com/` | Low | Live fetch | Cosmetic; Google handles it. Normalise for cleanliness. |
| T3 | `/feedback` is indexable and in the sitemap at priority 0.4 | Medium | `lib/pages.ts` | Zero search value, dilutes crawl budget. Set `robots: { index: false, follow: true }`, drop from sitemap. |
| T4 | Four dead `href="#"` social links on every page | Medium | `content/footer.ts` → `footerSocial` | Populate with real URLs, mirror into `site.socials` so `sameAs` emits. |
| T5 | GSC / Bing verification tokens are env-gated and I cannot confirm they are set | High | `lib/site.ts` → `verification` | Verify in Vercel env. Without GSC you are flying blind — no impressions, no query data, no index coverage. This is the single cheapest high-value fix. |
| T6 | **Zero images across the entire site** | High | `grep` for `<img`, `next/image`, `<Image` returns nothing; `public/` contains only `BingSiteAuth.xml` | No image search surface, but the real cost is E-E-A-T and conversion — see §7. |
| T7 | No individual case-study pages | High | `/case-studies` renders inline cards, no `[slug]` route | Each case study is a long-tail landing page you are not publishing. |
| T8 | Core Web Vitals not measured | Unknown | `lighthouserc.json` exists but I have no run output | Needs a real Lighthouse/CrUX run before I claim anything. Flagged, not diagnosed. |
| T9 | CSP requires `style-src 'unsafe-inline'` due to heavy inline `style={{}}` props | Low | `middleware.ts` comment | Not an SEO issue. Noted for completeness. |

---

## 6. On-page SEO audit

### Meta titles — the biggest quick win on the site

The `layout.tsx` template is `%s — Nimikh`. Current output:

| Page | Current title (rendered) | Problem |
|---|---|---|
| `/services/software` | `Software Development — Nimikh` | Generic. No geo, no qualifier, no buyer language. |
| `/services/marketing` | `Growth Marketing — Nimikh` | Same. Also: your brief says *affordable marketing*; the site says *growth marketing*. |
| `/services` | `Services — Nimikh` | Targets nothing. |
| `/pricing` | `Pricing — Nimikh` | Wastes a high-commercial-intent page. |
| `/case-studies` | `Case Studies — Nimikh` | |
| `/marketplace` | `Creator Marketplace — Nimikh` | Only page with a distinctive term. |

Every one is a **label, not a target**. Nobody searches "Software Development." They search "software development company in Dhaka," "custom software development cost in Bangladesh," "inventory software for small business Bangladesh."

I have deliberately **not** written replacement titles yet. Doing so before the positioning question in §2 is resolved would mean rewriting them twice. They are the first deliverable in Phase 6, immediately after you decide.

### H1s

Good news: every page has exactly one H1, and the heading hierarchy is clean (no skipped levels). But the H1s are pure brand copy with no keyword anchoring:

- `/services/software` → *"We engineer software your business runs on."*
- `/services/marketing` → *"Marketing that earns its own budget."*
- `/pricing` → *"Transparent pricing. No surprises."*

These are well-written. That is not the issue — they simply carry no topical signal. The fix is not to make them ugly; it is to add a keyword-bearing subhead or intro sentence beneath them, and let the H1 keep doing its persuasive job. Both audiences get served.

### Internal linking — severely thin

Counted across the whole app:

```
/contact            22 links
/marketplace        13 links
/case-studies        3 links
/services/software   2 links   ← your highest-value commercial page
/services/marketing  2 links
/services/creative   2 links
/pricing             2 links
/services            1 link
/about               1 link
```

Your money pages receive two internal links each, both from nav/footer boilerplate. There is no contextual body-copy linking anywhere on the site — because there is no body copy to link from. This is a symptom of the content gap, not an independent problem, and it resolves as content ships.

### Content depth

Every page is a marketing landing page: short paragraphs, feature cards, CTA. Appropriate for conversion, insufficient for ranking on informational or comparison queries. There is no page on the site that answers a question. `/faq` comes closest and is correctly marked up, but sits at priority 0.6 with no supporting cluster around it.

---

## 7. E-E-A-T and trust signals

This section matters more than usual, because your competitors are 15–20-year-old firms with hundreds of employees, and you are competing on credibility from a standing start.

**Present:**
- Founder pages at `/founders/[slug]` with `Person` schema — genuinely good, and the right instinct
- Named testimonials with company attribution (Rahim Chowdhury / Dhaka Threads, Fatima Begum / NutriBoost BD, Tanvir Ahmed / SkyTech Solutions)
- Specific claimed metrics: 152 projects, 80+ clients, 240+ creators, +340% average ROI

**Missing or at risk:**

- **No photographs of anything.** No team, no office, no client work, no case-study screenshots. For a Bangladeshi SMB deciding whether to wire ৳65,000 to a company they found online, this is a serious trust deficit — and for AI systems assessing E-E-A-T, an entirely faceless site is a weak signal.
- **Testimonials are unmarked.** Named, attributed testimonials with star ratings sit in the HTML with no `Review` schema. That is free eligibility being discarded.
- **The `+340%` claim needs substantiation.** Displayed prominently as an average campaign ROI. If you add `AggregateRating` or `Review` schema, Google's guidelines require these reflect genuine, verifiable data. Publish the methodology, or soften the claim. I would not implement rating schema until this is settled — a manual action for false structured data would be a far worse outcome than not having stars.
- **`Nimikh Private Limited` is marked "pending incorporation"** in the Golden Record. Directory submissions requiring a registration number will be blocked. Worth knowing before you start Phase 4 outreach.
- **Founded 2025.** You are a new domain with, as far as I can tell, near-zero backlink authority. Realistic expectation setting: competitive head terms are a 9–18 month project **[ESTIMATE]**. Long-tail and local terms are winnable in 3–6 months **[ESTIMATE]**. Anyone promising faster on a 2025 domain in this vertical is guessing.

---

## 8. Structured data audit

**Implemented** (`lib/schema.ts`): `Organization`, `WebSite`, `LocalBusiness`, `ProfessionalService`, `FAQPage` (on `/faq`, `/pricing`, `/contact`), `BreadcrumbList`, `Person`.

**Missing, ranked by value:**

| Schema | Where it belongs | Value |
|---|---|---|
| `Service` | All `/services/*` pages | **Highest.** Your core commercial pages have no service markup. Builders for five services already exist in `Nimikh-Execution-Kit/03-schema/` — written for the Version A positioning, so they need reconciling first. |
| `Review` / `AggregateRating` | Homepage testimonials | High — but gated on substantiation (§7). |
| `Article` / `BlogPosting` | Blog | Blocked: no blog exists. |
| `SearchAction` | `WebSite` node | Blocked: no site search exists. Do not add the markup without the feature. |
| `Offer` | `/pricing` | Medium. Real BDT prices are already published — mark them up. |
| `ImageObject` | Everywhere | Blocked: no images. |
| `CreativeWork` / case-study markup | `/case-studies/[slug]` | Blocked: no child pages. |

Note the pattern: most gaps are **blocked on content or product decisions, not on schema work**. Schema is downstream. This is why I would not start Phase 9 first, despite it looking like the easiest phase.

---

## 9. Competitor landscape

### Bangladesh

| Competitor | Model | What they do well | Where you can beat them |
|---|---|---|---|
| **Bdtask** | Productised software, 60+ solution pages | Vertical landing pages + heavy blog + Dubai page. Ranks for cost queries. | Their pages are thin and template-cloned. Genuine depth wins. |
| **Kaz Software** | Enterprise custom dev, since 2004 | 20+ years authority, 35+ countries, own ranking listicles | Enterprise-priced. Ignores SMBs entirely. |
| **Brain Station 23** | Enterprise, public limited, since 2006 | Strongest brand authority in market | Same — no SMB motion. |
| **Vivasoft** | Team augmentation | Fast-growing, strong content | B2B staffing focus, not SMB products. |
| **Dcastalia, Rexoit, Ontik, Technext, Nextzen, Kolpolok, MyPiHR** | Mid-market agencies | All run cost-comparison and listicle content | Content quality is generally shallow. |
| **AmarSolution, Shohoz, Financfy, Troyee, E-hishab, Biznify, Nexchar** | SMB SaaS (POS/inventory) | Own the actual SMB search demand | Rigid off-the-shelf. Custom-fit is your wedge. |

### UAE / Dubai

Gligx, Tntra, Code-Brew, Seasia, UAE App Developers, Triospace. Notably, **several already position explicitly on "SME-friendly" and "affordable"** — the differentiation you are counting on is less novel in UAE than in Bangladesh. Local presence and TDRA/VAT compliance content are the real barriers there.

**My read: UAE is a Phase 2 market, not a launch market.** Bdtask maintains exactly one Dubai page rather than a full UAE site — that is the sensible pattern to copy. Concentrating on Bangladesh first, where the SMB gap is genuinely undefended, will produce leads faster. Happy to argue the other side if you have UAE-specific commercial reasons I do not know about.

### International

Not realistically contestable on head terms — Toptal, Clutch, and the major consultancies own them. Your international path is long-tail and referral, not organic head terms. I would not spend budget there in year one.

---

## 10. What I recommend doing, in order

Sequenced by dependency, not by ease.

**Before anything else — decisions only you can make:**
1. Resolve the positioning conflict (§2). Everything inherits from this.
2. Decide whether the creator marketplace is core or legacy.
3. Confirm or correct the Facebook NAP.
4. Confirm GSC/Bing verification tokens are live in Vercel.

**Then, roughly in this order:**
5. Fix NAP everywhere; populate `site.socials` and real footer links.
6. Rewrite all meta titles and descriptions against the settled positioning.
7. Add `Service` schema to service pages; add `Offer` to pricing.
8. Fix the `/*?*` robots rule; `noindex` `/feedback`.
9. Build the solution-page layer — the `/solutions/[vertical]` architecture that the SERP evidence in §4 says wins this market.
10. Ship individual case-study pages with real screenshots.
11. Launch the blog and start the topic clusters.
12. Execute the directory-submission pack — but only after step 1.

Steps 1–8 are days of work. Steps 9–12 are the year.

---

## Questions I need answered before Phase 3

I have deliberately stopped here rather than building a keyword database on an unstable foundation.

1. **Which positioning is real?** Version A (enterprise/global), Version B (Dhaka SMB agency + marketplace), or Version C (SMB software + affordable marketing, no marketplace)? The Execution Kit and the live site currently contradict each other in the same repository.
2. **Is the creator marketplace core to the business?** It occupies your nav and 13 internal links but is absent from your brief to me.
3. **Which contact details are correct** — the site's, or Facebook's?
4. **Are the `152 projects / 80 clients / +340% ROI` figures verifiable?** This determines whether rating schema is safe to implement.
5. **Is Search Console verified and collecting data?** If yes, a Performance export would let me ground Phase 3 in your real impression data instead of SERP inference — a large upgrade in confidence.

---

## Sources

- [Kaz Software](https://www.kaz.com.bd/) · [Brain Station 23](https://brainstation-23.com/top-software-companies-in-bangladesh/) · [Vivasoft](https://vivasoftltd.com/best-software-companies-in-bangladesh/) · [Bdtask sitemap](https://www.bdtask.com/sitemap.xml) · [Bdtask cost guide](https://www.bdtask.com/blog/custom-software-development-cost-in-bangladesh)
- [Dcastalia cost guide](https://dcastalia.com/blog/custom-software-development-cost-in-bangladesh/) · [Ontik Top 25](https://www.ontiktechnology.com/blog/top-software-companies-in-bangladesh) · [Technext](https://technext.it/software-companies-in-bangladesh/)
- [Clutch Bangladesh developers](https://clutch.co/bd/developers) · [GoodFirms Bangladesh](https://www.goodfirms.co/directory/country/top-software-development-companies/bangladesh) · [DesignRush Bangladesh](https://www.designrush.com/agency/software-development/bd)
- [AmarSolution](https://amarsolution.com/) · [Shohoz Software](https://shohozsoftware.com/best-inventory-management-software-in-bangladesh/) · [Financfy](https://financfy.com/blog/inventory-management-software-in-bangladesh/) · [Smart Software](https://www.smartsoftware.com.bd/retail-pos-software-in-bangladesh)
- [Gligx Dubai](https://www.gligx.com/custom-software-development-company/) · [Tntra UAE](https://www.tntra.io/ae/software-development-company-dubai) · [GoodFirms UAE](https://www.goodfirms.co/directory/country/top-software-development-companies/ae)
- [Nimikh Facebook page](https://www.facebook.com/nimikh.technologies/)
