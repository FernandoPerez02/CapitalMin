export type CategoryTrendDirection = "increasing" | "decreasing" | "stable" | "insufficient_data";

export interface CategoryTrendPoint {
  period: string;
  amount: number;
}

export interface CategoryTrend {
  categoryId: string;
  categoryName: string;
  series: CategoryTrendPoint[];
  trend: CategoryTrendDirection;
  changePercent: number | null;
  message: string | null;
}
