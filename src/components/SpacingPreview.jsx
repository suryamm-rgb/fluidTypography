// Visual demo of padding, margin or gap at the current size.
// --c is the property color token; the tint is derived from it.
export default function SpacingPreview({ property, px, color }) {
  const style = { "--c": color };
  const label = <span className="sp-demo__label">{px}px</span>;

  if (property === "gap") {
    return (
      <div className="sp-demo sp-demo--gap" style={{ ...style, gap: `${px}px` }}>
        {[1, 2, 3].map((i) => (
          <div key={i} className="sp-demo__box">
            item {i}
          </div>
        ))}
        {label}
      </div>
    );
  }
  return (
    <div className={`sp-demo sp-demo--${property}`} style={{ ...style, padding: `${px}px` }}>
      <div className="sp-demo__box">content</div>
      {label}
    </div>
  );
}
