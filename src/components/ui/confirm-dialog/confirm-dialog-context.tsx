"use client";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { cx } from "@/lib/cx";

interface ConfirmOptions {
  title: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  tone?: "danger" | "primary";
}

type ConfirmState = ConfirmOptions & { open: boolean };

type ConfirmFn = (options: ConfirmOptions) => Promise<boolean>;

const ConfirmContext = createContext<ConfirmFn | null>(null);

const TONE_CONFIRM_BTN: Record<"danger" | "primary", string> = {
  danger: "bg-danger text-text-inverse hover:bg-danger-hover",
  primary: "bg-primary text-text-inverse hover:bg-primary-hover",
};

const CLOSE_MS = 150;

export function ConfirmProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<ConfirmState>({ open: false, title: "" });
  const [closing, setClosing] = useState(false);
  const resolver = useRef<((value: boolean) => void) | null>(null);

  const close = useCallback((result: boolean) => {
    setClosing(true);
    setTimeout(() => {
      setState((prev) => ({ ...prev, open: false }));
      setClosing(false);
      resolver.current?.(result);
      resolver.current = null;
    }, CLOSE_MS);
  }, []);

  const confirm = useCallback<ConfirmFn>((options) => {
    return new Promise<boolean>((resolve) => {
      resolver.current = resolve;
      setClosing(false);
      setState({ ...options, open: true });
    });
  }, []);

  useEffect(() => {
    if (!state.open) return;
    document.body.style.overflow = "hidden";
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") close(false);
    };
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [state.open, close]);

  return (
    <ConfirmContext.Provider value={confirm}>
      {children}
      {state.open && (
        <div
          className={cx(
            "fixed inset-0 z-[1200] flex items-center justify-center bg-primary-dark/40 p-4 backdrop-blur-[1px]",
            closing
              ? "animate-[overlay-out_0.15s_ease-in_forwards]"
              : "animate-[overlay-in_0.15s_ease-out]",
          )}
          onClick={() => close(false)}
        >
          <div
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="confirm-dialog-title"
            onClick={(event) => event.stopPropagation()}
            className={cx(
              "w-full max-w-sm rounded-2xl bg-surface p-5 text-left shadow-[0_12px_32px_rgba(16,21,28,0.24)]",
              closing
                ? "animate-[dialog-out_0.15s_ease-in_forwards]"
                : "animate-[dialog-in_0.18s_ease-out]",
            )}
          >
            <h2 id="confirm-dialog-title" className="text-base font-semibold text-text">
              {state.title}
            </h2>
            {state.description && (
              <p className="mt-1.5 text-sm text-text-muted">{state.description}</p>
            )}
            <div className="mt-5 flex justify-end gap-2">
              <button
                type="button"
                autoFocus
                onClick={() => close(false)}
                className="rounded-full border border-border px-4 py-2 text-sm font-medium text-text hover:bg-surface-muted"
              >
                {state.cancelLabel ?? "Cancelar"}
              </button>
              <button
                type="button"
                onClick={() => close(true)}
                className={cx(
                  "rounded-full px-4 py-2 text-sm font-medium",
                  TONE_CONFIRM_BTN[state.tone ?? "danger"],
                )}
              >
                {state.confirmLabel ?? "Eliminar"}
              </button>
            </div>
          </div>
        </div>
      )}
    </ConfirmContext.Provider>
  );
}

export function useConfirm() {
  const ctx = useContext(ConfirmContext);
  if (!ctx) {
    throw new Error("useConfirm debe usarse dentro de <ConfirmProvider>");
  }
  return ctx;
}
