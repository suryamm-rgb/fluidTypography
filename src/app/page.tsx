import Link from "next/link";

const tools = [
  {
    href: "/fluid-typography",
    label: "Fluid Typography",
    description:
      "Generate CSS clamp() formulas that scale smoothly between screen sizes.",
    tag: "CSS Utility",
  },
  // Add more tools here later
];

export default function Home() {
  return (
    <div className="min-h-screen bg-[#080808] text-[#e0e0e0] px-6 py-12 font-(family-name:--font-dm-mono)">
      <div className="max-w-170 mx-auto">
        {/* Header */}
        <div className="mb-12">
          <span className="inline-block bg-[#1a1a1a] border border-[#2a2a2a] rounded px-2.5 py-1 text-[11px] text-[#666] uppercase tracking-widest mb-4">
            Developer Tools
          </span>
          <h1 className="font-(family-name:--font-syne) text-4xl font-extrabold text-white leading-none tracking-tight">
            CSS Utilities
          </h1>
          <p className="text-[#444] text-[13px] mt-2.5 leading-relaxed">
            A collection of small tools to make your frontend workflow faster.
          </p>
        </div>

        {/* Tool Cards */}
        <div className="flex flex-col gap-3">
          {tools.map((tool) => (
            <Link
              key={tool.href}
              href={tool.href}
              className="group bg-[#0d0d0d] border border-[#1e1e1e] hover:border-violet-400/40 rounded-2xl p-6 transition-all duration-200 no-underline"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <span className="inline-block bg-[#1a1a1a] border border-[#2a2a2a] rounded px-2 py-0.5 text-[10px] text-[#555] uppercase tracking-widest mb-3">
                    {tool.tag}
                  </span>
                  <h2 className="font-(family-name:--font-syne) text-lg font-bold text-white m-0 group-hover:text-violet-400 transition-colors">
                    {tool.label}
                  </h2>
                  <p className="text-[#444] text-[12px] mt-1.5 leading-relaxed m-0">
                    {tool.description}
                  </p>
                </div>
                <span className="text-[#333] group-hover:text-violet-400 transition-colors text-xl mt-1 shrink-0">
                  →
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
