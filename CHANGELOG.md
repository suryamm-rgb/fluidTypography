# Changelog

All changes made in the UI redesign and documentation work. The calculation in `src/components/CalculateClamp.js` and the spacing math in `src/lib/spacing.js` were **not** changed.

## Added

- Design tokens (`src/styles/tokens.css`): colors, spacing, radii, shadows, fluid type steps, light and dark themes.
- Fluid type for the app's own text, generated with `scripts/gen-type-tokens.mjs` using `calculateClamp()`.
- Inter and JetBrains Mono through `next/font` (self-hosted, `display: swap`).
- Theme toggle. Follows the OS by default, saved in `localStorage`, set before first paint (no flash).
- New shared components: `Header`, `Card`, `Tabs`, `Alert`, `CodeBlock` (syntax highlighting), `CopyButton` and `Toast`, `EmptyState`, `NumberField`, `Icons`, `GeneratorSkeleton`.
- Inputs: px suffix, linked sliders, presets (Body, Heading, Hero, Caption), inline validation, `type="number"` with `inputmode="decimal"`.
- Output card: rem / px / em tabs, CSS / JSON / Tailwind tabs, variable name, copy with "Copied!" toast, download.
- Live preview: resizable frame, width slider, readout of screen and font size.
- Plain SVG graph with a marker tied to the preview slider. Dragging the chart moves the marker.
- Type scale as cards (xs to 3xl), each with live sample text, clamp value and copy.
- Breakpoint table turns into stacked cards below 640px.
- Loading skeleton, error boundary, and empty and error states.
- Skip link, WAI-ARIA tabs and switch, focus rings, 44px touch targets, safe-area insets, `dvh`, `prefers-reduced-motion`.
- Fluid spacing page and home page rebuilt on the same system. The spacing page gained validation, a spacing preview component, a shared SVG curve, and a saved list with CSS export.
- `src/lib/exporters.js`, `validate.js`, `spacing.js`, `highlight.js`, `clipboard.js`, `download.js`.
- Tests (`npm test`, 32 tests, Node's built-in runner).
- Scripts: `check-contrast.mjs`, `audit.mjs` (overflow, touch targets, axe), `screenshots.mjs`, `gen-doc-examples.mjs`, `gen-type-tokens.mjs`.
- Documentation: README and `docs/` (architecture, flow, formula, components, UI design, export formats, accessibility, testing, contributing).

## Changed

- Settings validation: equal or reversed screens, empty fields and out-of-range values are blocked before the calculation (equal screens used to produce `-Infinity`).
- Theme is no longer a URL parameter.
- Preview fonts load only when picked (before: 16 Google Fonts loaded at once).
- The "How it works" panel is now a short guide that links to the docs (before: a 1,000-line panel with a PDF download).
- Scale CSS export no longer declares `--text-base` twice, and the Tailwind export is indented correctly.
- Single CSS export is wrapped in `:root { }`.

## Removed

- `recharts` (replaced by SVG), and Tailwind (`tailwindcss`, `@tailwindcss/postcss`, `postcss`, `globals.css`, `postcss.config.mjs`).
- Syne and DM Mono fonts.
- Old docs `docs/FluidTypographyGenerator.md` and `docs/fluid-typography-docs.md`. Some of their example values did not match the real output (for example `0.663rem + 3.560vw`). The new docs are generated from the code.

## Dev dependencies added

- `playwright` (screenshots and audit) and `axe-core` (accessibility checks).

## Results

- Lighthouse (headless Chromium, local production build), mobile / desktop: home 99/100 and 100/100, spacing 99/100 and 100/100, typography 97/100 and 100/100 for Performance / Accessibility / Best Practices. CLS 0 everywhere. Accessibility and Best Practices are 100 on all pages.
