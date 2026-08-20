import type { MovementStatus } from "@/types/movement";

export const STATUS_OPTIONS: { value: MovementStatus; label: string }[] = [
  { value: "Confirmado", label: "Confirmado" },
  { value: "Pendiente", label: "Pendiente" },
  { value: "Procesado", label: "Procesado" },
  { value: "Rechazado", label: "Rechazado" },
  { value: "Programado", label: "Programado" },
  { value: "Revertido", label: "Revertido" },
];
