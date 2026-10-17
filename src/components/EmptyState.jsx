import { InfoIcon, ErrorIcon } from "./Icons";

export default function EmptyState({ title, children, tone = "empty", small = false, action }) {
  const Icon = tone === "error" ? ErrorIcon : InfoIcon;
  return (
    <div className={`empty${tone === "error" ? " empty--error" : ""}${small ? " empty--sm" : ""}`}>
      <span className="empty__icon">
        <Icon size={24} />
      </span>
      <h3>{title}</h3>
      {children && <p>{children}</p>}
      {action}
    </div>
  );
}
