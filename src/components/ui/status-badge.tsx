import { cx } from "@/lib/cx";
import { BADGE_BASE_CLASSES, BADGE_TONE_CLASSES } from "./badge-classes";
import type { MovementStatus } from "@/types/movement";

type Tone = "success" | "warning" | "danger";

// Los 6 estados posibles se agrupan en 3 tonos semánticos:
// Confirmado/Procesado = resultado asentado; Pendiente/Programado = aún sin
// determinar; Rechazado/Revertido = resultado negativo para el usuario.
const STATUS_CONFIG: Record<MovementStatus, { tone: Tone; icon: string }> = {
  Confirmado: { tone: "success", icon: "bi-check-circle-fill" },
  Procesado: { tone: "success", icon: "bi-check-circle-fill" },
  Pendiente: { tone: "warning", icon: "bi-hourglass-split" },
  Programado: { tone: "warning", icon: "bi-hourglass-split" },
  Rechazado: { tone: "danger", icon: "bi-x-circle-fill" },
  Revertido: { tone: "danger", icon: "bi-x-circle-fill" },
};

interface StatusBadgeProps {
  status: MovementStatus;
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  const { tone, icon } = STATUS_CONFIG[status];
  return (
    <span
      data-slot="badge"
      data-tone={tone}
      className={cx(BADGE_BASE_CLASSES, BADGE_TONE_CLASSES[tone])}
    >
      <i className={`bi ${icon}`} aria-hidden="true" />
      {status}
    </span>
  );
}
