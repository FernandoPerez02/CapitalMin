// shortLabel: usado solo por BottomNav — en 360px de ancho, 5 columnas dejan
// ~72px cada una y "Presupuesto"/"Movimientos" (11 caracteres) no entran sin
// truncarse. El accessible name sigue siendo el label completo (ver aria-label
// en bottom-nav.tsx), así que esto es puramente una abreviación visual.
export const NAV_ITEMS = [
  { href: "/home", icon: "bi-bar-chart-line", label: "Dashboard" },
  { href: "/budget", icon: "bi-cash-stack", label: "Presupuesto", shortLabel: "Presup." },
  {
    href: "/movements",
    icon: "bi-arrow-left-right",
    label: "Movimientos",
    shortLabel: "Movim.",
  },
  { href: "/balance", icon: "bi-graph-up-arrow", label: "Balance" },
  { href: "/history", icon: "bi-journal-text", label: "Historial" },
];

// Recursos nuevos (wallets, tarjetas, deudas, obligaciones): solo en el
// sidebar de escritorio, que no tiene el límite de espacio del bottom-nav
// mobile (ver nota arriba). En mobile se llega a estas páginas desde /home.
export const SIDEBAR_EXTRA_ITEMS = [
  { href: "/wallets", icon: "bi-wallet2", label: "Cuentas" },
  { href: "/obligations", icon: "bi-calendar-check", label: "Obligaciones" },
  { href: "/cards", icon: "bi-credit-card", label: "Tarjetas" },
  { href: "/debts", icon: "bi-graph-down-arrow", label: "Deudas" },
];

export function isNavItemActive(pathname: string, href: string): boolean {
  return pathname.startsWith(href);
}
