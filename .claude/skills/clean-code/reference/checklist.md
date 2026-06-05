# Clean / reuse refactor checklist

Run top-to-bottom before and after a refactor. Each item is yes/no — a refactor isn't done until every "no" is fixed or consciously deferred. Order = impact + safety. The cardinal rule: **cleaner code, identical behavior.**

## 0. Scope (decide before touching anything)
- [ ] Read the whole file/section — section seams and repeated blocks identified.
- [ ] Real duplication, not coincidental similarity? (Two blocks that look alike but evolve independently should stay separate.)
- [ ] The user asked to clean up only — no feature/behavior change is bundled in by mistake.

## 1. Structure
- [ ] Fat page split into section components (`Hero`, `Collections`, …); page is now mostly composition.
- [ ] Page keeps the shell (Layout, `<main>`, page padding); sections own their inner markup.
- [ ] Copy-pasted blocks collapsed into one component + a data array rendered with `.map()`.
- [ ] Special-case items handled via `slice`/data, not a duplicated block.
- [ ] No component extracted that has only one caller *and* isn't a section boundary (no needless indirection).

## 2. Props & API
- [ ] Every component has a typed `interface Props`.
- [ ] Defaults live in the destructure (`const { x = ... } = Astro.props`), not ad-hoc in markup.
- [ ] Only varying values are props; invariant markup is baked in.
- [ ] No dead props — each is set differently by ≥1 caller.
- [ ] Conditional classes use `class:list`, not string concatenation.
- [ ] Arbitrary child markup uses `<slot />` (named slots for multiple points), not HTML-through-a-prop.
- [ ] `class` prop destructured as `class: klass` where needed (reserved word).

## 3. Project conventions
- [ ] Internal imports use the `@/*` alias, not relative `../../`.
- [ ] Section components placed under `src/components/<page>/`; Starwind primitives imported via their barrel.
- [ ] Extracted pieces are `.astro` (zero-JS) — no `client:*` added during cleanup.
- [ ] `<img>` left as-is if the source used it (upgrade to `astro:assets` only if the user opted in — and then it's a separate, intentional change).
- [ ] Thai UI text and comments preserved; THB price formatting (`.toLocaleString('th-TH')`) untouched.
- [ ] Shared SVGs/constants hoisted (local `const`, `Icon.astro`, or `src/consts.ts`) — not pasted repeatedly.

## 4. Behavior preservation (the safety net)
- [ ] Same classes, same DOM nesting, same image paths/URLs as before.
- [ ] Rendered HTML would be byte-identical (mentally diff the output) — unless a change was explicitly requested.
- [ ] No props accidentally renamed/dropped that a caller relied on.

## 5. Verify (don't trust, check)
- [ ] `npx astro check` → 0 errors. Pre-existing warnings/hints unrelated to the change are noted, not "fixed" blindly.
- [ ] If layout-sensitive, `npm run dev`/`build` + eyeball the page — looks identical to before.
- [ ] Result is genuinely shorter/clearer: fewer lines, one place to change each thing, reads like its neighbors.
