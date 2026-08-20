import type { TableColumn } from "@/components/tables/tablet";
import type { Movement } from "@/types/movement";
import type { Wallet } from "@/types/wallet";
import type { Card } from "@/types/card";
import MovementTypeBadge from "@/components/ui/movement-type-badge";
import StatusBadge from "@/components/ui/status-badge";
import MovementRowActions from "@/components/ui/movement-row-actions";
import { formatCurrency } from "@/lib/format-currency";

/**
 * El backend no embebe la wallet ni la tarjeta en la respuesta del
 * movimiento (solo los IDs), así que el nombre se resuelve acá contra las
 * listas ya cargadas de la cuenta — igual patrón que ya se usaba para
 * category, pero explícito porque category sí viene embebida y estas no.
 */
export function getMovementColumns(
  wallets: Wallet[] = [],
  cards: Card[] = [],
): TableColumn<Movement>[] {
  const walletNameById = new Map(wallets.map((wallet) => [wallet.id, wallet.name]));
  const cardNameById = new Map(cards.map((card) => [card.id, card.name]));

  return [
    { key: "date", header: "Fecha", accessor: "date" },
    {
      key: "wallet",
      header: "Cuenta",
      render: (m) =>
        m.walletId
          ? (walletNameById.get(m.walletId) ?? "—")
          : m.cardId
            ? `${cardNameById.get(m.cardId) ?? "—"} (tarjeta)`
            : "—",
    },
    { key: "type", header: "Tipo", render: (m) => <MovementTypeBadge type={m.typeMovement} /> },
    { key: "status", header: "Estado", render: (m) => <StatusBadge status={m.status} /> },
    {
      key: "category",
      header: "Categoría",
      render: (m) => m.category?.name ?? "Sin categoría",
    },
    {
      key: "amount",
      header: "Monto",
      render: (m) => formatCurrency(m.amount),
      align: "right",
    },
    { key: "description", header: "Descripción", accessor: "description" },
    {
      key: "actions",
      header: "",
      render: (m) => <MovementRowActions movementId={m.id} />,
      align: "right",
    },
  ];
}
