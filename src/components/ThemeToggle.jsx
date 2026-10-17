"use client";
import { useTheme } from "./useTheme";
import { SunIcon, MoonIcon } from "./Icons";

export default function ThemeToggle() {
  const { theme, toggle } = useTheme();
  return (
    <button
      type="button"
      className="icon-btn theme-toggle"
      onClick={toggle}
      aria-pressed={theme === "dark"}
      aria-label="Dark theme"
      title={theme === "dark" ? "Switch to light theme" : "Switch to dark theme"}
    >
      <SunIcon className="icon-sun" />
      <MoonIcon className="icon-moon" />
    </button>
  );
}
