# Astro SEO audit checklist

Run top-to-bottom before/after changes. Each item is a yes/no — fix every "no" before moving on.
Order = impact. Don't polish structured data while the hero image is unsized.

## 0. Config / foundations (breaks everything if wrong)
- [ ] `SITE_URL` / `site` in `astro.config.mjs` is the **real domain**, not `https://example.com`.
      (It drives sitemap, robots, RSS, and every canonical — a placeholder silently breaks all four.)
- [ ] `@astrojs/sitemap` installed and emitting `/sitemap-index.xml`.
- [ ] `robots.txt` exists, allows crawling, and points to the sitemap.
- [ ] Canonical URL on every page (derived from `Astro.site`).
- [ ] `hreflang` present if the site serves more than one language.
- [ ] `<html lang>` set correctly (e.g. `th`).

## 1. Performance / Core Web Vitals
- [ ] Hero / LCP image: `astro:assets` + `width`/`height` + `loading="eager"` + `fetchpriority="high"`.
- [ ] All other images: `astro:assets`, lazy (default), with dimensions → no CLS.
- [ ] No raw `<img>` anywhere (use `<Image>`/`<Picture>`).
- [ ] No blanket `client:load` — each island uses the lightest directive that works.
- [ ] Pseudo-interactive components are static `.astro` / CSS, not React islands.
- [ ] Fonts self-hosted/subset with `font-display: swap`.
- [ ] PageSpeed Insights: LCP < 2.5s, INP < 200ms, CLS < 0.1 (field data if available).

## 2. Meta / centralized SEO
- [ ] All SEO routed through one `<SEO>`/`Layout` component — no ad-hoc `<meta>`/`<head>` tags.
- [ ] Every page has a unique `title` and `description`.
- [ ] H1 is not the exact-match target keyword alone — keyword + a few extra words (avoid header over-optimization).
- [ ] Content Collections enforce required meta via Zod (title, description, image alt) — nothing ships incomplete.
- [ ] Open Graph + Twitter card tags present; OG image is an absolute URL and the file actually exists.
- [ ] `noindex` correctly applied to thank-you/cart/admin/utility pages only.

## 3. Structured data (JSON-LD)
- [ ] JSON-LD rendered in **static HTML** (view source / built output), not injected by client JS.
- [ ] `Organization` (or `LocalBusiness` with address/phone/hours) site-wide.
- [ ] `Product` + `BreadcrumbList` on product pages.
- [ ] `FAQPage` on the FAQ page, built from the same array as the visible accordion.
- [ ] `Article` on blog posts (with `datePublished`/`dateModified`).
- [ ] **No schema drift** — every value in JSON-LD is also visible on the page.
- [ ] Passes Google Rich Results Test.

## 4. Content architecture & GEO
- [ ] Content organized into topic clusters: pillar page ↔ sub-articles, linked both ways.
- [ ] Internal links are intentional and descriptive (real anchor text, not "click here").
- [ ] Key pages answer-first (direct answer in the first paragraph).
- [ ] The page's target keyword phrase appears in the body content (not only in the H1/meta).
- [ ] FAQ has real depth (15–30 Q&A) for both rich results and AI Overviews.
- [ ] `llms.txt` published (Astro integration) if AI-search visibility is a goal.
- [ ] Content has genuine topical depth — written for users, not keyword density.
- [ ] No orphan pages (every important page is reachable via internal links + sitemap).

## 5. Verify (don't trust, check)
- [ ] `npm run build && npm run preview`, view *source* of key pages — meta + JSON-LD present in static HTML.
- [ ] `npx astro check` passes (types, including SEO/content props).
- [ ] Crawl with a tool (Screaming Frog / Sitebulb) or Search Console URL Inspection — confirm indexable, canonical correct, no soft-404s.
