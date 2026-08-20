import "server-only";
import type { Budget, BudgetProjection } from "@/types/budget";
import { getSession, backendFetch } from "@/lib/backend-client";

interface BackendBudget {
  id: string;
  date: string;
  period: string;
  description: string;
  amount: number;
  status: Budget["status"];
}

export async function getBudgets(): Promise<Budget[]> {
  const session = await getSession();
  if (!session) return [];

  const response = await backendFetch(session, `/accounts/${session.accountId}/budgets`);
  if (!response.ok) return [];

  const budgets = (await response.json()) as BackendBudget[];

  return budgets.map((budget) => ({
    id: budget.id,
    date: budget.date.slice(0, 10),
    period: budget.period,
    description: budget.description,
    amount: budget.amount,
    status: budget.status,
  }));
}

export async function getBudgetProjection(budgetId: string): Promise<BudgetProjection | null> {
  const session = await getSession();
  if (!session) return null;

  const response = await backendFetch(
    session,
    `/accounts/${session.accountId}/budgets/${budgetId}/projection`,
  );
  if (!response.ok) return null;

  return response.json();
}
