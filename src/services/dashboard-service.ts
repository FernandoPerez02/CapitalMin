import "server-only";
import type { Dashboard } from "@/types/dashboard";
import { getSession, backendFetch } from "@/lib/backend-client";
import { emptyNetWorth } from "@/lib/net-worth-defaults";

function emptyDashboard(): Dashboard {
  return {
    netWorth: emptyNetWorth(),
    month: { period: "", income: 0, expense: 0, savings: 0 },
    budget: { totalBudgeted: 0, totalSpent: 0, percentUsed: 0 },
    goals: { totalTarget: 0, totalCurrent: 0, percentUsed: 0 },
    upcomingPayments: [],
  };
}

export async function getDashboard(): Promise<Dashboard> {
  const session = await getSession();
  if (!session) return emptyDashboard();

  const response = await backendFetch(session, `/accounts/${session.accountId}/dashboard`);
  if (!response.ok) return emptyDashboard();

  return response.json();
}
