# Mohiuddin — LinkedIn Starter Pack (10 posts)

Cadence: Publish Tuesdays. Cross-post best-performing posts to Nimikh Company Page (Wednesdays). Aim for 300–800 characters per post plus a hook and a P.S.

Voice: Authoritative, direct, quantitative. First-person. Occasional mildly opinionated stance. No emojis, no motivational fluff. Short sentences.

---

## Post 1 — The founding thesis
> The reason offshore engineering has a bad reputation isn't offshore engineers.
>
> It's that agencies split the delivery into three companies — designers, developers, growth — and charge the client for the coordination cost.
>
> Nimikh runs all three under one contract, one sprint cadence, one telemetry portal.
>
> Clients cut their coordination overhead by ~85%. That's not a services innovation. It's a structural one.
>
> P.S. Currently taking three new engagements for Q4.

## Post 2 — On PDPA 2026 (piggyback on the primer article)
> Bangladesh's PDPA 2026 is now enforceable and most SaaS founders serving Bangladeshi users have not architected for it.
>
> Six things that need to change:
>
> 1. Sensitive data residency (Dhaka node).
> 2. Granular, revocable consent.
> 3. DSAR fulfillment inside 30 days.
> 4. 72-hour breach notification.
> 5. Subprocessor liability audit.
> 6. Cross-border transfer legal basis, documented.
>
> Wrote a full primer on the practical implications. Link in comments.

## Post 3 — A hot take on Shopify vs headless
> Half the "we need headless commerce" conversations I have should end with "keep Shopify."
>
> Headless wins when:
> - Revenue > $5M and growing.
> - You have 3+ engineers in-house.
> - UX or integrations exceed template capability.
> - Multi-surface (web + app + kiosk).
>
> If you don't have three of the four, headless costs more than it earns.

## Post 4 — What ScaleGate actually is
> The reason we built ScaleGate:
>
> Every offshore agency I hired before founding Nimikh sent a Friday invoice attached to a Word doc.
>
> No commit visibility. No sprint capacity dashboard. No page-performance tracking on what shipped.
>
> ScaleGate is a client portal that shows all three, live. It's not a moat; it's a minimum standard.

## Post 5 — On multi-tenant PostgreSQL RLS
> PostgreSQL Row-Level Security is the most under-used compliance moat in SaaS.
>
> Application-layer tenancy enforcement is one bug away from a breach.
>
> RLS enforces isolation at the database policy layer — even a compromised application query cannot cross tenant boundaries.
>
> If you're building B2B SaaS on Postgres and not using RLS, you're one Little Bobby Tables away from an incident.

## Post 6 — What venture-backed founders actually need
> Talked to a Seed-stage founder last week who's spent $180k with three offshore agencies over 8 months and still has no shipping MVP.
>
> Pattern I keep seeing:
>
> 1. Founder writes a spec.
> 2. Agency A builds the frontend.
> 3. Agency B builds the backend.
> 4. Nothing connects.
> 5. Agency C is hired to fix it.
> 6. Runway is now 4 months, not 12.
>
> Under one delivery contract, that MVP ships in 10 weeks for a third the total spend.

## Post 7 — On the "40–70% cheaper" claim
> When I say Nimikh delivers Western-quality engineering at 40–70% below onshore rates, I don't mean:
>
> - Cheap developers.
> - Cheap timelines.
> - Cheap process.
>
> I mean: our COGS is Dhaka salaries, not San Francisco salaries. Everything else is the same — same architecture, same code quality, same security posture, same client-side tooling.
>
> Geography arbitrage is real. Quality arbitrage is not.

## Post 8 — On applied AI vs research AI
> If your applied AI project doesn't have:
> - A defined workflow it replaces.
> - A dollar-per-task cost target.
> - Guardrails and evals.
> - An integration to a system of record.
>
> …it's not applied AI. It's a demo.
>
> Demos are useful for boards. They don't ship value.

## Post 9 — A short thread on Core Web Vitals
> Three things that fix LCP more than 90% of the time on a Next.js commerce build:
>
> 1. Preload the hero image explicitly. `next/image priority` is not enough on ISR routes.
> 2. Cache the HTML at the edge, not the origin.
> 3. Defer analytics to server-side GTM.
>
> Everything else — image format, script splitting, font loading — is polish.

## Post 10 — On the year ahead
> Nimikh's plan for the next 12 months:
>
> 1. Ship 4 flagship reference publications (PDPA 2026 playbook first).
> 2. Get to 15 verified Clutch reviews.
> 3. Land 3 flagship enterprise engagements.
> 4. Spin up an internal SaaS product from a repeat client problem.
>
> If any of those overlap with what you're building, my calendar's open.

---

## Post templates for ongoing use

### Insight-piece amplification
> Just published: [title]
>
> The three things that surprised me while researching this:
> 1. [surprise 1]
> 2. [surprise 2]
> 3. [surprise 3]
>
> Full piece linked in comments.

### Case study announcement (post client sign-off)
> Just published a case study on how we [outcome] for [client type].
>
> The interesting part: [one non-obvious technical or process lesson].
>
> Numbers:
> - [metric 1]
> - [metric 2]
> - [metric 3]

### Reactive commentary
> [News event] happened today.
>
> Three things that changes for SaaS founders serving [affected group]:
> 1. […]
> 2. […]
> 3. […]
>
> This is a good time to audit your [related architectural concern].
