"use client";

export default function AccessibilityWarning({ isNegativeVw }) {
  return (
    <div className="bg-[#1a1200] border border-[#3a2800] rounded-2xl p-5 mb-6">
      <div className="flex items-start gap-3">
        <span className="text-amber-400 text-[16px] shrink-0 mt-0.5">⚠</span>
        <div>
          <p className="text-[12px] text-amber-400 font-mono font-semibold mb-1 uppercase tracking-widest">
            WCAG Accessibility Notice
          </p>
          <p className="text-[12px] text-[#886633] font-mono leading-relaxed mb-3">
            Using <span className="text-amber-500">vw</span> in{" "}
            <span className="text-amber-500">clamp()</span> can prevent users
            from scaling text to 200% via browser zoom — a{" "}
            <span className="text-amber-400">WCAG 1.4.4 (Resize Text, AA)</span>{" "}
            failure. Always test zoom behavior before shipping.
          </p>

          {isNegativeVw && (
            <div className="bg-[#1f1500] border border-[#4a3300] rounded-lg px-3.5 py-3 mb-3">
              <p className="text-[11px] text-amber-500 font-mono font-semibold mb-1 uppercase tracking-widest">
                Negative vw — Reverse Scaling Active
              </p>
              <p className="text-[11px] text-[#775522] font-mono leading-relaxed">
                Your config uses a negative vw value. Font size will{" "}
                <span className="text-amber-400">decrease</span> as screen width
                increases. This is valid CSS but an uncommon pattern — verify
                this is intentional.
              </p>
            </div>
          )}

          <div className="flex flex-wrap gap-3 mt-2">
            {[
              {
                label: "WCAG 1.4.4",
                href: "https://www.w3.org/WAI/WCAG21/Understanding/resize-text.html",
              },
              {
                label: "Adrian Roselli's research",
                href: "https://adrianroselli.com/2019/12/responsive-type-and-zoom.html",
              },
              {
                label: "MDN clamp()",
                href: "https://developer.mozilla.org/en-US/docs/Web/CSS/clamp",
              },
            ].map(({ label, href }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[10px] font-mono text-[#664422] hover:text-amber-400 transition-colors border border-[#3a2800] hover:border-amber-400/30 rounded px-2.5 py-1 no-underline"
              >
                {label} ↗
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
