"use client";
import { useState } from "react";
import Alert from "./Alert";
import { ExternalIcon } from "./Icons";

const LINKS = [
  { label: "WCAG 1.4.4 Resize Text", href: "https://www.w3.org/WAI/WCAG21/Understanding/resize-text.html" },
  { label: "Adrian Roselli on responsive type and zoom", href: "https://adrianroselli.com/2019/12/responsive-type-and-zoom.html" },
  { label: "MDN clamp()", href: "https://developer.mozilla.org/en-US/docs/Web/CSS/clamp" },
];

export default function AccessibilityWarning({ isNegativeVw }) {
  const [zoomDismissed, setZoomDismissed] = useState(false);

  return (
    <>
      {isNegativeVw && (
        <Alert variant="info" title="Reverse scaling is on">
          <p>
            The vw value is negative, so text gets <strong>smaller</strong> as the screen gets wider. This is valid CSS,
            but it is an unusual pattern. Check that it is what you want.
          </p>
        </Alert>
      )}
      {!zoomDismissed && (
        <Alert variant="warning" title="Test browser zoom before you ship" onDismiss={() => setZoomDismissed(true)}>
          <p>
            Text sized with <code>vw</code> inside <code>clamp()</code> can stop users from reaching 200% zoom. That can fail
            WCAG 1.4.4 (Resize Text, level AA). Zoom to 200% and check that the text really doubles.
          </p>
          <div className="alert__links">
            {LINKS.map((l) => (
              <a key={l.href} href={l.href} target="_blank" rel="noopener noreferrer">
                {l.label}
                <ExternalIcon size={12} className="inline-icon" />
                <span className="sr-only"> (opens in a new tab)</span>
              </a>
            ))}
          </div>
        </Alert>
      )}
    </>
  );
}
