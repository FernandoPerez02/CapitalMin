export const BADGE_BASE_CLASSES =
  "inline-flex items-center gap-1 rounded-full py-0.5 px-2 text-xs font-semibold whitespace-nowrap [&>i]:text-xs";

export const BADGE_TONE_CLASSES = {
  success: "bg-success-subtle text-success",
  warning: "bg-warning-subtle text-warning",
  danger: "bg-danger-subtle text-danger",
} as const;
