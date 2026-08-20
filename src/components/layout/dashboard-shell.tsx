"use client";

import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import type { Session } from "@/lib/session";
import type { ReactNode } from "react";
import SidebarNav from "./sidebar-nav";
import BottomNav from "./bottom-nav";

interface DashboardShellProps {
  user: Session | null;
  children: ReactNode;
}

function greetingName(email: string | undefined): string {
  if (!email) return "Usuario";
  const localPart = email.split("@")[0];
  return localPart.charAt(0).toUpperCase() + localPart.slice(1);
}

export default function DashboardShell({ user, children }: DashboardShellProps) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  };

  return (
    <div className="grid min-h-screen grid-rows-[auto_1fr_auto]">
      <header className="sticky top-0 z-[1000]">
        <div className="flex min-h-[56px] items-center justify-between gap-4 border-b border-border bg-surface py-2 px-5">
          <div className="flex shrink-0 items-center gap-2">
            <Image
              src="/logoCM.png"
              alt="CapitalMin"
              width={32}
              height={32}
              className="h-8 w-auto"
            />
            <span className="text-lg font-semibold text-text">CapitalMin</span>
          </div>

          <div className="mr-auto hidden min-w-0 flex-col md:flex">
            <p className="m-0 text-lg font-semibold text-text">
              ¡Hola, {greetingName(user?.email)}! 👋
            </p>
            <p className="m-0 text-xs text-text-muted">Tu resumen financiero de hoy</p>
          </div>

          <div className="flex shrink-0 items-center gap-2">
            <label className="hidden items-center gap-2 rounded-full bg-page-bg py-2 px-4 text-text-muted md:flex">
              <i className="bi bi-search" aria-hidden="true" />
              <input
                type="search"
                placeholder="Buscar..."
                disabled
                aria-label="Buscar"
                className="w-40 border-none bg-transparent text-sm text-text outline-none placeholder:text-text-muted"
              />
            </label>
            <button
              type="button"
              className="hidden h-10 w-10 items-center justify-center rounded-full border-none bg-transparent text-lg text-text-muted disabled:opacity-[0.55] disabled:cursor-default sm:flex"
              disabled
              aria-label="Notificaciones"
            >
              <i className="bi bi-bell" />
            </button>
            <button
              type="button"
              className="hidden h-10 w-10 items-center justify-center rounded-full border-none bg-transparent text-lg text-text-muted disabled:opacity-[0.55] disabled:cursor-default sm:flex"
              disabled
              aria-label="Configuración"
            >
              <i className="bi bi-gear" />
            </button>
            <button
              type="button"
              className="flex h-11 w-11 items-center justify-center rounded-full border-none bg-transparent text-xl text-text-muted hover:bg-danger-subtle hover:text-danger focus-visible:outline focus-visible:outline-2 focus-visible:outline-focus-ring focus-visible:outline-offset-2"
              onClick={handleLogout}
              aria-label="Cerrar sesión"
            >
              <i className="bi bi-box-arrow-right"></i>
            </button>
          </div>
        </div>
      </header>
      <main className="grid grid-cols-1 bg-page-bg pb-[var(--bottom-nav-height,64px)] md:grid-cols-[240px_1fr] md:pb-0">
        <SidebarNav pathname={pathname} user={user} />
        <div className="flex min-w-0 flex-col p-4">{children}</div>
      </main>
      <BottomNav pathname={pathname} />
      <footer>&copy; 2025 CapitalMin. Todos los derechos reservados.</footer>
    </div>
  );
}
