import Card from "@/components/ui/card";
import Tablet from "@/components/tables/tablet";
import { getMovementColumns } from "@/components/tables/columns/movement-columns";
import { getMovements } from "@/services/movements-service";
import { getWallets } from "@/services/wallets-service";
import { getCards } from "@/services/cards-service";
import { STATUS_OPTIONS } from "@/lib/status-options";
import type { MovementStatus, MovementType } from "@/types/movement";

const DEFAULT_WINDOW_DAYS = 90;

function daysAgoISO(n: number): string {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString().slice(0, 10);
}

const FILTER_FIELD_CLASSES = "flex flex-1 basis-40 flex-col gap-1";
const FILTER_LABEL_CLASSES = "text-xs text-text-muted";
const FILTER_INPUT_CLASSES =
  "min-h-11 rounded-lg border border-border bg-surface py-2 px-3 text-sm text-text";
const FILTER_SUBMIT_CLASSES =
  "min-h-11 cursor-pointer rounded-lg border-none bg-primary py-2 px-6 text-sm font-medium text-text-inverse hover:bg-primary-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-focus-ring focus-visible:outline-offset-2";

interface HistorySearchParams {
  dateFrom?: string;
  dateTo?: string;
  status?: string;
  typeMovement?: string;
}

export default async function HistoryPage({
  searchParams,
}: {
  searchParams: Promise<HistorySearchParams>;
}) {
  const params = await searchParams;
  // Sin dateFrom explícito, se acota a los últimos 90 días — el backend no
  // pagina el listado, así que sin un default el historial completo se
  // traería de una sola vez.
  const dateFrom = params.dateFrom || daysAgoISO(DEFAULT_WINDOW_DAYS);

  const [movements, wallets, cards] = await Promise.all([
    getMovements({
      dateFrom,
      dateTo: params.dateTo || undefined,
      status: params.status as MovementStatus | undefined,
      typeMovement: params.typeMovement as MovementType | undefined,
    }),
    getWallets(),
    getCards(),
  ]);

  return (
    <div className="flex w-full flex-col gap-4">
      <Card padding="md">
        <form method="GET" className="flex flex-col gap-3 md:flex-row md:flex-wrap md:items-end">
          <div className={FILTER_FIELD_CLASSES}>
            <label htmlFor="dateFrom" className={FILTER_LABEL_CLASSES}>
              Desde
            </label>
            <input
              type="date"
              id="dateFrom"
              name="dateFrom"
              defaultValue={dateFrom}
              className={FILTER_INPUT_CLASSES}
            />
          </div>
          <div className={FILTER_FIELD_CLASSES}>
            <label htmlFor="dateTo" className={FILTER_LABEL_CLASSES}>
              Hasta
            </label>
            <input
              type="date"
              id="dateTo"
              name="dateTo"
              defaultValue={params.dateTo ?? ""}
              className={FILTER_INPUT_CLASSES}
            />
          </div>
          <div className={FILTER_FIELD_CLASSES}>
            <label htmlFor="typeMovement" className={FILTER_LABEL_CLASSES}>
              Tipo
            </label>
            <select
              id="typeMovement"
              name="typeMovement"
              defaultValue={params.typeMovement ?? ""}
              className={FILTER_INPUT_CLASSES}
            >
              <option value="">Todos</option>
              <option value="Ingreso">Ingreso</option>
              <option value="Egreso">Egreso</option>
            </select>
          </div>
          <div className={FILTER_FIELD_CLASSES}>
            <label htmlFor="status" className={FILTER_LABEL_CLASSES}>
              Estado
            </label>
            <select
              id="status"
              name="status"
              defaultValue={params.status ?? ""}
              className={FILTER_INPUT_CLASSES}
            >
              <option value="">Todos</option>
              {STATUS_OPTIONS.map(({ value, label }) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </div>
          <button type="submit" className={FILTER_SUBMIT_CLASSES}>
            Filtrar
          </button>
        </form>
      </Card>

      <Tablet
        tableTitle="Historial de movimientos"
        columns={getMovementColumns(wallets, cards)}
        rows={movements}
        emptyMessage="No hay movimientos para el filtro seleccionado."
      />
    </div>
  );
}
