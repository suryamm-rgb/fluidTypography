"use client";

export default function PalettePreview({ palette, theme }) {
  const isDark = theme === "dark";

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 mb-6">
      {Object.entries(palette).map(([key, value]) => (
        <div
          key={key}
          className={`p-3 sm:p-4 rounded text-xs font-mono ${
            isDark ? "text-white" : "text-black"
          }`}
          style={{ background: value }}
        >
          {key}
          <br />
          {value}
        </div>
      ))}
    </div>
  );
}
