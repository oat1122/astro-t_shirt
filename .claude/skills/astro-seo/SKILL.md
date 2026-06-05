---
name: astro-seo
description: "Technical SEO for Astro sites in 2026 — Core Web Vitals (INP/LCP/CLS), astro:assets image optimization, hydration directives, static JSON-LD structured data, centralized SEO component, and GEO/AI-Overviews readiness. Use when adding/auditing SEO, writing meta tags, structured data, sitemaps, or optimizing page speed/ranking on an Astro project."
trigger: /seo
---

# /seo — Astro SEO (2026)

Make an Astro site rank by playing to its structural strengths: ship static HTML, hydrate only the interactive islands, render structured data at build time so crawlers always see it.

> **The trap to avoid:** Astro makes a site *fast* almost for free. It does **not** make it *trustworthy*. A page can score 100/100 on Lighthouse and still rank badly if the content architecture is weak, internal linking is messy, or the topic has no depth. Green Lighthouse ≠ good SEO. Treat speed as the floor, not the goal.

## When to use this skill

- Adding or auditing SEO on any `.astro` page/component
- Writing/centralizing meta tags, Open Graph, canonical, or JSON-LD
- Optimizing Core Web Vitals (INP, LCP, CLS) or image delivery
- Setting up sitemap, robots.txt, RSS, `hreflang`, or `llms.txt`
- Making content discoverable by AI search (AI Overviews / GEO)

## How to work a task

1. **Identify the layer.** Performance (CWV)? Discoverability (structured data, sitemap)? Or content/architecture (clusters, internal links)? Most "improve SEO" requests touch all three — surface that.
2. **Audit before editing.** Run the audit in `reference/audit-checklist.md` against the page/site so the work is targeted, not guesswork.
3. **Apply by impact order** (see below). Don't add a `Product` schema to a page whose hero image is an unsized 800 KB PNG — fix the bleeding first.
4. **Verify.** Check rendered HTML (not the dev React tree) actually contains the JSON-LD and meta. Validate schema mentally against `reference/json-ld.md`; for live validation point the user to Google's Rich Results Test and `PageSpeed Insights`.

## Why Astro has the structural edge

- **Islands architecture** — the page is static HTML; React hydrates only on interactive islands. The browser isn't fighting a large JS payload before first paint → faster load, better CWV.
- **Structured data is real HTML.** JSON-LD is rendered into static HTML at build, not injected by client JS. Crawlers and AI bots always see it — unlike SPAs where JSON-LD can arrive after the bot has left. This is Astro's most underrated SEO advantage. Protect it: never move structured data into a `client:*` component.

## Impact-ordered techniques

Apply in this order. Each links to a reference file for copy-paste detail.

### 1. Images — `astro:assets` (biggest lever for LCP + CLS)
- Use `<Image />` / `<Picture />`, never raw `<img>`. Astro emits WebP/AVIF + lazy-loads automatically.
- **Always set `width`/`height`** (or `aspect-ratio`) to reserve space → prevents CLS.
- Hero / LCP image only: `loading="eager"` + `fetchpriority="high"`. Everything else stays lazy (the default).
- Meaningful file names + **real, unique `alt`**. Duplicated boilerplate alt text is wasted — describe the actual image. Enforce `alt` via the content schema (`imageAlt` is already required for products here).
- Detail: `reference/core-web-vitals.md`.

### 2. Hydration directives — the direct INP control
This is what protects the INP score. Use the lightest directive that works:
- `client:visible` — hydrate when scrolled into view. Default choice for anything below the fold.
- `client:idle` — wait until the browser is idle. Good for non-urgent widgets.
- `client:load` — only for things that must be interactive immediately (e.g. a top nav search bar).
- **Never blanket `client:load`** — it throws away Astro's whole advantage and tanks INP.
- Prefer zero-JS `.astro` over a React island whenever the thing isn't genuinely interactive.

### 3. Structured data (JSON-LD) — what Google rewards
Embed JSON-LD directly in `.astro` so it renders static. Route it through the SEO component's `jsonLd` prop, not ad-hoc `<script>` tags. For a t-shirt/print shop, prioritize:
- `Organization` / `LocalBusiness` (address, phone, opening hours → local SEO + map pack)
- `FAQPage` — if an FAQ page exists, this is low-effort rich-result gold
- `Product` + `BreadcrumbList` on product pages
- `Article` on blog posts
- **Guard against schema drift:** structured data must match what's visibly on the page. Claiming a price/rating/answer in JSON-LD that isn't on the page risks a manual penalty.
- Copy-paste builders: `reference/json-ld.md`.

### 4. Centralized SEO component + schema-enforced meta
One `<SEO>` component takes `title`, `description`, `canonical`, `image`, `type`, `jsonLd`, `noindex`. Validate frontmatter with **Zod in Content Collections** so every article/product is forced to have complete meta — it can't ship with a missing description.
- This repo already has `src/components/SEO.astro` (wraps `astro-seo` + JSON-LD) and `src/layouts/Layout.astro` routing it. Extend those; don't write `<meta>`/`<head>` tags ad-hoc.

### 5. Foundations (don't skip)
- `@astrojs/sitemap` + a real `robots.txt`
- Canonical on every page (derived from `Astro.site`)
- `hreflang` if running TH/EN
- CDN (Cloudflare/Vercel) for edge caching
- **Set the real domain.** `SITE_URL` in `astro.config.mjs` drives sitemap, robots, RSS, and canonicals — a placeholder there silently breaks all of them.

## What Google rewards most in 2026

**INP is the decider.** INP replaced FID; it measures responsiveness to *every* interaction. Good < 200 ms; > 500 ms is poor and a confirmed negative ranking factor — it means the main thread is blocked by heavy JS. Partial hydration cuts main-thread execution directly, which is exactly why Astro fits this era.

Targets to memorize: **LCP < 2.5s · INP < 200ms · CLS < 0.1**.

**AI Overviews / GEO is the new surface.** AI search leans on sites that are well-structured, fast, and accessible to build accurate summaries. To get cited:
- **Answer-first** writing — answer the question directly in the first paragraph.
- A real **FAQ section** (aim for 15–30 questions) feeding structured Q&A that AI can lift.
- Ship **`llms.txt`** (Astro has integrations for it).
- Cite credible sources, use clear headings, include stats/data, write in natural conversational language.

**Depth beats keywords.** There's no magic keyword density — modern algorithms understand context and synonyms. Optimize for topical coverage and write for the user. Build **topic clusters**: a pillar page ("ผลิตเสื้อยืด") linking out to sub-articles (fabric types, screen-printing techniques) that link back — this builds topical authority. Strong internal linking + depth > scattered keywords.

## Priority recipe for a real build

1. Image optimization + disciplined hydration → CWV for nearly free
2. Complete JSON-LD (LocalBusiness + FAQPage first)
3. Genuinely deep content organized as clusters

## Reference files

- `reference/json-ld.md` — copy-paste JSON-LD builders (Organization, LocalBusiness, Product, FAQPage, BreadcrumbList, Article, WebSite) tuned for an Astro `jsonLd` prop.
- `reference/core-web-vitals.md` — concrete LCP/INP/CLS tuning, `astro:assets` patterns, hydration decision table.
- `reference/audit-checklist.md` — run this before/after changes to find what's actually broken.
