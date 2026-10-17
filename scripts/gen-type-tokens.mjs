// Prints the fluid type tokens used by the app's own UI (src/styles/tokens.css).
// The values come from the same calculateClamp() that the tool ships, so the
// app demonstrates its own idea.   Run: node scripts/gen-type-tokens.mjs
import { calculateClamp } from "../src/components/CalculateClamp.js";

const MIN = { size: 16, ratio: 1.2, screen: 320 };
const MAX = { size: 18, ratio: 1.25, screen: 1280 };
const STEPS = [-2, -1, 0, 1, 2, 3, 4];

for (const n of STEPS) {
  const min = MIN.size * Math.pow(MIN.ratio, n);
  const max = MAX.size * Math.pow(MAX.ratio, n);
  const r = calculateClamp(
    Number(min.toFixed(2)),
    Number(max.toFixed(2)),
    MIN.screen,
    MAX.screen,
    16,
  );
  console.log(`  --step-${n}: ${r.clampRem}; /* ${min.toFixed(1)}px → ${max.toFixed(1)}px */`);
}
