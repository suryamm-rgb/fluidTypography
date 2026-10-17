// Takes full-page screenshots at 375, 768 and 1440px, light and dark.
// Typography: <width>-<theme>.png. Spacing and home: spacing-/home-<width>-<theme>.png.
// Needs a running server.  Run: npm run build && npm start   (port 3000)
// then:  node scripts/screenshots.mjs [baseUrl]
import { chromium } from "playwright";
import { mkdirSync } from "node:fs";

const base = process.argv[2] ?? "http://localhost:3000";
const out = new URL("../docs/screenshots/", import.meta.url).pathname;
mkdirSync(out, { recursive: true });

const widths = [375, 768, 1440];
const PAGES = [
  { path: "/fluid-typography", prefix: "", wait: ".chart svg" },
  { path: "/fluid-spacing", prefix: "spacing-", wait: ".chart svg" },
  { path: "/", prefix: "home-", wait: "main h1" },
];
const browser = await chromium.launch();

for (const { path, prefix, wait } of PAGES) {
  for (const theme of ["light", "dark"]) {
    for (const width of widths) {
      const context = await browser.newContext({
        viewport: { width, height: 900 },
        colorScheme: theme,
        reducedMotion: "reduce",
      });
      const page = await context.newPage();
      await page.goto(`${base}${path}`, { waitUntil: "networkidle" });
      await page.waitForSelector(wait);
      const file = `${prefix}${width}-${theme}.png`;
      await page.screenshot({ path: `${out}${file}`, fullPage: true });
      console.log(`saved ${file}`);
      await context.close();
    }
  }
}
await browser.close();
