import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import SidebarNav from "./sidebar-nav";
import { NAV_ITEMS } from "./nav-items";

const user = {
  email: "demo@capitalmin.com",
  accountId: "acc_1",
  accessToken: "token",
  refreshToken: "refresh",
};

describe("SidebarNav", () => {
  it("renderiza los 5 ítems de navegación", () => {
    render(<SidebarNav pathname="/home" user={user} />);
    NAV_ITEMS.forEach(({ label }) => {
      expect(screen.getByText(label)).toBeInTheDocument();
    });
  });

  it("marca como activo el ítem que coincide con el pathname actual", () => {
    render(<SidebarNav pathname="/movements" user={user} />);
    const activeLink = screen.getByRole("link", { name: /Movimientos/ });
    expect(activeLink).toHaveAttribute("aria-current", "page");

    const inactiveLink = screen.getByRole("link", { name: /Presupuesto/ });
    expect(inactiveLink).not.toHaveAttribute("aria-current");
  });

  it("muestra la tarjeta de consejo del día con un enlace a Balance", () => {
    render(<SidebarNav pathname="/home" user={user} />);
    expect(screen.getByText("Consejo del día")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Ver análisis" })).toHaveAttribute("href", "/balance");
  });

  it("muestra el chip de perfil con el email del usuario", () => {
    render(<SidebarNav pathname="/home" user={user} />);
    expect(screen.getByText("demo@capitalmin.com")).toBeInTheDocument();
    expect(screen.getByText("Ver perfil")).toBeInTheDocument();
  });

  it("usa 'Usuario' como respaldo cuando no hay sesión", () => {
    render(<SidebarNav pathname="/home" user={null} />);
    expect(screen.getByText("Usuario")).toBeInTheDocument();
  });
});
