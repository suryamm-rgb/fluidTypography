"use client";

import { useState } from "react";

export default function ClampResult({ result, minFont, maxFont }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(result.clampValue);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
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
      <p className="text-[11px] text-[#555] uppercase tracking-widest mb-3.5 font-mono">
        Generated Clamp
      </p>

      {/* Clamp value + copy button */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="flex-1 min-w-0 bg-[#111] border border-[#222] rounded-lg px-4 py-3.5 text-[14px] text-violet-400 font-mono break-all">
          {result.clampValue}
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

      {/* Breakdown cards */}
      <div className="flex gap-3 mt-4 flex-wrap">
        {breakdown.map((item) => (
          <div
            key={item.label}
            className="flex-1 min-w-30 bg-[#111] border border-[#1e1e1e] rounded-lg px-3.5 py-3"
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
