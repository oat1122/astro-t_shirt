---
name: clean-code
description: "Refactor Astro/TS code for cleanliness and reuse — extract repeated markup into typed .astro components, turn copy-pasted blocks into data-driven lists, design clean Props/slots, and split fat pages into composable sections. Use when a page/component is long, repetitive, or copy-pasted, or when the user asks to clean up, DRY, extract components, or make code reusable."
trigger: /clean
---

# /clean — Clean & Reusable Code (Astro)

Cut duplication and shrink fat files by extracting **typed, composable `.astro` components** and turning repeated markup into **data-driven lists**. The goal is code that reads like the surrounding code, is changed in one place, and stays zero-JS unless it's genuinely interactive.

> **The trap to avoid:** "clean" is not "clever." Don't add abstraction the code doesn't need yet, don't over-parameterize a component with 12 props for one caller, and don't break a working layout to chase DRY. Extract when there's *real* repetition or a *real* section boundary — otherwise leave it. Premature abstraction is harder to undo than copy-paste.

## When to use this skill

- A page/component is long and mixes several distinct sections in one file
- The same markup block is copy-pasted (cards, list items, badges, CTAs)
- A list is hand-written N times instead of `.map()` over data
- Props are untyped, or values are hard-coded that should be inputs
- The user says: "clean up", "refactor", "DRY", "แยก component", "reuse", "code clean"

## How to work a task

1. **Read the whole file first.** Find the seams — where one visual/logical section ends and the next begins. Note any block that appears more than once (even with small differences).
2. **Decide what's a section vs. what's a reusable unit.**
   - *Section* (Hero, Collections, Footer) → one `.astro` per section, composed by the page.
   - *Repeated unit* (a card rendered 3×) → one component + an array of data, rendered with `.map()`.
3. **Design the Props before moving markup.** Type them. Give sensible defaults. Only expose what actually varies between callers — keep the invariant parts inside the component. See `reference/extraction-patterns.md`.
4. **Extract bottom-up:** smallest reusable unit first (`CollectionCard`), then the section that uses it (`Collections`), then slim the page to composition.
5. **Preserve behavior exactly.** Same classes, same DOM, same image paths. A refactor must not change rendered output unless the user asked for a change too. Diff mentally: would the HTML be identical?
6. **Verify.** Run `npx astro check` — 0 errors. Pre-existing warnings/hints unrelated to your change don't count. If unsure visually, build & preview.

## Project conventions (follow these)

This repo's `CLAUDE.md` is authoritative. The refactor must respect it:

- **Path alias:** import internal modules via `@/*` → `src/*`. `import Hero from '@/components/home/Hero.astro'`.
- **Section components live with their page:** `src/components/home/` for the home page, etc. Generic reusable UI goes under `src/components/`; vendored Starwind primitives stay in `src/components/starwind/` (import via the barrel: `import { Button } from '@/components/starwind/button'`).
- **Zero-JS by default.** Extract into `.astro`, never a React island, unless the piece is genuinely interactive (search/filter/form). Don't add `client:*` during a cleanup.
- **Images:** prefer `astro:assets` `<Image>` over raw `<img>` — but **don't silently swap it during a pure refactor**. If the source used `<img>`, keep it and *mention* the upgrade as a follow-up, so behavior stays identical. Only convert when the user opts in.
- **Thai UI text & comments** — keep them Thai, matching the codebase.
- **Prices** are THB via `.toLocaleString('th-TH')` — don't reinvent formatting.

## Core moves

Each links to copy-paste detail in `reference/extraction-patterns.md`.

### 1. Extract a section into its own `.astro`
The biggest readability win. A 130-line `index.astro` with Hero + Collections inline becomes:
```astro
<main class="...">
  <Hero />
  <Collections />
</main>
```
Each section file owns its own markup and its own imports. The page becomes a table of contents.

### 2. Collapse copy-paste into a component + data
Three near-identical cards → one `CollectionCard.astro` with typed Props, driven by an array:
```astro
---
const collections = [
  { title: "Men's",  image: "...", alt: "Men's Collection" },
  { title: "Girl's", image: "...", alt: "Girl's Collection" },
];
---
{collections.map((c) => <CollectionCard {...c} />)}
```
Adding a card is now one array entry, not a copy-pasted block. Spread props with `{...c}` when keys match.

### 3. Design lean, typed Props
- `interface Props { ... }` with defaults via destructuring: `const { subtitle = 'Collection' } = Astro.props;`
- Expose only what varies. A `flex?: boolean` toggle beats duplicating the card just to add one class.
- Use `class:list={[...]}` for conditional classes instead of string concatenation.

### 4. Use `<slot />` for structural wrappers
When a component wraps *arbitrary* children (a layout shell, a card frame), take a `<slot />` instead of a `content` prop. Named slots (`<slot name="actions" />`) for multiple insertion points. Props for data; slots for markup.

### 5. Hoist shared constants, don't re-declare
Repeated SVG icons, class strings, or magic values → a local `const`, a small `Icon.astro`, or `src/consts.ts` if site-wide. Don't paste the same 200-char SVG five times.

## What "clean" means here

- **One reason to change.** Editing a card's look touches one file, not three.
- **Reads like the neighbors.** Match existing naming, comment density, and idiom — don't import a foreign style.
- **No dead abstraction.** Every prop has ≥1 caller that uses it differently. Every component has ≥1 real reuse or is a genuine section boundary.
- **Smaller surface, same output.** Fewer lines, identical rendered HTML.

## Priority recipe

1. Split the fat page into section components → instant readability.
2. Collapse the worst copy-paste into one component + data array.
3. Tighten Props (types, defaults, `class:list`) and hoist shared constants.
4. `npx astro check` → 0 errors. Stop when the remaining "duplication" is coincidental, not real.

## Reference files

- `reference/extraction-patterns.md` — copy-paste patterns: section extraction, component + data list, typed Props with defaults, `class:list`, slots vs props, shared constants/icons.
- `reference/checklist.md` — run before/after a refactor to confirm it's cleaner *and* behavior-preserving.
