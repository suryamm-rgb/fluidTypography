"use client";
import { useId, useState } from "react";
import { parseNumber } from "../lib/validate";
import { ErrorIcon } from "./Icons";

/**
 * Number input with a px suffix and a linked range slider.
 * The text box keeps its own draft so the user can type "", "1." or "-"
 * without the value jumping. Only valid numbers are sent to onChange.
 */
export default function NumberField({
  label,
  value,
  onChange,
  error,
  hint,
  suffix = "px",
  step = 1,
  sliderMin,
  sliderMax,
  sliderLabel,
}) {
  const uid = useId();
  const [draft, setDraft] = useState(String(value));
  const [typingError, setTypingError] = useState(null);

  // Follow outside changes (preset click, slider, URL) but never fight typing.
  const [prevValue, setPrevValue] = useState(value);
  if (prevValue !== value) {
    setPrevValue(value);
    if (parseNumber(draft) !== value) setDraft(String(value));
    setTypingError(null);
  }

  const shownError = typingError ?? error;
  const errorId = `${uid}-err`;
  const hintId = `${uid}-hint`;
  const describedBy = [shownError ? errorId : null, hint ? hintId : null].filter(Boolean).join(" ") || undefined;

  const onText = (e) => {
    const text = e.target.value;
    setDraft(text);
    const n = parseNumber(text);
    if (n === null) {
      setTypingError(text.trim() === "" ? "Enter a number." : "Use digits only, for example 16 or 16.5.");
    } else {
      setTypingError(null);
      onChange(n);
    }
  };

  const hasSlider = sliderMin !== undefined && sliderMax !== undefined;
  const sliderValue = Math.min(sliderMax, Math.max(sliderMin, Number.isFinite(value) ? value : sliderMin));
  const fill = hasSlider ? ((sliderValue - sliderMin) / (sliderMax - sliderMin)) * 100 : 0;

  return (
    <div className="field field-pair">
      <label className="field__label" htmlFor={`${uid}-n`}>
        {label}
      </label>
      <div className="field__control">
        <input
          id={`${uid}-n`}
          className="input input--suffix"
          type="number"
          inputMode="decimal"
          step={step}
          value={draft}
          onChange={onText}
          aria-invalid={shownError ? "true" : undefined}
          aria-describedby={describedBy}
        />
        <span className="field__suffix" aria-hidden="true">
          {suffix}
        </span>
      </div>
      {hasSlider && (
        <input
          className="range"
          type="range"
          min={sliderMin}
          max={sliderMax}
          step={step}
          value={sliderValue}
          onChange={(e) => {
            const n = Number(e.target.value);
            setDraft(String(n));
            setTypingError(null);
            onChange(n);
          }}
          style={{ "--fill": `${fill}%` }}
          aria-label={sliderLabel ?? `${label} slider`}
        />
      )}
      {hint && (
        <p id={hintId} className="field__hint">
          {hint}
        </p>
      )}
      <div aria-live="polite" className="field-error-slot">
        {shownError && (
          <p id={errorId} className="field__error">
            <ErrorIcon size={16} />
            <span>{shownError}</span>
          </p>
        )}
      </div>
    </div>
  );
}
