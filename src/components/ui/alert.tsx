"use client";
import type { ReactNode } from "react";
import { cx } from "@/lib/cx";

export type AlertTone = "success" | "error" | "warning" | "info";

const TONE_STYLES: Record<AlertTone, string> = {
  success: "border-success/30 bg-success-subtle text-success-hover [&_.alert-icon]:text-success",
  error: "border-danger/30 bg-danger-subtle text-danger-hover [&_.alert-icon]:text-danger",
  warning: "border-warning/30 bg-warning-subtle text-warning-hover [&_.alert-icon]:text-warning",
  info: "border-primary/30 bg-primary-subtle text-primary-hover [&_.alert-icon]:text-primary",
};

const TONE_ICONS: Record<AlertTone, string> = {
  success: "bi-check-circle-fill",
  error: "bi-exclamation-octagon-fill",
  warning: "bi-exclamation-triangle-fill",
  info: "bi-info-circle-fill",
};

interface AlertProps {
  tone: AlertTone;
  children: ReactNode;
  className?: string;
  onDismiss?: () => void;
}

export default function Alert({ tone, children, className, onDismiss }: AlertProps) {
  return (
    <div
      role={tone === "error" ? "alert" : "status"}
      className={cx(
        "flex items-start gap-2 rounded-xl border px-3 py-2.5 text-left text-sm animate-[alert-in_0.2s_ease-out]",
        TONE_STYLES[tone],
        className,
      )}
    >
      <i
        className={cx("alert-icon bi shrink-0 pt-0.5 text-base", TONE_ICONS[tone])}
        aria-hidden="true"
      />
      <p className="min-w-0 flex-1 leading-snug">{children}</p>
      {onDismiss && (
        <button
          type="button"
          onClick={onDismiss}
          aria-label="Cerrar"
          className="shrink-0 rounded-full p-0.5 text-current/70 hover:bg-black/5 hover:text-current"
        >
          <i className="bi bi-x-lg text-xs" aria-hidden="true" />
        </button>
      )}
    </div>
  );
}
