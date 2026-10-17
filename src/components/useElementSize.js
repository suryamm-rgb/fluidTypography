"use client";
import { useEffect, useState } from "react";

/** { width, height } of an element in CSS px (zeros until measured). */
export function useElementSize(ref) {
  const [size, setSize] = useState({ width: 0, height: 0 });
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const read = (w, h) =>
      setSize((s) => (s.width === w && s.height === h ? s : { width: w, height: h }));
    const ro = new ResizeObserver(([entry]) =>
      read(Math.round(entry.contentRect.width), Math.round(entry.contentRect.height)),
    );
    ro.observe(el);
    const r = el.getBoundingClientRect();
    read(Math.round(r.width), Math.round(r.height));
    return () => ro.disconnect();
  }, [ref]);
  return size;
}
