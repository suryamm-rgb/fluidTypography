"use client";
import { useCallback, useSyncExternalStore } from "react";

const KEY = "ft-theme";

function subscribe(cb) {
  const obs = new MutationObserver(cb);
  obs.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["data-theme"],
  });
  // No saved choice yet: follow the OS when it changes.
  const mq = window.matchMedia("(prefers-color-scheme: dark)");
  const onOs = (e) => {
    try {
      if (localStorage.getItem(KEY)) return;
    } catch {}
    document.documentElement.dataset.theme = e.matches ? "dark" : "light";
  };
  mq.addEventListener("change", onOs);
  return () => {
    obs.disconnect();
    mq.removeEventListener("change", onOs);
  };
}

const getSnapshot = () => document.documentElement.dataset.theme || "light";
const getServerSnapshot = () => "light";

export function useTheme() {
  const theme = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const setTheme = useCallback((next) => {
    document.documentElement.dataset.theme = next;
    try {
      localStorage.setItem(KEY, next);
    } catch {}
  }, []);
  const toggle = useCallback(
    () => setTheme(getSnapshot() === "dark" ? "light" : "dark"),
    [setTheme],
  );
  return { theme, setTheme, toggle };
}
