import type { Wallet } from "@/types/wallet";
import type { WalletFormValues } from "@/lib/schemas/wallet-schema";
import type { TransferFormValues } from "@/lib/schemas/transfer-schema";
import { throwApiError } from "@/lib/api-error";

export async function createWallet(values: WalletFormValues): Promise<Wallet> {
  const response = await fetch("/api/wallets", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(values),
  });

  if (!response.ok) {
    throw new Error("No se pudo guardar la cuenta");
  }

  return response.json();
}

export async function createTransfer(values: TransferFormValues): Promise<void> {
  const response = await fetch("/api/transfers", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(values),
  });

  if (!response.ok) {
    throw new Error("No se pudo registrar la transferencia");
  }
}

export async function deleteWallet(id: string): Promise<void> {
  const response = await fetch(`/api/wallets/${id}`, { method: "DELETE" });

  if (!response.ok) {
    await throwApiError(response, "No se pudo eliminar la cuenta");
  }
}

export async function setWalletActive(id: string, isActive: boolean): Promise<Wallet> {
  const response = await fetch(`/api/wallets/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ isActive }),
  });

  if (!response.ok) {
    await throwApiError(
      response,
      isActive ? "No se pudo activar la cuenta" : "No se pudo desactivar la cuenta",
    );
  }

  return response.json();
}
