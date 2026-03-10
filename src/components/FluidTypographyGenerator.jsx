"use client";
import { useState, useMemo } from "react";
import Link from "next/link";
import InputPanel from "./InputPanel";
import ClampResult from "./ClampResult";
import ScaleGraph from "./ScaleGraph";
import LivePreview from "./LivePreview";
import {
  calculateClamp,
  generateGraphData,
  getPreviewFontSize,
} from "../utils/calculateClamp";

export default function FluidTypographyGenerator() {
  const [minFont, setMinFont] = useState(12);
  const [maxFont, setMaxFont] = useState(20);
  const [minScreen, setMinScreen] = useState(375);
  const [maxScreen, setMaxScreen] = useState(1280);
  const [previewScreen, setPreviewScreen] = useState(800);

  const result = useMemo(
    () => calculateClamp(minFont, maxFont, minScreen, maxScreen),
    [minFont, maxFont, minScreen, maxScreen],
  );

  const graphData = useMemo(
    () => generateGraphData(minFont, maxFont, minScreen, maxScreen),
    [minFont, maxFont, minScreen, maxScreen],
  );

  const previewFontSize = useMemo(
    () =>
      getPreviewFontSize(minFont, maxFont, minScreen, maxScreen, previewScreen),
    [minFont, maxFont, minScreen, maxScreen, previewScreen],
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
            Generate a CSS <span className="text-violet-400">clamp()</span>{" "}
            formula that scales smoothly between screen sizes.
          </p>
        </div>

        <InputPanel
          minFont={minFont}
          setMinFont={setMinFont}
          maxFont={maxFont}
          setMaxFont={setMaxFont}
          minScreen={minScreen}
          setMinScreen={setMinScreen}
          maxScreen={maxScreen}
          setMaxScreen={setMaxScreen}
        />

        <ClampResult result={result} minFont={minFont} maxFont={maxFont} />

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
      </div>
    </div>
  );
}
