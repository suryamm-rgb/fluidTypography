"use client";
import NumberField from "./NumberField";
import Card from "./Card";

export const PRESETS = [
  { id: "body", label: "Body", min: 16, max: 18 },
  { id: "heading", label: "Heading", min: 24, max: 40 },
  { id: "hero", label: "Hero", min: 36, max: 72 },
  { id: "caption", label: "Caption", min: 12, max: 14 },
];

const ROOT_SIZES = [14, 16, 18, 20];

export default function InputPanel({
  minFont,
  maxFont,
  minScreen,
  maxScreen,
  rootSize,
  errors,
  onChange, // (patch) => void
  reverse,
  onToggleReverse,
}) {
  return (
    <Card id="inputs" title="Settings" subtitle="Font size grows from min to max across the screen range.">
      <div className="stack">
        <div role="group" aria-labelledby="preset-label">
          <p id="preset-label" className="eyebrow" style={{ marginBottom: "var(--space-2)" }}>
            Presets
          </p>
          <div className="chips">
            {PRESETS.map((p) => (
              <button
                key={p.id}
                type="button"
                className="chip"
                aria-pressed={minFont === p.min && maxFont === p.max}
                onClick={() => onChange({ minFont: p.min, maxFont: p.max })}
              >
                {p.label}
                <small>
                  {p.min}–{p.max}
                </small>
              </button>
            ))}
          </div>
        </div>

        <div className="fields-grid">
          <NumberField
            label="Min font size"
            value={minFont}
            error={errors.minFont}
            onChange={(v) => onChange({ minFont: v })}
            sliderMin={8}
            sliderMax={160}
            step={0.5}
          />
          <NumberField
            label="Max font size"
            value={maxFont}
            error={errors.maxFont}
            onChange={(v) => onChange({ maxFont: v })}
            sliderMin={8}
            sliderMax={160}
            step={0.5}
          />
          <NumberField
            label="Min screen"
            value={minScreen}
            error={errors.minScreen}
            onChange={(v) => onChange({ minScreen: v })}
            sliderMin={240}
            sliderMax={1600}
          />
          <NumberField
            label="Max screen"
            value={maxScreen}
            error={errors.maxScreen}
            onChange={(v) => onChange({ maxScreen: v })}
            sliderMin={400}
            sliderMax={2560}
          />
        </div>

        <hr className="divider" style={{ margin: 0 }} />

        <div role="group" aria-labelledby="root-label">
          <p id="root-label" className="field__label" style={{ marginBottom: "var(--space-1)" }}>
            Root font size
          </p>
          <p className="field__hint" style={{ marginBottom: "var(--space-2)" }}>
            Used to convert px to rem. Browser default is 16px.
          </p>
          <div className="chips" style={{ marginBottom: "var(--space-3)" }}>
            {ROOT_SIZES.map((s) => (
              <button
                key={s}
                type="button"
                className="chip"
                aria-pressed={rootSize === s}
                onClick={() => onChange({ rootSize: s })}
              >
                {s}px
              </button>
            ))}
          </div>
          <NumberField
            label="Custom root size"
            value={rootSize}
            error={errors.rootSize}
            onChange={(v) => onChange({ rootSize: v })}
          />
        </div>

        <hr className="divider" style={{ margin: 0 }} />

        <div className="switch-row">
          <div>
            <p id="reverse-label" className="field__label">
              Reverse scaling
            </p>
            <p id="reverse-desc" className="field__hint">
              Text gets smaller as the screen gets wider (negative vw).
            </p>
          </div>
          <button
            type="button"
            role="switch"
            className="switch"
            aria-checked={reverse}
            aria-labelledby="reverse-label"
            aria-describedby="reverse-desc"
            onClick={onToggleReverse}
          />
        </div>
      </div>
    </Card>
  );
}
