"use client";
import { useId, useMemo, useState } from "react";
import Header from "./Header";
import { ToastProvider } from "./Toast";
import Card from "./Card";
import Tabs, { panelId, tabId } from "./Tabs";
import NumberField from "./NumberField";
import CodeBlock from "./CodeBlock";
import CopyButton from "./CopyButton";
import EmptyState from "./EmptyState";
import ScaleGraph from "./ScaleGraph";
import SpacingPreview from "./SpacingPreview";
import Alert from "./Alert";
import { TrashIcon } from "./Icons";
import { computeClamp, valueAtVw, validateSpacing, PRESETS, PROPERTIES, PROPERTY_COLORS } from "../lib/spacing";

const TABS = [
  { id: "generator", label: "Generator" },
  { id: "scale", label: "Scale" },
  { id: "docs", label: "Docs" },
];
let nextId = 1;

export default function FluidSpacingGenerator() {
  const uid = useId();
  const [minPx, setMinPx] = useState(16);
  const [maxPx, setMaxPx] = useState(48);
  const [minVw, setMinVw] = useState(320);
  const [maxVw, setMaxVw] = useState(1280);
  const [property, setProperty] = useState("padding");
  const [previewRaw, setPreviewRaw] = useState(768);
  const [tab, setTab] = useState("generator");
  const [saved, setSaved] = useState([]);
  const [name, setName] = useState("");

  const errors = useMemo(() => validateSpacing({ minPx, maxPx, minVw, maxVw }), [minPx, maxPx, minVw, maxVw]);
  const valid = Object.keys(errors).length === 0;

  const rangeMin = Math.max(100, minVw - 100);
  const rangeMax = maxVw + 100;
  const previewVw = Math.min(rangeMax, Math.max(rangeMin, previewRaw));
  const color = PROPERTY_COLORS[property];

  const clampVal = valid ? computeClamp(minPx, maxPx, minVw, maxVw) : "";
  const cssOutput = `${property}: ${clampVal};`;
  const curVal = valid ? valueAtVw(minPx, maxPx, minVw, maxVw, previewVw) : 0;
  const valueAt = (s) => valueAtVw(minPx, maxPx, minVw, maxVw, s);

  const addToList = (e) => {
    e.preventDefault();
    const label = name.trim() || `${property}-${minPx}-${maxPx}`;
    setSaved((prev) => [...prev, { id: nextId++, name: label, property, clamp: clampVal, minPx, maxPx, minVw, maxVw }]);
    setName("");
  };

  const rootCss = `:root {\n${saved.map((s) => `  --${s.name.replace(/\s+/g, "-")}: ${s.clamp};`).join("\n")}\n}`;

  const scaleRows = valid
    ? PRESETS.map((p) => ({ ...p, clamp: computeClamp(p.minPx, p.maxPx, minVw, maxVw), cur: valueAtVw(p.minPx, p.maxPx, minVw, maxVw, previewVw) }))
    : [];
  const scaleCss = `:root {\n${scaleRows.map((p) => `  --space-${p.name}: ${p.clamp};`).join("\n")}\n}`;

  const slider = (id) => (
    <div className="field">
      <label className="field__label" htmlFor={`${uid}-${id}`}>
        Preview width: <span className="mono">{previewVw}px</span>
      </label>
      <input
        id={`${uid}-${id}`}
        className="range"
        type="range"
        min={rangeMin}
        max={rangeMax}
        value={previewVw}
        style={{ "--fill": `${((previewVw - rangeMin) / (rangeMax - rangeMin)) * 100}%` }}
        onChange={(e) => setPreviewRaw(Number(e.target.value))}
      />
    </div>
  );

  const panel = (id, children) => (
    <div role="tabpanel" id={panelId("sp", id)} aria-labelledby={tabId("sp", id)} className="stack" tabIndex={-1}>
      {children}
    </div>
  );

  let content;
  if (!valid) {
    content = panel(
      tab,
      <section className="card" aria-live="polite">
        <EmptyState tone="error" title="Fix the highlighted settings">
          {Object.values(errors)[0]} Your clamp() will appear here as soon as every field is valid.
        </EmptyState>
      </section>,
    );
  } else if (tab === "generator") {
    content = panel(
      "generator",
      <>
        <Card id="sp-output" title="Your clamp()" subtitle={`${property} grows from ${minPx}px to ${maxPx}px.`}>
          <CodeBlock code={cssOutput} label="Generated CSS" wrap large />
          <div className="output-actions">
            <CopyButton text={cssOutput} label="Copy CSS" variant="primary" toast="CSS copied!" />
          </div>
          <form className="inline-form" onSubmit={addToList}>
            <label className="sr-only" htmlFor={`${uid}-name`}>
              Name for this value
            </label>
            <input id={`${uid}-name`} className="input" placeholder="Name, e.g. section-gap" value={name} maxLength={40} onChange={(e) => setName(e.target.value)} />
            <button className="btn" type="submit">
              Add to list
            </button>
          </form>
        </Card>

        <div className="pair">
          <Card id="sp-preview" title="Live preview" subtitle={`${property} at ${previewVw}px is ${Math.round(curVal)}px`}>
            {slider("w")}
            <div className="preview-stage">
              <SpacingPreview property={property} px={Math.round(curVal)} color={color} />
            </div>
          </Card>
          <ScaleGraph
            minFont={minPx}
            maxFont={maxPx}
            minScreen={minVw}
            maxScreen={maxVw}
            rangeMin={rangeMin}
            rangeMax={rangeMax}
            previewScreen={previewVw}
            setPreviewScreen={setPreviewRaw}
            previewFontSize={String(Math.round(curVal * 10) / 10)}
            valueAt={valueAt}
            title="Scaling curve"
            subtitle="Spacing across viewport widths. Drag on the chart to move the marker."
            noun="Spacing"
          />
        </div>

        <dl className="stats stats--4">
          {[
            { label: "At min viewport", val: `${minPx}px`, sub: `${(minPx / 16).toFixed(3)}rem` },
            { label: "At max viewport", val: `${maxPx}px`, sub: `${(maxPx / 16).toFixed(3)}rem` },
            { label: "Current", val: `${Math.round(curVal)}px`, sub: `${(curVal / 16).toFixed(3)}rem` },
            { label: "Scale factor", val: minPx > 0 ? `${(maxPx / minPx).toFixed(2)}×` : "n/a", sub: `${maxPx - minPx}px range` },
          ].map((s) => (
            <div className="stat" key={s.label}>
              <dt>{s.label}</dt>
              <dd>
                <strong style={{ color }}>{s.val}</strong>
                <small>{s.sub}</small>
              </dd>
            </div>
          ))}
        </dl>

        <Card
          id="sp-saved"
          title="Saved values"
          subtitle={saved.length ? `${saved.length} saved this session` : "Add values to copy them together."}
          actions={saved.length > 0 && <button type="button" className="btn btn--ghost" onClick={() => setSaved([])}>Clear all</button>}
        >
          {saved.length === 0 ? (
            <EmptyState small title="Nothing saved yet">
              Press “Add to list” to keep a value for this session.
            </EmptyState>
          ) : (
            <>
              <ul className="saved-list" style={{ marginTop: 0 }}>
                {saved.map((s) => (
                  <li className="saved-item" key={s.id}>
                    <div className="saved-item__main">
                      <p className="saved-item__name">{s.name}</p>
                      <p className="saved-item__meta">
                        {s.property} · {s.minPx}→{s.maxPx}px · {s.minVw}→{s.maxVw}px
                      </p>
                    </div>
                    <button type="button" className="btn btn--ghost" aria-label={`Delete ${s.name}`} onClick={() => setSaved((p) => p.filter((x) => x.id !== s.id))}>
                      <TrashIcon size={16} />
                      Delete
                    </button>
                  </li>
                ))}
              </ul>
              <div style={{ marginTop: "var(--space-3)" }}>
                <CodeBlock code={rootCss} label="Saved values as CSS variables" />
              </div>
              <div className="output-actions">
                <CopyButton text={rootCss} label="Copy :root {}" variant="primary" toast="Saved values copied!" />
              </div>
            </>
          )}
        </Card>
      </>,
    );
  } else if (tab === "scale") {
    content = panel(
      "scale",
      <Card id="sp-scale" title="Spacing scale" subtitle="Seven steps, xs to 3xl, for the same viewport range." actions={<CopyButton text={scaleCss} label="Copy :root {}" variant="primary" toast="Scale copied!" />}>
        {slider("s")}
        <ul className="scale-grid" style={{ listStyle: "none", padding: 0 }}>
          {scaleRows.map((p) => (
            <li key={p.name} className="scale-card">
              <div className="scale-card__top">
                <span className="scale-card__name">{p.name}</span>
                <span className="scale-card__meta">
                  {p.minPx} → {p.maxPx}px · now {Math.round(p.cur)}px
                </span>
              </div>
              <div className="bp-bar" style={{ width: "100%", height: 8, marginLeft: 0 }} aria-hidden="true">
                <i style={{ width: `${(p.cur / p.maxPx) * 100}%`, background: color }} />
              </div>
              <div className="scale-card__value">
                <code>--space-{p.name}: {p.clamp}</code>
                <CopyButton text={`${property}: ${p.clamp};`} label={`Copy ${p.name}`} iconOnly ariaLabel={`Copy ${p.name} as ${property}`} toast={`${p.name} copied!`} />
              </div>
            </li>
          ))}
        </ul>
        <CodeBlock code={scaleCss} label="Spacing scale as CSS variables" />
      </Card>,
    );
  } else {
    content = panel(
      "docs",
      <Card id="sp-docs" title="How fluid spacing works" subtitle="The same idea as fluid type, applied to space.">
        <div className="stack" style={{ gap: "var(--space-3)" }}>
          <p>
            Spacing is a straight line between a min size at the min viewport and a max size at the max viewport. <code>clamp()</code> cuts it off at both ends.
          </p>
          <CodeBlock code={"clamp(minRem, slope·vw + interceptRem, maxRem)"} label="Formula" wrap />
          <Alert variant="info" title="Spacing and zoom">
            <p>Spacing can use <code>vw</code> more safely than text, because WCAG 1.4.4 is about text size. Keep the <code>rem</code> part, so user font settings still count.</p>
          </Alert>
          <p>Full documentation is in the <code>docs</code> folder of the project.</p>
        </div>
      </Card>,
    );
  }

  return (
    <ToastProvider>
      <div className="ft">
        <a className="skip-link" href="#main">
          Skip to content
        </a>
        <Header title="Fluid Spacing" />
        <main id="main" tabIndex={-1}>
          <div className="container">
            <section className="intro" aria-labelledby="page-title">
              <p className="eyebrow">CSS utility</p>
              <h1 id="page-title">
                Fluid space, <em>calculated.</em>
              </h1>
              <p>Generate clamp() values for padding, margin and gap that scale with the screen.</p>
            </section>
            <div className="layout">
              <aside className="sidebar" aria-label="Settings">
                <Card id="sp-inputs" title="Settings" subtitle="Space grows from min to max across the viewport range.">
                  <div className="stack">
                    <div role="group" aria-labelledby={`${uid}-prop`}>
                      <p id={`${uid}-prop`} className="eyebrow" style={{ marginBottom: "var(--space-2)" }}>
                        Property
                      </p>
                      <div className="chips">
                        {PROPERTIES.map((p) => (
                          <button key={p} type="button" className="chip" aria-pressed={property === p} onClick={() => setProperty(p)}>
                            {p}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div role="group" aria-labelledby={`${uid}-pre`}>
                      <p id={`${uid}-pre`} className="eyebrow" style={{ marginBottom: "var(--space-2)" }}>
                        Presets
                      </p>
                      <div className="chips">
                        {PRESETS.map((p) => (
                          <button key={p.name} type="button" className="chip" aria-pressed={minPx === p.minPx && maxPx === p.maxPx} onClick={() => { setMinPx(p.minPx); setMaxPx(p.maxPx); }}>
                            {p.name}
                            <small>{p.minPx}–{p.maxPx}</small>
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="fields-grid">
                      <NumberField label="Min size" value={minPx} error={errors.minPx} onChange={setMinPx} sliderMin={0} sliderMax={256} />
                      <NumberField label="Max size" value={maxPx} error={errors.maxPx} onChange={setMaxPx} sliderMin={0} sliderMax={256} />
                      <NumberField label="Min viewport" value={minVw} error={errors.minVw} onChange={setMinVw} sliderMin={240} sliderMax={1600} />
                      <NumberField label="Max viewport" value={maxVw} error={errors.maxVw} onChange={setMaxVw} sliderMin={400} sliderMax={2560} />
                    </div>
                  </div>
                </Card>
              </aside>
              <div className="results stack">
                <Tabs items={TABS} value={tab} onChange={setTab} prefix="sp" label="Tool sections" className="tabs--main" />
                {content}
              </div>
            </div>
          </div>
        </main>
        <footer className="site-footer">
          <div className="container">
            <span>Built by Surya M M</span>
          </div>
        </footer>
      </div>
    </ToastProvider>
  );
}
