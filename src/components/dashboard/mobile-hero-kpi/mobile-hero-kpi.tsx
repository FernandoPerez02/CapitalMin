import Card from "@/components/ui/card";
import { formatCurrency } from "@/lib/format-currency";

interface MobileHeroKpiProps {
  available: number;
  income: number;
}

export default function MobileHeroKpi({ available, income }: MobileHeroKpiProps) {
  const overspent = available < 0;
  // No existe un "objetivo" mensual definido en ningún dato mock ni real,
  // así que en vez de inventar un porcentaje de objetivo, se muestra el
  // disponible como porcentaje real de los ingresos del mes.
  const pct = income > 0 ? Math.min(100, Math.round((available / income) * 100)) : undefined;

  return (
    <Card data-slot="mobile-hero-kpi" padding="lg" className="block md:hidden">
      <p className="m-0 text-sm text-text-muted">Disponible este mes</p>
      <p className="mt-1 mb-3 text-[2rem] font-semibold tabular-nums">
        {formatCurrency(available)}
      </p>
      {overspent ? (
        <p className="m-0 text-xs text-danger">Gastaste más de lo que ingresó este mes.</p>
      ) : (
        pct !== undefined && (
          <>
            <div className="h-2 overflow-hidden rounded-full bg-page-bg">
              <div className="h-full rounded-full bg-primary" style={{ width: `${pct}%` }} />
            </div>
            <p className="mt-2 mb-0 text-xs text-text-muted">{pct}% de tus ingresos de este mes</p>
          </>
        )
      )}
    </Card>
  );
}
