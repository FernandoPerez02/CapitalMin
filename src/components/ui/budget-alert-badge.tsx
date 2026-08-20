import { cx } from "@/lib/cx";
import { BADGE_BASE_CLASSES, BADGE_TONE_CLASSES } from "./badge-classes";

export type BudgetAlertLevel = "ok" | "near" | "exceeded";

type Tone = "success" | "warning" | "danger";

const ALERT_CONFIG: Record<BudgetAlertLevel, { tone: Tone; icon: string; label: string }> = {
  ok: { tone: "success", icon: "bi-check-circle-fill", label: "En rango" },
  near: { tone: "warning", icon: "bi-exclamation-circle-fill", label: "Cerca del límite" },
  exceeded: { tone: "danger", icon: "bi-x-circle-fill", label: "Superado" },
};

interface BudgetAlertBadgeProps {
  alertLevel: BudgetAlertLevel;
}

export default function BudgetAlertBadge({ alertLevel }: BudgetAlertBadgeProps) {
  const { tone, icon, label } = ALERT_CONFIG[alertLevel];
  return (
    <span
      data-slot="badge"
      data-tone={tone}
      className={cx(BADGE_BASE_CLASSES, BADGE_TONE_CLASSES[tone])}
    >
      <i className={`bi ${icon}`} aria-hidden="true" />
      {label}
    </span>
  );
}
