# UI design

The look of the tool: a calm developer-tool style (think Linear or Vercel) with warm neutrals and one vermilion accent. All values are CSS variables in [`src/styles/tokens.css`](../src/styles/tokens.css). Component rules are in [`src/styles/app.css`](../src/styles/app.css). Component list: [COMPONENTS.md](COMPONENTS.md).

- [Rules](#rules)
- [Colors](#colors)
- [Fonts and fluid type](#fonts-and-fluid-type)
- [Spacing, radii, shadows](#spacing-radii-shadows)
- [Layout and breakpoints](#layout-and-breakpoints)
- [Dark mode](#dark-mode)
- [Motion](#motion)
- [Screenshots](#screenshots)

## Rules

1. Components never use raw colors, sizes or shadows. They use tokens.
2. All app styles are scoped under `.ft`. Every page (home, typography, spacing) uses that root class. The reset at the top of `app.css` uses `:where()`, so it never beats a component rule.
3. Every touch target is at least `--tap` (2.75rem = 44px).
4. Layout uses grid, flexbox, `minmax()`, `auto-fit` and container queries. There are no fixed widths.

## Colors

Both themes use the same token names. Light is `:root`, dark is `:root[data-theme="dark"]`.

| Token | Light | Dark | Use |
| --- | --- | --- | --- |
| `--bg` | `#fbfaf8` | `#0e0d0c` | Page |
| `--surface` | `#ffffff` | `#171614` | Cards |
| `--surface-2` | `#f4f2ee` | `#1f1d1a` | Inset panels, tab track |
| `--border` | `#e3dfd7` | `#2d2a26` | Hairlines |
| `--border-strong` | `#c9c3b8` | `#433f39` | Inputs, chips |
| `--text` | `#1c1a17` | `#f3f0ea` | Body |
| `--text-muted` | `#5b564d` | `#aca59a` | Secondary text |
| `--text-subtle` | `#6a645a` | `#9a9389` | Labels |
| `--accent` | `#c4360a` | `#ff7a4d` | Buttons, slider, chart line |
| `--accent-text` | `#b03009` | `#ff8a60` | Accent used as text |
| `--accent-contrast` | `#ffffff` | `#1a0a03` | Text on `--accent` |
| `--focus` | `#1d5fa8` | `#7db4ff` | Focus ring |

Other groups: status (`--info`, `--warn`, `--danger`, `--success`, each with `-bg` and `-border`), code (`--code-bg`, `--tok-*`), chart (`--chart-*`).

Contrast is checked by `node scripts/check-contrast.mjs` (58 pairs, both themes, exits 1 on failure). Examples: body text 16.64:1 light and 17.07:1 dark. White on the light accent is 5.41:1. Dark text on the dark accent is 7.48:1. See [ACCESSIBILITY.md](ACCESSIBILITY.md).

## Fonts and fluid type

| Role | Font | Loaded by |
| --- | --- | --- |
| UI | Inter | `next/font`, self-hosted, `display: swap` |
| Code | JetBrains Mono | `next/font`, self-hosted, `display: swap` |

Fallback stacks: `ui-sans-serif, system-ui, ...` and `ui-monospace, "SF Mono", Menlo, ...`.

The app's own text is fluid. The seven `--step-*` tokens were made with this tool's calculator: 320px to 1280px, base `16px → 18px`, ratio `1.2 → 1.25`. Regenerate with:

```bash
node scripts/gen-type-tokens.mjs
```

| Token | Size range |
| --- | --- |
| `--step--2` | 11.1px → 11.5px |
| `--step--1` | 13.3px → 14.4px |
| `--step-0` | 16.0px → 18.0px |
| `--step-1` | 19.2px → 22.5px |
| `--step-2` | 23.0px → 28.1px |
| `--step-3` | 27.6px → 35.2px |
| `--step-4` | 33.2px → 43.9px |

Form inputs use `max(16px, var(--step-0))` so iOS does not zoom on focus.

## Spacing, radii, shadows

| Token | Value |
| --- | --- |
| `--space-1` … `--space-8` | 0.25, 0.5, 0.75, 1, 1.5, 2, 3, 4 rem |
| `--gutter` | `clamp(1rem, 0.5rem + 2.5vw, 2rem)` |
| `--radius-sm/md/lg/xl/full` | 0.375, 0.625, 0.875, 1.25 rem, 999px |
| `--shadow-sm/md/lg` | Soft two-layer shadows. Stronger in dark. |
| `--content-max` | 82rem |
| `--header-h` | 3.5rem |

## Layout and breakpoints

Mobile first. One column by default.

| Width | What changes |
| --- | --- |
| below 26rem (416px) | Smaller brand text. The name field fills the row. |
| below 40rem (640px) | Breakpoint table becomes stacked cards. |
| 64rem (1024px) and up | Two columns. Settings are sticky on the left. |
| container 44rem and up | Inside the results column: Preview and Graph sit side by side, and type scale cards use two columns. |
| max-height 34rem | Sticky sidebar is turned off (landscape phones). |

The 44rem rule is a container query on `.results`, so it reacts to the column width, not the screen. At 768px the results column is full width, so the pair is side by side. At 1024px the column is narrower, so they stack again.

Other rules:

- `100dvh` is used instead of `100vh`.
- Safe-area insets pad the container, the header and the toast (`viewport-fit=cover`).
- Long `clamp()` strings wrap inside their code block (`overflow-wrap: anywhere`). Export blocks scroll inside their own box.
- No page-level horizontal scroll. `scripts/audit.mjs` checks this at 320, 375, 414, 768, 1024, 1280, 1440, 1920, 2560 (ultrawide) and 844×390 (landscape phone).

## Dark mode

- `layout.tsx` has an inline script. It sets `data-theme` before the first paint: saved choice first, else `prefers-color-scheme`.
- The header toggle saves the choice in `localStorage` under `ft-theme`.
- With no saved choice, the theme follows OS changes live.
- `color-scheme` is set per theme, so scrollbars and form controls match.

## Motion

- Hover and focus transitions use `--dur` (160ms) and `--ease`.
- The header uses a gradient plus `backdrop-filter` blur (glass).
- `prefers-reduced-motion: reduce` sets all animation and transition durations to near zero.

## Screenshots

Made by `node scripts/screenshots.mjs` (server must be running). Light and dark, at 375, 768 and 1440px, in [`docs/screenshots/`](screenshots).

| | Light | Dark |
| --- | --- | --- |
| 375px | [view](screenshots/375-light.png) | [view](screenshots/375-dark.png) |
| 768px | [view](screenshots/768-light.png) | [view](screenshots/768-dark.png) |
| 1440px | [view](screenshots/1440-light.png) | [view](screenshots/1440-dark.png) |

Spacing tool: `screenshots/spacing-<width>-<theme>.png`. Home page: `screenshots/home-<width>-<theme>.png`.
