import Tablet, { type TableColumn } from "@/components/tables/tablet";
import BudgetForm from "./forms/budget-form";
import { getBudgets, getBudgetProjection } from "@/services/budget-service";
import StatusBadge from "@/components/ui/status-badge";
import BudgetAlertBadge from "@/components/ui/budget-alert-badge";
import BudgetRowActions from "@/components/budget/budget-row-actions";
import { formatCurrency } from "@/lib/format-currency";
import type { Budget, BudgetProjection } from "@/types/budget";

/**
 * Presupuesto predictivo (spec sección 10): el backend ya calcula
 * spent/percentUsed/projectedTotal/alertLevel por presupuesto
 * (`BudgetsService.buildProjection`) — acá solo se pide por id y se pinta,
 * sin reescanear movimientos del lado del cliente.
 */
function getBudgetColumns(projectionById: Map<string, BudgetProjection>): TableColumn<Budget>[] {
  return [
    { key: "date", header: "Fecha", accessor: "date" },
    { key: "period", header: "Periodo", accessor: "period" },
    { key: "description", header: "Descripción", accessor: "description" },
    { key: "amount", header: "Monto", render: (b) => formatCurrency(b.amount), align: "right" },
    {
      key: "spent",
      header: "Gastado",
      render: (b) => {
        const projection = projectionById.get(b.id);
        return projection ? formatCurrency(projection.spent) : "—";
      },
      align: "right",
    },
    {
      key: "percentUsed",
      header: "% usado",
      render: (b) => {
        const projection = projectionById.get(b.id);
        return projection ? `${Math.round(projection.percentUsed * 100)}%` : "—";
      },
      align: "right",
    },
    {
      key: "projectedTotal",
      header: "Proyectado",
      render: (b) => {
        const projection = projectionById.get(b.id);
        return projection ? formatCurrency(projection.projectedTotal) : "—";
      },
      align: "right",
    },
    {
      key: "alert",
      header: "Alerta",
      render: (b) => {
        const projection = projectionById.get(b.id);
        return projection ? <BudgetAlertBadge alertLevel={projection.alertLevel} /> : null;
      },
    },
    { key: "status", header: "Estado", render: (b) => <StatusBadge status={b.status} /> },
    {
      key: "actions",
      header: "",
      render: (b) => <BudgetRowActions budgetId={b.id} />,
      align: "right",
    },
  ];
}

export default async function BudgetPage() {
  const budgets = await getBudgets();
  const projections = await Promise.all(budgets.map((b) => getBudgetProjection(b.id)));
  const projectionById = new Map(
    projections.filter((p): p is BudgetProjection => p !== null).map((p) => [p.budgetId, p]),
  );

  return (
    <div className="flex flex-col md:flex-row gap-6 md:gap-10 p-4 md:p-10">
      <BudgetForm />
      <div className="min-w-0 flex-1">
        <Tablet
          tableTitle="Ultimos Presupuestos"
          columns={getBudgetColumns(projectionById)}
          rows={budgets}
        />
      </div>
    </div>
  );
}
