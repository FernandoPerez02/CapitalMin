import type { TableColumn } from "@/components/tables/tablet";
import type { Debt } from "@/types/debt";
import DebtRowActions from "@/components/debts/debt-row-actions";
import { formatCurrency } from "@/lib/format-currency";

function DebtProgress({ debt }: { debt: Debt }) {
  const pct = Math.round(debt.percentPaid * 100);
  return (
    <div className="min-w-[120px]">
      <div className="h-1.5 overflow-hidden rounded-full bg-border">
        <div className="h-full rounded-full bg-primary" style={{ width: `${pct}%` }} />
      </div>
      <p className="m-0 mt-1 text-xs text-text-muted tabular-nums">{pct}%</p>
    </div>
  );
}

export const debtColumns: TableColumn<Debt>[] = [
  { key: "name", header: "Nombre", accessor: "name" },
  {
    key: "principal",
    header: "Capital",
    render: (d) => formatCurrency(d.principal),
    align: "right",
  },
  {
    key: "interestRate",
    header: "Tasa",
    render: (d) => `${d.interestRate}%`,
    align: "right",
  },
  { key: "termMonths", header: "Plazo", render: (d) => `${d.termMonths} meses` },
  {
    key: "estimatedInstallment",
    header: "Cuota estimada",
    render: (d) => formatCurrency(d.estimatedInstallment),
    align: "right",
  },
  {
    key: "pendingBalance",
    header: "Saldo pendiente",
    render: (d) => formatCurrency(d.pendingBalance),
    align: "right",
  },
  {
    key: "progress",
    header: "Avance",
    render: (d) => <DebtProgress debt={d} />,
  },
  {
    key: "actions",
    header: "",
    render: (d) => <DebtRowActions debtId={d.id} isActive={d.isActive} />,
    align: "right",
  },
];
