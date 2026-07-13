# Case Study — Custom Headless Social Commerce Portal

**URL:** `/case-studies/social-commerce-portal/`
**Meta title:** Case Study: Headless Social Commerce Portal | Nimikh
**Meta description:** How Nimikh cut cart abandonment 15%+ and coordination overhead 85% with a Next.js + bKash + courier automation stack.

**Status:** DRAFT — awaiting client sign-off on named attribution and imagery per Knowledge Graph gap #2. If the client declines named attribution, publish as "Retail brand, Dhaka" and remove logos.

---

## H1
Cutting cart abandonment 15%+ with a Next.js + bKash + courier-automation storefront.

## Meta box (top of page)

- **Client:** [Client name — pending sign-off]
- **Industry:** Retail / Social Commerce
- **Region:** Bangladesh
- **Services:** Headless Commerce (`/services/headless-commerce/`)
- **Timeline:** [X] weeks
- **Stack:** Next.js, Node.js, MongoDB, bKash Merchant API, courier tracking hooks

## 40–60 word summary

Local retail merchants selling primarily through fragmented social messaging channels were losing up to 25% of transactional revenue to cart abandonment and return-to-origin failures. Nimikh engineered a decoupled Next.js storefront integrated with bKash Mobile Financial Services checkout and automated courier dispatch — cutting cart abandonment 15%+, coordination overhead 85%, and page load times below 1.5 seconds.

## The problem

Bangladeshi social-commerce sellers operate primarily on Facebook Live, Messenger, and WhatsApp — where checkout requires manual DMs, screenshot receipts, and hand-typed courier requests. The result:

- **Cart abandonment up to 25%** as buyers dropped between DM and confirmation.
- **Return-to-origin (RTO) rates** climbing because addresses were mis-copied.
- **Manual coordination overhead** consuming 8+ hours per day per operator.
- **No SEO discoverability** because inventory lived in Messenger, not on a crawlable web surface.

The client had two options: keep hiring humans, or engineer their way out.

## What we built

A custom, decoupled Next.js commerce storefront integrated end-to-end with Bangladesh's payment and logistics infrastructure:

- **Frontend:** Next.js App Router with SSR + ISR + AWS CloudFront edge caching. Tailwind CSS token pipeline. Framer Motion physics interactions. Sub-1.5s LCP on 4G.
- **Backend:** Node.js REST API on MongoDB. Product catalog, cart, orders, inventory.
- **Payments:** bKash Merchant API integration with webhook-driven order confirmation.
- **Logistics:** Courier tracking hooks (Pathao, Redx, Steadfast) with automated waybill generation and status polling.
- **Content:** Shoppable video slider layer — repurposing existing Facebook Live content as catalog surfaces.
- **Notifications:** Automated SMS via BulkSMSBD on order confirmation, shipment, and delivery.
- **Admin:** Metrics dashboard showing daily orders, cart-conversion funnel, RTO rate, and courier performance.
- **SEO:** Full schema (Organization + Product + Offer + BreadcrumbList) and sitemap automation — first crawlable footprint for the merchant.

## How we delivered

1. **Discovery & System Architecture** — mapped the current Messenger workflow, identified the top three friction points.
2. **Database & API Schema Mapping** — product, order, customer, courier, inventory models.
3. **Frontend UI Variable Sync** — Figma tokens → Tailwind, Shoppable Video component.
4. **Unit & Visual QA** — Chromatic visual regression, accessibility pass, load test at 5× projected traffic.
5. **Zero-Downtime Staging Launch** — feature-flagged rollout, live monitoring, post-launch handoff.

## Results

*(All metrics from the Knowledge Graph. Pending client written sign-off before publication.)*

- **On-page transactional conversion rate: +15%.**
- **Administrative coordination overhead: −85%.**
- **Page load speeds: <1.5 seconds across edge networks.**
- **Post-launch tracking reliability: 100% data fidelity.**

## What the client said

*"[Testimonial quote pending client sign-off.]"*
— [Client name / role, pending]

## Technologies

React · Next.js · Node.js · REST API · MongoDB · bKash Merchant API · Pathao/Redx/Steadfast tracking APIs · BulkSMSBD · AWS CloudFront · Tailwind CSS · Framer Motion · Chromatic.

## Want a build like this?

Book a diagnostic — we'll audit your current commerce stack and propose an engineering plan.
→ `/contact/`

## Related work

- Headless Commerce vs Shopify: A Decision Framework → `/insights/headless-commerce-vs-shopify/`
- Next.js SSR Caching Strategies at the Edge → `/insights/nextjs-ssr-caching-edge/`
- bKash Integration Guide → `/insights/bkash-integration-guide/`

## Schema

Use `03-schema/12-article-template.jsonld` with these values:
- `@type`: `Article`, `additionalType`: `https://schema.org/CaseStudy`
- `about`: the headless-commerce service `@id`
- `mentions`: Next.js, bKash, MongoDB, AWS CloudFront
- `datePublished`: publish date
- Include `QuantitativeValue` for each metric once client sign-off is written.

---

## Client sign-off template (email to send)

> Subject: Nimikh case study — approval request
>
> Hi [Client],
>
> We'd love to publish the story of our work together as a Nimikh case study. It would live at nimikh.com/case-studies/social-commerce-portal/ and appear in our Clutch, LinkedIn, and Google Business Profile.
>
> Draft attached. Please confirm:
> 1. Named attribution — OK to name [Client Company Name]? If not, we'll anonymize as "retail brand, Dhaka."
> 2. Logo usage — OK to display your logo?
> 3. Metrics — the numbers below match your internal reporting?
>    - Cart conversion +15%
>    - Coordination overhead −85%
>    - Page load <1.5s
> 4. Testimonial — a 2–3 sentence quote for the page? We can draft one for your review.
>
> Reply with any edits by [date]. This is not time-critical — I'd rather get it right.
>
> Thanks,
> Mohiuddin
