# Fluid Typography — Complete Documentation

> Generate CSS `clamp()` formulas that scale text smoothly between any two screen sizes — no media query breakpoints needed.

---

## Table of Contents

1. [What Is Fluid Typography?](#what-is-fluid-typography)
2. [Why Use It?](#why-use-it)
3. [When to Use It (and When Not To)](#when-to-use-it-and-when-not-to)
4. [Core Concepts](#core-concepts)
5. [The Formula — Step by Step](#the-formula--step-by-step)
6. [CSS clamp() Explained](#css-clamp-explained)
7. [Units: rem vs px vs em](#units-rem-vs-px-vs-em)
8. [Reverse Scaling](#reverse-scaling)
9. [Type Scale & Modular Ratios](#type-scale--modular-ratios)
10. [Breakpoint Behavior](#breakpoint-behavior)
11. [Accessibility Warnings](#accessibility-warnings)
12. [Export Formats](#export-formats)
13. [Real-World Examples](#real-world-examples)
14. [Quick Reference Cheatsheet](#quick-reference-cheatsheet)

---

## What Is Fluid Typography?

**Fluid typography** is a CSS technique where font sizes scale *continuously* and *proportionally* as the viewport width changes — rather than snapping between fixed sizes at specific breakpoints.

Instead of writing:

```css
/* Old approach — stepped, not smooth */
h1 { font-size: 24px; }

@media (min-width: 768px) { h1 { font-size: 32px; } }
@media (min-width: 1280px) { h1 { font-size: 48px; } }
```

You write a single `clamp()` rule:

```css
/* Fluid approach — scales smoothly */
h1 {
  font-size: clamp(1.500rem, 0.663rem + 3.560vw, 3.000rem);
}
```

This single declaration makes the font size:
- **Exactly 24px** on a 375px-wide screen
- **Exactly 48px** on a 1280px-wide screen
- **Smoothly interpolated** at every width in between
- **Clamped** (never smaller than 24px, never larger than 48px) outside that range

---

## Why Use It?

| Problem with fixed breakpoints | Fluid typography solution |
|---|---|
| Text snaps abruptly between sizes | Text scales continuously — no jumps |
| Many media queries to maintain | One `clamp()` value replaces them all |
| Hard to handle every device width | Works on any viewport, including unusual sizes |
| Design looks great at 768px but awkward at 900px | Looks great at *every* width |
| Requires designer to specify every breakpoint | One min/max definition handles everything |

### Key Benefits

- **Zero layout shift** — no sudden text reflow at breakpoints
- **Design fidelity** — text stays proportional at any screen size
- **Less CSS** — one rule replaces many `@media` blocks
- **Future-proof** — works on any device, including ones that don't exist yet
- **Readable at every size** — not too big on mobile, not too small on desktop

---

## When to Use It (and When Not To)

### ✅ Good use cases

- **Headings** — hero text, section headings, page titles that should feel proportional to the viewport
- **Display text** — pull quotes, large callouts, marketing copy
- **Body text** — when you want reading comfort across a wide range of devices
- **Responsive UI components** — card titles, button labels, navigation items
- **Design systems** — generating a full type scale where every step scales consistently

### ⚠️ Use with caution

- **Very small text** — caption or label text where legibility is paramount; fluid scaling may make it too small on mobile
- **Fixed-width layouts** — if your layout doesn't change width, fluid type has no benefit
- **Print stylesheets** — viewport units have no meaning in print

### ❌ Not recommended

- **Icon labels or badges** — usually need fixed sizes for UI consistency
- **Legal copy or fine print** — accessibility regulations may require minimum sizes that fluid scaling could violate
- **When users rely on browser zoom** — see [Accessibility Warnings](#accessibility-warnings)

---

## Core Concepts

### The Four Inputs

Every fluid type calculation starts with four numbers:

| Input | Description | Example |
|---|---|---|
| `minFont` | Font size (px) at the smallest screen | `16px` |
| `maxFont` | Font size (px) at the largest screen | `32px` |
| `minScreen` | The viewport width where font is smallest | `375px` |
| `maxScreen` | The viewport width where font is largest | `1280px` |

### The Three Zones

For any given screen width, the font size falls into one of three zones:

```
Screen width:   |--- min clamp ---|--- fluid (scales) ---|--- max clamp ---|
                0      minScreen                          maxScreen       ∞

Font size:      [minFont]         [interpolates linearly]         [maxFont]
```

- **Min zone** (`screen ≤ minScreen`): Font is fixed at `minFont` — never gets smaller
- **Fluid zone** (`minScreen < screen < maxScreen`): Font scales linearly with viewport width
- **Max zone** (`screen ≥ maxScreen`): Font is fixed at `maxFont` — never gets larger

### Root Size

The `rootSize` (default: `16px`) is your browser's base font size. It's used to convert `px` values to `rem`. Most browsers default to 16px, but users can change this — which is why `rem` is preferred over `px` for accessibility.

```
16px ÷ 16 = 1rem
24px ÷ 16 = 1.5rem
32px ÷ 16 = 2rem
```

---

## The Formula — Step by Step

Given `minFont = 16`, `maxFont = 32`, `minScreen = 375`, `maxScreen = 1280`, `rootSize = 16`:

### Step 1: Calculate the Slope

The slope tells us how fast the font size grows per pixel of screen width.

```
slope = (maxFont - minFont) / (maxScreen - minScreen)
slope = (32 - 16) / (1280 - 375)
slope = 16 / 905
slope = 0.01768
```

This means: for every **1px wider** the screen gets, the font grows by **0.01768px**.

### Step 2: Convert Slope to vw

`vw` is a percentage of viewport width. `1vw = 1% of viewport`. Multiply slope by 100 to convert the `px/px` ratio into a `vw` value:

```
vw = slope × 100
vw = 0.01768 × 100
vw = 1.768vw
```

### Step 3: Calculate the Intercept

The intercept anchors the line to the minimum breakpoint. It's the "base offset" that, combined with the `vw` term, gives you the exact `minFont` size at `minScreen`:

```
intercept = minFont - (slope × minScreen)
intercept = 16 - (0.01768 × 375)
intercept = 16 - 6.630
intercept = 9.370px
```

Convert to rem: `9.370 ÷ 16 = 0.586rem`

### Step 4: Convert Font Sizes to rem

```
minRem = minFont ÷ rootSize = 16 ÷ 16 = 1.000rem
maxRem = maxFont ÷ rootSize = 32 ÷ 16 = 2.000rem
```

### Step 5: Assemble the clamp()

```css
font-size: clamp(minRem, interceptRem + vw, maxRem);
font-size: clamp(1.000rem, 0.586rem + 1.768vw, 2.000rem);
```

### Verify It Works

At `minScreen = 375px`:
```
0.586rem + 1.768vw
= 9.370px + (1.768/100 × 375px)
= 9.370px + 6.630px
= 16.000px ✓ (equals minFont)
```

At `maxScreen = 1280px`:
```
0.586rem + 1.768vw
= 9.370px + (1.768/100 × 1280px)
= 9.370px + 22.630px
= 32.000px ✓ (equals maxFont)
```

---

## CSS clamp() Explained

```css
font-size: clamp(MIN, PREFERRED, MAX);
```

CSS `clamp()` takes three arguments:

| Argument | Role | Must be |
|---|---|---|
| `MIN` | Absolute lower bound | ≤ MAX |
| `PREFERRED` | The fluid calculation | Any length/calc expression |
| `MAX` | Absolute upper bound | ≥ MIN |

The browser evaluates `PREFERRED` at the current viewport width and then clamps the result between `MIN` and `MAX`.

### The Three Output Formats

The tool generates the same formula in three unit formats:

**rem (recommended)**
```css
font-size: clamp(1.000rem, 0.586rem + 1.768vw, 2.000rem);
```
Respects the user's browser font size preference. Best for accessibility.

**px**
```css
font-size: clamp(16px, 9.370px + 1.768vw, 32px);
```
Ignores browser font size settings. Easier to reason about in absolute terms.

**em**
```css
font-size: clamp(1.000em, 0.586em + 1.768vw, 2.000em);
```
Relative to the *parent* element's font size. Useful in nested contexts.

---

## Units: rem vs px vs em

| Unit | Relative to | Respects browser zoom? | Best for |
|---|---|---|---|
| `rem` | Root element (`<html>`) | ✅ Yes | Body text, headings — default choice |
| `px` | Physical pixels | ❌ No | When you need exact pixel control |
| `em` | Parent element | ✅ Yes | Nested components, buttons |

**Recommendation:** Use `rem` in almost all cases. It ensures your fluid type still respects user preferences and browser zoom.

---

## Reverse Scaling

**Reverse scaling** inverts the normal relationship: the font size *decreases* as the screen width *increases*.

This produces a **negative vw** coefficient in the `clamp()` preferred value:

```css
/* Normal: grows with screen */
font-size: clamp(1.000rem, 0.586rem + 1.768vw, 2.000rem);

/* Reverse: shrinks with screen */
font-size: clamp(1.000rem, 2.414rem + -1.768vw, 2.000rem);
```

### When Would You Use This?

Reverse scaling is uncommon but has valid use cases:

- **Dense desktop dashboards** — large text on mobile for readability, but smaller on desktop where the UI is more compact
- **Print-first designs** — where mobile acts as a "zoom in" view
- **Artistic/typographic layouts** — deliberate design decisions where large text on small screens creates emphasis

### How It Works Internally

When reverse scaling is toggled, the `minFont` and `maxFont` inputs are swapped before calculation:

```
Normal:   effectiveMin = minFont (16), effectiveMax = maxFont (32)
Reversed: effectiveMin = maxFont (32), effectiveMax = minFont (16)
```

The `clamp()` always requires `MIN ≤ MAX`, so the tool automatically sorts the bounds:

```css
/* Even with negative vw, clamp bounds are sorted correctly */
clamp(1.000rem, 2.414rem + -1.768vw, 2.000rem)
/* ↑ 1.000rem (smaller) is always MIN, 2.000rem (larger) is always MAX */
```

---

## Type Scale & Modular Ratios

A **type scale** is a set of harmonically related font sizes, generated by multiplying a base size by a consistent ratio at each step.

### The Scale Steps

| Token | CSS Variable | Ratio Step | Typical Use |
|---|---|---|---|
| `xs` | `--text-xs` | base ÷ ratio² | Caption, badge |
| `sm` | `--text-sm` | base ÷ ratio¹ | Helper, footnote |
| `base` | `--text-base` | base × ratio⁰ | Body text |
| `lg` | `--text-lg` | base × ratio¹ | Card title |
| `xl` | `--text-xl` | base × ratio² | Section heading |
| `2xl` | `--text-2xl` | base × ratio³ | Page heading |
| `3xl` | `--text-3xl` | base × ratio⁴ | Hero headline |

Each step is a *fluid clamp* — so the entire scale scales proportionally across all screen sizes.

### Common Ratios

| Ratio Name | Value | Character |
|---|---|---|
| Minor Second | ×1.067 | Very subtle — good for dense UIs |
| Major Second | ×1.125 | Gentle hierarchy |
| Minor Third | ×1.200 | Popular for body + heading |
| **Major Third** | **×1.250** | **Default — balanced for most sites** |
| Perfect Fourth | ×1.333 | Strong contrast — editorial feel |
| Augmented Fourth | ×1.414 | Dramatic hierarchy |
| Perfect Fifth | ×1.500 | Very bold — display/marketing |
| Golden Ratio | ×1.618 | Maximum drama — use sparingly |

### Line Height

Line height affects readability and rhythm. Choose based on use case:

| Preset | Value | Best For |
|---|---|---|
| Tight | 1.1 | Headings, display text |
| Snug | 1.25 | Large subheadings |
| Normal | 1.5 | Body text — standard |
| Relaxed | 1.625 | Long-form reading |
| Loose | 2.0 | Spacious layouts |

### CSS Output

```css
:root {
  --text-xs:   clamp(0.711rem, 0.466rem + 1.045vw, 1.280rem);
  --text-sm:   clamp(0.889rem, 0.553rem + 1.433vw, 1.600rem);
  --text-base: clamp(1.000rem, 0.586rem + 1.768vw, 2.000rem);
  --text-lg:   clamp(1.250rem, 0.698rem + 2.354vw, 2.500rem);
  --text-xl:   clamp(1.563rem, 0.814rem + 3.193vw, 3.125rem);
  --text-2xl:  clamp(1.953rem, 0.934rem + 4.336vw, 3.906rem);
  --text-3xl:  clamp(2.441rem, 1.048rem + 5.928vw, 4.883rem);
}
```

---

## Breakpoint Behavior

The tool shows exactly what font size will render at common device widths:

| Screen | Device | Zone | Behavior |
|---|---|---|---|
| 320px | iPhone SE | min | Fixed at `minFont` |
| 375px | iPhone 14 | min | Fixed at `minFont` |
| 480px | Small mobile | min/fluid | Depends on your `minScreen` |
| 640px | Large mobile | fluid | Scaling |
| 768px | iPad | fluid | Scaling |
| 1024px | iPad Pro | fluid | Scaling |
| 1280px | Desktop | max | Fixed at `maxFont` |
| 1440px | Large desktop | max | Fixed at `maxFont` |
| 1920px | Wide screen | max | Fixed at `maxFont` |

The bar visualization in the table shows relative font size — longer bars = larger font within your defined range.

---

## Accessibility Warnings

### WCAG 1.4.4 — Resize Text (Level AA)

Using `vw` inside `clamp()` can interfere with browser text zoom. When a user zooms to 200% in their browser, `rem` values double (correct behavior), but `vw` values do not — they're still relative to the viewport width, not the zoom level.

This means a user who relies on text scaling may find that your fluid type doesn't scale as expected.

**Mitigation strategies:**

1. **Test browser zoom** at 200% on your actual content before shipping
2. **Use `rem` for min/max bounds** — these do respect zoom
3. **Consider media queries for critical accessibility paths** alongside fluid type
4. **Avoid very tight clamp ranges** — if `minFont` and `maxFont` are close, the clamping prevents adequate scaling

### Negative vw — Reverse Scaling

When reverse scaling is active, the preferred value uses a negative vw coefficient. This is valid CSS, but it's an unusual pattern that may confuse other developers. Always document intentional reverse scaling in your codebase.

### References

- [WCAG 1.4.4 Resize Text (AA)](https://www.w3.org/WAI/WCAG21/Understanding/resize-text.html)
- [Adrian Roselli — Responsive Type and Zoom](https://adrianroselli.com/2019/12/responsive-type-and-zoom.html)
- [MDN — clamp()](https://developer.mozilla.org/en-US/docs/Web/CSS/clamp)

---

## Export Formats

### CSS

Outputs as CSS custom properties, ready to paste into `:root {}`:

```css
/* Fluid Typography Export
 * Screen: 375px → 1280px
 * Base:   16px → 32px
 * Unit:   rem
 */

/* Single value — 16px → 32px */
--text-base: clamp(1.000rem, 0.586rem + 1.768vw, 2.000rem);

/* Type scale */
:root {
  --text-xs:   clamp(0.711rem, ...);
  --text-sm:   clamp(0.889rem, ...);
  --text-base: clamp(1.000rem, ...);
  /* ... */
}
```

### JSON

Outputs as structured data — useful for design tokens, style dictionaries, or feeding into build tools:

```json
{
  "meta": {
    "screen": "375px → 1280px",
    "base": "16px → 32px",
    "unit": "rem"
  },
  "single": {
    "value": "clamp(1.000rem, 0.586rem + 1.768vw, 2.000rem)",
    "range": "16px → 32px"
  },
  "scale": {
    "xs":   { "value": "clamp(...)", "range": "11.4px → 20.5px" },
    "base": { "value": "clamp(...)", "range": "16px → 32px" }
  }
}
```

### Tailwind

Outputs as a `tailwind.config.js` extension — adds fluid sizes as custom `fontSize` utilities:

```js
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      fontSize: {
        /* 11.4px → 20.5px */
        'fluid-xs':   'clamp(0.711rem, 0.466rem + 1.045vw, 1.280rem)',
        /* 16px → 32px */
        'fluid-base': 'clamp(1.000rem, 0.586rem + 1.768vw, 2.000rem)',
        /* ... */
      },
    },
  },
};
```

Use in your templates as: `<h1 class="text-fluid-3xl">Hello</h1>`

---

## Real-World Examples

### Body Text

```
minFont:   16px   maxFont:   20px
minScreen: 375px  maxScreen: 1280px
```

```css
--body: clamp(1.000rem, 0.834rem + 0.442vw, 1.250rem);
```
Comfortable reading size that stays modest — only grows 4px across the full screen range.

### Hero Headline

```
minFont:   36px   maxFont:   96px
minScreen: 375px  maxScreen: 1440px
```

```css
--hero: clamp(2.250rem, -0.099rem + 6.197vw, 6.000rem);
```
Dramatic scale: intimate on mobile, commanding on a wide desktop.

### Navigation

```
minFont:   13px   maxFont:   16px
minScreen: 375px  maxScreen: 1280px
```

```css
--nav: clamp(0.813rem, 0.646rem + 0.442vw, 1.000rem);
```
Subtle fluid scaling — keeps navigation readable without becoming oversized.

### Card Title

```
minFont:   18px   maxFont:   24px
minScreen: 375px  maxScreen: 1024px
```

```css
--card-title: clamp(1.125rem, 0.706rem + 1.118vw, 1.500rem);
```

### Dashboard (Reverse — smaller on desktop)

```
minFont:   18px   maxFont:   14px  (note: reversed)
minScreen: 375px  maxScreen: 1280px
Reverse toggle: ON
```

```css
--dashboard-label: clamp(0.875rem, 1.288rem + -0.442vw, 1.125rem);
```
Label text that's generous on mobile for thumb-sized touch targets, compact on desktop for data density.

---

## Quick Reference Cheatsheet

### Formula

```
slope     = (maxFont − minFont) / (maxScreen − minScreen)
vw        = slope × 100
intercept = minFont − (slope × minScreen)

clamp(
  min(minFont, maxFont) / rootSize + rem,
  intercept / rootSize + rem + vw vw,
  max(minFont, maxFont) / rootSize + rem
)
```

### Common Starting Points

| Use Case | minFont | maxFont | minScreen | maxScreen |
|---|---|---|---|---|
| Body text | 16px | 20px | 375px | 1280px |
| Subheading | 20px | 28px | 375px | 1280px |
| Page heading | 28px | 48px | 375px | 1280px |
| Hero / display | 36px | 80px | 375px | 1440px |
| Caption | 12px | 14px | 375px | 1280px |

### Ratio Selection Guide

| Content Type | Recommended Ratio |
|---|---|
| Dense UI / dashboard | Minor Second (×1.067) or Major Second (×1.125) |
| Marketing / blog | Major Third (×1.250) |
| Editorial / magazine | Perfect Fourth (×1.333) |
| Portfolio / creative | Perfect Fifth (×1.500) or Golden Ratio (×1.618) |

### Quick Accessibility Checklist

- [ ] Test at 200% browser zoom — does text still scale?
- [ ] `minFont` is at least 16px for body text
- [ ] Clamp range isn't so tight it prevents meaningful scaling
- [ ] Reverse scaling is documented if intentional
- [ ] Contrast ratio still passes after font-size changes

---

*Generated for the Fluid Typography Generator — a CSS `clamp()` utility.*
