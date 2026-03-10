"use client";

export default function InputPanel({
  minFont,
  setMinFont,
  maxFont,
  setMaxFont,
  minScreen,
  setMinScreen,
  maxScreen,
  setMaxScreen,
  rootSize,
  setRootSize,
  theme,
}) {
  const isDark = theme === "dark";
  const cardBg = isDark
    ? "bg-[#0d0d0d] border-[#1e1e1e]"
    : "bg-white border-gray-200";
  const inputCls = isDark
    ? "bg-[#111] border-[#2a2a2a] text-white focus:border-violet-400"
    : "bg-gray-50 border-gray-200 text-gray-900 focus:border-violet-400";
  const labelCls = isDark ? "text-[#555]" : "text-gray-400";
  const dividerCls = isDark ? "border-[#1a1a1a]" : "border-gray-100";
  const noteCls = isDark ? "text-[#555]" : "text-gray-600";
  const quickBtnActive =
    "bg-violet-500/20 border-violet-400/50 text-violet-400";
  const quickBtnIdle = isDark
    ? "bg-[#111] border-[#2a2a2a] text-[#555] hover:text-[#888]"
    : "bg-gray-50 border-gray-200 text-gray-400 hover:text-gray-600";

  const fields = [
    { label: "Min Font Size (px)", value: minFont, setter: setMinFont },
    { label: "Max Font Size (px)", value: maxFont, setter: setMaxFont },
    { label: "Min Screen (px)", value: minScreen, setter: setMinScreen },
    { label: "Max Screen (px)", value: maxScreen, setter: setMaxScreen },
  ];

  return (
    <div className={`border rounded-2xl p-7 mb-6 ${cardBg}`}>
      <div className="grid grid-cols-2 gap-5 mb-5">
        {fields.map(({ label, value, setter }) => (
          <div key={label}>
            <label
              className={`block text-[11px] uppercase tracking-widest mb-1.5 font-mono ${labelCls}`}
            >
              {label}
            </label>
            <input
              type="number"
              value={value}
              onChange={(e) => setter(Number(e.target.value))}
              className={`w-full border rounded-lg font-mono text-[15px] px-3.5 py-2.5 outline-none transition-colors ${inputCls}`}
            />
          </div>
        ))}
      </div>

      {/* Root font size */}
      <div className={`border-t pt-5 ${dividerCls}`}>
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div>
            <label
              className={`block text-[11px] uppercase tracking-widest mb-0.5 font-mono ${labelCls}`}
            >
              Root Font Size (px)
            </label>
            <p className={`text-[12px] font-mono ${noteCls}`}>
              Used for rem conversion · browser default is 16px
            </p>
          </div>
          <div className="flex items-center gap-2">
            {[14, 16, 18, 20].map((size) => (
              <button
                key={size}
                onClick={() => setRootSize(size)}
                className={`w-10 h-8 rounded text-[12px] font-mono cursor-pointer transition-all border ${
                  rootSize === size ? quickBtnActive : quickBtnIdle
                }`}
              >
                {size}
              </button>
            ))}
            <input
              type="number"
              value={rootSize}
              onChange={(e) => setRootSize(Number(e.target.value))}
              className={`w-16 border rounded-lg font-mono text-[13px] px-2.5 py-1.5 outline-none transition-colors text-center ${inputCls}`}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
