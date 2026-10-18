# Scroll journey hero — preview build

The cinematic hero lives on an isolated route. **The homepage is untouched.**

```bash
npm run dev
# http://localhost:3000/preview/hero
```

---

## What was found before building

The project was a bare `create-next-app` (Next.js 16.4.2, React 19, Tailwind v4): no
existing hero, nav, logo file, menu or order flow to preserve or reuse. So nothing
was overwritten — everything below is new, apart from two additive edits called out
in the table.

---

## Files added and changed

| File | Change |
| --- | --- |
| `src/app/preview/hero/page.tsx` | **new** — isolated preview route, noindex, with placeholder menu/story/footer sections below the hero |
| `src/components/hungry-wrap/ScrollJourneyHero.tsx` | **new** — pin + master timeline, `gsap.matchMedia` branches, scene state, seek handler |
| `src/components/hungry-wrap/LayeredFoodStage.tsx` | **new** — background washes, sprites, wrap stack, image error handling |
| `src/components/hungry-wrap/KineticText.tsx` | **new** — the five headlines, word-split for staggering |
| `src/components/hungry-wrap/SceneProgress.tsx` | **new** — accessible progress rail with seek buttons |
| `src/components/hungry-wrap/HeroHeader.tsx` | **new** — fixed brand bar, usable while the stage is pinned |
| `src/components/hungry-wrap/scenes.ts` | **new** — scene and sprite data (positions as % of the stage) |
| `public/assets/hungry-wrap/*.png` | **new** — 11 cleaned sprites generated from the kit |
| `scripts/clean-kit-assets.py` | **new** — reproducible asset cleanup |
| `scripts/remove-wrapper-mark.py` | **new** — removes the fake brand mark on the packaged wrap |
| `src/app/globals.css` | **changed, additive** — brand palette, `--hero-*` custom properties, reduced-motion rule, scroll-hint keyframes |
| `src/app/layout.tsx` | **changed, additive** — adds the Anton display font variable. Nothing else in the layout was touched |
| `package.json` | **changed** — adds `gsap@3.15.0` |

Nothing in `The_Hungry_Wrap_2_5D_Animation_Kit/` was modified; it is read-only source.

---

## Assets: what shipped, and what still has to be replaced

The PNGs in the kit are **not production assets**. They are screenshot crops of a
contact sheet — the transparency checkerboard, the cell borders and the file-name
captions are all baked in as opaque pixels, and `tortilla`, `finished_wrap`,
`packaged_wrap` and `wood_board` arrived with effectively **no alpha channel at all**
(0.0–0.1 % transparent). `floating_leaves.png` also contained a slab of the
neighbouring background swatch, and `particles.png` contained fragments of two
neighbouring cells.

`scripts/clean-kit-assets.py` keys the background out, deletes the caption lettering
and frame lines, despills the edges and autocrops. That is enough to review the
motion. It cannot invent resolution.

**Still needed before this goes live:**

| Asset | Problem | Needed |
| --- | --- | --- |
| `finished_wrap.png` | 601 × 473 after cropping; soft, upscaled, visible compression. It is the hero image and is displayed up to ~1.25× of a 34 rem box | Clean-alpha hero shot, ≥ 2400 px wide |
| `packaged_wrap.png` | Carried a garbled AI-generated logo on the wrapper, now smudged out by `remove-wrapper-mark.py`; the paper reads as blank | Real packaging shot with the actual branded wrapper, ≥ 1800 px |
| `tortilla.png` | Flat, low-resolution disc; reads as a pale circle at stage size | Clean tortilla on transparent background, matched lighting/perspective, ≥ 1600 px |
| `lettuce`, `tomato`, `onion`, `grilled_chicken`, `sauce`, `herbs`, `spices` | ~400 px, soft edges, keying residue | Individually shot cutouts, ≥ 1200 px each, same light direction as the hero wrap |
| `floating_leaves.png` | Salvaged from a cell that bled into its neighbour; one leaf is clipped | Reshoot, or drop the layer |
| `logo` | `original_logo_reference.png` is a 840 × 256 screenshot crop with an opaque cream background, clipped on the right | **The original vector/clean logo file from the client** |
| `particles.png`, `wood_board.png`, `background_cream.png` | Not used — contained neighbouring-cell bleed, baked checkerboard, or were better as CSS | — |

