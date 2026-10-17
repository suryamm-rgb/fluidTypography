// Pure string builders for every export format.
// No React here, so tests and doc scripts can import this file directly.
import { getClampValue } from "../components/CalculateClamp.js";

export const FORMATS = ["CSS", "JSON", "Tailwind"];

export const FORMAT_META = {
  CSS: { ext: "css", mime: "text/css", language: "css" },
  JSON: { ext: "json", mime: "application/json", language: "json" },
  Tailwind: { ext: "js", mime: "text/javascript", language: "js" },
};

const px = (n) => `${parseFloat(n)}px`;
const range = (a, b) => `${px(a)} → ${px(b)}`;

// ─── Single value ─────────────────────────────────────────────────────────────

export function buildSingle(
  format,
  { result, unit, name, minFont, maxFont, minScreen, maxScreen },
) {
  const value = getClampValue(result, unit);

  if (format === "JSON") {
    return JSON.stringify(
      {
        name,
        value,
        unit,
        fontSize: { min: px(minFont), max: px(maxFont) },
        screen: { min: px(minScreen), max: px(maxScreen) },
      },
      null,
      2,
    );
  }

  if (format === "Tailwind") {
    return `// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      fontSize: {
        /* ${range(minFont, maxFont)} */
        'fluid-${name}': '${value}',
      },
    },
  },
};`;
  }

  return `:root {
  /* ${range(minFont, maxFont)} · screen ${range(minScreen, maxScreen)} */
  --${name}: ${value};
}`;
}

// ─── Type scale ───────────────────────────────────────────────────────────────

export function buildScale(
  format,
  { result, scale, unit, minFont, maxFont, minScreen, maxScreen },
) {
  if (format === "JSON") {
    const scaleObj = Object.fromEntries(
      scale.map(({ label, result: r, minPx, maxPx }) => [
        label,
        { value: getClampValue(r, unit), range: range(minPx, maxPx) },
      ]),
    );
    return JSON.stringify(
      {
        meta: {
          screen: range(minScreen, maxScreen),
          base: range(minFont, maxFont),
          unit,
        },
        single: {
          value: getClampValue(result, unit),
          range: range(minFont, maxFont),
        },
        scale: scaleObj,
      },
      null,
      2,
    );
  }

  if (format === "Tailwind") {
    const entries = scale
      .map(
        ({ label, result: r, minPx, maxPx }) =>
          `        /* ${range(minPx, maxPx)} */\n        'fluid-${label}': '${getClampValue(r, unit)}',`,
      )
      .join("\n");
    return `// tailwind.config.js
// Screen range: ${range(minScreen, maxScreen)}
module.exports = {
  theme: {
    extend: {
      fontSize: {
${entries}
      },
    },
  },
};`;
  }

  const scaleVars = scale
    .map(
      ({ token, result: r, minPx, maxPx }) =>
        `  ${token}: ${getClampValue(r, unit)}; /* ${range(minPx, maxPx)} */`,
    )
    .join("\n");
  return `/* Fluid Typography Export
 * Screen: ${range(minScreen, maxScreen)}
 * Base:   ${range(minFont, maxFont)}
 * Unit:   ${unit}
 */
:root {
${scaleVars}
}`;
}

// ─── Saved configs ────────────────────────────────────────────────────────────

const slug = (name) => name.toLowerCase().trim().replace(/\s+/g, "-");

export function buildSaved(format, configs, unit, calculate) {
  const rows = configs.map((c) => {
    const result = calculate(
      c.minFont,
      c.maxFont,
      c.minScreen,
      c.maxScreen,
      c.rootSize,
    );
    return {
      ...c,
      key: slug(c.name),
      value: getClampValue(result, unit),
      note: `${range(c.minFont, c.maxFont)} | screen ${range(c.minScreen, c.maxScreen)}`,
    };
  });

  if (format === "JSON") {
    return JSON.stringify(
      rows.map((r) => ({
        name: r.name,
        value: r.value,
        range: range(r.minFont, r.maxFont),
        screen: range(r.minScreen, r.maxScreen),
      })),
      null,
      2,
    );
  }
  if (format === "Tailwind") {
    const entries = rows
      .map((r) => `      /* ${r.note} */\n      'fluid-${r.key}': '${r.value}',`)
      .join("\n");
    return `// tailwind.config.js\nmodule.exports = {\n  theme: {\n    extend: {\n      fontSize: {\n${entries}\n      },\n    },\n  },\n};`;
  }
  const lines = rows
    .map((r) => `  --${r.key}: ${r.value}; /* ${r.note} */`)
    .join("\n");
  return `:root {\n${lines}\n}`;
}
