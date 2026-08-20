import type { MovementType } from "./movement";

export type ObligationStatus = "PENDIENTE" | "PAGADA";

export interface Obligation {
  id: string;
  name: string;
  amount: number;
  typeMovement: MovementType;
  categoryId: string | null;
  dueDate: string;
  recurrenceDayOfMonth: number | null;
  status: ObligationStatus;
  overdue: boolean;
  isActive: boolean;
}
