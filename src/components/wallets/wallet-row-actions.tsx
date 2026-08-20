"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { deleteWallet, setWalletActive } from "@/services/wallets-service.client";
import { useConfirm } from "@/components/ui/confirm-dialog/confirm-dialog-context";
import { useToast } from "@/components/ui/toast/toast-context";
import { ApiError } from "@/lib/api-error";

const DELETE_BTN =
  "shrink-0 rounded-full border border-border p-1.5 text-text-muted hover:border-danger hover:text-danger focus-visible:outline focus-visible:outline-2 focus-visible:outline-focus-ring focus-visible:outline-offset-2 disabled:opacity-50";
const BUTTON_CLASSES =
  "min-h-9 shrink-0 rounded-full border border-border py-1 px-3 text-xs font-medium text-primary hover:bg-primary-subtle disabled:cursor-default disabled:text-disabled-text";

interface WalletRowActionsProps {
  walletId: string;
  isActive: boolean;
}

export default function WalletRowActions({ walletId, isActive }: WalletRowActionsProps) {
  const router = useRouter();
  const confirm = useConfirm();
  const toast = useToast();
  const [isDeleting, setIsDeleting] = useState(false);
  const [isToggling, setIsToggling] = useState(false);

  const handleToggleActive = async () => {
    setIsToggling(true);
    try {
      await setWalletActive(walletId, !isActive);
      router.refresh();
    } catch (error) {
      toast.error(error instanceof ApiError ? error.message : "No se pudo actualizar la cuenta.");
    } finally {
      setIsToggling(false);
    }
  };

  const handleDelete = async () => {
    const confirmed = await confirm({
      title: "¿Eliminar esta cuenta?",
      description: "Esta acción no se puede deshacer.",
      confirmLabel: "Eliminar",
    });
    if (!confirmed) return;
    setIsDeleting(true);
    try {
      await deleteWallet(walletId);
      router.refresh();
    } catch (error) {
      if (error instanceof ApiError && error.status === 409) {
        const deactivate = await confirm({
          title: "No se puede eliminar",
          description: `${error.message}. Puedes desactivarla en su lugar: dejará de aparecer entre las cuentas activas.`,
          confirmLabel: "Desactivar",
        });
        if (deactivate) await handleToggleActive();
      } else {
        toast.error("No se pudo eliminar la cuenta.");
      }
    } finally {
      setIsDeleting(false);
    }
  };

  if (!isActive) {
    return (
      <button
        type="button"
        className={BUTTON_CLASSES}
        onClick={handleToggleActive}
        disabled={isToggling}
        aria-label="Activar cuenta"
      >
        {isToggling ? "Activando..." : "Activar"}
      </button>
    );
  }

  return (
    <button
      type="button"
      className={DELETE_BTN}
      onClick={handleDelete}
      disabled={isDeleting}
      aria-label="Eliminar cuenta"
    >
      <i className="bi bi-trash" aria-hidden="true" />
    </button>
  );
}
