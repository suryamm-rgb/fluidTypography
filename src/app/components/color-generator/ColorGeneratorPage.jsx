"use client";

import { useState } from "react";
import ColorInput from "./ColorInput";
import PalettePreview from "./PalettePreview";
import ColorExportPanel from "./ColorExportPanel";
import { generateShades } from "./utils/colorUtils";

export default function ColorGeneratorPage() {
  const [color, setColor] = useState("#6366F1");
  const [theme, setTheme] = useState("dark");

  const isDark = theme === "dark";
  const palette = generateShades(color);

  const bg = isDark ? "bg-[#080808]" : "bg-gray-50";
  const text = isDark ? "text-white" : "text-black";
  const card = isDark
    ? "bg-[#0d0d0d] border-[#1e1e1e]"
    : "bg-white border-gray-200";

  const btn = isDark
    ? "bg-[#111] border-[#2a2a2a] text-[#888] hover:text-white"
    : "bg-white border-gray-200 text-gray-600 hover:text-black";

  return (
    <div className={`min-h-screen ${bg} ${text} p-4 sm:p-6 transition-all`}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h1 className="text-xl sm:text-2xl font-bold">
          🎨 Color Theme Generator
        </h1>

        <button
          onClick={() => setTheme(isDark ? "light" : "dark")}
          className={`px-4 py-2 border rounded-lg text-sm ${btn}`}
        >
          {isDark ? "☀ Light" : "🌙 Dark"}
        </button>
      </div>

      {/* Main Card */}
      <div
        className={`border rounded-2xl p-4 sm:p-6 ${card} max-w-6xl mx-auto`}
      >
        <ColorInput color={color} setColor={setColor} theme={theme} />
        <PalettePreview palette={palette} theme={theme} />
        <ColorExportPanel palette={palette} theme={theme} />
      </div>
    </div>
  );
}
