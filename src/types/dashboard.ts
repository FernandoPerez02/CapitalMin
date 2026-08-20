import type { NetWorth } from "./net-worth";

export interface DashboardUpcomingPayment {
  id: string;
  name: string;
  amount: number;
  dueDate: string;
  overdue: boolean;
}

export interface Dashboard {
  netWorth: NetWorth;
  month: {
    period: string;
    income: number;
    expense: number;
    savings: number;
  };
  budget: {
    totalBudgeted: number;
    totalSpent: number;
    percentUsed: number;
  };
  goals: {
    totalTarget: number;
    totalCurrent: number;
    percentUsed: number;
  };
  upcomingPayments: DashboardUpcomingPayment[];
}
