import Link from "next/link";
import { cx } from "@/lib/cx";
import Card from "@/components/ui/card";
import KpiCard from "@/components/dashboard/kpi-card/kpi-card";
import InsightCard from "@/components/dashboard/insight-card/insight-card";
import CategoryLegend from "@/components/dashboard/category-legend/category-legend";
import { CHART_CARD, KPI_ROW, SECTION_TITLE } from "@/styles/dashboard-shared-classes";
import { CategoryDonut, MonthlyTrend } from "./balance-charts";
import { getSummary, getCategoryReport, getMonthlyTrend } from "@/services/reports-service";
import { getCategoryTrends } from "@/services/analytics-service";
import { toCategoryDatum } from "@/lib/reports-metrics";
import { computeInsight } from "@/lib/dashboard-metrics";
import type { ReportRange } from "@/types/report";

const RANGES: ReportRange[] = ["day", "week", "month", "year"];
const RANGE_LABELS: Record<ReportRange, string> = {
  day: "Día",
  week: "Semana",
  month: "Mes",
  year: "Año",
};

function isReportRange(value: string | undefined): value is ReportRange {
  return RANGES.includes(value as ReportRange);
}

const RANGE_TAB_CLASSES =
  "flex min-h-11 items-center rounded-full border border-border bg-surface py-2 px-4 text-sm font-medium text-text-muted no-underline";
const RANGE_TAB_ACTIVE_CLASSES = "border-primary bg-primary text-text-inverse";

export default async function BalancePage({
  searchParams,
}: {
  searchParams: Promise<{ range?: string }>;
}) {
  const params = await searchParams;
  const range: ReportRange = isReportRange(params.range) ? params.range : "month";

  const [summary, categoryReport, monthlyTrend, categoryTrends] = await Promise.all([
    getSummary(range),
    getCategoryReport(range),
    getMonthlyTrend(6),
    getCategoryTrends(),
  ]);
  const categoryBreakdown = toCategoryDatum(categoryReport);
  const insight = computeInsight(categoryTrends);

  return (
    <div className="flex w-full flex-col gap-4">
      <nav className="flex flex-wrap gap-2" aria-label="Rango de tiempo">
        {RANGES.map((r) => (
          <Link
            key={r}
            href={`/balance?range=${r}`}
            aria-current={r === range ? "page" : undefined}
            className={cx(RANGE_TAB_CLASSES, r === range && RANGE_TAB_ACTIVE_CLASSES)}
          >
            {RANGE_LABELS[r]}
          </Link>
        ))}
      </nav>

      <div className={KPI_ROW}>
        <KpiCard title="Balance total" amount={summary.balance} />
        <KpiCard title={`Ingresos (${RANGE_LABELS[range]})`} amount={summary.incomeTotal} />
        <KpiCard title={`Egresos (${RANGE_LABELS[range]})`} amount={summary.expenseTotal} />
      </div>

      <InsightCard sentence={insight.sentence} />

      <Card padding="md" className={CHART_CARD}>
        <p className={SECTION_TITLE}>Ingresos vs. egresos (últimos 6 meses)</p>
        <MonthlyTrend data={monthlyTrend} />
      </Card>

      <Card padding="md" className={CHART_CARD}>
        <p className={SECTION_TITLE}>Gastos por categoría ({RANGE_LABELS[range]})</p>
        <CategoryDonut data={categoryBreakdown} />
        <CategoryLegend
          items={categoryBreakdown}
          emptyMessage="No hay gastos confirmados en este rango."
        />
      </Card>
    </div>
  );
}
