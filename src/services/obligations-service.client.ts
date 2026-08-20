import type { Obligation } from "@/types/obligation";
import type { MovementType } from "@/types/movement";
import { throwApiError } from "@/lib/api-error";

export interface CreateObligationPayload {
  name: string;
  amount: number;
  typeMovement: MovementType;
  categoryId?: string;
  recurrenceDayOfMonth?: number;
  dueDate?: string;
}

export async function createObligation(payload: CreateObligationPayload): Promise<Obligation> {
  const response = await fetch("/api/obligations", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error("No se pudo guardar la obligación");
  }

  return response.json();
}

export async function payObligation(obligationId: string, walletId: string): Promise<void> {
  const response = await fetch(`/api/obligations/${obligationId}/pay`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ walletId }),
  });

  if (!response.ok) {
    throw new Error("No se pudo registrar el pago");
  }
}

export async function deleteObligation(id: string): Promise<void> {
  const response = await fetch(`/api/obligations/${id}`, { method: "DELETE" });

  if (!response.ok) {
    await throwApiError(response, "No se pudo eliminar la obligación");
  }
}

export async function setObligationActive(id: string, isActive: boolean): Promise<Obligation> {
  const response = await fetch(`/api/obligations/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ isActive }),
  });

  if (!response.ok) {
    await throwApiError(
      response,
      isActive ? "No se pudo activar la obligación" : "No se pudo desactivar la obligación",
    );
  }

  return response.json();
}
