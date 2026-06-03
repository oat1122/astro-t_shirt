# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `npm run dev` — start dev server (Astro)
- `npm run build` — production build to `dist/` (runs `astro check` types via `@astrojs/check` is separate; build itself is `astro build`)
- `npm run preview` — serve the built `dist/` locally
- `npx astro check` — type-check `.astro`/`.ts` (uses `astro/tsconfigs/strict`)

Requires Node `>=22.12.0`. There is no test runner or linter configured.

## Architecture

Static-first (`output: 'static'`, SSG) Astro 6 storefront for a T-shirt shop. UI text and code comments are in Thai. React is configured as an island integration but should be used **only** for genuinely interactive bits (search/filter/form) — keep everything else as zero-JS `.astro`.

### Content Layer is the data source
All product and blog data lives in `src/content/` as `.md`/`.mdx`, loaded via the Content Layer API (`glob` loader) and validated by Zod schemas in `src/content.config.ts`. There is no database or API.
- `products` collection: includes `price` (THB), `image()` (astro:assets), `sizes` enum, `colors`, `featured`, `inStock`, etc.
- `blog` collection: `draft` flag filters items out of RSS and listings.
- Pages are generated from collections via `getStaticPaths()` (see `src/pages/products/[...slug].astro` and `blog/[...slug].astro`). Adding content = adding a file; no code changes needed.

### SEO is centralized — route SEO through the layout, not ad-hoc tags
`Layout.astro` is the only HTML shell and renders `SEO.astro`, which wraps `astro-seo` and emits JSON-LD. Pass `title`, `description`, `image`, `type`, `noindex`, and `jsonLd` as `Layout` props rather than writing `<meta>`/`<head>` tags directly. Per-page structured data (e.g. `Product`, `Article`) is passed via the `jsonLd` prop; otherwise default `Organization` + `WebSite` JSON-LD is emitted. Canonical and OG image URLs are derived from `Astro.site`.

Site-wide constants (name, locale `th_TH`, social, default OG image) live in `src/consts.ts` (`SITE`). RSS (`src/pages/rss.xml.ts`), sitemap, and robots.txt are all driven from this + `astro.config.mjs`. **`SITE_URL` in `astro.config.mjs` is still `https://example.com`** — it must be changed to the real domain; it controls sitemap, robots, RSS, and canonical URLs.

### UI components: Starwind UI (vendored, not a dependency)
Components under `src/components/starwind/` (`button`, `card`, `badge`, `input`) are generated/managed by the Starwind CLI per `starwind.config.json` — they are source you can edit, each with a `Component.astro`, `variants.ts` (tailwind-variants), and `index.ts` barrel. Import via the barrel: `import { Button } from '@/components/starwind/button'`. Note `starwind.config.json` points `utilsDir` at `src/lib/utils`, which does not exist yet — create it if a Starwind component needs the `cn` helper.

### Styling
Tailwind v4 via the Vite plugin (no `tailwind.config.js`; config is CSS-first). Single entry `src/styles/global.css` → imports `src/styles/starwind.css` (Tailwind + Starwind theme tokens for light/dark + base layer). Theme tokens like `bg-background`, `text-foreground`, `text-muted-foreground`, `text-primary`, `border-border` come from Starwind.

### Conventions
- Path alias `@/*` → `src/*` (tsconfig); use it for all internal imports.
- Prices are THB, formatted with `.toLocaleString('th-TH')`.
- Images: always use `astro:assets` `<Image>` / the `image()` schema helper, not raw `<img>` (LCP/SEO matters here).
