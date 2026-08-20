"use client";

import dynamic from "next/dynamic";
import type { CategoryBreakdownItem } from "@/lib/dashboard-metrics";
import type { MonthlyTrendPoint } from "@/types/report";

// Envoltorio "use client": next/dynamic con ssr:false solo puede usarse
// dentro de un Client Component, y home/page.tsx es un Server Component
// (necesita await para traer los datos). Este archivo es el único límite
// cliente de la página — el resto de las tarjetas se arman server-side.
// Mismo patrón que balance/balance-charts.tsx, con los mismos componentes
// de gráfico (la evolución mensual ya viene agregada del backend en ambas
// páginas vía /reports/by-month, no hay motivo para dos implementaciones).
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
