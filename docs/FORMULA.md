# The formula

This file explains the math behind the `clamp()` value. The code is `calculateClamp()` in [`src/components/CalculateClamp.js`](../src/components/CalculateClamp.js). Every number below was produced by running that function (`node scripts/gen-doc-examples.mjs`).

- [Idea](#idea)
- [Derivation](#derivation)
- [Worked example](#worked-example)
- [Units](#units)
- [Edge cases](#edge-cases)

## Idea

We want a font size that:

- is `minFont` at `minScreen` and below,
- is `maxFont` at `maxScreen` and above,
- grows in a straight line in between.

CSS can do this with one value:

```css
font-size: clamp(MIN, PREFERRED, MAX);
```

`PREFERRED` is the straight line. `clamp()` cuts it off at `MIN` and `MAX`.

## Derivation

A line is `size = intercept + slope × screen`.

**1. Slope** (px of font per px of screen):

```text
slope = (maxFont − minFont) / (maxScreen − minScreen)
```

**2. vw part.** `1vw` is 1% of the screen width, so `slope × screen = (slope × 100) × (screen / 100)`:

```text
vw = slope × 100
```

**3. Intercept** (the line at screen = 0). Use the line at `minScreen`:

```text
intercept = minFont − slope × minScreen
```

**4. rem.** Divide every px value by the root font size:

```text
minRem       = minFont   / rootSize
maxRem       = maxFont   / rootSize
interceptRem = intercept / rootSize
```

**5. Assemble:**

```css
clamp(minRem, interceptRem + vw vw, maxRem)
```

All numbers are printed with 3 decimals (`toFixed(3)`).

## Worked example

Input: `16px → 24px`, screens `320px → 1280px`, root `16px`.

| Step | Calculation | Result |
| --- | --- | --- |
| Slope | `(24 - 16) / (1280 - 320)` | `0.00833` |
| vw | `0.00833 × 100` | `0.833` |
| Intercept | `16 - (0.00833 × 320)` | `13.333px` |
| Intercept rem | `13.333 ÷ 16` | `0.833rem` |
| Min / max rem | `16 ÷ 16`, `24 ÷ 16` | `1.000rem`, `1.500rem` |

Result:

```css
clamp(1.000rem, 0.833rem + 0.833vw, 1.500rem)
```

Check: at an 800px screen the line gives `13.333 + 0.00833 × 800 = 20`. The tool's preview function agrees (`getPreviewFontSize(16, 24, 320, 1280, 800)` returns `20.0`).

Sizes at common screens for the same input (`generateBreakpointTable`):

| Screen | Size | Zone |
| --- | --- | --- |
| 320px | 16 | min |
| 375px | 16.46 | fluid |
| 480px | 17.33 | fluid |
| 640px | 18.67 | fluid |
| 768px | 19.73 | fluid |
| 1024px | 21.87 | fluid |
| 1280px | 24 | max |
| 1440px | 24 | max |
| 1920px | 24 | max |

Zones: `min` is at or below `minScreen`, `max` is at or above `maxScreen`, `fluid` is in between.

## Units

Same input, three outputs (see [EXPORT-FORMATS.md](EXPORT-FORMATS.md) for the full formats):

```css
clamp(1.000rem, 0.833rem + 0.833vw, 1.500rem)
clamp(16px, 13.333px + 0.833vw, 24px)
clamp(1.000em, 0.833em + 0.833vw, 1.500em)
```

A different root size only changes the rem and em numbers. With a `20px` root:

```css
clamp(0.800rem, 0.667rem + 0.833vw, 1.200rem)
```

The px output does not change.

## Edge cases

### Reverse scaling (min is larger than max)

Input `24px → 16px` makes the slope negative. The tool does not swap the fonts for the line. It only sorts the clamp bounds, because `clamp()` needs `MIN <= MAX`.

```css
clamp(1.000rem, 1.667rem + -0.833vw, 1.500rem)
```

- At 320px: `26.667 − 0.00833 × 320 = 24px`.
- At 1280px: `26.667 − 0.00833 × 1280 = 16px`.

`isNegativeVw` is `true`, and the UI shows an info alert. In the app, the **Reverse scaling** switch swaps the min and max for you.

### Equal min and max font

Input `16px → 16px` gives a slope of `0`. The line is flat:

```css
clamp(1.000rem, 1.000rem + 0.000vw, 1.000rem)
```

This is valid. The graph draws a flat line and the table bar shows full.

### Equal or reversed screens

If `minScreen` equals `maxScreen`, the slope divides by zero. The raw function returns garbage:

```text
clamp(1.000rem, -Infinityrem + Infinityvw, 1.500rem)
```

The calculation was not changed. Instead, `validateInputs()` in [`src/lib/validate.js`](../src/lib/validate.js) blocks the call and the UI shows:

```text
Max screen must be larger than min screen.
```

### Other limits

| Field | Allowed range |
| --- | --- |
| Font size | 1 to 500 |
| Screen | 100 to 10000 |
| Root size | 8 to 32 |

### Zoom

The `vw` part does not respond to browser zoom. See [ACCESSIBILITY.md](ACCESSIBILITY.md).
