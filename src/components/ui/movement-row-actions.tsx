"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { deleteMovement } from "@/services/movements-service.client";
import { useConfirm } from "@/components/ui/confirm-dialog/confirm-dialog-context";
import { useToast } from "@/components/ui/toast/toast-context";

const DELETE_BTN =
  "shrink-0 rounded-full border border-border p-1.5 text-text-muted hover:border-danger hover:text-danger focus-visible:outline focus-visible:outline-2 focus-visible:outline-focus-ring focus-visible:outline-offset-2 disabled:opacity-50";

interface MovementRowActionsProps {
  movementId: string;
}

export default function MovementRowActions({ movementId }: MovementRowActionsProps) {
  const router = useRouter();
  const confirm = useConfirm();
  const toast = useToast();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    const confirmed = await confirm({
      title: "¿Eliminar este movimiento?",
      description: "Esta acción no se puede deshacer.",
      confirmLabel: "Eliminar",
    });
    if (!confirmed) return;
    setIsDeleting(true);
    try {
      await deleteMovement(movementId);
      router.refresh();
    } catch {
      toast.error("No se pudo eliminar el movimiento.");
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
      aria-label="Eliminar movimiento"
    >
      <i className="bi bi-trash" aria-hidden="true" />
    </button>
  );
}
