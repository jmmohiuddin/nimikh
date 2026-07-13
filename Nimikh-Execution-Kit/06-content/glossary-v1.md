# Glossary v1 — 30 Terms

**URL structure:** `/glossary/{term-slug}/`
Each term ships as its own page with `DefinedTerm` schema and a paragraph definition; the glossary hub `/glossary/` lists all terms.

Use each definition as the top paragraph of the term page. Add: internal links to related terms and pillar service pages; a "Learn more" CTA to the relevant service.

---

## AEO (Answer Engine Optimization)
The practice of structuring content so that answer engines (Google AI Overviews, Bing Copilot, ChatGPT, Perplexity) can extract, cite, and paraphrase your answer as their response to a user question. Contrast with SEO (which optimizes for search-result placement) and GEO (which optimizes for grounding by generative models).

## Applied AI
The practical deployment of artificial intelligence models — usually large language models plus retrieval and orchestration — inside real business workflows. Applied AI is distinct from research AI: it prioritizes reliability, guardrails, cost per task, and integration with systems of record over benchmark scores.

## bKash Merchant API
The programmatic interface Bangladesh's largest Mobile Financial Services provider offers merchants to accept payments, disburse funds, and query transactions. Integration requires a Merchant Agreement with bKash and passes through a sandbox before production.

## Core Web Vitals
Google's user-experience performance metrics: Largest Contentful Paint (LCP, load speed), Interaction to Next Paint (INP, responsiveness), and Cumulative Layout Shift (CLS, visual stability). Green thresholds: LCP ≤ 2.5s, INP ≤ 200ms, CLS ≤ 0.1. Vitals feed into Google's page-experience ranking signal.

## Decoupled Architecture
A frontend / backend architecture in which the presentation layer communicates with backend systems exclusively through APIs, with no shared templating or database. Enables independent scaling, technology choice, and multi-surface delivery (web + mobile + kiosk from one backend).

## Design Tokens
Named variables (color, spacing, radius, typography, motion) that carry design decisions from Figma into code. Enables consistent styling across platforms and clean design-to-code handoff — see `/insights/design-tokens-to-tailwind-howto/`.

## Edge Caching
Serving static or pre-rendered content from CDN nodes physically close to the user. Reduces LCP and TTFB dramatically. AWS CloudFront, Vercel Edge, Cloudflare Workers are common providers.

## GEO (Generative Engine Optimization)
The practice of making content preferred by LLM retrieval and grounding — through structured data, freshness, named-entity density, and authoritative co-citation. Distinct from AEO (being the answer) — GEO is about being trusted enough to be cited.

## Guardrails (AI)
Input and output validation layers that prevent an AI model from processing unsafe queries or emitting unsafe responses. Common guardrails: PII redaction on input, JSON-schema validation on output, refusal patterns for out-of-scope queries, confidence thresholds routing uncertain queries to human review.

## Hallucination (AI)
A confidently-stated but factually incorrect response from a language model. Mitigated with retrieval grounding (RAG), structured output validation, and citation requirements.

## Headless Commerce
An e-commerce architecture in which the storefront frontend is decoupled from the commerce backend via APIs. Enables custom UX, multi-surface delivery, and integration flexibility that template-based platforms (Shopify themes, WooCommerce) can't match. See `/insights/headless-commerce-vs-shopify/`.

## ISR (Incremental Static Regeneration)
A Next.js rendering strategy that generates static pages at build time and re-generates them on a schedule (or on-demand) without redeploying. Combines the performance of static site generation with the freshness of server-side rendering.

## JWT (JSON Web Token)
A compact, signed token format for representing claims (authentication, authorization) transferred between parties. Standard in modern SaaS authentication.

## LangChain
An open-source framework for building applications powered by language models. Provides abstractions for prompts, retrieval, memory, tool-use, and multi-step agents.

## LCP (Largest Contentful Paint)
The Core Web Vitals metric measuring when the largest above-the-fold element renders. Target: ≤ 2.5 seconds on mobile.

## LLM (Large Language Model)
A machine-learning model trained on large text corpora to generate, classify, or transform natural language. Examples: GPT-4, Claude, Gemini, Llama.

## Multi-Tenant Architecture
A software architecture where a single application instance serves multiple customers (tenants) with isolation guarantees. Isolation patterns: row-level (shared schema, RLS policies), schema-per-tenant, database-per-tenant. See `/insights/multi-tenant-saas-architecture-patterns/`.

## Next.js
A React framework by Vercel offering file-system routing, server-side rendering, static generation, incremental regeneration, image optimization, and API routes. Nimikh's default frontend framework.

## PDPA 2026 (Bangladesh)
The Personal Data Protection Act 2026 — Bangladesh's first comprehensive data-protection law, introducing consent, residency, breach-notification, and processor-liability rules. See `/insights/pdpa-2026-primer/`.

## PostgreSQL Row-Level Security (RLS)
A PostgreSQL feature that enforces per-row access rules at the database layer, not the application layer. Nimikh's default multi-tenant isolation pattern — even a compromised application query cannot cross tenant boundaries.

## RAG (Retrieval-Augmented Generation)
An AI pattern where a language model, before generating a response, retrieves relevant documents from a knowledge store and grounds its output in that retrieved context. Reduces hallucination and enables source citation.

## RLS
See PostgreSQL Row-Level Security.

## SaaS (Software-as-a-Service)
Software delivered as a hosted service with subscription pricing. Contrast with on-prem license models. Common technical concerns: multi-tenancy, billing, SSO, uptime SLA.

## SAML SSO
Security Assertion Markup Language — an XML-based single sign-on protocol common in enterprise identity providers (Okta, Azure AD, OneLogin). Required for enterprise SaaS sales past a certain deal size.

## ScaleGate
Nimikh's proprietary client-delivery telemetry system. Provides real-time developer commits, sprint capacity, and page-performance tracking through a client portal — eliminating opaque offshore invoicing.

## Schema.org
A collaborative vocabulary for structured data on the web. Publishing Schema.org JSON-LD makes content extractable by Google, Bing, and LLM retrieval systems.

## Sovereign Cloud
Cloud infrastructure with legal residency inside a specific jurisdiction. Required by data-protection laws like PDPA 2026 for certain categories of personal data. Providers: Oracle OCI (Dhaka), AWS Local Zones, sovereign partner clouds.

## SSR (Server-Side Rendering)
Generating HTML on the server for each request, rather than in the client browser. Improves SEO (crawlers see fully-rendered content), initial paint, and social sharing.

## Tailwind CSS
A utility-first CSS framework that composes styles from small classes. Nimikh's default styling engine, integrated with Figma design tokens.

## Vector Database
A database optimized for storing and querying high-dimensional embeddings — the numerical representations used in RAG and semantic search. Examples: Pinecone, Weaviate, pgvector, Qdrant.

---

## Schema for each glossary term

Use `DefinedTerm` schema for each term page and `DefinedTermSet` for the hub. Example for the Headless Commerce page:

```json
{
  "@context": "https://schema.org",
  "@type": "DefinedTerm",
  "@id": "https://nimikh.com/glossary/headless-commerce/#term",
  "name": "Headless Commerce",
  "termCode": "headless-commerce",
  "description": "An e-commerce architecture in which the storefront frontend is decoupled from the commerce backend via APIs.",
  "inDefinedTermSet": "https://nimikh.com/glossary/#set",
  "url": "https://nimikh.com/glossary/headless-commerce/"
}
```
