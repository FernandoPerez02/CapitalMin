"use client";

import dynamic from "next/dynamic";
import type { CategoryBreakdownItem } from "@/lib/dashboard-metrics";
import type { MonthlyTrendPoint } from "@/types/report";

// Envoltorio "use client": next/dynamic con ssr:false solo puede usarse
// dentro de un Client Component, y balance/page.tsx es un Server Component
// (necesita await para traer los datos reales del backend). Mismo patrón
// que home/dashboard-charts.tsx.
const ComponentPieChart = dynamic(
  () => import("@/components/dashboard/pie-chart/component-pie-chart"),
  { ssr: false },
);
const ComponentMonthlyTrendChart = dynamic(
  () => import("@/components/dashboard/monthly-trend-chart/component-monthly-trend-chart"),
  { ssr: false },
);

export function CategoryDonut({ data }: { data: CategoryBreakdownItem[] }) {
  return <ComponentPieChart data={data} />;
}

export function MonthlyTrend({ data }: { data: MonthlyTrendPoint[] }) {
  return <ComponentMonthlyTrendChart data={data} />;
}
