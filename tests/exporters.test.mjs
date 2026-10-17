import { test } from "node:test";
import assert from "node:assert/strict";
import {
  calculateClamp,
  generateTypeScale,
} from "../src/components/CalculateClamp.js";
import { buildSingle, buildScale, buildSaved, FORMATS } from "../src/lib/exporters.js";

const base = { minFont: 16, maxFont: 24, minScreen: 320, maxScreen: 1280 };
const result = calculateClamp(16, 24, 320, 1280, 16);
const scale = generateTypeScale(16, 24, 320, 1280, 16, 1.25);
const args = { ...base, result, scale, unit: "rem", name: "text-base" };

test("single CSS is wrapped in :root", () => {
  const out = buildSingle("CSS", args);
  assert.match(out, /^:root \{/);
  assert.ok(out.includes(`--text-base: ${result.clampRem};`));
});

test("single JSON is valid JSON", () => {
  const data = JSON.parse(buildSingle("JSON", args));
  assert.equal(data.value, result.clampRem);
  assert.equal(data.fontSize.min, "16px");
});

test("single Tailwind uses the fluid- prefix", () => {
  assert.ok(buildSingle("Tailwind", args).includes("'fluid-text-base'"));
});

test("scale JSON has all seven steps", () => {
  const data = JSON.parse(buildScale("JSON", args));
  assert.deepEqual(Object.keys(data.scale), ["xs", "sm", "base", "lg", "xl", "2xl", "3xl"]);
});

test("scale CSS has one variable per step", () => {
  const out = buildScale("CSS", args);
  for (const s of scale) assert.ok(out.includes(`${s.token}:`));
});

test("every format builds a non-empty string", () => {
  for (const f of FORMATS) {
    assert.ok(buildSingle(f, args).length > 0);
    assert.ok(buildScale(f, args).length > 0);
  }
});

test("saved configs use slug names", () => {
  const out = buildSaved(
    "CSS",
    [{ name: "Hero Title", rootSize: 16, ...base }],
    "px",
    calculateClamp,
  );
  assert.ok(out.includes("--hero-title: clamp(16px"));
});
