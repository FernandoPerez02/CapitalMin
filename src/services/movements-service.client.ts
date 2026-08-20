import type { Movement } from "@/types/movement";
import type { MovementFormValues } from "@/lib/schemas/movement-schema";

export async function createMovement(values: MovementFormValues): Promise<Movement> {
  const response = await fetch("/api/movements", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(values),
  });

  if (!response.ok) {
    throw new Error("No se pudo guardar el movimiento");
  }

  return response.json();
}

export async function updateMovement(
  id: string,
  values: Partial<MovementFormValues>,
): Promise<Movement> {
  const response = await fetch(`/api/movements/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(values),
  });

  if (!response.ok) {
    throw new Error("No se pudo actualizar el movimiento");
  }

  return response.json();
}

export async function deleteMovement(id: string): Promise<void> {
  const response = await fetch(`/api/movements/${id}`, { method: "DELETE" });

  if (!response.ok) {
    throw new Error("No se pudo eliminar el movimiento");
  }
}
