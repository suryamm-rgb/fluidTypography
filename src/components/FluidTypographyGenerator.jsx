"use client";
import { useCallback, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import Header, { REPO_URL } from "./Header";
import { ToastProvider } from "./Toast";
import Tabs, { panelId, tabId } from "./Tabs";
import InputPanel from "./InputPanel";
import OutputCard from "./OutputCard";
import LivePreview from "./LivePreview";
import ScaleGraph from "./ScaleGraph";
import FormulaPanel from "./FormulaPanel";
import BreakpointTable from "./BreakpointTable";
import TypeScale from "./TypeScale";
import ExportPanel from "./ExportPanel";
import SavedConfigs from "./SavedConfigs";
import AccessibilityWarning from "./AccessibilityWarning";
import EmptyState from "./EmptyState";
import DocsPanel from "./DocsPanel";
import { useTheme } from "./useTheme";
import { calculateClamp, generateTypeScale, getPreviewFontSize } from "./CalculateClamp";
import { validateInputs } from "../lib/validate";

const TABS = [
  { id: "Single", label: "Single" },
  { id: "Type Scale", label: "Type Scale" },
  { id: "Export", label: "Export" },
];
const TAB_IDS = TABS.map((t) => t.id);
const UNITS = ["rem", "px", "em"];
const DEFAULTS = { minFont: 12, maxFont: 20, minScreen: 375, maxScreen: 1280, rootSize: 16, previewScreen: 800 };

function numParam(params, key, fallback) {
  const raw = params.get(key);
  const n = raw !== null && raw.trim() !== "" ? Number(raw) : NaN;
  return Number.isFinite(n) ? n : fallback;
}
function enumParam(params, key, allowed, fallback) {
  const v = params.get(key);
  return allowed.includes(v) ? v : fallback;
}

export default function FluidTypographyGenerator() {
  const params = useSearchParams();
  const { theme } = useTheme();
  const [format, setFormat] = useState("CSS");

  // All settings live in the URL, so a refresh or a shared link restores them.
  const minFont = numParam(params, "minFont", DEFAULTS.minFont);
  const maxFont = numParam(params, "maxFont", DEFAULTS.maxFont);
  const minScreen = numParam(params, "minScreen", DEFAULTS.minScreen);
  const maxScreen = numParam(params, "maxScreen", DEFAULTS.maxScreen);
  const rootSize = numParam(params, "rootSize", DEFAULTS.rootSize);
  const rawPreview = numParam(params, "previewScreen", DEFAULTS.previewScreen);
  const activeTab = enumParam(params, "tab", TAB_IDS, "Single");
  const unit = enumParam(params, "unit", UNITS, "rem");
  const reverse = params.get("reverse") === "1";

  const setParams = useCallback((patch) => {
    // Read the live URL, not a stale render, so quick slider drags never lose updates.
    const next = new URLSearchParams(window.location.search);
    for (const [k, v] of Object.entries(patch)) {
      if (v === null || v === undefined) next.delete(k);
      else next.set(k, String(v));
    }
    window.history.replaceState(window.history.state, "", `?${next.toString()}`);
  }, []);

  const errors = useMemo(
    () => validateInputs({ minFont, maxFont, minScreen, maxScreen, rootSize }),
    [minFont, maxFont, minScreen, maxScreen, rootSize],
  );
  const isValid = Object.keys(errors).length === 0;

  const effMin = reverse ? maxFont : minFont;
  const effMax = reverse ? minFont : maxFont;

  // The preview slider covers a little more than the fluid range on both sides.
  const rangeMin = Math.max(200, minScreen - 100);
  const rangeMax = maxScreen + 100;
  const previewScreen = Math.min(rangeMax, Math.max(rangeMin, Math.round(rawPreview)));

  const calc = useMemo(() => {
    if (!isValid) return null;
    return {
      result: calculateClamp(effMin, effMax, minScreen, maxScreen, rootSize),
      scale: generateTypeScale(effMin, effMax, minScreen, maxScreen, rootSize, 1.25),
      previewFontSize: getPreviewFontSize(effMin, effMax, minScreen, maxScreen, previewScreen),
    };
  }, [isValid, effMin, effMax, minScreen, maxScreen, rootSize, previewScreen]);

  const onInputChange = useCallback((patch) => setParams(patch), [setParams]);

  const panel = (id, children) => (
    <div role="tabpanel" id={panelId("main", id)} aria-labelledby={tabId("main", id)} className="stack" tabIndex={-1}>
      {children}
    </div>
  );

  let content;
  if (!isValid) {
    content = panel(
      activeTab,
      <section className="card" aria-live="polite">
        <EmptyState tone="error" title="Fix the highlighted settings">
          {Object.values(errors)[0]} Your clamp() will appear here as soon as every field is valid.
        </EmptyState>
      </section>,
    );
  } else if (activeTab === "Single") {
    content = panel(
      "Single",
      <>
        <AccessibilityWarning isNegativeVw={calc.result.isNegativeVw} />
        <OutputCard
          result={calc.result}
          minFont={effMin}
          maxFont={effMax}
          minScreen={minScreen}
          maxScreen={maxScreen}
          unit={unit}
          setUnit={(v) => setParams({ unit: v })}
          format={format}
          setFormat={setFormat}
        />
        <div className="pair">
          <LivePreview
            rangeMin={rangeMin}
            rangeMax={rangeMax}
            minScreen={minScreen}
            maxScreen={maxScreen}
            previewScreen={previewScreen}
            setPreviewScreen={(v) => setParams({ previewScreen: v })}
            previewFontSize={calc.previewFontSize}
          />
          <ScaleGraph
            minFont={effMin}
            maxFont={effMax}
            minScreen={minScreen}
            maxScreen={maxScreen}
            rangeMin={rangeMin}
            rangeMax={rangeMax}
            previewScreen={previewScreen}
            setPreviewScreen={(v) => setParams({ previewScreen: v })}
            previewFontSize={calc.previewFontSize}
          />
        </div>
        <FormulaPanel minFont={effMin} maxFont={effMax} minScreen={minScreen} maxScreen={maxScreen} rootSize={rootSize} />
        <BreakpointTable minFont={effMin} maxFont={effMax} minScreen={minScreen} maxScreen={maxScreen} />
      </>,
    );
  } else if (activeTab === "Type Scale") {
    content = panel(
      "Type Scale",
      <TypeScale
        minFont={effMin}
        maxFont={effMax}
        minScreen={minScreen}
        maxScreen={maxScreen}
        rootSize={rootSize}
        unit={unit}
        setUnit={(v) => setParams({ unit: v })}
        previewScreen={previewScreen}
        setPreviewScreen={(v) => setParams({ previewScreen: v })}
        rangeMin={rangeMin}
        rangeMax={rangeMax}
      />,
    );
  } else {
    content = panel(
      "Export",
      <>
        <ExportPanel
          result={calc.result}
          scale={calc.scale}
          unit={unit}
          minFont={effMin}
          maxFont={effMax}
          minScreen={minScreen}
          maxScreen={maxScreen}
          format={format}
          setFormat={setFormat}
        />
        <SavedConfigs current={{ minFont: effMin, maxFont: effMax, minScreen, maxScreen, rootSize }} unit={unit} />
      </>,
    );
  }

  return (
    <ToastProvider>
      <div className="ft">
        <a className="skip-link" href="#main">
          Skip to content
        </a>
        <Header />
        <main id="main" tabIndex={-1}>
          <div className="container">
            <section className="intro" aria-labelledby="page-title">
              <p className="eyebrow">CSS utility</p>
              <h1 id="page-title">
                Fluid type, <em>calculated.</em>
              </h1>
              <p>Generate CSS clamp() values that scale smoothly between screen sizes.</p>
            </section>

            <div className="layout">
              <aside className="sidebar" aria-label="Settings">
                <InputPanel
                  minFont={minFont}
                  maxFont={maxFont}
                  minScreen={minScreen}
                  maxScreen={maxScreen}
                  rootSize={rootSize}
                  errors={errors}
                  onChange={onInputChange}
                  reverse={reverse}
                  onToggleReverse={() => setParams({ reverse: reverse ? "0" : "1" })}
                />
              </aside>

              <div className="results stack">
                <Tabs items={TABS} value={activeTab} onChange={(v) => setParams({ tab: v })} prefix="main" label="Tool sections" className="tabs--main" />
                {content}
                <DocsPanel theme={theme} />
              </div>
            </div>
          </div>
        </main>
        <footer className="site-footer">
          <div className="container">
            <span>Built by Surya M M</span>
            <a href={REPO_URL} target="_blank" rel="noopener noreferrer">
              Source on GitHub<span className="sr-only"> (opens in a new tab)</span>
            </a>
          </div>
        </footer>
      </div>
    </ToastProvider>
  );
}
