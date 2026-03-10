"use client";
import { useState } from "react";
import { getClampValue } from "./Calculateclamp";

const UNITS = ["rem", "px", "em"];

export default function ClampResult({
  result,
  minFont,
  maxFont,
  unit,
  setUnit,
}) {
  const [copied, setCopied] = useState(false);
  const [copiedVar, setCopiedVar] = useState(false);
  const [cssVarName, setCssVarName] = useState("text-base");

  const clampValue = getClampValue(result, unit);
  const cssVarOutput = `--${cssVarName}: ${clampValue};`;

  const handleCopy = () => {
    navigator.clipboard.writeText(clampValue);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCopyVar = () => {
    navigator.clipboard.writeText(cssVarOutput);
    setCopiedVar(true);
    setTimeout(() => setCopiedVar(false), 2000);
  };

  const breakdown = [
    { label: "min", value: `${result.minRem}rem`, sub: `${minFont}px` },
    {
      label: "preferred",
      value: `${result.interceptRem}rem + ${result.vwFixed}vw`,
      sub: "fluid",
    },
    { label: "max", value: `${result.maxRem}rem`, sub: `${maxFont}px` },
  ];

  return (
    <div className="bg-[#0d0d0d] border border-[#1e1e1e] rounded-2xl p-7 mb-6">
      <div className="flex items-center justify-between mb-3.5 flex-wrap gap-3">
        <p className="text-[11px] text-[#555] uppercase tracking-widest font-mono">
          Generated Clamp
        </p>
        {/* Unit switcher */}
        <div className="flex gap-1">
          {UNITS.map((u) => (
            <button
              key={u}
              onClick={() => setUnit(u)}
              className={`px-3 py-1 rounded text-[11px] font-mono tracking-wide cursor-pointer transition-all border ${
                unit === u
                  ? "bg-violet-500/20 border-violet-400/50 text-violet-400"
                  : "bg-[#111] border-[#2a2a2a] text-[#555] hover:text-[#888]"
              }`}
            >
              {u}
            </button>
          ))}
        </div>
      </div>

      {/* Clamp value + copy */}
      <div className="flex items-center gap-3 flex-wrap mb-4">
        <div className="flex-1 min-w-0 bg-[#111] border border-[#222] rounded-lg px-4 py-3.5 text-[14px] text-violet-400 font-mono break-all">
          {clampValue}
        </div>
        <button
          onClick={handleCopy}
          className={`shrink-0 rounded-lg px-5 py-3.5 text-[12px] font-mono tracking-wide cursor-pointer transition-all duration-200 border ${
            copied
              ? "bg-[#1a2e1a] border-[#2d5a2d] text-green-400"
              : "bg-[#1a1a2e] border-[#3d3d6b] text-violet-400 hover:bg-[#22224a]"
          }`}
        >
          {copied ? "✓ Copied" : "Copy"}
        </button>
      </div>

      {/* CSS Variable output */}
      <div className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-xl p-4 mb-4">
        <p className="text-[10px] text-[#444] uppercase tracking-widest mb-3 font-mono">
          CSS Variable
        </p>
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-[#444] font-mono text-[13px]">--</span>
          <input
            type="text"
            value={cssVarName}
            onChange={(e) => setCssVarName(e.target.value.replace(/^--/, ""))}
            className="bg-[#111] border border-[#2a2a2a] rounded px-2.5 py-1.5 text-[13px] text-violet-300 font-mono outline-none focus:border-violet-400 transition-colors w-28"
          />
          <span className="text-[#333] font-mono text-[12px] flex-1 min-w-0 break-all">
            : {clampValue};
          </span>
          <button
            onClick={handleCopyVar}
            className={`shrink-0 text-[11px] font-mono px-3 py-1.5 rounded border cursor-pointer transition-all ${
              copiedVar
                ? "text-green-400 border-[#2d5a2d] bg-[#1a2e1a]"
                : "text-[#444] border-[#222] hover:text-violet-400 hover:border-violet-400/30 bg-transparent"
            }`}
          >
            {copiedVar ? "✓" : "copy"}
          </button>
        </div>
      </div>

      {/* Breakdown cards */}
      <div className="flex gap-3 flex-wrap">
        {breakdown.map((item) => (
          <div
            key={item.label}
            className="flex-1 min-w-[100px] bg-[#111] border border-[#1e1e1e] rounded-lg px-3.5 py-3"
          >
            <p className="text-[10px] text-[#444] uppercase tracking-widest mb-1 font-mono">
              {item.label}
            </p>
            <p className="text-[13px] text-[#e0e0e0] font-mono">{item.value}</p>
            <p className="text-[11px] text-[#555] mt-0.5 font-mono">
              {item.sub}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
