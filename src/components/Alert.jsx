"use client";
import { InfoIcon, WarningIcon, ErrorIcon, CloseIcon } from "./Icons";

const ICONS = { info: InfoIcon, warning: WarningIcon, danger: ErrorIcon };

export default function Alert({ variant = "info", title, children, onDismiss }) {
  const Icon = ICONS[variant];
  return (
    <div className={`alert alert--${variant}`} role={variant === "danger" ? "alert" : "note"}>
      <span className="alert__icon">
        <Icon />
      </span>
      <div className="alert__body">
        {title && <p className="alert__title">{title}</p>}
        {children}
      </div>
      {onDismiss && (
        <button type="button" className="icon-btn alert__close" onClick={onDismiss} aria-label={`Dismiss: ${title ?? "alert"}`}>
          <CloseIcon size={18} />
        </button>
      )}
    </div>
  );
}
