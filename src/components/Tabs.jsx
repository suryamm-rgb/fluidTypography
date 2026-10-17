"use client";
import { useRef } from "react";

export const tabId = (prefix, id) => `${prefix}-tab-${id}`;
export const panelId = (prefix, id) => `${prefix}-panel-${id}`;

/**
 * Accessible tab list (WAI-ARIA tabs, automatic activation).
 * items: [{ id, label }]. The parent renders the matching
 * <div role="tabpanel" id={panelId(prefix, value)} aria-labelledby={tabId(prefix, value)}>.
 */
export default function Tabs({ items, value, onChange, prefix, label, className = "" }) {
  const refs = useRef({});

  const onKeyDown = (e) => {
    const i = items.findIndex((it) => it.id === value);
    let next = null;
    if (e.key === "ArrowRight") next = (i + 1) % items.length;
    else if (e.key === "ArrowLeft") next = (i - 1 + items.length) % items.length;
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = items.length - 1;
    if (next === null) return;
    e.preventDefault();
    const id = items[next].id;
    onChange(id);
    refs.current[id]?.focus();
  };

  return (
    <div role="tablist" aria-label={label} className={`tabs ${className}`.trim()} onKeyDown={onKeyDown}>
      {items.map((it) => {
        const selected = it.id === value;
        return (
          <button
            key={it.id}
            ref={(el) => (refs.current[it.id] = el)}
            type="button"
            role="tab"
            className="tab"
            id={tabId(prefix, it.id)}
            aria-selected={selected}
            aria-controls={panelId(prefix, it.id)}
            tabIndex={selected ? 0 : -1}
            onClick={() => onChange(it.id)}
          >
            {it.label}
          </button>
        );
      })}
    </div>
  );
}
