import Tablet from "@/components/tables/tablet";
import StatusTabs, { isRecordStatus } from "@/components/tables/status-tabs";
import { getObligationColumns } from "@/components/tables/columns/obligation-columns";
import ObligationForm from "./forms/obligation-form";
import { getObligations } from "@/services/obligations-service";
import { getCategories } from "@/services/categories-service";
import { getWallets } from "@/services/wallets-service";

export default async function ObligationsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const params = await searchParams;
  const status = isRecordStatus(params.status) ? params.status : "active";
  const [obligations, categories, wallets] = await Promise.all([
    getObligations(),
    getCategories(),
    getWallets(),
  ]);
  const visibleObligations = obligations.filter(
    (obligation) => obligation.isActive === (status === "active"),
  );

  return (
    <div className="flex flex-col md:flex-row gap-6 md:gap-10 p-4 md:p-10">
      <ObligationForm categories={categories} />
      <div className="min-w-0 flex-1">
        <div className="mb-4">
          <StatusTabs basePath="/obligations" status={status} />
        </div>
        <Tablet
          tableTitle={status === "active" ? "Obligaciones" : "Obligaciones inactivas"}
          columns={getObligationColumns(wallets)}
          rows={visibleObligations}
          emptyMessage={
            status === "active" ? "No hay registros para mostrar" : "No hay obligaciones inactivas"
          }
        />
      </div>
    </div>
  );
}
