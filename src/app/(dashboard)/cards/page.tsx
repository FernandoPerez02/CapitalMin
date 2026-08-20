import Tablet from "@/components/tables/tablet";
import StatusTabs, { isRecordStatus } from "@/components/tables/status-tabs";
import { getCardColumns } from "@/components/tables/columns/card-columns";
import CardForm from "./forms/card-form";
import { getCards } from "@/services/cards-service";
import { getWallets } from "@/services/wallets-service";

export default async function CardsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const params = await searchParams;
  const status = isRecordStatus(params.status) ? params.status : "active";
  const [cards, wallets] = await Promise.all([getCards(), getWallets()]);
  const visibleCards = cards.filter((card) => card.isActive === (status === "active"));

  return (
    <div className="flex flex-col md:flex-row gap-6 md:gap-10 p-4 md:p-10">
      <div className="flex w-full flex-col gap-4 md:basis-[360px] md:flex-none">
        <CardForm wallets={wallets.filter((wallet) => wallet.isActive)} />
      </div>
      <div className="min-w-0 flex-1">
        <div className="mb-4">
          <StatusTabs basePath="/cards" status={status} />
        </div>
        <Tablet
          tableTitle={status === "active" ? "Tarjetas" : "Tarjetas inactivas"}
          columns={getCardColumns(wallets)}
          rows={visibleCards}
          emptyMessage={
            status === "active" ? "No hay registros para mostrar" : "No hay tarjetas inactivas"
          }
        />
      </div>
    </div>
  );
}
