import Link from "next/link";
import { cx } from "@/lib/cx";
import Tablet from "@/components/tables/tablet";
import StatusTabs, { isRecordStatus } from "@/components/tables/status-tabs";
import { walletColumns } from "@/components/tables/columns/wallet-columns";
import WalletForm from "./forms/wallet-form";
import TransferForm from "./forms/transfer-form";
import { getWallets } from "@/services/wallets-service";

const FORMS = ["account", "transfer"] as const;
type FormTab = (typeof FORMS)[number];

const FORM_LABELS: Record<FormTab, string> = {
  account: "Nueva cuenta",
  transfer: "Transferencia",
};

function isFormTab(value: string | undefined): value is FormTab {
  return FORMS.includes(value as FormTab);
}

const TAB_CLASSES =
  "flex min-h-11 items-center rounded-full border border-border bg-surface py-2 px-4 text-sm font-medium text-text-muted no-underline";
const TAB_ACTIVE_CLASSES = "border-primary bg-primary text-text-inverse";

export default async function WalletsPage({
  searchParams,
}: {
  searchParams: Promise<{ form?: string; status?: string }>;
}) {
  const params = await searchParams;
  const activeForm: FormTab = isFormTab(params.form) ? params.form : "account";
  const status = isRecordStatus(params.status) ? params.status : "active";
  const wallets = await getWallets();
  const activeWallets = wallets.filter((wallet) => wallet.isActive);
  const visibleWallets = wallets.filter((wallet) => wallet.isActive === (status === "active"));

  return (
    <div className="flex flex-col md:flex-row gap-6 md:gap-10 p-4 md:p-10">
      <div className="flex w-full flex-col gap-4 md:basis-[360px] md:flex-none">
        <nav className="flex flex-wrap gap-2" aria-label="Tipo de formulario">
          {FORMS.map((tab) => (
            <Link
              key={tab}
              href={`/wallets?form=${tab}`}
              aria-current={tab === activeForm ? "page" : undefined}
              className={cx(TAB_CLASSES, tab === activeForm && TAB_ACTIVE_CLASSES)}
            >
              {FORM_LABELS[tab]}
            </Link>
          ))}
        </nav>
        {activeForm === "account" ? <WalletForm /> : <TransferForm wallets={activeWallets} />}
      </div>
      <div className="min-w-0 flex-1">
        <div className="mb-4">
          <StatusTabs basePath="/wallets" status={status} extraQuery={{ form: activeForm }} />
        </div>
        <Tablet
          tableTitle={status === "active" ? "Cuentas" : "Cuentas inactivas"}
          columns={walletColumns}
          rows={visibleWallets}
          emptyMessage={
            status === "active" ? "No hay registros para mostrar" : "No hay cuentas inactivas"
          }
        />
      </div>
    </div>
  );
}
