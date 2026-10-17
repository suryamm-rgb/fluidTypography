// WCAG AA contrast check for the colour tokens in src/styles/tokens.css.
// Run: node scripts/check-contrast.mjs   (exits 1 if any pair fails)
import { readFileSync } from "node:fs";

const css = readFileSync(new URL("../src/styles/tokens.css", import.meta.url), "utf8");

function block(selector) {
  const start = css.indexOf(selector + " {");
  const end = css.indexOf("\n}", start);
  const vars = {};
  for (const m of css.slice(start, end).matchAll(/--([\w-]+):\s*(#[0-9a-fA-F]{6})\s*;/g)) {
    vars[m[1]] = m[2];
  }
  return vars;
}

const light = block(":root");
const dark = { ...light, ...block(':root[data-theme="dark"]') };

const lum = (hex) => {
  const [r, g, b] = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255)
    .map((c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};
const ratio = (a, b) => {
  const [hi, lo] = [lum(a), lum(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
};

// [foreground, background, minimum ratio]
const PAIRS = [
  ["text", "bg", 4.5], ["text", "surface", 4.5], ["text", "surface-2", 4.5],
  ["text-muted", "bg", 4.5], ["text-muted", "surface", 4.5], ["text-muted", "surface-2", 4.5],
  ["text-subtle", "surface", 4.5], ["text-subtle", "surface-2", 4.5], ["text-subtle", "bg", 4.5],
  ["accent-contrast", "accent", 4.5], ["accent-text", "bg", 4.5],
  ["accent-text", "surface", 4.5], ["accent-text", "accent-soft", 4.5],
  ["accent", "surface", 3], ["focus", "bg", 3], ["focus", "surface", 3],
  ["border-strong", "surface", 1.5],
  ["info", "info-bg", 4.5], ["warn", "warn-bg", 4.5],
  ["danger", "danger-bg", 4.5], ["danger", "surface", 4.5], ["success", "success-bg", 4.5],
  ["code-text", "code-bg", 4.5], ["tok-prop", "code-bg", 4.5], ["tok-num", "code-bg", 4.5],
  ["tok-fn", "code-bg", 4.5], ["tok-str", "code-bg", 4.5], ["tok-punct", "code-bg", 4.5],
  ["tok-comment", "code-bg", 4.5],
];

let failed = 0;
for (const [name, theme] of [["light", light], ["dark", dark]]) {
  console.log(`\n${name}`);
  for (const [fg, bg, min] of PAIRS) {
    const r = ratio(theme[fg], theme[bg]);
    const ok = r >= min;
    if (!ok) failed++;
    console.log(`  ${ok ? "PASS" : "FAIL"}  ${fg} on ${bg}: ${r.toFixed(2)} (needs ${min})`);
  }
}
process.exit(failed ? 1 : 0);
