import type { Category } from "./category";

export type MovementType = "Ingreso" | "Egreso";

/**
 * Un movimiento leído del backend puede ser "Transferencia" (transferencia
 * entre wallets o pago de tarjeta de crédito, ver MovementsService.transfer
 * y CardsService.pay) — solo Ingreso/Egreso son creables directamente desde
 * el formulario, por eso MovementType (el dominio del form) queda angosto.
 */
export type MovementRecordType = MovementType | "Transferencia";

export type MovementStatus =
  "Confirmado" | "Pendiente" | "Procesado" | "Rechazado" | "Programado" | "Revertido";

export interface Movement {
  id: string;
  date: string;
  typeMovement: MovementRecordType;
  description: string;
  amount: number;
  status: MovementStatus;
  categoryId: string | null;
  category: Category | null;
  walletId: string | null;
  cardId: string | null;
}
