"use client";

import { generateBreakpointTable } from "./Calculateclamp";
import { useMemo } from "react";

const ZONE_STYLES = {
  min: { dot: "bg-[#333]", text: "text-[#555]", label: "min" },
  fluid: { dot: "bg-violet-500", text: "text-violet-400", label: "fluid" },
  max: { dot: "bg-[#333]", text: "text-[#555]", label: "max" },
};

// Common device names for labelling
const DEVICE_LABELS = {
  320: "iPhone SE",
  375: "iPhone 14",
  480: "Small mobile",
  640: "Large mobile",
  768: "iPad",
  1024: "iPad Pro",
  1280: "Desktop",
  1440: "Large desktop",
  1920: "Wide screen",
};

export default function BreakpointTable({
  minFont,
  maxFont,
  minScreen,
  maxScreen,
}) {
  const rows = useMemo(
    () => generateBreakpointTable(minFont, maxFont, minScreen, maxScreen),
    [minFont, maxFont, minScreen, maxScreen],
  );

  return (
    <div className="bg-[#0d0d0d] border border-[#1e1e1e] rounded-2xl p-7 mb-6">
      <div className="flex items-center justify-between mb-5 flex-wrap gap-2">
        <p className="text-[11px] text-[#555] uppercase tracking-widest font-mono">
          Breakpoint Table
        </p>
        <div className="flex items-center gap-4">
          {[
            { dot: "bg-[#333]", label: "clamped" },
            { dot: "bg-violet-500", label: "fluid" },
          ].map(({ dot, label }) => (
            <div key={label} className="flex items-center gap-1.5">
              <span className={`w-2 h-2 rounded-full ${dot}`} />
              <span className="text-[10px] text-[#444] font-mono uppercase tracking-widest">
                {label}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-[#1a1a1a]">
        {/* Header */}
        <div className="grid grid-cols-4 bg-[#111] px-4 py-2.5 border-b border-[#1a1a1a]">
          {["Screen", "Device", "Font Size", "Zone"].map((h) => (
            <span
              key={h}
              className="text-[10px] text-[#333] uppercase tracking-widest font-mono"
            >
              {h}
            </span>
          ))}
        </div>

        {/* Rows */}
        {rows.map(({ screen, size, zone }, i) => {
          const style = ZONE_STYLES[zone];
          const device = DEVICE_LABELS[screen] ?? "";
          const isEven = i % 2 === 0;

          return (
            <div
              key={screen}
              className={`grid grid-cols-4 px-4 py-3 items-center border-b border-[#111] last:border-0 ${
                isEven ? "bg-[#0a0a0a]" : "bg-[#0d0d0d]"
              }`}
            >
              {/* Screen */}
              <span className="text-[13px] text-[#e0e0e0] font-mono">
                {screen}px
              </span>

              {/* Device */}
              <span className="text-[11px] text-[#333] font-mono">
                {device}
              </span>

              {/* Font size — bar */}
              <div className="flex items-center gap-2">
                <span
                  className={`text-[13px] font-mono font-semibold ${style.text}`}
                >
                  {size}px
                </span>
                <div className="flex-1 max-w-15 h-1 bg-[#1a1a1a] rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${
                      zone === "fluid" ? "bg-violet-500/60" : "bg-[#2a2a2a]"
                    }`}
                    style={{
                      width: `${((size - minFont) / (maxFont - minFont)) * 100}%`,
                    }}
                  />
                </div>
              </div>

              {/* Zone badge */}
              <div className="flex items-center gap-1.5">
                <span className={`w-1.5 h-1.5 rounded-full ${style.dot}`} />
                <span
                  className={`text-[10px] font-mono uppercase tracking-widest ${style.text}`}
                >
                  {style.label}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
