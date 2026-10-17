"use client";
import { useRef } from "react";
import Card from "./Card";
import { useElementSize } from "./useElementSize";
import { getPreviewFontSize } from "./CalculateClamp";

const M = { top: 14, right: 14, bottom: 34, left: 48 };

/**
 * Flat → diagonal → flat chart, drawn as plain SVG.
 * It measures its container, so labels stay 12px at every width.
 * The marker follows previewScreen, and dragging the chart sets it.
 */
export default function ScaleGraph({
  minFont,
  maxFont,
  minScreen,
  maxScreen,
  rangeMin,
  rangeMax,
  previewScreen,
  setPreviewScreen,
  previewFontSize,
  valueAt, // optional: (screen) => number. Defaults to the font-size formula.
  title = "Scale graph",
  subtitle = "Font size across screen widths. Drag on the chart to move the marker.",
  noun = "Font size",
}) {
  const box = useRef(null);
  const svg = useRef(null);
  const { width, height } = useElementSize(box);

  const f = valueAt ?? ((s) => parseFloat(getPreviewFontSize(minFont, maxFont, minScreen, maxScreen, s)));
  const lo = Math.min(minFont, maxFont);
  const hi = Math.max(minFont, maxFont);
  const pad = hi === lo ? 2 : (hi - lo) * 0.18;
  const yLo = lo - pad;
  const yHi = hi + pad;

  const innerW = Math.max(0, width - M.left - M.right);
  const innerH = Math.max(0, height - M.top - M.bottom);
  const x = (s) => M.left + ((s - rangeMin) / (rangeMax - rangeMin)) * innerW;
  const y = (v) => M.top + (1 - (v - yLo) / (yHi - yLo)) * innerH;

  const pts = [rangeMin, minScreen, maxScreen, rangeMax].map((s) => [x(s), y(f(s))]);
  const path = pts.map(([px, py], i) => `${i ? "L" : "M"}${px.toFixed(1)} ${py.toFixed(1)}`).join(" ");

  const mx = x(previewScreen);
  const my = y(parseFloat(previewFontSize));
  const pillText = `${previewScreen}px → ${previewFontSize}px`;
  const pillW = pillText.length * 7.3 + 16;
  const flip = mx > M.left + innerW * 0.55;
  const pillX = flip ? mx - pillW - 8 : mx + 8;

  const scrub = (e) => {
    const rect = svg.current.getBoundingClientRect();
    const t = (e.clientX - rect.left - M.left) / innerW;
    const s = Math.round(rangeMin + Math.min(1, Math.max(0, t)) * (rangeMax - rangeMin));
    setPreviewScreen(s);
  };
  const onDown = (e) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    scrub(e);
  };
  const onMove = (e) => {
    if (e.currentTarget.hasPointerCapture(e.pointerId)) scrub(e);
  };

  const summary = `${noun} is ${f(minScreen)} pixels up to a ${minScreen} pixel screen, grows to ${f(maxScreen)} pixels at ${maxScreen} pixels, then stays flat. At ${previewScreen} pixels it is ${previewFontSize} pixels.`;
  const compact = width < 440;

  return (
    <Card id="graph" title={title} subtitle={subtitle}>
      <div className="chart" ref={box}>
        {width > 0 && height > 0 && (
          <svg
            ref={svg}
            viewBox={`0 0 ${width} ${height}`}
            width={width}
            height={height}
            role="img"
            aria-label={summary}
            onPointerDown={onDown}
            onPointerMove={onMove}
          >
            <rect className="zone" x={x(minScreen)} y={M.top} width={Math.max(0, x(maxScreen) - x(minScreen))} height={innerH} />
            {[lo, hi].map((v, i) => (
              <g key={i}>
                <line className="grid" x1={M.left} x2={M.left + innerW} y1={y(v)} y2={y(v)} />
                <text x={M.left - 8} y={y(v)} textAnchor="end" dominantBaseline="middle">
                  {Number(v.toFixed(1))}px
                </text>
              </g>
            ))}
            {[minScreen, maxScreen].map((s, i) => (
              <g key={s}>
                <line className="guide" x1={x(s)} x2={x(s)} y1={M.top} y2={M.top + innerH} />
                <text x={x(s)} y={M.top + innerH + 20} textAnchor={compact ? (i ? "end" : "start") : "middle"}>
                  {s}px
                </text>
              </g>
            ))}
            <path className="line" d={path} />
            <line className="marker-guide" x1={mx} x2={mx} y1={M.top} y2={M.top + innerH} />
            <circle className="marker" cx={mx} cy={my} r={6} />
            <g transform={`translate(${Math.max(M.left, Math.min(pillX, width - M.right - pillW))} ${M.top + 6})`}>
              <rect className="marker-pill" width={pillW} height={24} rx={12} />
              <text className="marker-label" x={pillW / 2} y={12} textAnchor="middle" dominantBaseline="middle">
                {pillText}
              </text>
            </g>
          </svg>
        )}
      </div>
      <p className="legend">
        <span>
          <i style={{ background: "var(--chart-zone)", border: "1px solid var(--accent)" }} />
          Fluid zone
        </span>
        <span>
          <i style={{ background: "var(--accent)" }} />
          {noun}
        </span>
      </p>
    </Card>
  );
}
