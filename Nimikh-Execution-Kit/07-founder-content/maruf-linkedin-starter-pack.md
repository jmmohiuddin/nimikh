# Maruf Shezad — LinkedIn Starter Pack (10 posts)

Cadence: Publish Thursdays. Cross-post best-performing to Nimikh Company Page and Dribbble/Behance.

Voice: Considered, craft-focused, mildly opinionated on typography and design systems. Less quantitative than Mohiuddin, more visual. Ships posts with an image or short clip whenever possible.

---

## Post 1 — Founding thesis (design edition)
> Design systems fail when they live in Figma.
>
> Every design token I ship at Nimikh compiles into Tailwind CSS variables via an automated Git script. When I change a color, engineering sees a PR — reviewed, tested by Chromatic, merged, deployed.
>
> The design file and the production site can't drift because they read the same JSON.
>
> That's not fancy. That's the minimum bar for a design system to matter.

## Post 2 — Typography opinion
> Inter Variable at weight 510 sits exactly between Regular and Semibold — and it's the correct weight for large structural headings on dark backgrounds.
>
> Semibold clips on Retina. Regular loses hierarchy. Weight 510 does neither.
>
> Small choice. Compounds across a product.

## Post 3 — On dark-first design
> Dark-first design is not a Vercel copycat.
>
> It's the correct default for:
> - Developer-audience products.
> - High-contrast information density.
> - Products used in low-ambient-light settings (evening reading, coding).
>
> It is the wrong default for consumer e-commerce, healthcare, and children's education.
>
> Pick your palette from the use case, not from what's on Dribbble this week.

## Post 4 — Design tokens explainer (short)
> Here's the shortest useful explanation of design tokens:
>
> Instead of `color: #5e6ad2`, you write `color: var(--interactive-action)`.
>
> Now:
> - You can retheme the whole product by changing one JSON file.
> - Designers and engineers reference the same variable.
> - Dark mode is a variable swap, not a rebuild.
>
> That's it. The rest is tooling.

## Post 5 — Cognitive load in UX
> Every UI decision has a cognitive cost.
>
> - New icon: cost.
> - New color: cost.
> - New interaction pattern: cost.
> - New spacing rule: cost.
>
> The best design systems reduce that cost by making 80% of choices default.
>
> Then designers spend attention on the 20% that actually differentiates.

## Post 6 — On premium typography
> Premium typography is a signal.
>
> Berkeley Mono in code snippets. Inter Variable for UI. Custom OpenType features (cv01, ss03) for character.
>
> The user doesn't consciously notice. They subconsciously trust the interface more.
>
> That trust converts.

## Post 7 — Common design-system mistake
> The most common design-system mistake I see:
>
> Teams build a component library, ship it to Figma, and consider it done.
>
> A design system is not a component library. It's:
> - Tokens.
> - Components.
> - Documentation.
> - Governance.
> - Enforcement in code.
>
> Skip one and it degrades within six months.

## Post 8 — On mouse-tracking spotlight bento
> A visual technique I've been shipping this year: mouse-tracking spotlight bento layouts.
>
> Radial gradient follows the cursor across a grid of cards. Subtle. Depth without dark UI trickery.
>
> Works because it's peripherally-perceived motion — the eye registers presence without the brain deciding to look.
>
> Best for hero sections and developer docs. Wrong for e-commerce PDPs (competes with product imagery).

## Post 9 — On Chromatic
> If your design system doesn't run Chromatic (or an equivalent visual-regression tool) on every PR, you don't have a design system.
>
> You have a component library and hope.

## Post 10 — What we're hiring for (once you are)
> Nimikh is looking for a Senior Product Designer who:
>
> - Ships design tokens, not just Figma files.
> - Has opinions about typography.
> - Reads a Storybook config file without breaking a sweat.
> - Wants clients globally.
>
> Dhaka HQ, remote OK.
>
> DM me.

---

## Templates for ongoing posts

### Design breakdown (share an image + this format)
> [Design principle]. Example: [screenshot].
>
> Three things that make this work:
> 1. […]
> 2. […]
> 3. […]

### Behind-the-scenes ship
> Just shipped: [feature].
>
> The design decision I'm most proud of: [decision].
>
> The design decision I'm least sure about: [decision + open question].

### Design pattern take
> Everyone's shipping [pattern]. Here's when it works and when it doesn't.
