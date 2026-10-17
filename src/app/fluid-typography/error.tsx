"use client";
import "../../styles/app.css";

export default function Error({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="ft">
      <div className="container" style={{ paddingBlock: "var(--space-8)" }}>
        <div className="card empty empty--error" role="alert">
          <h2>Something went wrong</h2>
          <p>The generator could not load. Try again, and if it keeps happening please open an issue.</p>
          <button type="button" className="btn btn--primary" onClick={reset}>
            Try again
          </button>
        </div>
      </div>
    </div>
  );
}
