"use client";
import { useState } from "react";
import { getFormulaSteps } from "./Calculateclamp";

function Step({ number, title, calc, result, unit = "", note }) {
  return (
    <div className="flex gap-4 pb-6 last:pb-0">
      {/* Step number + line */}
      <div className="flex flex-col items-center shrink-0">
        <div className="w-6 h-6 rounded-full bg-[#1a1a2e] border border-[#3d3d6b] flex items-center justify-center text-[10px] text-violet-400 font-mono font-bold shrink-0">
          {number}
        </div>
        {number < 4 && <div className="w-px flex-1 bg-[#1e1e1e] mt-2" />}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0 pt-0.5">
        <p className="text-[11px] text-[#555] uppercase tracking-widest font-mono mb-2">
          {title}
        </p>
        <div className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-lg px-4 py-3 mb-2">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <span className="text-[12px] text-[#444] font-mono">{calc}</span>
            <span className="text-[13px] text-violet-400 font-mono font-semibold">
              = {result}
              {unit}
            </span>
          </div>
        </div>
        {note && (
          <p className="text-[11px] text-[#333] font-mono leading-relaxed">
            {note}
          </p>
        )}
      </div>
    </div>
  );
}

export default function FormulaPanel({
  minFont,
  maxFont,
  minScreen,
  maxScreen,
  rootSize,
}) {
  const [open, setOpen] = useState(false);
  const s = getFormulaSteps(minFont, maxFont, minScreen, maxScreen, rootSize);

  return (
    <div className="bg-[#0d0d0d] border border-[#1e1e1e] rounded-2xl mb-6 overflow-hidden">
      {/* Toggle header */}
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between px-7 py-5 cursor-pointer bg-transparent border-0 text-left"
      >
        <div>
          <p className="text-[11px] text-[#555] uppercase tracking-widest font-mono mb-0.5">
            Formula Explanation
          </p>
          <p className="text-[12px] text-[#333] font-mono">
            How <span className="text-violet-400">{s.vwResult}vw</span> and{" "}
            <span className="text-violet-400">{s.interceptRem}rem</span> were
            calculated
          </p>
        </div>
        <span
          className={`text-[#444] font-mono text-[18px] transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        >
          ↓
        </span>
      </button>

      {/* Expandable content */}
      {open && (
        <div className="px-7 pb-7 border-t border-[#1a1a1a] pt-6">
          {/* The goal */}
          <div className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-xl px-4 py-3.5 mb-6">
            <p className="text-[10px] text-[#333] uppercase tracking-widest font-mono mb-2">
              Goal — find v and r so that:
            </p>
            <p className="text-[12px] text-[#666] font-mono">
              font-size ={" "}
              <span className="text-violet-400">
                clamp({s.minRem}rem, {s.interceptRem}rem + {s.vwResult}vw,{" "}
                {s.maxRem}rem)
              </span>
            </p>
            <p className="text-[11px] text-[#333] font-mono mt-2 leading-relaxed">
              where the fluid zone starts at{" "}
              <span className="text-[#666]">{minScreen}px</span> and ends at{" "}
              <span className="text-[#666]">{maxScreen}px</span>
            </p>
          </div>

          <Step
            number={1}
            title="Calculate the slope (how fast font grows per px of screen)"
            calc={`(maxFont − minFont) ÷ (maxScreen − minScreen) = ${s.slopeCalc}`}
            result={s.slopeResult}
            note="The slope tells us the rate of font-size change per pixel of viewport width."
          />

          <Step
            number={2}
            title="Convert slope → vw value"
            calc={`slope × 100 = ${s.vwCalc}`}
            result={s.vwResult}
            unit="vw"
            note="Multiplying by 100 converts the px/px ratio into a vw percentage (1vw = 1% of viewport)."
          />

          <Step
            number={3}
            title="Calculate the intercept (base rem in preferred value)"
            calc={`minFont − (slope × minScreen) = ${s.interceptCalc}`}
            result={`${s.interceptPx}px → ${s.interceptRemCalc} = ${s.interceptRem}rem`}
            note="The intercept anchors the line to your minimum breakpoint. Divide by root font size to convert to rem."
          />

          <Step
            number={4}
            title="Convert min / max font sizes to rem"
            calc={`min: ${s.minRemCalc} | max: ${s.maxRemCalc}`}
            result={`${s.minRem}rem → ${s.maxRem}rem`}
            note="rem values adapt to the user's browser font size preference, unlike px."
          />

          {/* Final result */}
          <div className="bg-[#0f0f1a] border border-[#2a2a4a] rounded-xl px-4 py-4 mt-2">
            <p className="text-[10px] text-[#444] uppercase tracking-widest font-mono mb-3">
              Final clamp()
            </p>
            <p className="text-[13px] text-violet-400 font-mono break-all">
              clamp({s.minRem}rem, {s.interceptRem}rem + {s.vwResult}vw,{" "}
              {s.maxRem}rem)
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
