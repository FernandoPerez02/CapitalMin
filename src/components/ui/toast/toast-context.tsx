"use client";
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { cx } from "@/lib/cx";
import type { AlertTone } from "@/components/ui/alert";

interface ToastItem {
  id: number;
  tone: AlertTone;
  message: string;
  leaving: boolean;
}

interface ToastApi {
  success: (message: string, duration?: number) => void;
  error: (message: string, duration?: number) => void;
  warning: (message: string, duration?: number) => void;
  info: (message: string, duration?: number) => void;
}

const ToastContext = createContext<ToastApi | null>(null);

const DEFAULT_DURATION: Record<AlertTone, number> = {
  success: 4000,
  info: 4000,
  warning: 5500,
  error: 6000,
};

const TONE_ICON: Record<AlertTone, string> = {
  success: "bi-check-circle-fill",
  error: "bi-exclamation-octagon-fill",
  warning: "bi-exclamation-triangle-fill",
  info: "bi-info-circle-fill",
};

const TONE_ACCENT: Record<AlertTone, string> = {
  success: "border-l-success [&_.toast-icon]:text-success",
  error: "border-l-danger [&_.toast-icon]:text-danger",
  warning: "border-l-warning [&_.toast-icon]:text-warning",
  info: "border-l-primary [&_.toast-icon]:text-primary",
};

const EXIT_MS = 180;
let uid = 0;

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const timers = useRef(new Map<number, ReturnType<typeof setTimeout>>());

  const dismiss = useCallback((id: number) => {
    const timer = timers.current.get(id);
    if (timer) {
      clearTimeout(timer);
      timers.current.delete(id);
    }
    setToasts((prev) =>
      prev.map((toast) => (toast.id === id ? { ...toast, leaving: true } : toast)),
    );
    setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, EXIT_MS);
  }, []);

  const push = useCallback(
    (tone: AlertTone, message: string, duration?: number) => {
      const id = ++uid;
      setToasts((prev) => [...prev, { id, tone, message, leaving: false }]);
      const timer = setTimeout(() => dismiss(id), duration ?? DEFAULT_DURATION[tone]);
      timers.current.set(id, timer);
    },
    [dismiss],
  );

  const api = useMemo<ToastApi>(
    () => ({
      success: (message, duration) => push("success", message, duration),
      error: (message, duration) => push("error", message, duration),
      warning: (message, duration) => push("warning", message, duration),
      info: (message, duration) => push("info", message, duration),
    }),
    [push],
  );

  return (
    <ToastContext.Provider value={api}>
      {children}
      <div
        aria-live="polite"
        aria-atomic="false"
        className="pointer-events-none fixed inset-x-4 top-4 z-[1200] flex flex-col items-stretch gap-2 md:inset-x-auto md:left-auto md:right-4 md:w-96"
      >
        {toasts.map((toast) => (
          <div
            key={toast.id}
            role={toast.tone === "error" ? "alert" : "status"}
            className={cx(
              "pointer-events-auto flex items-start gap-2 rounded-xl border border-border border-l-4 bg-surface px-3 py-3 text-sm text-text shadow-[0_4px_16px_rgba(16,21,28,0.14)]",
              TONE_ACCENT[toast.tone],
              toast.leaving
                ? "animate-[toast-out_0.18s_ease-in_forwards]"
                : "animate-[toast-in_0.22s_ease-out]",
            )}
          >
            <i
              className={cx("toast-icon bi shrink-0 pt-0.5 text-base", TONE_ICON[toast.tone])}
              aria-hidden="true"
            />
            <p className="min-w-0 flex-1 leading-snug">{toast.message}</p>
            <button
              type="button"
              onClick={() => dismiss(toast.id)}
              aria-label="Cerrar notificación"
              className="shrink-0 rounded-full p-0.5 text-text-muted hover:bg-surface-muted hover:text-text"
            >
              <i className="bi bi-x-lg text-xs" aria-hidden="true" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error("useToast debe usarse dentro de <ToastProvider>");
  }
  return ctx;
}
