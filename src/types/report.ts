export type ReportRange = "day" | "week" | "month" | "year";

export interface Summary {
  range: ReportRange;
  balance: number;
  incomeTotal: number;
  expenseTotal: number;
}

export interface CategoryReportItem {
  id: string;
  label: string;
  value: number;
}

export interface MonthlyTrendPoint {
  period: string; // "YYYY-MM"
  income: number;
  expense: number;
}
