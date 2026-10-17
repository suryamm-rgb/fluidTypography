import { test } from "node:test";
import assert from "node:assert/strict";
import { computeClamp, valueAtVw, validateSpacing } from "../src/lib/spacing.js";

test("computeClamp: 16 → 48 between 320 and 1280", () => {
  assert.equal(computeClamp(16, 48, 320, 1280), "clamp(1rem, 3.3333vw + 0.3333rem, 3rem)");
});

test("valueAtVw is flat outside the range and linear inside", () => {
  assert.equal(valueAtVw(16, 48, 320, 1280, 100), 16);
  assert.equal(valueAtVw(16, 48, 320, 1280, 2000), 48);
  assert.equal(valueAtVw(16, 48, 320, 1280, 800), 32);
});

test("validateSpacing", () => {
  const ok = { minPx: 16, maxPx: 48, minVw: 320, maxVw: 1280 };
  assert.deepEqual(validateSpacing(ok), {});
  assert.ok(validateSpacing({ ...ok, maxVw: 320 }).maxVw);
  assert.ok(validateSpacing({ ...ok, minPx: -1 }).minPx);
  assert.ok(validateSpacing({ ...ok, maxPx: NaN }).maxPx);
});
