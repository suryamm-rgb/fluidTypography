"use client";
import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { CheckIcon } from "./Icons";

const ToastContext = createContext(() => {});

export function ToastProvider({ children }) {
  const [message, setMessage] = useState("");
  const timer = useRef(null);

  const show = useCallback((text) => {
    clearTimeout(timer.current);
    // Clear first so a repeated message is announced again by screen readers.
    setMessage("");
    requestAnimationFrame(() => setMessage(text));
    timer.current = setTimeout(() => setMessage(""), 2000);
  }, []);

  useEffect(() => () => clearTimeout(timer.current), []);

  return (
    <ToastContext.Provider value={show}>
      {children}
      <div className="toast-region" role="status" aria-live="polite">
        {message && (
          <span className="toast">
            <CheckIcon size={16} /> {message}
          </span>
        )}
      </div>
    </ToastContext.Provider>
  );
}

export const useToast = () => useContext(ToastContext);
