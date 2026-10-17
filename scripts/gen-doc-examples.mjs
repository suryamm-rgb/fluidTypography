// Prints every example value used in the docs, straight from the real code.
// Run: node scripts/gen-doc-examples.mjs
import {
  calculateClamp, generateBreakpointTable, generateTypeScale, getFormulaSteps, getPreviewFontSize,
} from "../src/components/CalculateClamp.js";
import { buildSingle, buildScale } from "../src/lib/exporters.js";
import { validateInputs } from "../src/lib/validate.js";

const show = (title, v) => console.log(`\n### ${title}\n${typeof v === "string" ? v : JSON.stringify(v, null, 2)}`);

const a = [16, 24, 320, 1280, 16];
show("standard 16→24, 320→1280", calculateClamp(...a));
show("steps", getFormulaSteps(...a));
show("preview @800", getPreviewFontSize(16, 24, 320, 1280, 800));
show("reverse 24→16", calculateClamp(24, 16, 320, 1280, 16));
show("equal 16→16", calculateClamp(16, 16, 320, 1280, 16));
show("root 20", calculateClamp(16, 24, 320, 1280, 20));
show("default app 12→20, 375→1280", calculateClamp(12, 20, 375, 1280, 16));
show("breakpoints 16→24", generateBreakpointTable(16, 24, 320, 1280));
show("equal screens validation", validateInputs({ minFont: 16, maxFont: 24, minScreen: 500, maxScreen: 500, rootSize: 16 }));
show("equal screens raw calc (NaN)", calculateClamp(16, 24, 500, 500, 16).clampRem);

const result = calculateClamp(...a);
const scale = generateTypeScale(...a, 1.25);
const args = { result, scale, unit: "rem", name: "text-base", minFont: 16, maxFont: 24, minScreen: 320, maxScreen: 1280 };
for (const f of ["CSS", "JSON", "Tailwind"]) {
  show(`single ${f}`, buildSingle(f, args));
  show(`scale ${f}`, buildScale(f, args));
}
