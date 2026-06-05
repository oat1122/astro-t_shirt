# Core Web Vitals tuning for Astro

Targets (the "good" bucket): **LCP < 2.5s · INP < 200ms · CLS < 0.1**.
Lab-test with PageSpeed Insights; field data comes from CrUX (real users) — the field score is what ranks.

## LCP — Largest Contentful Paint

The LCP element is usually the hero image or the H1. Make it appear fast.

- Hero image via `astro:assets`, **eager + high priority**:
  ```astro
  ---
  import { Image } from 'astro:assets';
  import hero from '@/assets/hero.jpg';
  ---
  <Image src={hero} alt="ทีมงานกำลังสกรีนเสื้อยืดในโรงงาน" width={1200} height={630}
         loading="eager" fetchpriority="high" />
  ```
- Don't lazy-load the LCP image (lazy = it waits → LCP regresses).
- Preconnect to any third-party origin the hero depends on (fonts, CDN).
- Self-host fonts or use `font-display: swap`; subset to the glyphs you use (Thai subsetting matters — full Thai fonts are heavy).
- Keep the critical render path JS-free: the hero is `.astro`, not a React island.

## INP — Interaction to Next Paint (the 2026 decider)

INP is dragged down by long tasks blocking the main thread = too much JS executing. Astro's lever is shipping less JS.

Hydration decision table:

| Situation | Directive |
|---|---|
| Must be interactive instantly (top search bar) | `client:load` |
| Interactive but below the fold | `client:visible` |
| Non-urgent, can wait for idle | `client:idle` |
| Only interactive on large screens | `client:media="(min-width: 768px)"` |
| Not actually interactive | **no directive** — keep it `.astro` (zero JS) |

Rules:
- Never blanket `client:load`. Audit every island: does it *need* JS at all?
- Split heavy islands so only the interactive part hydrates, not a whole section.
- Prefer CSS (`:hover`, `<details>`, `popover`, CSS transitions) over JS for menus/accordions/toggles.
- A fully static `.astro` page has effectively perfect INP — that's the baseline to protect.

## CLS — Cumulative Layout Shift

- **Every** image/video/iframe needs `width` + `height` (or a CSS `aspect-ratio` box). `astro:assets` `<Image>` infers dimensions from imported assets — use imported `src`, not string paths, to keep that.
- Reserve space for anything that loads late: ads, embeds, dynamically-injected banners.
- Don't insert content above existing content after load (e.g. a late cookie bar pushing the page down).
- Use `font-display: swap` + a metric-matched fallback to avoid text reflow when the web font loads.

## astro:assets checklist

- `<Image>` for single images, `<Picture>` when you need art-direction / multiple `formats`.
- Set `formats={['avif','webp']}` for best compression; Astro negotiates per browser.
- Use `quality` to trim bytes (e.g. `quality={70}`) on non-critical images.
- Descriptive, unique `alt` on every meaningful image; `alt=""` only for purely decorative ones.
- Enforce alt at the data layer: require `imageAlt`/`coverAlt` in the Zod content schema so no entry ships without it.

## Quick wins ranked

1. Size + prioritize the hero image (LCP + CLS in one move).
2. Downgrade every non-essential `client:load` to `client:visible`/`client:idle` or remove it.
3. Convert pseudo-interactive React islands to static `.astro` / CSS.
4. Subset and self-host fonts.
5. Lazy-load + dimension every below-the-fold image.
