"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { deleteBudget } from "@/services/budget-service.client";
import { useConfirm } from "@/components/ui/confirm-dialog/confirm-dialog-context";
import { useToast } from "@/components/ui/toast/toast-context";

const DELETE_BTN =
  "shrink-0 rounded-full border border-border p-1.5 text-text-muted hover:border-danger hover:text-danger focus-visible:outline focus-visible:outline-2 focus-visible:outline-focus-ring focus-visible:outline-offset-2 disabled:opacity-50";

interface BudgetRowActionsProps {
  budgetId: string;
}

export default function BudgetRowActions({ budgetId }: BudgetRowActionsProps) {
  const router = useRouter();
  const confirm = useConfirm();
  const toast = useToast();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    const confirmed = await confirm({
      title: "¿Eliminar este presupuesto?",
      description: "Esta acción no se puede deshacer.",
      confirmLabel: "Eliminar",
    });
    if (!confirmed) return;
    setIsDeleting(true);
    try {
      await deleteBudget(budgetId);
      router.refresh();
    } catch {
      toast.error("No se pudo eliminar el presupuesto.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <button
      type="button"
      className={DELETE_BTN}
      onClick={handleDelete}
      disabled={isDeleting}
      aria-label="Eliminar presupuesto"
    >
      <i className="bi bi-trash" aria-hidden="true" />
    </button>
  );
}
