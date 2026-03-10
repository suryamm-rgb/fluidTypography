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
}) {
  const fields = [
    { label: "Min Font Size (px)", value: minFont, setter: setMinFont },
    { label: "Max Font Size (px)", value: maxFont, setter: setMaxFont },
    { label: "Min Screen Width (px)", value: minScreen, setter: setMinScreen },
    { label: "Max Screen Width (px)", value: maxScreen, setter: setMaxScreen },
  ];

  return (
    <div className="bg-[#0d0d0d] border border-[#1e1e1e] rounded-2xl p-7 mb-6">
      <div className="grid grid-cols-2 gap-5">
        {fields.map(({ label, value, setter }) => (
          <div key={label}>
            <label className="block text-[11px] text-[#555] uppercase tracking-widest mb-1.5 font-mono">
              {label}
            </label>
            <input
              type="number"
              value={value}
              onChange={(e) => setter(Number(e.target.value))}
              className="w-full bg-[#111] border border-[#2a2a2a] rounded-lg text-white font-mono text-[15px] px-3.5 py-2.5 outline-none focus:border-violet-400 transition-colors"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
