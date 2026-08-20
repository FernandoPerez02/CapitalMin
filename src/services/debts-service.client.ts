import type { Debt } from "@/types/debt";
import type { DebtFormValues } from "@/lib/schemas/debt-schema";
import { throwApiError } from "@/lib/api-error";

export async function createDebt(values: DebtFormValues): Promise<Debt> {
  const response = await fetch("/api/debts", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(values),
  });

  if (!response.ok) {
    throw new Error("No se pudo guardar la deuda");
  }

  return response.json();
}

export interface AddDebtPaymentPayload {
  walletId: string;
  amount: number;
  principalPortion: number;
  interestPortion: number;
  date?: string;
}

export async function addDebtPayment(
  debtId: string,
  payload: AddDebtPaymentPayload,
): Promise<void> {
  const response = await fetch(`/api/debts/${debtId}/payments`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error("No se pudo registrar el pago");
  }
}

export async function deleteDebt(id: string): Promise<void> {
  const response = await fetch(`/api/debts/${id}`, { method: "DELETE" });

  if (!response.ok) {
    await throwApiError(response, "No se pudo eliminar la deuda");
  }
}

export async function setDebtActive(id: string, isActive: boolean): Promise<Debt> {
  const response = await fetch(`/api/debts/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ isActive }),
  });

  if (!response.ok) {
    await throwApiError(
      response,
      isActive ? "No se pudo activar la deuda" : "No se pudo desactivar la deuda",
    );
  }

  return response.json();
}
