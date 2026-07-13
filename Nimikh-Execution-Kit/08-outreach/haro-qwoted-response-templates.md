# HARO / Qwoted / SourceBottle Response Templates

**Rule of engagement:** 15 minutes per day, first thing. Respond to 2–3 relevant queries. Never respond to queries outside Nimikh's expertise — journalist quality trumps quantity, and low-relevance responses damage source-inbox reputation.

**Sign every response** as: Mohiuddin, Founder & CEO of Nimikh (nimikh.com). Include a two-sentence bio and one link.

---

## Response formula (every response follows this)

1. **Line 1 — direct answer to the question.** No preamble.
2. **Lines 2–4 — supporting reasoning or data.** Named, specific, quantifiable where possible.
3. **Line 5 — one contrarian nuance or edge case.** Journalists cite responses that add something.
4. **Sign-off — name, role, company, one link.** No more.

Total: 100–250 words. Never more.

---

## Template 1 — Engineering / Software / Architecture

**Journalist query pattern:** "How should [audience] think about [technical decision]?" / "Best practice for [X]?"

**Response:**
> The three-question test for [decision]:
>
> 1. [Question with implicit answer].
> 2. [Question with implicit answer].
> 3. [Question with implicit answer].
>
> If a team can't answer all three cleanly, [contrarian recommendation].
>
> The most common failure mode I see: [specific pattern] — teams optimize for [wrong metric] when [right metric] is what predicts outcome.
>
> One counterintuitive rule: [contrarian nuance].
>
> — Mohiuddin, Founder & CEO of Nimikh (nimikh.com). Nimikh engineers custom SaaS, headless commerce, mobile, and AI systems for VC-backed startups and mid-market enterprises. Based in Dhaka; serving globally.

---

## Template 2 — AI / RAG / Applied AI

**Journalist query pattern:** "How does [industry] use AI?" / "What's the biggest mistake in [AI deployment]?"

**Response:**
> The most common enterprise AI deployment mistake: teams treat retrieval-augmented generation (RAG) as a plug-in, not an architecture.
>
> RAG done well requires: [item 1], [item 2], [item 3], and [item 4]. When any one is missing, the model hallucinates confidently — which is worse than not deploying at all in [regulated context].
>
> The one metric that predicts success: [metric] — teams that measure this hit production; teams that measure model benchmark scores get demos.
>
> A contrarian rule I use: [rule].
>
> — Mohiuddin, Founder & CEO of Nimikh.

---

## Template 3 — Startup / Venture / Business

**Journalist query pattern:** "What should Seed founders prioritize?" / "How to work with offshore agencies?"

**Response:**
> The specific failure mode I see at Seed-stage: [pattern]. Founders spend [amount] with [count] agencies over [duration], end up with [outcome].
>
> Three checks before signing an offshore contract:
>
> 1. Do you own the source code from Sprint 0?
> 2. Do you see commits, sprint capacity, and page performance in real time — not in a Friday PDF?
> 3. Is the invoice tied to milestones or hours? (Milestones for well-defined work, hours for exploration — never mixed inside one line item.)
>
> One thing founders overweight: hourly rate. One thing they underweight: coordination cost between design, backend, and growth teams — usually 20–40% of the total invoice.
>
> — Mohiuddin, Founder & CEO of Nimikh.

---

## Template 4 — Design / UX / Design Systems

**Journalist query pattern:** "How should teams build a design system?" / "What makes a good design system?"

**Response:**
> A design system is not a Figma library. Four things distinguish real systems from decorated component sheets:
>
> 1. Tokens, not colors. Change one JSON file, retheme the product.
> 2. Automated design-to-code handoff. Figma tokens compile to Tailwind (or your framework of choice) via Git.
> 3. Visual-regression testing (Chromatic or equivalent) on every PR.
> 4. Governance — a documented process for adding, deprecating, and enforcing components.
>
> Teams that skip #4 see their system degrade within six months.
>
> The metric to track: percentage of production UI rendered via design-system components. If it drops below 80%, the system isn't earning its cost.
>
> — Maruf Shezad, Founder & CXO of Nimikh (nimikh.com).

---

## Template 5 — Compliance / Data Privacy

**Journalist query pattern:** "What should SaaS founders know about [regulation]?" / "How to handle [privacy concern]?"

**Response:**
> [Regulation] treats architecture as a compliance requirement, not a policy footnote. Three concrete implications most SaaS founders miss:
>
> 1. [Residency / consent / notification requirement] — needs [architectural change], not a privacy-policy update.
> 2. [DSAR / breach / cross-border requirement] — the 30-day (or 72-hour) clock starts on the day of the request, not the day you decide to respond.
> 3. Processor liability — you're jointly liable for every subprocessor. Audit before you sign.
>
> The countdown that surprises founders: [X hours / Y days]. That's not enough time to build the response process during an incident; you build it in advance or you fail the deadline.
>
> — Mohiuddin, Founder & CEO of Nimikh.

---

## What to skip

- Consumer / lifestyle / travel / general marketing queries (out of scope).
- Queries requesting free consulting via reply (respond only if headline value fits).
- Anonymous queries with no publication named.
- Queries with unusually short deadlines that seem AI-bait.

---

## Tracking

Keep a Google Sheet: date, publication, journalist, query, response length, pitched, cited, link. Review monthly. Iterate on which templates land.
