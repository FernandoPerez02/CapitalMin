import type { MovementStatus } from "./movement";
import type { BudgetAlertLevel } from "@/components/ui/budget-alert-badge";

export interface Budget {
  id: string;
  date: string;
  period: string;
  description: string;
  amount: number;
  status: MovementStatus;
}

export interface BudgetProjection {
  budgetId: string;
  categoryId: string | null;
  period: string;
  amount: number;
  spent: number;
  available: number;
  percentUsed: number;
  daysElapsed: number;
  daysTotal: number;
  projectedTotal: number;
  projectedExceedsBy: number;
  alertLevel: BudgetAlertLevel;
}
