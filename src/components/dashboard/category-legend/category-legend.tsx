import type { CategoryBreakdownItem } from "@/lib/dashboard-metrics";
import { formatCurrency } from "@/lib/format-currency";

interface CategoryLegendProps {
  items: CategoryBreakdownItem[];
  emptyMessage?: string;
}

export default function CategoryLegend({
  items,
  emptyMessage = "Todavía no hay gastos registrados en este período.",
}: CategoryLegendProps) {
  if (items.length === 0) {
    return <p className="text-sm text-text-muted">{emptyMessage}</p>;
  }

  return (
    <ul className="m-0 flex list-none flex-col gap-2 p-0">
      {items.map((item) => (
        <li key={item.label} className="flex items-center gap-2 text-sm">
          <span
            className="h-2.5 w-2.5 shrink-0 rounded-full"
            style={{ backgroundColor: item.color }}
            aria-hidden="true"
          />
          <span className="flex-1 text-text">{item.label}</span>
          <span className="text-text-muted tabular-nums">{formatCurrency(item.amount)}</span>
          <span className="min-w-10 text-right font-medium tabular-nums">
            {Math.round(item.percentage)}%
          </span>
        </li>
      ))}
    </ul>
  );
}
