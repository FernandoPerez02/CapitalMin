import type { MovementType } from "@/types/movement";

export const TYPE_OPTIONS: { value: MovementType; label: string }[] = [
  { value: "Ingreso", label: "Ingreso" },
  { value: "Egreso", label: "Egreso" },
];
