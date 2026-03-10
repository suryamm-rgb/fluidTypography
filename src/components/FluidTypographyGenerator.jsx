"use client";
import { useState, useMemo } from "react";
import Link from "next/link";
import InputPanel from "./InputPanel";
import ClampResult from "./ClampResult";
import ScaleGraph from "./ScaleGraph";
import LivePreview from "./LivePreview";
import TypeScale from "./TypeScale";
import AccessibilityWarning from "./Accessibilitywarning";
import BreakpointTable from "./Breakpointtable";
import FormulaPanel from "./Formulapanel ";
import {
  calculateClamp,
  generateGraphData,
  generateTypeScale,
  getPreviewFontSize,
} from "./Calculateclamp";

const TABS = ["Single", "Type Scale"];

export default function FluidTypographyGenerator() {
  const [minFont, setMinFont] = useState(12);
  const [maxFont, setMaxFont] = useState(20);
  const [minScreen, setMinScreen] = useState(375);
  const [maxScreen, setMaxScreen] = useState(1280);
  const [rootSize, setRootSize] = useState(16);
  const [previewScreen, setPreviewScreen] = useState(800);
  const [activeTab, setActiveTab] = useState("Single");
  const [unit, setUnit] = useState("rem");
  const [reverseScale, setReverseScale] = useState(false);

  // If reverse mode, swap min/max font so vw becomes negative
  const effectiveMin = reverseScale ? maxFont : minFont;
  const effectiveMax = reverseScale ? minFont : maxFont;

  const result = useMemo(
    () =>
      calculateClamp(
        effectiveMin,
        effectiveMax,
        minScreen,
        maxScreen,
        rootSize,
      ),
    [effectiveMin, effectiveMax, minScreen, maxScreen, rootSize],
  );

  const graphData = useMemo(
    () => generateGraphData(effectiveMin, effectiveMax, minScreen, maxScreen),
    [effectiveMin, effectiveMax, minScreen, maxScreen],
  );

  const typeScale = useMemo(
    () => generateTypeScale(minFont, maxFont, minScreen, maxScreen, rootSize),
    [minFont, maxFont, minScreen, maxScreen, rootSize],
  );

  const previewFontSize = useMemo(
    () =>
      getPreviewFontSize(
        effectiveMin,
        effectiveMax,
        minScreen,
        maxScreen,
        previewScreen,
      ),
    [effectiveMin, effectiveMax, minScreen, maxScreen, previewScreen],
  );

  return (
    <div className="min-h-screen bg-[#080808] text-[#e0e0e0] font-mono px-6 py-12 box-border">
      <div className="max-w-170 mx-auto">
        {/* Header */}
        <div className="mb-12">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-[11px] text-[#555] hover:text-violet-400 transition-colors mb-6 no-underline uppercase tracking-widest"
          >
            ← Back
          </Link>
          <span className="block bg-[#1a1a1a] border border-[#2a2a2a] rounded px-2.5 py-1 text-[11px] text-[#666] uppercase tracking-widest mb-4 font-mono w-fit">
            CSS Utility
          </span>
          <h1 className="font-(family-name:--font-syne) text-[clamp(28px,5vw,42px)] font-extrabold text-white m-0 leading-none tracking-tight">
            Fluid Typography
          </h1>
          <p className="text-[#444] text-[13px] mt-2.5 leading-relaxed">
            Generate CSS <span className="text-violet-400">clamp()</span>{" "}
            formulas that scale smoothly between screen sizes.
          </p>
        </div>

        {/* Inputs */}
        <InputPanel
          minFont={minFont}
          setMinFont={setMinFont}
          maxFont={maxFont}
          setMaxFont={setMaxFont}
          minScreen={minScreen}
          setMinScreen={setMinScreen}
          maxScreen={maxScreen}
          setMaxScreen={setMaxScreen}
          rootSize={rootSize}
          setRootSize={setRootSize}
        />

        {/* Reverse scale toggle */}
        <div className="bg-[#0d0d0d] border border-[#1e1e1e] rounded-2xl px-6 py-4 mb-6 flex items-center justify-between gap-4 flex-wrap">
          <div>
            <p className="text-[11px] text-[#555] uppercase tracking-widest font-mono mb-0.5">
              Reverse Scaling
            </p>
            <p className="text-[11px] text-[#333] font-mono">
              Font size <span className="text-[#666]">decreases</span> as screen
              width increases (negative vw)
            </p>
          </div>
          <button
            onClick={() => setReverseScale((v) => !v)}
            className={`relative w-11 h-6 rounded-full border transition-all duration-200 cursor-pointer shrink-0 ${
              reverseScale
                ? "bg-violet-500/30 border-violet-400/50"
                : "bg-[#111] border-[#2a2a2a]"
            }`}
          >
            <span
              className={`absolute top-0.5 w-5 h-5 rounded-full transition-all duration-200 ${
                reverseScale ? "left-4.5 bg-violet-400" : "left-0.5 bg-[#333]"
              }`}
            />
          </button>
        </div>

        {/* Tab switcher */}
        <div className="flex gap-1 mb-6 bg-[#0d0d0d] border border-[#1e1e1e] rounded-xl p-1">
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-2 rounded-lg text-[12px] font-mono tracking-wide cursor-pointer transition-all border ${
                activeTab === tab
                  ? "bg-[#1a1a2e] border-[#3d3d6b] text-violet-400"
                  : "bg-transparent border-transparent text-[#444] hover:text-[#777]"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Accessibility warning — always visible in Single tab */}
        {activeTab === "Single" && (
          <AccessibilityWarning isNegativeVw={result.isNegativeVw} />
        )}

        {/* Tab content */}
        {activeTab === "Single" ? (
          <>
            <ClampResult
              result={result}
              minFont={effectiveMin}
              maxFont={effectiveMax}
              unit={unit}
              setUnit={setUnit}
            />
            <FormulaPanel
              minFont={effectiveMin}
              maxFont={effectiveMax}
              minScreen={minScreen}
              maxScreen={maxScreen}
              rootSize={rootSize}
            />
            <BreakpointTable
              minFont={effectiveMin}
              maxFont={effectiveMax}
              minScreen={minScreen}
              maxScreen={maxScreen}
            />
            <ScaleGraph
              graphData={graphData}
              minScreen={minScreen}
              maxScreen={maxScreen}
            />
            <LivePreview
              minScreen={minScreen}
              maxScreen={maxScreen}
              previewScreen={previewScreen}
              setPreviewScreen={setPreviewScreen}
              previewFontSize={previewFontSize}
            />
          </>
        ) : (
          <TypeScale scale={typeScale} unit={unit} setUnit={setUnit} />
        )}
      </div>
    </div>
  );
}