Until the real logo arrives, the wordmark in `HeroHeader.tsx` is live text plus a
small SVG glyph. That is also better for accessibility and sharpness; swap in an
`<Image>` when the file is supplied (one component, clearly marked).

**No invented claims.** No prices, ratings, delivery times, customer counts or
dish names appear anywhere. The placeholder sections say plainly that they are
awaiting real content.

---

## How the animation is put together

One `<section>` 280 svh tall on phones, 420 svh on tablets, 500 svh on desktop, is the
ScrollTrigger. The 100 svh stage inside it is pinned (`pin`, `scrub: 1`,
`anticipatePin: 1`, `invalidateOnRefresh: true`, `pinSpacing: false`) for the whole
section, and a single master timeline — written in units of 100, so the numbers read
as percentages of the journey — drives every layer.

| Progress | Scene | What happens |
| --- | --- | --- |
| 0.00–0.17 | Intro | Espresso stage, headline reveals, wrap scales 0.7 → 1, scroll hint |
| 0.17–0.38 | Ingredients | Stage turns cream, layers separate outward on staggered organic eases |
| 0.38–0.62 | Build | Tortilla appears, layers curve back inward and are absorbed, tortilla cross-fades into the finished wrap |
| 0.62–0.82 | Flavour | SVG wave sweeps up, orange wash fills, wrap scales to 1.25 and rotates, sauce and spices return in parallax |
| 0.82–1.00 | Order | Finished wrap cross-fades to the packaged one, CTAs appear, the stage hands back to cream and unpins into the menu section |

Implementation notes worth knowing:

- Positions in `scenes.ts` are percentages of the stage, resolved through
  function-based tween values, so `invalidateOnRefresh` recomputes them on resize.
- Curved inward paths come from running `x` and `y` on different eases rather than
  pulling in MotionPathPlugin.
- Only `transform` and `opacity`/`visibility` animate. No React state changes per
  frame — `onUpdate` only calls `setState` when the scene index actually changes.
- Theme colours are registered CSS custom properties (`@property`) on the document
  root, so the fixed header re-themes with the stage as it travels dark → cream →
  orange → cream.
- The giant type sits at `z-30`; the wrap and the near-camera ingredients sit above
  it, so food crosses the headlines deliberately while the copy stays readable.

### Responsive and accessibility

- **Phones** run five sprites (the `core` tier), six specks, a shorter 280 svh pin,
  a smaller travel radius and their own headline placement; the nav wraps onto a
  second row rather than hiding behind a menu button.
- **`prefers-reduced-motion: reduce`** gets no pin and no scrub at all: the section
  collapses to a single screen with one still composition, the headline, the
  ingredients and both CTAs visible.
- The progress rail is a list of real buttons that scroll to their scene, with
  `aria-current` and a polite live region.
- The CTAs animate with `autoAlpha`, so they are `visibility: hidden` — and
  therefore unfocusable — until they are on screen.
- The stage uses `100svh`, not `100dvh`. `dvh` changes while a mobile toolbar
  collapses, which makes a pinned stage jump; `ScrollTrigger.config({ ignoreMobileResize: true })`
  is set for the same reason. Safe-area insets are respected top and bottom.

---

## Verification

`npm run build` passes (typecheck + lint clean). Driven in headless Chrome at
1440 × 900, 834 × 1112 and 390 × 844, plus a reduced-motion run:

- no console errors, no page errors, no failed requests;
- no horizontal overflow at any width;
- scrubbing backwards restores earlier scenes exactly;
- crossing the mobile/desktop breakpoint and back rebuilds the timeline cleanly;
- the progress rail is keyboard-reachable and activating a stop seeks correctly.

Not yet checked on real hardware: **Safari iOS and Chrome Android still need a pass
on a device**, particularly the pin behaviour during toolbar collapse.

---

## Merging to the homepage

When the preview is approved:

1. Render `<ScrollJourneyHero />` from `src/app/page.tsx` and delete the starter
   markup there.
2. Replace the placeholder `#menu`, `#story` and `#visit` sections with the real
   menu and ordering flow, and point the CTAs and the header's "Order now" at it.
3. Update the metadata in `src/app/layout.tsx` (still "Create Next App").
4. Swap in the real photography and the client's logo file. Refreshing
   ScrollTrigger is handled automatically once the images settle, but do re-check
   the framing of each scene: larger assets change how much of the headline the
   food covers.
5. Delete `src/app/preview/hero/` once it is no longer needed.
