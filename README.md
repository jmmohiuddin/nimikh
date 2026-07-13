# Nimikh

Digital growth agency website — software development, growth marketing, and a creator marketplace connecting small businesses with affordable local creative talent. Based in Dhaka, Bangladesh.

🌐 **Live:** [nimikh.tech](https://nimikh.tech) · [nimikh.vercel.app](https://nimikh.vercel.app)

## Overview

A fast, fully-responsive static website with a dark, developer-focused design system inspired by Stripe, Vercel, and Linear.

## Pages

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

## Tech

- Plain HTML, CSS, and vanilla JavaScript — no build step
- Design tokens as CSS custom properties (`css/styles.css`)
- Scroll animations, accordions, filters, and counters (`js/main.js`)
- Deployed on [Vercel](https://vercel.com) with clean URLs (`vercel.json`)

## Local development

Serve over HTTP (CSS/fonts don't load correctly from `file://`):

```bash
python3 -m http.server 3456
# then open http://localhost:3456
```

## Deployment

Pushes to `main` auto-deploy via Vercel.

---

© 2026 Nimikh. All rights reserved.
