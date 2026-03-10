export function calculateClamp(minFont, maxFont, minScreen, maxScreen) {
  const slope = (maxFont - minFont) / (maxScreen - minScreen);
  const vw = slope * 100;
  const intercept = minFont - slope * minScreen;

  const minRem = (minFont / 16).toFixed(3);
  const maxRem = (maxFont / 16).toFixed(3);
  const interceptRem = (intercept / 16).toFixed(3);
  const vwFixed = vw.toFixed(3);

  const clampValue = `clamp(${minRem}rem, ${interceptRem}rem + ${vwFixed}vw, ${maxRem}rem)`;
  return { clampValue, minRem, maxRem, interceptRem, vwFixed };
}

export function generateGraphData(minFont, maxFont, minScreen, maxScreen) {
  const slope = (maxFont - minFont) / (maxScreen - minScreen);
  const intercept = minFont - slope * minScreen;
  const points = [];
  const step = (maxScreen - minScreen) / 20;

  for (let s = minScreen - 100; s <= maxScreen + 100; s += step) {
    const rawSize = intercept + slope * s;
    const clamped = Math.min(maxFont, Math.max(minFont, rawSize));
    points.push({
      screen: Math.round(s),
      size: parseFloat(clamped.toFixed(2)),
    });
  }
  return points;
}

export function getPreviewFontSize(
  minFont,
  maxFont,
  minScreen,
  maxScreen,
  previewScreen,
) {
  const slope = (maxFont - minFont) / (maxScreen - minScreen);
  const intercept = minFont - slope * minScreen;
  const raw = intercept + slope * previewScreen;
  return Math.min(maxFont, Math.max(minFont, raw)).toFixed(1);
}
