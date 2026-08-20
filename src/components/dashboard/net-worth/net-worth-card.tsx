import type { NetWorth } from "@/types/net-worth";
import { formatCurrency } from "@/lib/format-currency";

interface NetWorthCardProps {
  netWorth: NetWorth;
}

export default function NetWorthCard({ netWorth }: NetWorthCardProps) {
  return (
    <div>
      <p className="m-0 text-sm text-text-muted">Patrimonio neto</p>
      <p className="mt-1 mb-3 text-2xl font-semibold tabular-nums">
        {formatCurrency(netWorth.netWorth)}
      </p>
      <div className="flex gap-6">
        <div>
          <p className="m-0 text-xs text-text-muted">Activos</p>
          <p className="m-0 text-sm font-medium text-success tabular-nums">
            {formatCurrency(netWorth.assets)}
          </p>
        </div>
        <div>
          <p className="m-0 text-xs text-text-muted">Pasivos</p>
          <p className="m-0 text-sm font-medium text-danger tabular-nums">
            {formatCurrency(netWorth.liabilities)}
          </p>
        </div>
      </div>
    </div>
  );
}
