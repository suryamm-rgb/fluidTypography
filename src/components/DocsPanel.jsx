"use client";
import Card from "./Card";

const SECTIONS = [
  {
    title: "What is fluid typography?",
    body: "Font size that changes smoothly with the screen width, instead of jumping at breakpoints. CSS clamp(min, preferred, max) does it with one line.",
  },
  {
    title: "How the formula works",
    body: "The preferred value is a straight line through two points: min size at min screen, max size at max screen. Its slope becomes the vw part. Its intercept becomes the rem part. clamp() keeps the result between min and max.",
    code: "preferred = intercept + slope × 100vw",
  },
  {
    title: "Reverse scaling",
    body: "If the max size is smaller than the min size, the slope is negative. The tool sorts the clamp() bounds so the CSS stays valid. Text shrinks as the screen grows.",
  },
  {
    title: "Accessibility",
    body: "A vw-based size can stop users from zooming text to 200% (WCAG 1.4.4). Keep the rem part in the preferred value, keep the range small, and test with browser zoom before you ship.",
  },
];

export default function DocsPanel() {
  return (
    <Card id="learn" title="How it works" subtitle="A short guide. The full docs live in the repository.">
      <div className="stack" style={{ gap: "var(--space-3)" }}>
        {SECTIONS.map((s) => (
          <details key={s.title} className="panel-inset disclosure">
            <summary>
              <span style={{ fontWeight: 600 }}>{s.title}</span>
              <svg className="chev" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
                <path d="m6 9 6 6 6-6" />
              </svg>
            </summary>
            <p className="card__sub" style={{ marginTop: "var(--space-2)" }}>
              {s.body}
            </p>
            {s.code && (
              <code className="mono" style={{ display: "block", marginTop: "var(--space-2)", color: "var(--accent-text)" }}>
                {s.code}
              </code>
            )}
          </details>
        ))}
      </div>
      <p className="card__sub" style={{ marginTop: "var(--space-4)" }}>
        Full documentation is in the <code>docs</code> folder of the project.
      </p>
    </Card>
  );
}
