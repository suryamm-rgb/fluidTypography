"use client";
import { useId, useMemo, useState } from "react";
import Card from "./Card";
import Tabs from "./Tabs";
import CopyButton from "./CopyButton";
import { generateTypeScale, getClampValue, getPreviewFontSize } from "./CalculateClamp";

const RATIOS = [
  { label: "Minor Second", value: 1.067 },
  { label: "Major Second", value: 1.125 },
  { label: "Minor Third", value: 1.2 },
  { label: "Major Third", value: 1.25 },
  { label: "Perfect Fourth", value: 1.333 },
  { label: "Augmented Fourth", value: 1.414 },
  { label: "Perfect Fifth", value: 1.5 },
  { label: "Golden Ratio", value: 1.618 },
];
const LINE_HEIGHTS = [
  { label: "Tight", value: 1.1 },
  { label: "Snug", value: 1.25 },
  { label: "Normal", value: 1.5 },
  { label: "Relaxed", value: 1.625 },
];
const UNITS = [
  { id: "rem", label: "rem" },
  { id: "px", label: "px" },
  { id: "em", label: "em" },
];
const SAMPLES = ["Aa", "The quick brown fox", "Fluid typography scales smoothly"];

const USAGE = {
  xs: "Caption / badge",
  sm: "Helper / footnote",
  base: "Body text",
  lg: "Card title",
  xl: "Section heading",
  "2xl": "Page heading",
  "3xl": "Hero headline",
};

export default function TypeScale({
  minFont,
  maxFont,
  minScreen,
  maxScreen,
  rootSize,
  unit,
  setUnit,
  previewScreen,
  setPreviewScreen,
  rangeMin,
  rangeMax,
}) {
  const uid = useId();
  const [ratio, setRatio] = useState(1.25);
  const [ratioDraft, setRatioDraft] = useState("1.25");
  const [lineHeight, setLineHeight] = useState(1.5);
  const [sample, setSample] = useState(SAMPLES[1]);

  const scale = useMemo(
    () => generateTypeScale(minFont, maxFont, minScreen, maxScreen, rootSize, ratio),
    [minFont, maxFont, minScreen, maxScreen, rootSize, ratio],
  );

  // Largest first, judged by the real size at the preview width.
  const rows = useMemo(
    () =>
      scale
        .map((s) => ({
          ...s,
          live: parseFloat(getPreviewFontSize(parseFloat(s.minPx), parseFloat(s.maxPx), minScreen, maxScreen, previewScreen)),
        }))
        .sort((a, b) => b.live - a.live),
    [scale, minScreen, maxScreen, previewScreen],
  );

  const fill = ((previewScreen - rangeMin) / (rangeMax - rangeMin)) * 100;
  const allCss = `:root {\n${scale
    .map(({ token, result }) => `  ${token}: ${getClampValue(result, unit)}; /* line-height: ${lineHeight} */`)
    .join("\n")}\n}`;

  const setRatioFromText = (text) => {
    setRatioDraft(text);
    const n = Number(text);
    if (Number.isFinite(n) && n >= 1.001 && n <= 3) setRatio(n);
  };
  const ratioInvalid = !(Number(ratioDraft) >= 1.001 && Number(ratioDraft) <= 3);
  const ratioName = RATIOS.find((r) => r.value === ratio)?.label ?? "Custom";

  return (
    <Card
      id="scale"
      title="Type scale"
      subtitle={`${ratioName} · ×${ratio} per step`}
      actions={
        <>
          <Tabs items={UNITS} value={unit} onChange={setUnit} prefix={`${uid}-unit`} label="Unit" className="tabs--inline tabs--mono" />
          <CopyButton text={allCss} label="Copy :root {}" variant="primary" toast="Type scale copied!" />
        </>
      }
    >
      <div className="panel-inset">
        <p className="eyebrow" id={`${uid}-ratio`} style={{ marginBottom: "var(--space-2)" }}>
          Modular ratio
        </p>
        <div className="chips" role="group" aria-labelledby={`${uid}-ratio`}>
          {RATIOS.map((r) => (
            <button
              key={r.value}
              type="button"
              className="chip"
              title={r.label}
              aria-pressed={ratio === r.value}
              onClick={() => {
                setRatio(r.value);
                setRatioDraft(String(r.value));
              }}
            >
              ×{r.value}
            </button>
          ))}
        </div>
        <div className="field" style={{ marginTop: "var(--space-3)", maxWidth: "12rem" }}>
          <label className="field__label" htmlFor={`${uid}-custom`}>
            Custom ratio
          </label>
          <input
            id={`${uid}-custom`}
            className="input"
            type="number"
            inputMode="decimal"
            step="0.001"
            min="1.001"
            max="3"
            value={ratioDraft}
            aria-invalid={ratioInvalid ? "true" : undefined}
            onChange={(e) => setRatioFromText(e.target.value)}
          />
          {ratioInvalid && <p className="field__error">Use a number from 1.001 to 3.</p>}
        </div>
      </div>

      <div className="panel-inset">
        <p className="eyebrow" id={`${uid}-lh`} style={{ marginBottom: "var(--space-2)" }}>
          Line height
        </p>
        <div className="chips" role="group" aria-labelledby={`${uid}-lh`}>
          {LINE_HEIGHTS.map((l) => (
            <button key={l.value} type="button" className="chip" aria-pressed={lineHeight === l.value} onClick={() => setLineHeight(l.value)}>
              {l.label}
              <small>{l.value}</small>
            </button>
          ))}
        </div>
      </div>

      <div className="panel-inset">
        <label className="field__label" htmlFor={`${uid}-screen`}>
          Preview screen: <span className="mono">{previewScreen}px</span>
        </label>
        <input
          id={`${uid}-screen`}
          className="range"
          type="range"
          min={rangeMin}
          max={rangeMax}
          value={previewScreen}
          onChange={(e) => setPreviewScreen(Number(e.target.value))}
          style={{ "--fill": `${fill}%` }}
        />
        <div className="chips" role="group" aria-label="Sample text">
          {SAMPLES.map((t) => (
            <button key={t} type="button" className="chip" aria-pressed={sample === t} onClick={() => setSample(t)}>
              {t.length > 14 ? `${t.slice(0, 14)}…` : t}
            </button>
          ))}
        </div>
      </div>

      <ul className="scale-grid" style={{ listStyle: "none", padding: 0, marginBottom: 0 }}>
        {rows.map(({ label, token, minPx, maxPx, result, live }) => {
          const value = getClampValue(result, unit);
          return (
            <li key={label} className={`scale-card${label === "base" ? " scale-card--base" : ""}`}>
              <div className="scale-card__top">
                <span className="scale-card__name">{label}</span>
                <span className="scale-card__meta">
                  {parseFloat(minPx).toFixed(1)} → {parseFloat(maxPx).toFixed(1)}px · now {live.toFixed(1)}px
                </span>
              </div>
              <p className="scale-card__sample" style={{ fontSize: `${live}px`, lineHeight }}>
                {sample}
              </p>
              <p className="scale-card__meta">{USAGE[label]}</p>
              <div className="scale-card__value">
                <code>
                  {token}: {value}
                </code>
                <CopyButton
                  text={`${token}: ${value};\nline-height: ${lineHeight};`}
                  label={`Copy ${label}`}
                  iconOnly
                  ariaLabel={`Copy ${label} token`}
                  toast={`${label} copied!`}
                />
              </div>
            </li>
          );
        })}
      </ul>
    </Card>
  );
}
