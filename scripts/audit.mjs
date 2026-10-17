// Responsive + accessibility audit with Playwright and axe-core.
// Needs a running server.  Run: node scripts/audit.mjs [baseUrl]
// Checks, for every viewport and both themes: horizontal scroll, touch targets
// under 44x44px, and axe-core WCAG A/AA violations.
import { chromium } from "playwright";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";

const base = process.argv[2] ?? "http://localhost:3000";
const axeSource = readFileSync(createRequire(import.meta.url).resolve("axe-core/axe.min.js"), "utf8");

const VIEWPORTS = [
  [320, 700], [375, 812], [414, 896], [768, 1024], [1024, 768],
  [1280, 800], [1440, 900], [1920, 1080], [844, 390], [2560, 1080],
];
const PATHS = ["/fluid-typography", "/fluid-typography?tab=Type%20Scale", "/fluid-typography?tab=Export"];

const browser = await chromium.launch();
let problems = 0;

for (const path of PATHS) {
  for (const [w, h] of VIEWPORTS) {
    for (const theme of ["light", "dark"]) {
      if (theme === "dark" && ![375, 1440].includes(w)) continue;
      const ctx = await browser.newContext({ viewport: { width: w, height: h }, colorScheme: theme, reducedMotion: "reduce", hasTouch: w < 1000 });
      const page = await ctx.newPage();
      await page.goto(base + path, { waitUntil: "networkidle" });
      await page.waitForSelector("main h1");

      const info = await page.evaluate(() => {
        const small = [...document.querySelectorAll("a[href], button, input, select, summary, [role=tab], [role=switch]")]
          .filter((el) => {
            const r = el.getBoundingClientRect();
            const cs = getComputedStyle(el);
            if (!r.width || !r.height || cs.visibility === "hidden") return false;
            if (el.closest(".sr-only") || el.classList.contains("sr-only")) return false;
            const type = el.getAttribute("type");
            return (r.height < 43.5 || r.width < 43.5) && type !== "hidden";
          })
          .map((el) => `${el.tagName.toLowerCase()}.${el.className || el.getAttribute("aria-label") || el.textContent.slice(0, 20)} ${Math.round(el.getBoundingClientRect().width)}x${Math.round(el.getBoundingClientRect().height)}`);
        return { overflow: document.documentElement.scrollWidth - innerWidth, small };
      });

      await page.addScriptTag({ content: axeSource });
      const axe = await page.evaluate(() => axe.run(document, { runOnly: ["wcag2a", "wcag2aa", "wcag21aa", "best-practice"] }));
      const v = axe.violations.map((x) => `${x.id} (${x.nodes.length}): ${x.nodes[0].target.join(" ")}`);

      const tag = `${path} ${w}x${h} ${theme}`;
      if (info.overflow > 0) { problems++; console.log(`OVERFLOW ${tag}: +${info.overflow}px`); }
      if (info.small.length) { problems++; console.log(`SMALL TARGETS ${tag}:\n  ${[...new Set(info.small)].slice(0, 6).join("\n  ")}`); }
      if (v.length) { problems++; console.log(`AXE ${tag}:\n  ${v.join("\n  ")}`); }
      await ctx.close();
    }
  }
}
await browser.close();
console.log(problems ? `\n${problems} problem group(s)` : "\nAll checks passed");
process.exit(problems ? 1 : 0);
