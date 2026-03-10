# Fluid Typography Generator

A developer tool that generates CSS `clamp()` formulas for fluid typography — font sizes that scale smoothly between a minimum and maximum value based on screen width, without any media queries.

---

## What is Fluid Typography?

Traditional responsive typography uses breakpoints:

```css
font-size: 12px;

@media (min-width: 768px) {
  font-size: 16px;
}

@media (min-width: 1280px) {
  font-size: 20px;
}
```

This creates **sudden jumps** in font size at each breakpoint. Fluid typography eliminates those jumps by making the font scale continuously and smoothly with the viewport width.

```css
/* One line. No media queries. Smooth scaling. */
font-size: clamp(0.75rem, 0.542rem + 0.884vw, 1.25rem);
```

---

## How to Use the Tool

1. Enter your **Min Font Size** — the smallest the text should ever be (in px)
2. Enter your **Max Font Size** — the largest the text should ever be (in px)
3. Enter your **Min Screen Width** — the viewport width where scaling begins (in px)
4. Enter your **Max Screen Width** — the viewport width where scaling ends (in px)
5. Click **Copy** to copy the generated `clamp()` value
6. Paste it directly into your CSS or design system

### Example

| Field            | Value    |
| ---------------- | -------- |
| Min Font Size    | `12px`   |
| Max Font Size    | `20px`   |
| Min Screen Width | `375px`  |
| Max Screen Width | `1280px` |

**Output:**

```css
font-size: clamp(0.75rem, 0.542rem + 0.884vw, 1.25rem);
```

---

## Understanding `clamp()`

The CSS `clamp()` function takes three arguments:

```css
clamp(minimum, preferred, maximum)
```

| Argument    | Role                                            |
| ----------- | ----------------------------------------------- |
| `minimum`   | The smallest value — font never goes below this |
| `preferred` | The fluid value — scales with viewport width    |
| `maximum`   | The largest value — font never goes above this  |

The browser logic works like this:

```
if preferred < minimum → use minimum
if preferred > maximum → use maximum
else                   → use preferred
```

### Example Behaviour

```css
font-size: clamp(0.75rem, 0.542rem + 0.884vw, 1.25rem);
```

| Screen Width | Calculated Size | Result |
| ------------ | --------------- | ------ |
| `375px`      | `≤ 12px`        | `12px` |
| `700px`      | `≈ 15px`        | `15px` |
| `1280px`     | `≥ 20px`        | `20px` |

---

## The Formula Explained

The preferred value (`0.542rem + 0.884vw`) is calculated using linear interpolation between two known points — your minimum and maximum font sizes at your minimum and maximum screen widths.

### Step-by-step Derivation

Given:

```
minFont   = 12px     maxFont   = 20px
minScreen = 375px    maxScreen = 1280px
```

**Step 1 — Calculate the slope**

The slope tells us how fast the font grows per pixel of screen width.

```
slope = (maxFont - minFont) / (maxScreen - minScreen)
slope = (20 - 12) / (1280 - 375)
slope = 8 / 905
slope = 0.00884
```

**Step 2 — Convert slope to vw**

`vw` is 1% of viewport width, so multiply slope by 100:

```
vw = slope × 100
vw = 0.884vw
```

**Step 3 — Calculate the intercept**

The intercept is the base rem value — where the line crosses zero screen width.

```
intercept = minFont - (slope × minScreen)
intercept = 12 - (0.00884 × 375)
intercept = 12 - 3.315
intercept = 8.685px → 8.685 / 16 = 0.542rem
```

**Step 4 — Convert font sizes to rem**

```
minFont = 12 / 16 = 0.75rem
maxFont = 20 / 16 = 1.25rem
```

**Step 5 — Assemble the clamp**

```css
font-size: clamp(0.75rem, 0.542rem + 0.884vw, 1.25rem);
```

---

## Why rem + vw in the Preferred Value?

You might wonder why the preferred value uses `rem + vw` rather than just `vw` alone.

Using only `vw`:

```css
font-size: clamp(0.75rem, 4vw, 1.25rem);
```

This works but the scaling is not mathematically precise — it does not guarantee exact sizes at your target breakpoints.

Using `rem + vw` (linear interpolation):

```css
font-size: clamp(0.75rem, 0.542rem + 0.884vw, 1.25rem);
```

This is derived from a straight line between `(minScreen, minFont)` and `(maxScreen, maxFont)`, so the font hits **exactly** your target sizes at exactly your target screen widths.

| Approach   | Precise at breakpoints | Smooth scaling |
| ---------- | ---------------------- | -------------- |
| `vw` only  | ✗                      | ✓              |
| `rem + vw` | ✓                      | ✓              |

---

## Why Use Fluid Typography?

### Less Code

No media queries. One line handles all screen sizes.

### Smoother Experience

Text scales continuously instead of jumping at fixed breakpoints — better for readability across every screen width, not just the three you designed for.

### Design System Friendly

Fluid type scales integrate well into token-based design systems. You can define a full type scale with one `clamp()` per step:

```css
--text-sm: clamp(0.75rem, 0.668rem + 0.055vw, 0.875rem);
--text-base: clamp(1rem, 0.913rem + 0.087vw, 1.125rem);
--text-lg: clamp(1.125rem, 0.989rem + 0.136vw, 1.5rem);
--text-xl: clamp(1.25rem, 1.065rem + 0.185vw, 1.875rem);
--text-2xl: clamp(1.5rem, 1.239rem + 0.261vw, 2.25rem);
```

### Works Everywhere

`clamp()` is supported in all modern browsers with no polyfill needed.

---

## Using the Output

Copy the generated value and use it anywhere CSS is accepted:

**Plain CSS**

```css
h1 {
  font-size: clamp(0.75rem, 0.542rem + 0.884vw, 1.25rem);
}
```

**CSS Custom Property**

```css
:root {
  --text-heading: clamp(0.75rem, 0.542rem + 0.884vw, 1.25rem);
}

h1 {
  font-size: var(--text-heading);
}
```

**Tailwind CSS (arbitrary value)**

```html
<h1 class="text-[clamp(0.75rem,0.542rem+0.884vw,1.25rem)]">Hello world</h1>
```

**Tailwind CSS (config)**

```js
// tailwind.config.js
theme: {
  fontSize: {
    'fluid-sm': 'clamp(0.75rem, 0.542rem + 0.884vw, 1.25rem)',
  }
}
```

---

## Visualizations in the Tool

### Scale Graph

Shows a line chart of how font size grows as screen width increases. The flat portions at each end show where `min` and `max` clamps are applied. The diagonal section in the middle is the fluid scaling zone.

### Live Preview

Drag the slider to simulate any screen width between your min and max. The sample text resizes in real time so you can judge readability at any viewport size before committing to the values.

---

## Glossary

| Term       | Meaning                                                            |
| ---------- | ------------------------------------------------------------------ |
| `clamp()`  | CSS function that constrains a value between a min and max         |
| `rem`      | Relative unit — 1rem = 16px (root font size)                       |
| `vw`       | Viewport width unit — 1vw = 1% of the current browser window width |
| Slope      | How fast the font grows per pixel of screen width                  |
| Intercept  | The base rem value in the preferred formula                        |
| Breakpoint | A screen width at which a layout or style change is triggered      |
