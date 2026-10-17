"use client";
import { useEffect, useRef, useState } from "react";
import { copyText } from "../lib/clipboard";
import { useToast } from "./Toast";
import { CopyIcon, CheckIcon } from "./Icons";

export default function CopyButton({
  text,
  label = "Copy",
  copiedLabel = "Copied!",
  toast = "Copied!",
  variant = "default", // "primary" | "default" | "ghost"
  iconOnly = false,
  ariaLabel,
  className = "",
}) {
  const [copied, setCopied] = useState(false);
  const timer = useRef(null);
  const showToast = useToast();

  useEffect(() => () => clearTimeout(timer.current), []);

  const onClick = async () => {
    const ok = await copyText(text);
    showToast(ok ? toast : "Copy failed. Select the text and copy it manually.");
    if (!ok) return;
    setCopied(true);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setCopied(false), 1800);
  };

  const variantClass =
    variant === "primary" ? "btn--primary" : variant === "ghost" ? "btn--ghost" : "";

  return (
    <button
      type="button"
      className={`btn ${variantClass} ${className}`.trim()}
      onClick={onClick}
      data-copied={copied}
      aria-label={ariaLabel}
    >
      {copied ? <CheckIcon size={16} /> : <CopyIcon size={16} />}
      {iconOnly ? <span className="sr-only">{copied ? copiedLabel : label}</span> : copied ? copiedLabel : label}
    </button>
  );
}
