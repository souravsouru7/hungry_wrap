# Build an exact visual recreation — The Hungry Wrap CTA + Footer

You are a senior Next.js, Tailwind CSS and accessible UI engineer. Recreate `REFERENCE.png` as closely as possible, not by displaying it as a background but by rebuilding every element as real responsive HTML and CSS.

## Reference composition
A full-width bright-orange call-to-action band occupying the upper part of the screenshot. Both its top and bottom edges have gentle organic white waves. Inside, from left to right:
- Large, slightly playful white bold italic heading on two lines: `Ready to Satisfy` / `Your Hunger?`.
- Small hand-drawn white curved arrow pointing toward the central button (create with SVG).
- White rounded capsule button containing orange `Order Now` and a small ordering icon.
- Four compact benefits evenly spaced to the right: yellow circle with white leaf icon `Fresh Ingredients`; yellow circle with white chef-hat icon `Bold Flavors`; coral-red circle with white heart icon `Made to Satisfy You`; yellow circle with dark happy-face icon `Always Delicious`. Each label is white in two or three lines.

Below the orange band, an airy off-white/footer region featuring four columns:
1. Brand: wrap logo inside light cream circle, stacked orange `The Hungry`, black `Wrap`, tiny gray tagline `Wraps so good, you'll come back for more!`. Prefer the actual client-provided logo asset; DO NOT extract or invent a logo if the project already has it.
2. `Quick Links`: Home, About Us, Menu, Specials, Contact Us.
3. `Connect With Us`: social icon circles for Instagram (pink/orange), Facebook (dark gray), YouTube (white with red play mark), WhatsApp (green). Link to real provided URLs only; if absent, render a disabled/no-link presentation or TODOs rather than fabricated destinations.
4. `Subscribe for Updates`: helper text `Get the latest offers and new menu items.` and a pill email-input with circular orange arrow submit button. Implement accessible label, client validation and a real submission hook/interface; do not claim email subscription succeeded without backend connection.

Footer bottom: thin light gray horizontal divider, then left copyright `© {current year} The Hungry Wrap. All rights reserved.` and right tagline `Good Food Moves You.` followed by small orange heart. Note reference shows 2024; prefer dynamic current year unless pixel fidelity explicitly requires fixed screenshot text.

## Styling
- Palette: vivid tangerine #FF7308 / #FA7510, cream #FFF9F1, charcoal #211B18, muted gray #77716C, pale circles #FFB31A, coral #F14C43.
- Desktop reference width about 2048 and height 616, proportions are guidance, not hard-coded height.
- CTA band about 43% of section height in screenshot, footer body about 43%, copyright bottom about 14%.
- Generous horizontal padding and max-width container about 1720px.
- Orange band has a subtle vertical tonal gradient and organic boundary waves via inline decorative SVG path or CSS border-radius/clip-path. Do not use raster wave assets.
- Font: choose a friendly rounded Google font and apply slight italic/bold treatment to the CTA heading. Do not claim an exact proprietary font match without the original font.
- Rounded button, minimal shadows, crisp lines, soft footer spacing.

## Engineering requirements
- Next.js App Router, TypeScript, Tailwind CSS, lucide-react.
- Export `FinalCtaFooter` component. Props: `logoSrc?: string`, `orderHref: string`, `navLinks?: {label: string; href: string}[]`, `socialLinks?: {platform: string; href: string}[]`, `onSubscribe?: (email: string) => Promise<void>`.
- Use Next.js `Image` only for an actual logo file, and SVG/CSS for every other ornament and icon.
- Proper semantic `<footer>`, navigation aria labels, accessible email form, keyboard focus and proper button/link distinctions.
- Hover interactions: gentle button rise, icons scale up to 1.06, links underline. Animate CTA reveal on scroll with GSAP ScrollTrigger only if the existing project already uses GSAP, or install when appropriate; respect prefers-reduced-motion.
- Layout at widths 1440, 1024, 768, 390 and 320 px. On mobile: headline and button first, then 2x2 feature icons; footer columns stack logically; bottom line wraps, no horizontal overflow.
- Preserve existing site styles and avoid global resets.
- Use reference image for side-by-side visual QA: compare orange wave silhouette, element coordinates, heading size, spacing, footer columns, icon design and button height; adjust after screenshot review.
- Do not fabricate business facts, subscription functionality, or social URLs.

## Deliverables
1. `components/FinalCtaFooter.tsx` full source
2. Any SVG and CSS/Tailwind helpers
3. Integration example for page.tsx
4. Clear list of external inputs required (original logo, order link, social links, subscribe endpoint)
5. Responsive/visual QA checklist

IMPORTANT: No additional PNG illustrations are needed. Build as real code, NOT an image overlay. Visually reproduce the provided design as closely as possible while keeping the UI functional.
