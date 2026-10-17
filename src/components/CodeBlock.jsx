import { tokenize } from "../lib/highlight";

export default function CodeBlock({ code, label, wrap = false, large = false }) {
  return (
    <div className={`code${wrap ? " code--wrap" : ""}${large ? " code--lg" : ""}`}>
      {/* tabIndex makes the scrollable region reachable by keyboard */}
      <pre tabIndex={0} aria-label={label}>
        <code>
          {tokenize(code).map((t, i) =>
            t.type ? (
              <span key={i} className={`tok-${t.type}`}>
                {t.text}
              </span>
            ) : (
              t.text
            ),
          )}
        </code>
      </pre>
    </div>
  );
}
