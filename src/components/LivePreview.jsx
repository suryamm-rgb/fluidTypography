"use client";

export default function LivePreview({
  minScreen,
  maxScreen,
  previewScreen,
  setPreviewScreen,
  previewFontSize,
}) {
  return (
    <div className="bg-[#0d0d0d] border border-[#1e1e1e] rounded-2xl p-7">
      <div className="flex justify-between items-center mb-5 flex-wrap gap-2">
        <p className="text-[11px] text-[#555] uppercase tracking-widest font-mono">
          Live Preview
        </p>
        <p className="text-[12px] text-[#555] font-mono">
          screen: <span className="text-violet-400">{previewScreen}px</span>
          {" → "}
          font: <span className="text-violet-400">{previewFontSize}px</span>
        </p>
      </div>

      <input
        type="range"
        min={minScreen}
        max={maxScreen}
        value={previewScreen}
        onChange={(e) => setPreviewScreen(Number(e.target.value))}
        className="w-full mb-6 accent-violet-400"
      />

      <div className="bg-[#111] border border-[#1e1e1e] rounded-lg px-6 py-8 text-center">
        <p
          style={{
            fontSize: `${previewFontSize}px`,
            transition: "font-size 0.1s",
          }}
          className="text-[#e0e0e0] m-0 leading-relaxed font-(family-name:--font-syne)"
        >
          The quick brown fox jumps over the lazy dog
        </p>
      </div>
    </div>
  );
}
