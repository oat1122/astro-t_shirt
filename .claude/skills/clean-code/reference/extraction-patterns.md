# Extraction patterns (Astro)

Copy-paste recipes for cleaning up and reusing `.astro` code. Each pattern shows the *before* smell and the *after* shape. Keep rendered HTML identical unless the user asked for a change.

---

## 1. Section extraction — fat page → composed sections

**Smell:** one page file holds several distinct sections inline (Hero + Collections + Footer), hundreds of lines, hard to scan.

**Before** — everything in `index.astro`:
```astro
---
import Layout from '@/layouts/Layout.astro';
---
<Layout>
  <main>
    <div class="grid ..."> ...80 lines of hero... </div>
    <div class="grid ..."> ...50 lines of cards... </div>
  </main>
</Layout>
```

**After** — one `.astro` per section under `src/components/<page>/`:
```astro
---
import Layout from '@/layouts/Layout.astro';
import Hero from '@/components/home/Hero.astro';
import Collections from '@/components/home/Collections.astro';
---
<Layout>
  <main class="...">
    <Hero />
    <Collections />
  </main>
</Layout>
```

Rules:
- The page keeps the **shell** (Layout, `<main>` wrapper, page-level padding). Sections own their inner markup.
- Each section file imports its own deps. Don't thread imports through the page.
- Name by role (`Hero`, `Collections`, `Footer`), not by position (`Section1`).
- Put page-specific sections in `src/components/<page>/`; truly generic ones in `src/components/`.

---

## 2. Component + data list — kill the copy-paste

**Smell:** the same markup block pasted N times with only text/image differing.

**Before** — 3 hand-written cards:
```astro
<div class="card ...">...Men's...</div>
<div class="card ...">...Girl's...</div>
<div class="card ...">...Kid's...</div>
```

**After** — one component, an array, `.map()`:
```astro
---
import CollectionCard from './CollectionCard.astro';
const collections = [
  { title: "Men's",  image: "/images/home/men's%20collection.png",  alt: "Men's Collection" },
  { title: "Girl's", image: "/images/home/girl's%20collection.png", alt: "Girl's Collection" },
  { title: "Kid's",  image: "/images/home/kid's%20collection.png",  alt: "Kid's Collection" },
];
---
{collections.map((c) => <CollectionCard {...c} />)}
```

- `{...c}` spreads matching keys onto props — no manual prop wiring.
- Adding/removing an item = editing the array, never the markup.
- When one item is special (e.g. last card sits next to a button), `slice` it out rather than duplicating the whole block:
  ```astro
  const featured = collections.slice(0, -1);
  const last = collections[collections.length - 1];
  ```

---

## 3. Typed Props with defaults

Type every component's inputs. Expose only what varies; bake the invariant parts in.

```astro
---
interface Props {
  title: string;                 // required
  subtitle?: string;             // optional + default below
  description?: string;
  image: string;
  alt: string;
  flex?: boolean;                // behavior toggle, not a duplicated component
}

const {
  title,
  subtitle = 'Collection',
  description = 'The Essence of Modern\nSophistication',
  image,
  alt,
  flex = false,
} = Astro.props;
---
```

- Defaults live in the destructure, not scattered `??` checks in markup.
- A boolean/enum prop (`flex`, `variant`) beats forking the component to change one class.
- If a prop has no caller that sets it differently, delete it — it's dead surface.

---

## 4. Conditional classes — `class:list`

**Smell:** template-string class concatenation, ternaries inside `class="..."`.

```astro
<div
  class:list={[
    'card base classes here',
    flex && 'flex-1',
    active ? 'ring-2' : 'opacity-80',
  ]}
>
```
`class:list` flattens arrays, drops falsy entries, and dedupes — cleaner than `` class={`a ${flex ? 'flex-1' : ''}`} ``.

---

## 5. Slots vs props — markup vs data

- **Data in → props.** Strings, numbers, image paths, flags.
- **Arbitrary markup in → `<slot />`.** A wrapper/shell that frames whatever children the caller passes.

```astro
---
// Card.astro — a frame, not a fixed card
interface Props { padded?: boolean }
const { padded = true } = Astro.props;
---
<div class:list={['rounded-3xl border', padded && 'p-4']}>
  <slot />
</div>
```

Multiple insertion points → **named slots**:
```astro
<article>
  <slot name="media" />
  <div class="body"><slot /></div>
  <slot name="actions" />
</article>
```
Caller: `<Card><img slot="media" .../> ... <Button slot="actions">Buy</Button></Card>`

Don't pass big HTML strings through a prop — that's what slots are for.

---

## 6. Hoist shared constants & icons

**Smell:** the same 200-char inline SVG or magic class string pasted many times.

- Repeated icon → a tiny `Icon.astro` (or a `src/components/icons/ArrowUpRight.astro`) taking `size`/`class`.
  ```astro
  ---
  interface Props { size?: number; class?: string }
  const { size = 20, class: klass } = Astro.props;
  ---
  <svg width={size} height={size} viewBox="0 0 24 24" class={klass} ...>
    <path d="M7 17 17 7"/><path d="M7 7h10v10"/>
  </svg>
  ```
  Note `class` is reserved — destructure as `class: klass`.
- Site-wide values (name, locale, social) belong in `src/consts.ts` (`SITE`), already established here — reuse it, don't re-declare.
- Local-only repetition → a `const` in frontmatter is enough; don't over-engineer a module.

---

## Anti-patterns (don't)

- **Over-extraction:** a component used once, with no section boundary, just adds indirection. Inline it.
- **Prop explosion:** 10+ props to cover every caller → the component is doing too much; split it or use slots.
- **Behavior drift during refactor:** swapping `<img>`→`<Image>`, changing classes, or "while I'm here" tweaks. Keep the refactor pure; propose changes separately.
- **Breaking the alias:** relative `../../components/...` instead of `@/components/...`.
- **React island for static markup:** never add `client:*` to make an extracted section "work" — `.astro` renders fine with zero JS.
