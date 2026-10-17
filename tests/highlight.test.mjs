import { test } from "node:test";
import assert from "node:assert/strict";
import { tokenize } from "../src/lib/highlight.js";

const join = (t) => t.map((x) => x.text).join("");

test("tokenize never loses or adds characters", () => {
  const samples = [
    ":root {\n  --text-base: clamp(1.000rem, 0.833rem + 0.833vw, 1.500rem);\n}",
    '{\n  "name": "text-base",\n  "value": "clamp(16px, 1vw, 24px)"\n}',
    "// tailwind.config.js\nmodule.exports = { 'fluid-xs': 'clamp(1rem, 2vw, 3rem)' };",
  ];
  for (const s of samples) assert.equal(join(tokenize(s)), s);
});

test("tokenize labels CSS parts", () => {
  const t = tokenize("--a: clamp(1rem, 2vw, 3rem);");
  const type = (text) => t.find((x) => x.text === text)?.type;
  assert.equal(type("--a"), "prop");
  assert.equal(type("clamp"), "fn");
  assert.equal(type("1rem"), "num");
  assert.equal(type("2vw"), "num");
});

test("tokenize treats JSON keys as properties", () => {
  const t = tokenize('{"name": "x"}');
  assert.equal(t.find((x) => x.text === '"name"').type, "prop");
  assert.equal(t.find((x) => x.text === '"x"').type, "str");
});
