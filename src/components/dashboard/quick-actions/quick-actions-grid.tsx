import Link from "next/link";
import { cx } from "@/lib/cx";

interface QuickAction {
  key: string;
  label: string;
  icon: string;
  href?: string;
}

// "Nuevo movimiento" y "Transferir" tienen funcionalidad real detrás (los
// formularios de /movements y /wallets). Escanear ticket y Más no tienen
// ninguna funcionalidad en la app hoy (sin OCR, sin menú "más"), así que se
// muestran deshabilitados en vez de simular que hacen algo — mismo criterio
// que los controles del topbar del Incremento 1.
const ACTIONS: QuickAction[] = [
  { key: "new-movement", label: "Nuevo movimiento", icon: "bi-plus-lg", href: "/movements" },
  { key: "scan-receipt", label: "Escanear ticket", icon: "bi-camera" },
  {
    key: "transfer",
    label: "Transferir",
    icon: "bi-arrow-left-right",
    href: "/wallets?form=transfer",
  },
  { key: "more", label: "Más", icon: "bi-three-dots" },
];

const ITEM_CLASSES =
  "flex flex-col items-center gap-2 rounded-2xl border-none bg-surface py-3 px-1 text-center text-xs text-text no-underline shadow-[0_1px_2px_rgba(16,21,28,0.04),0_4px_12px_rgba(16,21,28,0.06)] disabled:text-disabled-text disabled:cursor-default";
const ICON_CLASSES =
  "flex h-10 w-10 items-center justify-center rounded-full bg-page-bg text-lg text-text-muted";
const LABEL_CLASSES = "line-clamp-2 leading-tight";

export default function QuickActionsGrid() {
  return (
    <div
      data-slot="quick-actions-grid"
      className="grid grid-cols-2 min-[400px]:grid-cols-4 gap-2 md:hidden"
    >
      {ACTIONS.map((action) =>
        action.href ? (
          <Link key={action.key} href={action.href} className={ITEM_CLASSES}>
            <span className={cx(ICON_CLASSES, "bg-primary text-text-inverse")}>
              <i className={`bi ${action.icon}`} aria-hidden="true" />
            </span>
            <span className={LABEL_CLASSES}>{action.label}</span>
          </Link>
        ) : (
          <button key={action.key} type="button" className={ITEM_CLASSES} disabled>
            <span className={ICON_CLASSES}>
              <i className={`bi ${action.icon}`} aria-hidden="true" />
            </span>
            <span className={LABEL_CLASSES}>{action.label}</span>
          </button>
        ),
      )}
    </div>
  );
}
