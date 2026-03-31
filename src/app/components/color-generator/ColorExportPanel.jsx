"use client";

import { useState } from "react";

export default function ColorExportPanel({ palette, theme }) {
  const [tab, setTab] = useState("css");
  const [copied, setCopied] = useState(false);
  const [colorName, setColorName] = useState("primary"); // 🔥 NEW

  const isDark = theme === "dark";

  const codeBg = isDark
    ? "bg-[#111] text-violet-400"
    : "bg-gray-50 text-violet-600";

  // ✅ USE USER NAME HERE
  const css = `:root {\n${Object.entries(palette)
    .map(([k, v]) => `  --${colorName}-${k}: ${v};`)
    .join("\n")}\n}`;

  const tailwind = `theme: {
  extend: {
    colors: {
      ${colorName}: ${JSON.stringify(palette, null, 2)}
    }
  }
}`;

  const inline = `{
  backgroundColor: "${palette[500]}",
  color: "#fff"
}`;

  const json = JSON.stringify({ [colorName]: palette }, null, 2);

  const getCode = () => {
    if (tab === "css") return css;
    if (tab === "tailwind") return tailwind;
    if (tab === "inline") return inline;
    return json;
  };

  const copy = () => {
    navigator.clipboard.writeText(getCode());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="border rounded-2xl p-4 sm:p-5">
      {/* 🔥 NAME INPUT */}
      <div className="mb-4">
        <label className="text-xs font-mono block mb-1">Color Name</label>
        <input
          type="text"
          value={colorName}
          onChange={(e) => setColorName(e.target.value.replace(/\s+/g, "-"))}
          placeholder="primary / brand / accent"
          className="border px-3 py-2 rounded w-full sm:w-60"
        />
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 mb-4">
        {["css", "tailwind", "inline", "json"].map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-3 py-1 border rounded text-xs sm:text-sm ${
              tab === t ? "bg-violet-500 text-white" : ""
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Code */}
      <div className="flex flex-col sm:flex-row gap-3">
        <pre
          className={`flex-1 text-xs p-3 rounded overflow-auto max-h-60 ${codeBg}`}
        >
          {getCode()}
        </pre>

        <button
          onClick={copy}
          className="px-4 py-2 border rounded w-full sm:w-auto"
        >
          {copied ? "✓ Copied" : "Copy"}
        </button>
      </div>
    </div>
  );
}
