import Card from "@/components/ui/card";
import {
  CHART_CARD,
  DASHBOARD_ROW_GRID,
  KPI_ROW,
  SECTION_TITLE,
} from "@/styles/dashboard-shared-classes";
import Tablet from "@/components/tables/tablet";
import { getMovementColumns } from "@/components/tables/columns/movement-columns";
import KpiCard from "@/components/dashboard/kpi-card/kpi-card";
import HealthScoreGauge from "@/components/dashboard/health-score-gauge/health-score-gauge";
import InsightCard from "@/components/dashboard/insight-card/insight-card";
import CategoryLegend from "@/components/dashboard/category-legend/category-legend";
import GoalsList from "@/components/dashboard/goals/goals-list";
import UpcomingPaymentsList from "@/components/dashboard/upcoming-payments/upcoming-payments-list";
import MoneyDistributionBar from "@/components/dashboard/money-distribution/money-distribution-bar";
import QuickActionsGrid from "@/components/dashboard/quick-actions/quick-actions-grid";
import MobileHeroKpi from "@/components/dashboard/mobile-hero-kpi/mobile-hero-kpi";
import MobileResourceLinks from "@/components/dashboard/mobile-resource-links/mobile-resource-links";
import NetWorthCard from "@/components/dashboard/net-worth/net-worth-card";
import { CategoryDonut, MonthlyTrend } from "./dashboard-charts";
import { getMovements } from "@/services/movements-service";
import { getGoals } from "@/services/goals-service";
import { getWallets } from "@/services/wallets-service";
import { getCards } from "@/services/cards-service";
import { getDashboard } from "@/services/dashboard-service";
import { getCategoryReport, getMonthlyTrend } from "@/services/reports-service";
import { getCategoryTrends } from "@/services/analytics-service";
import { toCategoryDatum } from "@/lib/reports-metrics";
import {
  computeHealthScore,
  computeMoneyDistribution,
  computeInsight,
  trendPct,
} from "@/lib/dashboard-metrics";

const HEALTH_CAPTIONS = {
  success: "¡Vas por buen camino!",
  warning: "Podés mejorar tu tasa de ahorro este mes.",
  danger: "Tus gastos superaron tus ingresos este mes.",
};

const TREND_MONTHS = 6;

export default async function Home() {
  const [
    dashboard,
    movements,
    goals,
    wallets,
    cards,
    categoryReport,
    monthlyTrend,
    categoryTrends,
  ] = await Promise.all([
    getDashboard(),
    getMovements(),
    getGoals(),
    getWallets(),
    getCards(),
    getCategoryReport("month"),
    getMonthlyTrend(TREND_MONTHS),
    getCategoryTrends(),
  ]);

  const { month, netWorth, upcomingPayments } = dashboard;
  const categoryBreakdown = toCategoryDatum(categoryReport);
  const healthScore = computeHealthScore(month.income, month.expense);
  const distribution = computeMoneyDistribution(month.savings, goals);
  const insight = computeInsight(categoryTrends);

  const previousMonth = monthlyTrend[monthlyTrend.length - 2];
  const availableTrendPct = previousMonth
    ? trendPct(month.savings, previousMonth.income - previousMonth.expense)
    : undefined;
  const incomeTrendPct = previousMonth ? trendPct(month.income, previousMonth.income) : undefined;
  const expensesTrendPct = previousMonth
    ? trendPct(month.expense, previousMonth.expense)
    : undefined;

  return (
    <div className="flex w-full flex-col gap-4">
      <MobileHeroKpi available={month.savings} income={month.income} />
      <QuickActionsGrid />
      <MobileResourceLinks />

      <div className={KPI_ROW}>
        <KpiCard title="Saldo Disponible" amount={month.savings} trendPct={availableTrendPct} />
        <KpiCard title="Ingresos Mes" amount={month.income} trendPct={incomeTrendPct} />
        <KpiCard title="Egresos Mes" amount={month.expense} trendPct={expensesTrendPct} />
      </div>

      <div className={DASHBOARD_ROW_GRID}>
        <Card padding="md" className="flex flex-col items-center gap-2 text-center">
          <p className={SECTION_TITLE}>Salud financiera</p>
          <HealthScoreGauge score={healthScore.score} band={healthScore.band} />
          <p className="m-0 text-sm text-text-muted">{HEALTH_CAPTIONS[healthScore.band]}</p>
        </Card>
        <InsightCard sentence={insight.sentence} />
      </div>

      <div className={DASHBOARD_ROW_GRID}>
        <Card padding="md" className={CHART_CARD}>
          <p className={SECTION_TITLE}>Gastos por categoría</p>
          <CategoryDonut data={categoryBreakdown} />
          <CategoryLegend items={categoryBreakdown} />
        </Card>
        <Card padding="md" className={CHART_CARD}>
          <p className={SECTION_TITLE}>Ingresos vs. egresos (últimos {TREND_MONTHS} meses)</p>
          <MonthlyTrend data={monthlyTrend} />
        </Card>
      </div>

      <div className={DASHBOARD_ROW_GRID}>
        <Card padding="md">
          <p className={SECTION_TITLE}>Metas</p>
          <GoalsList goals={goals} />
        </Card>
        <Card padding="md">
          <p className={SECTION_TITLE}>Próximos pagos</p>
          <UpcomingPaymentsList payments={upcomingPayments} />
        </Card>
      </div>

      <Card padding="md">
        <NetWorthCard netWorth={netWorth} />
      </Card>

      <Card padding="md">
        <MoneyDistributionBar distribution={distribution} />
      </Card>

      <Tablet
        tableTitle="Movimientos Recientes"
        columns={getMovementColumns(wallets, cards)}
        rows={movements}
        initialRowsToShow={5}
      />
    </div>
  );
}
