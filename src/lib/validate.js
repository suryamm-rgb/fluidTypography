// Input validation. The calculator itself is never called with invalid input,
// because equal screens would divide by zero and produce NaN / Infinity.

export const LIMITS = {
  font: { min: 1, max: 500 },
  screen: { min: 100, max: 10000 },
  rootSize: { min: 8, max: 32 },
};

const FIELD_LABELS = {
  minFont: "Min font size",
  maxFont: "Max font size",
  minScreen: "Min screen",
  maxScreen: "Max screen",
  rootSize: "Root font size",
};

function checkRange(value, { min, max }, label) {
  if (typeof value !== "number" || !Number.isFinite(value))
    return `${label} must be a number.`;
  if (value < min || value > max)
    return `${label} must be between ${min} and ${max}.`;
  return null;
}

/** Returns an object of { field: message }. Empty object means valid. */
export function validateInputs({
  minFont,
  maxFont,
  minScreen,
  maxScreen,
  rootSize,
}) {
  const errors = {};
  const set = (field, msg) => {
    if (msg) errors[field] = msg;
  };

  set("minFont", checkRange(minFont, LIMITS.font, FIELD_LABELS.minFont));
  set("maxFont", checkRange(maxFont, LIMITS.font, FIELD_LABELS.maxFont));
  set("minScreen", checkRange(minScreen, LIMITS.screen, FIELD_LABELS.minScreen));
  set("maxScreen", checkRange(maxScreen, LIMITS.screen, FIELD_LABELS.maxScreen));
  set("rootSize", checkRange(rootSize, LIMITS.rootSize, FIELD_LABELS.rootSize));

  if (!errors.minScreen && !errors.maxScreen && minScreen >= maxScreen) {
    errors.maxScreen = "Max screen must be larger than min screen.";
  }
  return errors;
}

/** Parse a text field. Returns null for empty or non-numeric text. */
export function parseNumber(text) {
  if (typeof text !== "string" || text.trim() === "") return null;
  const n = Number(text);
  return Number.isFinite(n) ? n : null;
}
