import { cx } from "@/lib/cx";
import { BADGE_BASE_CLASSES, BADGE_TONE_CLASSES } from "./badge-classes";
import type { Obligation } from "@/types/obligation";

type Tone = "success" | "warning" | "danger";

interface ObligationStatusBadgeProps {
  status: Obligation["status"];
  overdue: boolean;
}

export default function ObligationStatusBadge({ status, overdue }: ObligationStatusBadgeProps) {
  const tone: Tone = status === "PAGADA" ? "success" : overdue ? "danger" : "warning";
  const icon =
    status === "PAGADA"
      ? "bi-check-circle-fill"
      : overdue
        ? "bi-exclamation-circle-fill"
        : "bi-hourglass-split";
  const label = status === "PAGADA" ? "Pagada" : overdue ? "Vencida" : "Pendiente";

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
