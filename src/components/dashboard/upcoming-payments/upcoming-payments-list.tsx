import type { DashboardUpcomingPayment } from "@/types/dashboard";
import { daysUntilDue } from "@/lib/dashboard-metrics";
import { formatCurrency } from "@/lib/format-currency";
import { cx } from "@/lib/cx";

interface UpcomingPaymentsListProps {
  payments: DashboardUpcomingPayment[];
}

export default function UpcomingPaymentsList({ payments }: UpcomingPaymentsListProps) {
  if (payments.length === 0) {
    return <p className="text-sm text-text-muted">No tenés pagos próximos registrados.</p>;
  }

  return (
    <ul className="m-0 flex list-none flex-col gap-3 p-0">
      {payments.map((payment) => {
        const days = daysUntilDue(payment.dueDate);
        const dueLabel = payment.overdue
          ? "Vencida"
          : days <= 0
            ? "Vence hoy"
            : `en ${days} día${days === 1 ? "" : "s"}`;
        return (
          <li key={payment.id} className="flex items-center gap-3">
            <span
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] bg-page-bg font-semibold text-text-muted"
              aria-hidden="true"
            >
              {payment.name.charAt(0)}
            </span>
            <span className="flex min-w-0 flex-1 flex-col">
              <span className="text-sm text-text">{payment.name}</span>
              <span className={cx("text-xs", payment.overdue ? "text-danger" : "text-text-muted")}>
                {dueLabel}
              </span>
            </span>
            <span className="text-sm font-medium tabular-nums">
              {formatCurrency(payment.amount)}
            </span>
          </li>
        );
      })}
    </ul>
  );
}
