import type { Goal } from "@/types/goal";
import type { CategoryTrend } from "@/types/analytics";
import { formatCurrency } from "@/lib/format-currency";

/**
 * Interfaz de datos para el legend/donut de categorías — la usan tanto
 * `reports-metrics.ts::toCategoryDatum` (adaptador puro sobre datos ya
 * agregados por el backend) como `category-legend.tsx`. No hay una función
 * en este módulo que la calcule desde `movements[]`: el backend siempre es
 * la fuente (`/reports/by-category`).
 */
export interface CategoryBreakdownItem {
  label: string;
  amount: number;
  percentage: number;
  color: string;
}

export function trendPct(current: number, previous: number): number | undefined {
  if (previous === 0) return undefined;
  return ((current - previous) / Math.abs(previous)) * 100;
}

export interface HealthScoreResult {
  score: number;
  band: "danger" | "warning" | "success";
}

/**
 * Heurística simple, no asesoría financiera real: usa la tasa de ahorro del
 * mes (ingresos - egresos) / ingresos, acotada a 0-100. Sin ingresos en el
 * mes, el score es 0 (no hay base para calcular una tasa de ahorro). Recibe
 * income/expenses ya agregados por `GET /dashboard` — no reescanea movements.
 */
export function computeHealthScore(income: number, expenses: number): HealthScoreResult {
  const savingsRate = income > 0 ? (income - expenses) / income : 0;
  const score = Math.min(100, Math.max(0, Math.round(savingsRate * 100)));
  const band: HealthScoreResult["band"] =
    score < 34 ? "danger" : score < 67 ? "warning" : "success";
  return { score, band };
}

export interface MoneyDistributionResult {
  disponible: number;
  metas: number;
  ahorro: number;
  disponibleLibre: number;
}

// Heurística: de lo que sobra después de cubrir el aporte mensual a las
// metas, la mitad se sugiere como ahorro adicional y la otra mitad queda
// como disponible libre. No es un cálculo financiero exacto, es un reparto
// ilustrativo para la barra de distribución.
const SAVINGS_ALLOCATION_RATIO = 0.5;

/** `disponible` viene ya agregado (`dashboard.month.savings`); `goals` es la
 * lista ya cargada para la sección de Metas — sumar su `monthlyContribution`
 * no es recalcular contabilidad, es leer un campo que el usuario ya cargó. */
export function computeMoneyDistribution(
  disponible: number,
  goals: Goal[],
): MoneyDistributionResult {
  const disponibleClamped = Math.max(disponible, 0);
  const metas = Math.min(
    goals.reduce((sum, g) => sum + g.monthlyContribution, 0),
    disponibleClamped,
  );
  const remaining = disponibleClamped - metas;
  const ahorro = remaining * SAVINGS_ALLOCATION_RATIO;
  const disponibleLibre = remaining - ahorro;

  return { disponible: disponibleClamped, metas, ahorro, disponibleLibre };
}

export interface InsightResult {
  sentence: string;
}

/**
 * Elige y formatea qué tendencia de categoría destacar — el análisis en sí
 * (tendencia, % de cambio, mensaje) ya lo hace `AnalyticsService` en el
 * backend; esto es puramente presentación: `trends` ya viene ordenado por
 * el backend (mayor gasto del último mes primero).
 */
export function computeInsight(trends: CategoryTrend[]): InsightResult {
  if (trends.length === 0) {
    return { sentence: "Todavía no hay gastos registrados este mes." };
  }

  const withMessage = trends.find((t) => t.message);
  if (withMessage?.message) {
    return { sentence: withMessage.message };
  }

  const top = trends[0];
  const latest = top.series[top.series.length - 1];
  return {
    sentence: `Tu mayor gasto reciente es ${top.categoryName} (${formatCurrency(latest.amount)}).`,
  };
}

export function daysUntilDue(dueDate: string, referenceDate: Date = new Date()): number {
  const due = new Date(dueDate);
  const ref = new Date(
    Date.UTC(
      referenceDate.getUTCFullYear(),
      referenceDate.getUTCMonth(),
      referenceDate.getUTCDate(),
    ),
  );
  return Math.round((due.getTime() - ref.getTime()) / (24 * 60 * 60 * 1000));
}
