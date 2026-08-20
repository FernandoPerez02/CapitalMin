import type { TableColumn } from "@/components/tables/tablet";
import type { Card } from "@/types/card";
import type { Wallet } from "@/types/wallet";
import CardRowActions from "@/components/cards/card-row-actions";
import { CARD_TYPE_OPTIONS } from "@/lib/card-type-options";
import { formatCurrency } from "@/lib/format-currency";

const TYPE_LABELS = Object.fromEntries(CARD_TYPE_OPTIONS.map(({ value, label }) => [value, label]));

export function getCardColumns(wallets: Wallet[]): TableColumn<Card>[] {
  const walletNameById = new Map(wallets.map((wallet) => [wallet.id, wallet.name]));

  return [
    { key: "name", header: "Nombre", accessor: "name" },
    { key: "type", header: "Tipo", render: (c) => TYPE_LABELS[c.type] ?? c.type },
    {
      key: "wallet",
      header: "Cuenta asociada",
      render: (c) => (c.walletId ? (walletNameById.get(c.walletId) ?? "—") : "—"),
    },
    {
      key: "creditLimit",
      header: "Cupo",
      render: (c) => (c.creditLimit === null ? "—" : formatCurrency(c.creditLimit)),
      align: "right",
    },
    {
      key: "balance",
      header: "Saldo utilizado",
      render: (c) => formatCurrency(c.balance),
      align: "right",
    },
    {
      key: "availableCredit",
      header: "Disponible",
      render: (c) => (c.availableCredit === null ? "—" : formatCurrency(c.availableCredit)),
      align: "right",
    },
    {
      key: "actions",
      header: "",
      render: (c) => (
        <CardRowActions
          cardId={c.id}
          wallets={wallets}
          showPay={c.type === "CREDIT" && c.isActive}
          isActive={c.isActive}
        />
      ),
      align: "right",
    },
  ];
}
