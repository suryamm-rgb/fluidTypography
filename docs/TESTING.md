# Testing

Unit tests use Node's built-in runner, so there is nothing extra to install. Browser checks use Playwright and axe-core (dev dependencies).

- [Run unit tests](#run-unit-tests)
- [What is covered](#what-is-covered)
- [Add a test](#add-a-test)
- [Browser checks](#browser-checks)
- [Before a pull request](#before-a-pull-request)

## Run unit tests

```bash
npm test
```

This runs `node --test tests/*.test.mjs`. It needs Node 22 or newer (the source files are ES modules without `"type": "module"`, which Node 22 detects by itself; the script hides the related warning).

## What is covered

| File | Covers |
| --- | --- |
| `tests/calculate.test.mjs` | `calculateClamp` (normal, reverse, equal fonts, root size), `getClampValue`, breakpoint zones, type scale, graph data, preview size, formula steps |
| `tests/validate.test.mjs` | Ranges, equal and reversed screens, `parseNumber` |
| `tests/exporters.test.mjs` | CSS, JSON and Tailwind for single, scale and saved configs, valid JSON, no duplicate variables |
| `tests/spacing.test.mjs` | Spacing `computeClamp`, `valueAtVw`, `validateSpacing` |
| `tests/highlight.test.mjs` | The tokenizer never loses a character, and labels CSS and JSON parts |

There are no React component tests yet. The browser checks below cover the UI.

## Add a test

1. Create or open `tests/<topic>.test.mjs`.
2. Import from `src/` with the **full file extension**, because Node does not guess it:

```js
import { test } from "node:test";
import assert from "node:assert/strict";
import { calculateClamp } from "../src/components/CalculateClamp.js";

test("example", () => {
  const r = calculateClamp(16, 24, 320, 1280, 16);
  assert.equal(r.clampRem, "clamp(1.000rem, 0.833rem + 0.833vw, 1.500rem)");
});
```

3. Never calculate the expected value by hand. Run the function once, check it makes sense (for example, that the line passes through both points), then paste the output.
4. Run `npm test`.

Keep logic you want to test in plain `.js` files with no React and no `next/*` imports (see `src/lib/`).

## Browser checks

Start a production server first:

```bash
npm run build && npm start
```

Then, in another terminal:

```bash
node scripts/audit.mjs          # home, spacing, typography: overflow, 44px targets, axe, 10 viewports
node scripts/screenshots.mjs    # docs/screenshots at 375, 768, 1440 in both themes
node scripts/check-contrast.mjs # WCAG AA for the color tokens (no server needed)
```

First time only: `npx playwright install chromium`.

Lighthouse (optional):

```bash
npx lighthouse http://localhost:3000/fluid-typography --preset=desktop --view
```

## Before a pull request

```bash
npm run lint && npm test && npm run build
```

If you changed UI, also run `scripts/audit.mjs`.
