import MovementsTable from "@/components/movements/movements-table";
import MovementsForms from "./forms/movements-forms";
import { getMovements } from "@/services/movements-service";
import { getObligations } from "@/services/obligations-service";
import { getCategories } from "@/services/categories-service";
import { getWallets } from "@/services/wallets-service";
import { getCards } from "@/services/cards-service";

export default async function MovementsPage() {
  const [movements, obligations, categories, wallets, cards] = await Promise.all([
    getMovements(),
    getObligations({ status: "PENDIENTE" }),
    getCategories(),
    getWallets(),
    getCards(),
  ]);
  const payableObligations = obligations.filter((obligation) => obligation.isActive);
  return (
    <div className="flex flex-col md:flex-row gap-6 md:gap-10 p-4 md:p-10">
      <MovementsForms
        obligations={payableObligations}
        categories={categories}
        wallets={wallets}
        cards={cards}
      />
      <div className="min-w-0 flex-1">
        <MovementsTable
          tableTitle="Ultimos Movimientos"
          movements={movements}
          categories={categories}
          wallets={wallets}
          cards={cards}
        />
      </div>
    </div>
  );
}
