import Card from "@/components/ui/card";
import Sparkline from "@/components/dashboard/sparkline/sparkline";
import { formatCurrency } from "@/lib/format-currency";

interface KpiCardProps {
  title: string;
  amount: number;
  trendPct?: number;
  sparkline?: number[];
}

export default function KpiCard({ title, amount, trendPct, sparkline }: KpiCardProps) {
  const hasTrend = trendPct !== undefined;
  const isPositive = hasTrend && trendPct >= 0;

  return (
    <Card padding="sm" className="flex min-w-40 flex-1 basis-[200px] flex-col gap-1">
      <p className="m-0 text-sm text-text-muted">{title}</p>
      <p className="m-0 text-2xl font-semibold tabular-nums">{formatCurrency(amount)}</p>
      {hasTrend && (
        <p
          className={`m-0 flex items-center text-xs ${isPositive ? "text-success" : "text-danger"}`}
        >
          <i
            className={`bi ${isPositive ? "bi-arrow-up-short" : "bi-arrow-down-short"} text-base`}
            aria-hidden="true"
          />
          {Math.abs(trendPct).toFixed(1)}% vs. el mes pasado
        </p>
      )}
      {sparkline && <Sparkline data={sparkline} />}
    </Card>
  );
}
