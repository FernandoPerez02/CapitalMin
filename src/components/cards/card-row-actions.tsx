"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { payCard, deleteCard, setCardActive } from "@/services/cards-service.client";
import { useConfirm } from "@/components/ui/confirm-dialog/confirm-dialog-context";
import { useToast } from "@/components/ui/toast/toast-context";
import { ApiError } from "@/lib/api-error";
import type { Wallet } from "@/types/wallet";

interface CardRowActionsProps {
  cardId: string;
  wallets: Wallet[];
  showPay: boolean;
  isActive: boolean;
}

const SELECT_CLASSES =
  "min-h-9 rounded-lg border border-border bg-surface py-1 px-2 text-xs text-text";
const AMOUNT_CLASSES =
  "min-h-9 w-24 rounded-lg border border-border bg-surface py-1 px-2 text-xs text-text";
const BUTTON_CLASSES =
  "min-h-9 shrink-0 rounded-full border border-border py-1 px-3 text-xs font-medium text-primary hover:bg-primary-subtle disabled:cursor-default disabled:text-disabled-text";
const DELETE_BTN =
  "shrink-0 rounded-full border border-border p-1.5 text-text-muted hover:border-danger hover:text-danger focus-visible:outline focus-visible:outline-2 focus-visible:outline-focus-ring focus-visible:outline-offset-2 disabled:opacity-50";

export default function CardRowActions({
  cardId,
  wallets,
  showPay,
  isActive,
}: CardRowActionsProps) {
  const router = useRouter();
  const confirm = useConfirm();
  const toast = useToast();
  const [walletId, setWalletId] = useState(wallets[0]?.id ?? "");
  const [amount, setAmount] = useState("");
  const [isPaying, setIsPaying] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isToggling, setIsToggling] = useState(false);

  const handlePay = async () => {
    const parsedAmount = Number(amount);
    if (!walletId || !parsedAmount || parsedAmount <= 0) return;
    setIsPaying(true);
    try {
      await payCard(cardId, walletId, parsedAmount);
      setAmount("");
      router.refresh();
    } catch {
      toast.error("No se pudo registrar el pago.");
    } finally {
      setIsPaying(false);
    }
  };

  const handleDelete = async () => {
    const confirmed = await confirm({
      title: "¿Eliminar esta tarjeta?",
      description: "Esta acción no se puede deshacer.",
      confirmLabel: "Eliminar",
    });
    if (!confirmed) return;
    setIsDeleting(true);
    try {
      await deleteCard(cardId);
      router.refresh();
    } catch (error) {
      if (error instanceof ApiError && error.status === 409) {
        const deactivate = await confirm({
          title: "No se puede eliminar",
          description: `${error.message}. Puedes desactivarla en su lugar: dejará de aparecer entre las tarjetas activas.`,
          confirmLabel: "Desactivar",
        });
        if (deactivate) await handleToggleActive();
      } else {
        toast.error("No se pudo eliminar la tarjeta.");
      }
    } finally {
      setIsDeleting(false);
    }
  };

  const handleToggleActive = async () => {
    setIsToggling(true);
    try {
      await setCardActive(cardId, !isActive);
      router.refresh();
    } catch (error) {
      toast.error(error instanceof ApiError ? error.message : "No se pudo actualizar la tarjeta.");
    } finally {
      setIsToggling(false);
    }
  };

  return (
    <div className="flex items-center justify-end gap-2">
      {showPay && wallets.length > 0 && (
        <>
          <select
            aria-label="Cuenta para el pago"
            value={walletId}
            disabled={isPaying}
            onChange={(event) => setWalletId(event.target.value)}
            className={SELECT_CLASSES}
          >
            {wallets.map((wallet) => (
              <option key={wallet.id} value={wallet.id}>
                {wallet.name}
              </option>
            ))}
          </select>
          <input
            aria-label="Monto del pago"
            type="text"
            inputMode="decimal"
            placeholder="Monto"
            value={amount}
            disabled={isPaying}
            onChange={(event) => setAmount(event.target.value)}
            className={AMOUNT_CLASSES}
          />
          <button type="button" disabled={isPaying} onClick={handlePay} className={BUTTON_CLASSES}>
            {isPaying ? "Pagando..." : "Pagar"}
          </button>
        </>
      )}
      {isActive ? (
        <button
          type="button"
          className={DELETE_BTN}
          onClick={handleDelete}
          disabled={isDeleting}
          aria-label="Eliminar tarjeta"
        >
          <i className="bi bi-trash" aria-hidden="true" />
        </button>
      ) : (
        <button
          type="button"
          className={BUTTON_CLASSES}
          onClick={handleToggleActive}
          disabled={isToggling}
          aria-label="Activar tarjeta"
        >
          {isToggling ? "Activando..." : "Activar"}
        </button>
      )}
    </div>
  );
}
