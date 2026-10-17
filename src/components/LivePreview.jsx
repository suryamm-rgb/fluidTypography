"use client";
import { useEffect, useId, useState } from "react";
import Card from "./Card";

const FONTS = [
  { group: "App", label: "Inter", value: "var(--font-inter), system-ui, sans-serif" },
  { group: "App", label: "JetBrains Mono", value: "var(--font-jetbrains), ui-monospace, monospace" },
  { group: "System", label: "System UI", value: "system-ui, sans-serif" },
  { group: "System", label: "Georgia", value: "Georgia, serif" },
  { group: "System", label: "Courier", value: "'Courier New', monospace" },
  // Google fonts: loaded only when picked, so they cost nothing until used.
  { group: "Sans", label: "Outfit", value: "'Outfit', sans-serif", google: "Outfit" },
  { group: "Sans", label: "Plus Jakarta Sans", value: "'Plus Jakarta Sans', sans-serif", google: "Plus+Jakarta+Sans" },
  { group: "Sans", label: "DM Sans", value: "'DM Sans', sans-serif", google: "DM+Sans" },
  { group: "Sans", label: "Manrope", value: "'Manrope', sans-serif", google: "Manrope" },
  { group: "Display", label: "Fraunces", value: "'Fraunces', serif", google: "Fraunces" },
  { group: "Display", label: "Playfair Display", value: "'Playfair Display', serif", google: "Playfair+Display" },
  { group: "Display", label: "Space Grotesk", value: "'Space Grotesk', sans-serif", google: "Space+Grotesk" },
  { group: "Serif", label: "Lora", value: "'Lora', serif", google: "Lora" },
  { group: "Serif", label: "Merriweather", value: "'Merriweather', serif", google: "Merriweather" },
  { group: "Mono", label: "Fira Code", value: "'Fira Code', monospace", google: "Fira+Code" },
  { group: "Mono", label: "IBM Plex Mono", value: "'IBM Plex Mono', monospace", google: "IBM+Plex+Mono" },
];
const GROUPS = ["App", "System", "Sans", "Display", "Serif", "Mono"];

const TEXTS = [
  "The quick brown fox jumps over the lazy dog",
  "Fluid typography scales smoothly between breakpoints",
  "Pack my box with five dozen liquor jugs",
];

function loadGoogleFont(family) {
  const id = `gf-${family}`;
  if (document.getElementById(id)) return;
  const link = document.createElement("link");
  link.id = id;
  link.rel = "stylesheet";
  link.href = `https://fonts.googleapis.com/css2?family=${family}:wght@400;600;700&display=swap`;
  document.head.appendChild(link);
}

export default function LivePreview({ rangeMin, rangeMax, minScreen, maxScreen, previewScreen, setPreviewScreen, previewFontSize }) {
  const uid = useId();
  const [fontValue, setFontValue] = useState(FONTS[0].value);
  const [textIdx, setTextIdx] = useState(0); // -1 = custom
  const [custom, setCustom] = useState("");

  const font = FONTS.find((f) => f.value === fontValue) ?? FONTS[0];
  useEffect(() => {
    if (font.google) loadGoogleFont(font.google);
  }, [font]);

  const text = textIdx === -1 ? custom || "Type your own text…" : TEXTS[textIdx];
  const span = rangeMax - rangeMin;
  const fill = ((previewScreen - rangeMin) / span) * 100;
  // The frame is always at least 38% wide so it stays readable at tiny widths.
  const framePct = 38 + (fill / 100) * 62;
  const zone = previewScreen <= minScreen ? "min size" : previewScreen >= maxScreen ? "max size" : "fluid zone";

  return (
    <Card
      id="preview"
      title="Live preview"
      subtitle="Drag to resize the frame and see the font size change."
      actions={
        <p className="readout" aria-hidden="true">
          <span>
            screen <b>{previewScreen}px</b>
          </span>
          <span>
            font <b>{previewFontSize}px</b>
          </span>
        </p>
      }
    >
      <label className="field__label" htmlFor={`${uid}-w`}>
        Screen width
      </label>
      <input
        id={`${uid}-w`}
        className="range"
        type="range"
        min={rangeMin}
        max={rangeMax}
        step={1}
        value={previewScreen}
        onChange={(e) => setPreviewScreen(Number(e.target.value))}
        style={{ "--fill": `${fill}%` }}
        aria-valuetext={`${previewScreen} pixels wide, font size ${previewFontSize} pixels, ${zone}`}
      />
      <div className="preview-stage">
        <div className="preview-frame" style={{ width: `${framePct}%` }}>
          <div className="preview-frame__bar">
            <span className="preview-frame__dots" aria-hidden="true">
              <i />
              <i />
              <i />
            </span>
            <span>
              {previewScreen}px · {zone}
            </span>
          </div>
          <div className="preview-frame__body">
            <p className="preview-text" style={{ fontSize: `${previewFontSize}px`, fontFamily: font.value }}>
              {text}
            </p>
          </div>
        </div>
      </div>

      <div className="control-row">
        <div className="field">
          <label className="field__label" htmlFor={`${uid}-f`}>
            Font family
          </label>
          <select id={`${uid}-f`} className="input select" value={fontValue} onChange={(e) => setFontValue(e.target.value)}>
            {GROUPS.map((g) => (
              <optgroup key={g} label={g}>
                {FONTS.filter((f) => f.group === g).map((f) => (
                  <option key={f.value} value={f.value}>
                    {f.label}
                  </option>
                ))}
              </optgroup>
            ))}
          </select>
        </div>
        <div role="group" aria-labelledby={`${uid}-t`}>
          <p id={`${uid}-t`} className="field__label" style={{ marginBottom: "var(--space-2)" }}>
            Sample text
          </p>
          <div className="chips">
            {TEXTS.map((t, i) => (
              <button key={t} type="button" className="chip" aria-pressed={textIdx === i} onClick={() => setTextIdx(i)}>
                {t.split(" ").slice(0, 3).join(" ")}…
              </button>
            ))}
            <button type="button" className="chip" aria-pressed={textIdx === -1} onClick={() => setTextIdx(-1)}>
              Custom
            </button>
          </div>
          {textIdx === -1 && (
            <input
              className="input input--text"
              style={{ marginTop: "var(--space-2)" }}
              type="text"
              value={custom}
              placeholder="Type your own text"
              aria-label="Custom sample text"
              onChange={(e) => setCustom(e.target.value)}
            />
          )}
        </div>
      </div>
    </Card>
  );
}
