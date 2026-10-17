// Math and validation for the fluid spacing tool. Pure functions, no React.
// computeClamp and valueAtVw are the original helpers, unchanged.

export function computeClamp(minPx, maxPx, minVw, maxVw) {
  const minRem = +(minPx / 16).toFixed(4);
  const maxRem = +(maxPx / 16).toFixed(4);
  const slope = (maxPx - minPx) / (maxVw - minVw);
  const intercept = minPx / 16 - slope * (minVw / 16);
  const slopeVw = +(slope * 100).toFixed(4);
  const intRem = +intercept.toFixed(4);
  const sign = intRem >= 0 ? "+" : "-";
  return `clamp(${minRem}rem, ${slopeVw}vw ${sign} ${Math.abs(intRem)}rem, ${maxRem}rem)`;
}

export function valueAtVw(minPx, maxPx, minVw, maxVw, vw) {
  if (vw <= minVw) return minPx;
  if (vw >= maxVw) return maxPx;
  return minPx + ((maxPx - minPx) * (vw - minVw)) / (maxVw - minVw);
}

export const PRESETS = [
  { name: "xs", minPx: 4, maxPx: 8 },
  { name: "sm", minPx: 8, maxPx: 16 },
  { name: "md", minPx: 16, maxPx: 32 },
  { name: "lg", minPx: 24, maxPx: 48 },
  { name: "xl", minPx: 32, maxPx: 64 },
  { name: "2xl", minPx: 48, maxPx: 96 },
  { name: "3xl", minPx: 64, maxPx: 128 },
];

export const PROPERTIES = ["padding", "margin", "gap"];

// Theme-aware colors (tokens), so every color keeps AA contrast in both themes.
export const PROPERTY_COLORS = {
  padding: "var(--accent-text)",
  margin: "var(--info)",
  gap: "var(--success)",
};

export const SPACING_LIMITS = {
  size: { min: 0, max: 512 },
  screen: { min: 100, max: 10000 },
};

const inRange = (v, { min, max }, label) =>
  !Number.isFinite(v) ? `${label} must be a number.` : v < min || v > max ? `${label} must be between ${min} and ${max}.` : null;

/** Returns { field: message }. Empty object means valid. */
export function validateSpacing({ minPx, maxPx, minVw, maxVw }) {
  const e = {};
  const set = (k, m) => m && (e[k] = m);
  set("minPx", inRange(minPx, SPACING_LIMITS.size, "Min size"));
  set("maxPx", inRange(maxPx, SPACING_LIMITS.size, "Max size"));
  set("minVw", inRange(minVw, SPACING_LIMITS.screen, "Min viewport"));
  set("maxVw", inRange(maxVw, SPACING_LIMITS.screen, "Max viewport"));
  if (!e.minVw && !e.maxVw && minVw >= maxVw) e.maxVw = "Max viewport must be larger than min viewport.";
  return e;
}
