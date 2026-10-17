import { test } from "node:test";
import assert from "node:assert/strict";
import {
  calculateClamp,
  getClampValue,
  generateBreakpointTable,
  generateTypeScale,
  generateGraphData,
  getPreviewFontSize,
  getFormulaSteps,
} from "../src/components/CalculateClamp.js";

test("calculateClamp: standard 16 → 24 between 320 and 1280", () => {
  const r = calculateClamp(16, 24, 320, 1280, 16);
  assert.equal(r.clampRem, "clamp(1.000rem, 0.833rem + 0.833vw, 1.500rem)");
  assert.equal(r.clampPx, "clamp(16px, 13.333px + 0.833vw, 24px)");
  assert.equal(r.clampEm, "clamp(1.000em, 0.833em + 0.833vw, 1.500em)");
  assert.equal(r.isNegativeVw, false);
});

test("calculateClamp: font size at the screen bounds matches min and max", () => {
  const r = calculateClamp(14, 22, 375, 1280, 16);
  assert.ok(Math.abs(r.intercept + r.slope * 375 - 14) < 1e-9);
  assert.ok(Math.abs(r.intercept + r.slope * 1280 - 22) < 1e-9);
});

test("calculateClamp: reverse scaling sorts the clamp bounds", () => {
  const r = calculateClamp(24, 16, 320, 1280, 16);
  assert.equal(r.isNegativeVw, true);
  assert.match(r.clampRem, /^clamp\(1\.000rem, .*-0\.833vw, 1\.500rem\)$/);
});

test("calculateClamp: equal min and max gives a flat line", () => {
  const r = calculateClamp(16, 16, 320, 1280, 16);
  assert.equal(r.vwFixed, "0.000");
  assert.equal(r.clampRem, "clamp(1.000rem, 1.000rem + 0.000vw, 1.000rem)");
  assert.equal(r.isNegativeVw, false);
});

test("calculateClamp: root size changes rem but not px", () => {
  const a = calculateClamp(16, 24, 320, 1280, 16);
  const b = calculateClamp(16, 24, 320, 1280, 20);
  assert.equal(a.clampPx, b.clampPx);
  assert.notEqual(a.clampRem, b.clampRem);
});

test("getClampValue picks the right unit", () => {
  const r = calculateClamp(16, 24, 320, 1280, 16);
  assert.equal(getClampValue(r, "px"), r.clampPx);
  assert.equal(getClampValue(r, "em"), r.clampEm);
  assert.equal(getClampValue(r, "rem"), r.clampRem);
  assert.equal(getClampValue(r, "unknown"), r.clampRem);
});

test("generateBreakpointTable: zones and clamping", () => {
  const rows = generateBreakpointTable(16, 24, 375, 1280);
  const at = (s) => rows.find((r) => r.screen === s);
  assert.equal(at(320).zone, "min");
  assert.equal(at(320).size, 16);
  assert.equal(at(768).zone, "fluid");
  assert.equal(at(1920).zone, "max");
  assert.equal(at(1920).size, 24);
});

test("generateTypeScale: seven steps and base equals input", () => {
  const scale = generateTypeScale(16, 20, 375, 1280, 16, 1.25);
  assert.equal(scale.length, 7);
  const base = scale.find((s) => s.label === "base");
  assert.equal(base.minPx, "16.0");
  assert.equal(base.maxPx, "20.0");
});

test("generateGraphData: stays inside the clamp bounds", () => {
  const pts = generateGraphData(16, 24, 320, 1280);
  assert.ok(pts.length > 10);
  for (const p of pts) assert.ok(p.size >= 16 && p.size <= 24);
});

test("getPreviewFontSize: midpoint and clamped ends", () => {
  assert.equal(getPreviewFontSize(16, 24, 320, 1280, 800), "20.0");
  assert.equal(getPreviewFontSize(16, 24, 320, 1280, 100), "16.0");
  assert.equal(getPreviewFontSize(16, 24, 320, 1280, 4000), "24.0");
});

test("getFormulaSteps agrees with calculateClamp", () => {
  const s = getFormulaSteps(16, 24, 320, 1280, 16);
  const r = calculateClamp(16, 24, 320, 1280, 16);
  assert.equal(s.vwResult, r.vwFixed);
  assert.equal(s.interceptRem, r.interceptRem);
});
