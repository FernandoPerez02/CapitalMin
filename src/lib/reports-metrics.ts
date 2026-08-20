import { CHART_COLORS } from "@/lib/chart-colors";
import type { CategoryBreakdownItem } from "@/lib/dashboard-metrics";
import type { CategoryReportItem } from "@/types/report";

/**
 * Las categorías reales (tabla `Category` del backend) no tienen un color
 * fijo predefinido como el union cerrado que usa el mock del dashboard —
 * se asigna por posición dentro de la paleta categórica.
 */
export function toCategoryDatum(items: CategoryReportItem[]): CategoryBreakdownItem[] {
  const total = items.reduce((sum, item) => sum + item.value, 0);

  return items.map((item, index) => ({
    label: item.label,
    amount: item.value,
    percentage: total > 0 ? (item.value / total) * 100 : 0,
    color: CHART_COLORS[index % CHART_COLORS.length],
  }));
}
