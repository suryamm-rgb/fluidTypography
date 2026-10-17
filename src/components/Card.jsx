export default function Card({ id, title, subtitle, actions, children, as: Tag = "section", className = "" }) {
  const headingId = id ? `${id}-title` : undefined;
  return (
    <Tag id={id} className={`card ${className}`.trim()} aria-labelledby={title ? headingId : undefined}>
      {(title || actions) && (
        <div className="card__head">
          <div>
            {title && (
              <h2 id={headingId} className="card__title">
                {title}
              </h2>
            )}
            {subtitle && <p className="card__sub">{subtitle}</p>}
          </div>
          {actions && <div className="card__actions">{actions}</div>}
        </div>
      )}
      {children}
    </Tag>
  );
}
