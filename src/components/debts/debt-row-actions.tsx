"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { deleteDebt, setDebtActive } from "@/services/debts-service.client";
import { useConfirm } from "@/components/ui/confirm-dialog/confirm-dialog-context";
import { useToast } from "@/components/ui/toast/toast-context";
import { ApiError } from "@/lib/api-error";

const DELETE_BTN =
  "shrink-0 rounded-full border border-border p-1.5 text-text-muted hover:border-danger hover:text-danger focus-visible:outline focus-visible:outline-2 focus-visible:outline-focus-ring focus-visible:outline-offset-2 disabled:opacity-50";
const BUTTON_CLASSES =
  "min-h-9 shrink-0 rounded-full border border-border py-1 px-3 text-xs font-medium text-primary hover:bg-primary-subtle disabled:cursor-default disabled:text-disabled-text";

interface DebtRowActionsProps {
  debtId: string;
  isActive: boolean;
}

export default function DebtRowActions({ debtId, isActive }: DebtRowActionsProps) {
  const router = useRouter();
  const confirm = useConfirm();
  const toast = useToast();
  const [isDeleting, setIsDeleting] = useState(false);
  const [isToggling, setIsToggling] = useState(false);

  const handleToggleActive = async () => {
    setIsToggling(true);
    try {
      await setDebtActive(debtId, !isActive);
      router.refresh();
    } catch (error) {
      toast.error(error instanceof ApiError ? error.message : "No se pudo actualizar la deuda.");
    } finally {
      setIsToggling(false);
    }
  };

  const handleDelete = async () => {
    const confirmed = await confirm({
      title: "¿Eliminar esta deuda?",
      description:
        "Esta acción no se puede deshacer y eliminará también los movimientos asociados a sus pagos.",
      confirmLabel: "Eliminar",
    });
    if (!confirmed) return;
    setIsDeleting(true);
    try {
      await deleteDebt(debtId);
      router.refresh();
    } catch (error) {
      toast.error(error instanceof ApiError ? error.message : "No se pudo eliminar la deuda.");
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
        aria-label="Activar deuda"
      >
        {isToggling ? "Activando..." : "Activar"}
      </button>
    );
  }

  return (
    <div className="flex items-center justify-end gap-2">
      <button
        type="button"
        className={BUTTON_CLASSES}
        onClick={handleToggleActive}
        disabled={isToggling}
        aria-label="Desactivar deuda"
      >
        {isToggling ? "Desactivando..." : "Desactivar"}
      </button>
      <button
        type="button"
        className={DELETE_BTN}
        onClick={handleDelete}
        disabled={isDeleting}
        aria-label="Eliminar deuda"
      >
        <i className="bi bi-trash" aria-hidden="true" />
      </button>
    </div>
  );
}
