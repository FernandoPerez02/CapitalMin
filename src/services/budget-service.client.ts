import type { Budget } from "@/types/budget";
import type { BudgetFormValues } from "@/lib/schemas/budget-schema";

export async function createBudget(values: BudgetFormValues): Promise<Budget> {
  const response = await fetch("/api/budgets", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(values),
  });

  if (!response.ok) {
    throw new Error("No se pudo guardar el presupuesto");
  }

  return response.json();
}

export async function deleteBudget(id: string): Promise<void> {
  const response = await fetch(`/api/budgets/${id}`, { method: "DELETE" });

  if (!response.ok) {
    throw new Error("No se pudo eliminar el presupuesto");
  }
}
