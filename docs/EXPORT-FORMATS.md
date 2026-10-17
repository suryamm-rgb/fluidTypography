# Export formats

The tool exports a `clamp()` value as CSS, JSON or a Tailwind config. The code is in [`src/lib/exporters.js`](../src/lib/exporters.js). All examples use `16px → 24px`, screens `320px → 1280px`, unit `rem`, variable name `text-base`. They were produced by `node scripts/gen-doc-examples.mjs`.

- [Single value](#single-value)
- [Type scale](#type-scale)
- [Saved configurations](#saved-configurations)
- [Choosing a unit](#choosing-a-unit)

## Single value

Shown in the **Single** tab (output card). Functions: `buildSingle(format, options)`.

### CSS

```css
:root {
  /* 16px → 24px · screen 320px → 1280px */
  --text-base: clamp(1.000rem, 0.833rem + 0.833vw, 1.500rem);
}
```

Use it:

```css
body { font-size: var(--text-base); }
```

### JSON

```json
{
  "name": "text-base",
  "value": "clamp(1.000rem, 0.833rem + 0.833vw, 1.500rem)",
  "unit": "rem",
  "fontSize": {
    "min": "16px",
    "max": "24px"
  },
  "screen": {
    "min": "320px",
    "max": "1280px"
  }
}
```

### Tailwind

```js
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      fontSize: {
        /* 16px → 24px */
        'fluid-text-base': 'clamp(1.000rem, 0.833rem + 0.833vw, 1.500rem)',
      },
    },
  },
};
```

Use it: `class="text-fluid-text-base"`.

The **Name** field sets `text-base` in all three. A leading `-` is removed.

## Type scale

Shown in the **Export** tab. Function: `buildScale(format, options)`. It uses a ratio of `1.25` and the seven steps `xs`, `sm`, `base`, `lg`, `xl`, `2xl`, `3xl` (see [FORMULA.md](FORMULA.md) for how each step is calculated).

### CSS

```css
/* Fluid Typography Export
 * Screen: 320px → 1280px
 * Base:   16px → 24px
 * Unit:   rem
 */
:root {
  --text-xs: clamp(0.640rem, 0.533rem + 0.533vw, 0.960rem); /* 10.2px → 15.4px */
  --text-sm: clamp(0.800rem, 0.667rem + 0.667vw, 1.200rem); /* 12.8px → 19.2px */
  --text-base: clamp(1.000rem, 0.833rem + 0.833vw, 1.500rem); /* 16px → 24px */
  --text-lg: clamp(1.250rem, 1.042rem + 1.042vw, 1.875rem); /* 20px → 30px */
  --text-xl: clamp(1.563rem, 1.302rem + 1.302vw, 2.344rem); /* 25px → 37.5px */
  --text-2xl: clamp(1.953rem, 1.628rem + 1.628vw, 2.930rem); /* 31.3px → 46.9px */
  --text-3xl: clamp(2.441rem, 2.035rem + 2.035vw, 3.662rem); /* 39.1px → 58.6px */
}
```

### JSON (first two steps shown)

```json
{
  "meta": {
    "screen": "320px → 1280px",
    "base": "16px → 24px",
    "unit": "rem"
  },
  "single": {
    "value": "clamp(1.000rem, 0.833rem + 0.833vw, 1.500rem)",
    "range": "16px → 24px"
  },
  "scale": {
    "xs": {
      "value": "clamp(0.640rem, 0.533rem + 0.533vw, 0.960rem)",
      "range": "10.2px → 15.4px"
    },
    "sm": {
      "value": "clamp(0.800rem, 0.667rem + 0.667vw, 1.200rem)",
      "range": "12.8px → 19.2px"
    }
  }
}
```

The real output continues with `base`, `lg`, `xl`, `2xl` and `3xl`.

### Tailwind (first two steps shown)

```js
// tailwind.config.js
// Screen range: 320px → 1280px
module.exports = {
  theme: {
    extend: {
      fontSize: {
        /* 10.2px → 15.4px */
        'fluid-xs': 'clamp(0.640rem, 0.533rem + 0.533vw, 0.960rem)',
        /* 12.8px → 19.2px */
        'fluid-sm': 'clamp(0.800rem, 0.667rem + 0.667vw, 1.200rem)',
        // ...base, lg, xl, 2xl, 3xl
      },
    },
  },
};
```

The **Type Scale** tab lets you change the ratio and line height. Its **Copy :root {}** button copies the CSS with the chosen ratio and adds a `line-height` comment per step. The **Export** tab always uses `1.25`.

## Saved configurations

Press **Save current** in the Export tab to keep several settings during the session. `buildSaved()` exports them together, one variable per saved name (`Hero Title` becomes `--hero-title` or `'fluid-hero-title'`). They are kept in memory only and are lost on reload.

## Choosing a unit

| Unit | Use when |
| --- | --- |
| `rem` | Default. Follows the user's browser font size. |
| `px` | You need exact pixel output. Does not follow the browser font size. |
| `em` | The size should depend on the parent element's font size. |

Each file can be downloaded (`.css`, `.json` or `.js`) or copied.
