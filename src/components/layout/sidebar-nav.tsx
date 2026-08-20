import Link from "next/link";
import { NAV_ITEMS, SIDEBAR_EXTRA_ITEMS, isNavItemActive } from "./nav-items";
import Card from "@/components/ui/card";
import type { Session } from "@/lib/session";

const DAILY_TIPS = [
  "Revisa tus gastos de restaurantes: suelen ser los que más se salen del presupuesto.",
  "Define una meta de ahorro mensual, aunque sea pequeña. La constancia importa más que el monto.",
  "Registra tus movimientos el mismo día — así el balance del mes es siempre confiable.",
  "Compará tus egresos de este mes contra el anterior en la sección Balance.",
];

function getDailyTip(): string {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  const dayOfYear = Math.floor((now.getTime() - start.getTime()) / 86400000);
  return DAILY_TIPS[dayOfYear % DAILY_TIPS.length];
}

interface SidebarNavProps {
  pathname: string;
  user: Session | null;
}

const NAV_LINK_CLASSES =
  "group flex items-center gap-3 rounded-[10px] py-3 px-4 text-sm text-text-inverse no-underline transition-colors duration-150 hover:bg-surface-inverse-elevated focus-visible:outline focus-visible:outline-2 focus-visible:outline-focus-ring focus-visible:outline-offset-2 aria-[current=page]:bg-accent aria-[current=page]:text-text-on-accent aria-[current=page]:font-medium";

export default function SidebarNav({ pathname, user }: SidebarNavProps) {
  const email = user?.email ?? "Usuario";
  const initial = email.charAt(0).toUpperCase();

  return (
    <aside
      data-slot="sidebar-nav"
      className="col-start-1 hidden h-[calc(100vh-56px)] flex-col gap-4 self-start overflow-y-auto bg-surface-inverse py-6 px-3 sticky top-14 md:flex"
    >
      <nav className="flex-1">
        <ul className="m-0 flex list-none flex-col gap-2 p-0">
          {[...NAV_ITEMS, ...SIDEBAR_EXTRA_ITEMS].map(({ href, icon, label }) => {
            const isActive = isNavItemActive(pathname, href);
            return (
              <li key={href}>
                <Link
                  href={href}
                  aria-current={isActive ? "page" : undefined}
                  className={NAV_LINK_CLASSES}
                >
                  <i
                    className={`bi ${icon} text-xl opacity-75 group-aria-[current=page]:opacity-100`}
                  />
                  <span>{label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <Card tone="inverse" padding="sm" className="flex flex-col gap-2">
        <p className="m-0 text-xs font-semibold opacity-[0.85]">
          <span aria-hidden="true">💡</span> Consejo del día
        </p>
        <p className="m-0 text-xs leading-normal opacity-[0.85]">{getDailyTip()}</p>
        <Link
          href="/balance"
          className="mt-1 self-start rounded-full bg-surface-inverse py-1 px-3 text-xs text-text-inverse no-underline hover:bg-primary"
        >
          Ver análisis
        </Link>
      </Card>

      <div className="flex items-center gap-3 border-t border-surface-inverse-elevated py-2 px-3">
        <span
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent text-sm font-semibold text-text-on-accent"
          aria-hidden="true"
        >
          {initial}
        </span>
        <span className="flex min-w-0 flex-col text-text-inverse">
          <span className="overflow-hidden text-ellipsis whitespace-nowrap text-sm">{email}</span>
          <span className="text-xs opacity-[0.65]">Ver perfil</span>
        </span>
      </div>
    </aside>
  );
}
