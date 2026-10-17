import { test } from "node:test";
import assert from "node:assert/strict";
import { validateInputs, parseNumber } from "../src/lib/validate.js";

const ok = { minFont: 16, maxFont: 24, minScreen: 320, maxScreen: 1280, rootSize: 16 };

test("valid input has no errors", () => {
  assert.deepEqual(validateInputs(ok), {});
});

test("equal screens are rejected (would divide by zero)", () => {
  const e = validateInputs({ ...ok, minScreen: 500, maxScreen: 500 });
  assert.ok(e.maxScreen);
});

test("min screen above max screen is rejected", () => {
  assert.ok(validateInputs({ ...ok, minScreen: 1500 }).maxScreen);
});

test("equal fonts are allowed", () => {
  assert.deepEqual(validateInputs({ ...ok, minFont: 16, maxFont: 16 }), {});
});

test("reverse fonts are allowed", () => {
  assert.deepEqual(validateInputs({ ...ok, minFont: 24, maxFont: 16 }), {});
});

test("zero, negative and NaN are rejected", () => {
  assert.ok(validateInputs({ ...ok, minFont: 0 }).minFont);
  assert.ok(validateInputs({ ...ok, maxFont: -4 }).maxFont);
  assert.ok(validateInputs({ ...ok, rootSize: NaN }).rootSize);
});

test("parseNumber", () => {
  assert.equal(parseNumber("12.5"), 12.5);
  assert.equal(parseNumber(""), null);
  assert.equal(parseNumber("abc"), null);
  assert.equal(parseNumber("  "), null);
});
