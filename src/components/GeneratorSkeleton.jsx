// Shown while the URL settings load (useSearchParams needs a Suspense boundary).
// It mirrors the real layout so nothing jumps when the tool appears.
export default function GeneratorSkeleton() {
  return (
    <div className="ft" aria-busy="true">
      <div className="site-header">
        <div className="container site-header__inner" />
      </div>
      <div className="container">
        <div className="intro">
          <div className="skeleton" style={{ height: "1rem", width: "6rem" }} />
          <div className="skeleton" style={{ height: "3rem", width: "min(100%, 28rem)", marginTop: "var(--space-3)" }} />
        </div>
        <div className="layout">
          <div className="skeleton" style={{ height: "34rem", borderRadius: "var(--radius-xl)" }} />
          <div className="stack">
            <div className="skeleton" style={{ height: "3.5rem", borderRadius: "var(--radius-lg)" }} />
            <div className="skeleton" style={{ height: "22rem", borderRadius: "var(--radius-xl)" }} />
          </div>
        </div>
      </div>
      <p className="sr-only" role="status">
        Loading the generator
      </p>
    </div>
  );
}
