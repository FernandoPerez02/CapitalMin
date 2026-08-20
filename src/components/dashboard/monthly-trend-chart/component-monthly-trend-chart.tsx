"use client";
import { ResponsiveBar, type BarDatum } from "@nivo/bar";
import type { MonthlyTrendPoint } from "@/types/report";

interface ComponentMonthlyTrendChartProps {
  data: MonthlyTrendPoint[];
}

export default function ComponentMonthlyTrendChart({ data }: ComponentMonthlyTrendChartProps) {
  // BarDatum exige una firma de índice que MonthlyTrendPoint no tiene —
  // se copian los campos a un objeto plano compatible en vez de forzar el
  // tipo con un cast.
  const chartData: BarDatum[] = data.map((point) => ({
    period: point.period,
    income: point.income,
    expense: point.expense,
  }));

  return (
    <div>
      <div className="h-[240px]">
        <ResponsiveBar
          data={chartData}
          keys={["income", "expense"]}
          indexBy="period"
          groupMode="grouped"
          margin={{ top: 20, right: 10, bottom: 30, left: 50 }}
          padding={0.3}
          colors={["var(--color-success)", "var(--color-danger)"]}
          borderRadius={4}
          axisTop={null}
          axisRight={null}
          axisBottom={{ tickSize: 0, tickPadding: 8 }}
          axisLeft={{ tickSize: 0, tickPadding: 8 }}
          enableLabel={false}
          enableGridX={false}
        />
      </div>
      <ul className="m-0 mt-2 flex list-none justify-center gap-4 p-0 text-sm text-text-muted">
        <li className="flex items-center gap-1">
          <span className="h-2.5 w-2.5 rounded-full bg-success" aria-hidden="true" />
          Ingresos
        </li>
        <li className="flex items-center gap-1">
          <span className="h-2.5 w-2.5 rounded-full bg-danger" aria-hidden="true" />
          Egresos
        </li>
      </ul>
    </div>
  );
}
