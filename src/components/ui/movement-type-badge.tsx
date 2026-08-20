import { cx } from "@/lib/cx";
import { BADGE_BASE_CLASSES, BADGE_TONE_CLASSES } from "./badge-classes";
import type { MovementRecordType } from "@/types/movement";

const TYPE_CONFIG: Record<
  MovementRecordType,
  { tone: "success" | "danger" | "warning"; icon: string }
> = {
  Ingreso: { tone: "success", icon: "bi-arrow-down-circle-fill" },
  Egreso: { tone: "danger", icon: "bi-arrow-up-circle-fill" },
  Transferencia: { tone: "warning", icon: "bi-arrow-left-right" },
};

interface MovementTypeBadgeProps {
  type: MovementRecordType;
}

export default function MovementTypeBadge({ type }: MovementTypeBadgeProps) {
  const { tone, icon } = TYPE_CONFIG[type];
  return (
    <span
      data-slot="badge"
      data-tone={tone}
      className={cx(BADGE_BASE_CLASSES, BADGE_TONE_CLASSES[tone])}
    >
      <i className={`bi ${icon}`} aria-hidden="true" />
      {type}
    </span>
  );
}
