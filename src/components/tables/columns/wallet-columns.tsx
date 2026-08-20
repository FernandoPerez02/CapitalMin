import type { TableColumn } from "@/components/tables/tablet";
import type { Wallet } from "@/types/wallet";
import WalletRowActions from "@/components/wallets/wallet-row-actions";
import { WALLET_TYPE_OPTIONS } from "@/lib/wallet-type-options";
import { formatCurrency } from "@/lib/format-currency";

const TYPE_LABELS = Object.fromEntries(
  WALLET_TYPE_OPTIONS.map(({ value, label }) => [value, label]),
);

export const walletColumns: TableColumn<Wallet>[] = [
  { key: "name", header: "Cuenta", accessor: "name" },
  { key: "type", header: "Tipo", render: (w) => TYPE_LABELS[w.type] ?? w.type },
  { key: "currency", header: "Moneda", accessor: "currency" },
  {
    key: "balance",
    header: "Saldo",
    render: (w) => formatCurrency(w.balance),
    align: "right",
  },
  {
    key: "actions",
    header: "",
    render: (w) => <WalletRowActions walletId={w.id} isActive={w.isActive} />,
    align: "right",
  },
];
