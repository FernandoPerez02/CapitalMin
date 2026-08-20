import Link from "next/link";
import { cx } from "@/lib/cx";
import Tablet from "@/components/tables/tablet";
import { debtColumns } from "@/components/tables/columns/debt-columns";
import DebtForm from "./forms/debt-form";
import DebtPaymentForm from "./forms/debt-payment-form";
import { getDebts } from "@/services/debts-service";
import { getWallets } from "@/services/wallets-service";

const FORMS = ["debt", "payment"] as const;
type FormTab = (typeof FORMS)[number];

const FORM_LABELS: Record<FormTab, string> = {
  debt: "Nueva deuda",
  payment: "Registrar pago",
};

function isFormTab(value: string | undefined): value is FormTab {
  return FORMS.includes(value as FormTab);
}

const TAB_CLASSES =
  "flex min-h-11 items-center rounded-full border border-border bg-surface py-2 px-4 text-sm font-medium text-text-muted no-underline";
const TAB_ACTIVE_CLASSES = "border-primary bg-primary text-text-inverse";

export default async function DebtsPage({
  searchParams,
}: {
  searchParams: Promise<{ form?: string }>;
}) {
  const params = await searchParams;
  const activeForm: FormTab = isFormTab(params.form) ? params.form : "debt";
  const [debts, wallets] = await Promise.all([getDebts(), getWallets()]);

  return (
    <div className="flex flex-col md:flex-row gap-6 md:gap-10 p-4 md:p-10">
      <div className="flex w-full flex-col gap-4 md:basis-[360px] md:flex-none">
        <nav className="flex flex-wrap gap-2" aria-label="Tipo de formulario">
          {FORMS.map((tab) => (
            <Link
              key={tab}
              href={`/debts?form=${tab}`}
              aria-current={tab === activeForm ? "page" : undefined}
              className={cx(TAB_CLASSES, tab === activeForm && TAB_ACTIVE_CLASSES)}
            >
              {FORM_LABELS[tab]}
            </Link>
          ))}
        </nav>
        {activeForm === "debt" ? <DebtForm /> : <DebtPaymentForm debts={debts} wallets={wallets} />}
      </div>
      <div className="min-w-0 flex-1">
        <Tablet tableTitle="Deudas" columns={debtColumns} rows={debts} />
      </div>
    </div>
  );
}
