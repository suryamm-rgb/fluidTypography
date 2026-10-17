// Takes full-page screenshots of the tool at 375, 768 and 1440px, light and dark.
// Needs a running server.  Run: npm run build && npm start   (port 3000)
// then:  node scripts/screenshots.mjs [baseUrl]
import { chromium } from "playwright";
import { mkdirSync } from "node:fs";

const base = process.argv[2] ?? "http://localhost:3000";
const out = new URL("../docs/screenshots/", import.meta.url).pathname;
mkdirSync(out, { recursive: true });

const widths = [375, 768, 1440];
const browser = await chromium.launch();

for (const theme of ["light", "dark"]) {
  for (const width of widths) {
    const context = await browser.newContext({
      viewport: { width, height: 900 },
      colorScheme: theme,
      reducedMotion: "reduce",
    });
    const page = await context.newPage();
    await page.goto(`${base}/fluid-typography`, { waitUntil: "networkidle" });
    await page.waitForSelector(".chart svg");
    await page.screenshot({ path: `${out}${width}-${theme}.png`, fullPage: true });
    console.log(`saved ${width}-${theme}.png`);
    await context.close();
  }
}
await browser.close();
