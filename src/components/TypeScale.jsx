"use client";
import { useState } from "react";
import { getClampValue } from "./Calculateclamp";

export default function TypeScale({ scale, unit }) {
  const [copiedIndex, setCopiedIndex] = useState(null);
  const [copiedAll, setCopiedAll] = useState(false);

  const handleCopy = (value, index) => {
    navigator.clipboard.writeText(value);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleCopyAll = () => {
    const all = scale
      .map(({ token, result }) => `${token}: ${getClampValue(result, unit)};`)
      .join("\n");
    const wrapped = `:root {\n${all
      .split("\n")
      .map((l) => `  ${l}`)
      .join("\n")}\n}`;
    navigator.clipboard.writeText(wrapped);
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 2000);
  };

  return (
    <div className="bg-[#0d0d0d] border border-[#1e1e1e] rounded-2xl p-7 mb-6">
      <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
        <div>
          <p className="text-[11px] text-[#555] uppercase tracking-widest font-mono">
            Type Scale
          </p>
          <p className="text-[11px] text-[#333] font-mono mt-0.5">
            xs → 3xl · modular scale ×1.25
          </p>
        </div>
        <button
          onClick={handleCopyAll}
          className={`text-[11px] font-mono px-4 py-2 rounded-lg border cursor-pointer transition-all ${
            copiedAll
              ? "bg-[#1a2e1a] border-[#2d5a2d] text-green-400"
              : "bg-[#111] border-[#2a2a2a] text-[#555] hover:text-violet-400 hover:border-violet-400/30"
          }`}
        >
          {copiedAll ? "✓ Copied :root {}" : "Copy :root {}"}
        </button>
      </div>

      <div className="flex flex-col gap-2">
        {scale.map(({ label, token, minPx, maxPx, result }, i) => {
          const value = getClampValue(result, unit);
          const isCopied = copiedIndex === i;
          const isBase = label === "base";

          return (
            <div
              key={label}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl border transition-colors ${
                isBase
                  ? "bg-violet-500/5 border-violet-400/20"
                  : "bg-[#111] border-[#1a1a1a]"
              }`}
            >
              {/* Label */}
              <span
                className={`w-10 shrink-0 text-[11px] uppercase tracking-widest font-mono ${
                  isBase ? "text-violet-400" : "text-[#444]"
                }`}
              >
                {label}
              </span>

              {/* Size range */}
              <span className="w-28 shrink-0 text-[11px] text-[#333] font-mono">
                {minPx}px → {maxPx}px
              </span>

              {/* Clamp value */}
              <span className="flex-1 min-w-0 text-[12px] text-[#666] font-mono truncate">
                {token}: <span className="text-[#888]">{value}</span>
              </span>

              {/* Copy button */}
              <button
                onClick={() => handleCopy(`${token}: ${value};`, i)}
                className={`shrink-0 text-[10px] font-mono px-2.5 py-1 rounded border cursor-pointer transition-all ${
                  isCopied
                    ? "text-green-400 border-[#2d5a2d] bg-[#1a2e1a]"
                    : "text-[#444] border-[#222] hover:text-violet-400 hover:border-violet-400/30 bg-transparent"
                }`}
              >
                {isCopied ? "✓" : "copy"}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
