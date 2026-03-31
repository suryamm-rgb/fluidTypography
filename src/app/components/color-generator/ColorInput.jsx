"use client";

export default function ColorInput({ color, setColor, theme }) {
  const isDark = theme === "dark";

  const inputCls = isDark
    ? "bg-[#111] border-[#2a2a2a] text-white"
    : "bg-gray-50 border-gray-200 text-black";

  return (
    <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center mb-6">
      <input
        type="color"
        value={color}
        onChange={(e) => setColor(e.target.value)}
        className="w-12 h-12 border rounded"
      />

      <input
        type="text"
        value={color}
        onChange={(e) => setColor(e.target.value)}
        className={`border px-3 py-2 rounded w-full sm:w-auto ${inputCls}`}
      />
    </div>
  );
}
