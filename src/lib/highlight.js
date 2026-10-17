// Tiny tokenizer for the three export languages (CSS, JSON, JS config).
// Returns [{ type, text }]. Types map to .tok-* classes in app.css.

const TOKEN = new RegExp(
  [
    "(\\/\\*[\\s\\S]*?\\*\\/|\\/\\/[^\\n]*)", // 1 comment
    "((?:\"(?:[^\"\\\\]|\\\\.)*\"|'(?:[^'\\\\]|\\\\.)*')(?=\\s*:))", // 2 quoted key
    "(\"(?:[^\"\\\\]|\\\\.)*\"|'(?:[^'\\\\]|\\\\.)*')", // 3 string
    "(--[\\w-]+|[a-zA-Z-]+(?=\\s*:))", // 4 property
    "([a-zA-Z-]+)(?=\\()", // 5 function name
    "(-?\\d*\\.?\\d+(?:px|rem|em|vw|vh|%)?)", // 6 number
    "([{}()\\[\\],;:+])", // 7 punctuation
  ].join("|"),
  "g",
);

const TYPES = [null, "comment", "prop", "str", "prop", "fn", "num", "punct"];

export function tokenize(code) {
  const out = [];
  let last = 0;
  for (const m of code.matchAll(TOKEN)) {
    if (m.index > last) out.push({ type: null, text: code.slice(last, m.index) });
    const group = m.findIndex((g, i) => i > 0 && g !== undefined);
    out.push({ type: TYPES[group], text: m[0] });
    last = m.index + m[0].length;
  }
  if (last < code.length) out.push({ type: null, text: code.slice(last) });
  return out;
}
