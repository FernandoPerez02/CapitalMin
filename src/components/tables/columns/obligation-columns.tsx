import type { TableColumn } from "@/components/tables/tablet";
import type { Obligation } from "@/types/obligation";
import type { Wallet } from "@/types/wallet";
import ObligationStatusBadge from "@/components/ui/obligation-status-badge";
import ObligationRowActions from "@/components/obligations/obligation-row-actions";
import { formatCurrency } from "@/lib/format-currency";

export function getObligationColumns(wallets: Wallet[]): TableColumn<Obligation>[] {
  return [
    { key: "name", header: "Nombre", accessor: "name" },
    {
      key: "amount",
      header: "Monto",
      render: (o) => formatCurrency(o.amount),
      align: "right",
    },
    { key: "dueDate", header: "Vence", accessor: "dueDate" },
    {
      key: "recurrence",
      header: "Frecuencia",
      render: (o) =>
        o.recurrenceDayOfMonth ? `Mensual (día ${o.recurrenceDayOfMonth})` : "Puntual",
    },
    {
      key: "status",
      header: "Estado",
      render: (o) => <ObligationStatusBadge status={o.status} overdue={o.overdue} />,
    },
    {
      key: "actions",
      header: "",
      render: (o) => (
        <ObligationRowActions
          obligationId={o.id}
          wallets={wallets}
          showPay={o.status === "PENDIENTE" && o.isActive}
          isActive={o.isActive}
        />
      ),
      align: "right",
    },
  ];
}
