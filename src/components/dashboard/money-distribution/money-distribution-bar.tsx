import type { MoneyDistributionResult } from "@/lib/dashboard-metrics";
import { formatCurrency } from "@/lib/format-currency";

interface MoneyDistributionBarProps {
  distribution: MoneyDistributionResult;
}

export default function MoneyDistributionBar({ distribution }: MoneyDistributionBarProps) {
  const { disponible, metas, ahorro, disponibleLibre } = distribution;

  const segments = [
    { key: "metas", label: "Metas", amount: metas, colorVar: "var(--color-chart-4)" },
    { key: "ahorro", label: "Ahorro", amount: ahorro, colorVar: "var(--color-chart-1)" },
    {
      key: "disponibleLibre",
      label: "Disponible libre",
      amount: disponibleLibre,
      colorVar: "var(--color-chart-5)",
    },
  ];

  return (
    <div>
      <p className="m-0 text-sm text-text-muted">Distribución del dinero disponible</p>
      <p className="mt-1 mb-3 text-2xl font-semibold tabular-nums">{formatCurrency(disponible)}</p>

      <div className="mb-4 flex h-2.5 gap-0.5 overflow-hidden rounded-full bg-border">
        {segments.map((segment) => (
          <div
            key={segment.key}
            className="h-full transition-[width] duration-300 ease-in-out"
            style={{
              width: disponible > 0 ? `${(segment.amount / disponible) * 100}%` : "0%",
              backgroundColor: segment.colorVar,
            }}
          />
        ))}
      </div>

      <ul className="m-0 flex list-none flex-col gap-2 p-0">
        {segments.map((segment) => (
          <li key={segment.key} className="flex items-center gap-2 text-sm">
            <span
              className="h-2.5 w-2.5 shrink-0 rounded-full"
              style={{ backgroundColor: segment.colorVar }}
              aria-hidden="true"
            />
            <span className="flex-1 text-text">{segment.label}</span>
            <span className="text-text-muted tabular-nums">{formatCurrency(segment.amount)}</span>
            <span className="min-w-10 text-right font-medium tabular-nums">
              {disponible > 0 ? Math.round((segment.amount / disponible) * 100) : 0}%
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
