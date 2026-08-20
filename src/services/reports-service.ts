import "server-only";
import type { ReportRange, Summary, CategoryReportItem, MonthlyTrendPoint } from "@/types/report";
import { getSession, backendFetch } from "@/lib/backend-client";

function emptySummary(range: ReportRange): Summary {
  return { range, balance: 0, incomeTotal: 0, expenseTotal: 0 };
}

export async function getSummary(range: ReportRange = "month"): Promise<Summary> {
  const session = await getSession();
  if (!session) return emptySummary(range);

  const response = await backendFetch(
    session,
    `/accounts/${session.accountId}/summary?range=${range}`,
  );
  if (!response.ok) return emptySummary(range);

  return response.json();
}

export async function getCategoryReport(
  range: ReportRange = "month",
): Promise<CategoryReportItem[]> {
  const session = await getSession();
  if (!session) return [];

  const response = await backendFetch(
    session,
    `/accounts/${session.accountId}/reports/by-category?range=${range}`,
  );
  if (!response.ok) return [];

  return response.json();
}

export async function getMonthlyTrend(months = 6): Promise<MonthlyTrendPoint[]> {
  const session = await getSession();
  if (!session) return [];

  const response = await backendFetch(
    session,
    `/accounts/${session.accountId}/reports/by-month?months=${months}`,
  );
  if (!response.ok) return [];

  return response.json();
}
