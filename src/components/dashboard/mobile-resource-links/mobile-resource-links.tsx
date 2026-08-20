import Link from "next/link";
import { SIDEBAR_EXTRA_ITEMS } from "@/components/layout/nav-items";

// El bottom-nav mobile se queda en 5 ítems (ver comentario sobre
// `shortLabel` en nav-items.ts) — Cuentas/Obligaciones/Tarjetas/Deudas
// llegan al sidebar de escritorio directo, pero en mobile no tenían punto
// de entrada. Este grid reutiliza la misma lista de `SIDEBAR_EXTRA_ITEMS`
// (una sola fuente de verdad para esos 4 recursos) con el mismo lenguaje
// visual que QuickActionsGrid.
const ITEM_CLASSES =
  "flex flex-col items-center gap-2 rounded-2xl border-none bg-surface py-3 px-1 text-center text-xs text-text no-underline shadow-[0_1px_2px_rgba(16,21,28,0.04),0_4px_12px_rgba(16,21,28,0.06)]";
const ICON_CLASSES =
  "flex h-10 w-10 items-center justify-center rounded-full bg-page-bg text-lg text-primary";
const LABEL_CLASSES = "line-clamp-2 leading-tight";

export default function MobileResourceLinks() {
  return (
    <div
      data-slot="mobile-resource-links"
      className="grid grid-cols-2 min-[400px]:grid-cols-4 gap-2 md:hidden"
    >
      {SIDEBAR_EXTRA_ITEMS.map((item) => (
        <Link key={item.href} href={item.href} className={ITEM_CLASSES}>
          <span className={ICON_CLASSES}>
            <i className={`bi ${item.icon}`} aria-hidden="true" />
          </span>
          <span className={LABEL_CLASSES}>{item.label}</span>
        </Link>
      ))}
    </div>
  );
}
