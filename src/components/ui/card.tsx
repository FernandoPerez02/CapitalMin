import { cx } from "@/lib/cx";
import type { HTMLAttributes } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  tone?: "surface" | "inverse" | "insight";
  padding?: "sm" | "md" | "lg";
}

const TONE_CLASSES: Record<NonNullable<CardProps["tone"]>, string> = {
  surface: "bg-surface text-text",
  inverse: "bg-surface-inverse-elevated text-text-inverse",
  insight: "bg-insight-subtle text-insight",
};

const PADDING_CLASSES: Record<NonNullable<CardProps["padding"]>, string> = {
  sm: "p-4",
  md: "p-6",
  lg: "p-8",
};

export default function Card({
  tone = "surface",
  padding = "md",
  className,
  children,
  ...props
}: CardProps) {
  return (
    <div
      className={cx(
        "rounded-2xl shadow-[0_1px_2px_rgba(16,21,28,0.04),0_4px_12px_rgba(16,21,28,0.06)]",
        TONE_CLASSES[tone],
        PADDING_CLASSES[padding],
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}
