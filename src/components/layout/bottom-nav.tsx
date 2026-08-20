import Link from "next/link";
import { NAV_ITEMS, isNavItemActive } from "./nav-items";

interface BottomNavProps {
  pathname: string;
  onNewMovement?: () => void;
}

const NAV_LINK_CLASSES =
  "flex min-h-11 w-full flex-col items-center justify-center gap-1 py-1 px-1 text-text-inverse no-underline opacity-70 focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-focus-ring aria-[current=page]:text-accent aria-[current=page]:opacity-100";
const NAV_LABEL_CLASSES = "block w-full truncate text-center text-[11px] leading-tight";

const FAB_CLASSES =
  "absolute left-1/2 -top-[22px] flex h-[52px] w-[52px] -translate-x-1/2 items-center justify-center rounded-full border-4 border-page-bg bg-primary text-[22px] text-text-inverse shadow-[0_4px_10px_rgba(16,21,28,0.25)] hover:bg-primary-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-focus-ring focus-visible:outline-offset-2";

export default function BottomNav({ pathname, onNewMovement }: BottomNavProps) {
  return (
    <nav
      className="fixed left-0 right-0 bottom-0 z-[1000] h-16 bg-surface-inverse pb-[env(safe-area-inset-bottom,0px)] shadow-[0_-1px_0_rgba(0,0,0,0.08)] md:hidden"
      aria-label="Navegación principal"
    >
      <ul className="m-0 flex h-full list-none p-0">
        {NAV_ITEMS.map(({ href, icon, label, shortLabel }) => {
          const isActive = isNavItemActive(pathname, href);
          return (
            <li key={href} className="min-w-0 flex-1">
              <Link
                href={href}
                aria-current={isActive ? "page" : undefined}
                aria-label={shortLabel ? label : undefined}
                className={NAV_LINK_CLASSES}
              >
                <i className={`bi ${icon} text-xl`} aria-hidden="true" />
                <span className={NAV_LABEL_CLASSES} aria-hidden={shortLabel ? true : undefined}>
                  {shortLabel ?? label}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
      {onNewMovement ? (
        <button
          type="button"
          className={FAB_CLASSES}
          onClick={onNewMovement}
          aria-label="Nuevo movimiento"
        >
          <i className="bi bi-plus-lg" />
        </button>
      ) : (
        <Link href="/movements" className={FAB_CLASSES} aria-label="Nuevo movimiento">
          <i className="bi bi-plus-lg" />
        </Link>
      )}
    </nav>
  );
}
