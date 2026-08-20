import type { Card, CardType } from "@/types/card";
import { throwApiError } from "@/lib/api-error";

export interface CreateCardPayload {
  name: string;
  type: CardType;
  walletId?: string;
  creditLimit?: number;
  cutoffDay?: number;
  paymentDueDay?: number;
}

export async function createCard(payload: CreateCardPayload): Promise<Card> {
  const response = await fetch("/api/cards", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error("No se pudo guardar la tarjeta");
  }

  return response.json();
}

export async function payCard(cardId: string, walletId: string, amount: number): Promise<void> {
  const response = await fetch(`/api/cards/${cardId}/pay`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ walletId, amount }),
  });

  if (!response.ok) {
    throw new Error("No se pudo registrar el pago");
  }
}

export async function deleteCard(id: string): Promise<void> {
  const response = await fetch(`/api/cards/${id}`, { method: "DELETE" });

  if (!response.ok) {
    await throwApiError(response, "No se pudo eliminar la tarjeta");
  }
}

export async function setCardActive(id: string, isActive: boolean): Promise<Card> {
  const response = await fetch(`/api/cards/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ isActive }),
  });

  if (!response.ok) {
    await throwApiError(
      response,
      isActive ? "No se pudo activar la tarjeta" : "No se pudo desactivar la tarjeta",
    );
  }

  return response.json();
}
