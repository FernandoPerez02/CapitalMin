import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import BottomNav from "./bottom-nav";
import { NAV_ITEMS } from "./nav-items";

describe("BottomNav", () => {
  it("renderiza los 5 ítems de navegación con su nombre accesible completo", () => {
    render(<BottomNav pathname="/home" />);
    NAV_ITEMS.forEach(({ label }) => {
      expect(screen.getByRole("link", { name: label })).toBeInTheDocument();
    });
  });

  it("marca como activo el ítem que coincide con el pathname actual", () => {
    render(<BottomNav pathname="/balance" />);
    const activeLink = screen.getByRole("link", { name: /Balance/ });
    expect(activeLink).toHaveAttribute("aria-current", "page");

    const inactiveLink = screen.getByRole("link", { name: /Historial/ });
    expect(inactiveLink).not.toHaveAttribute("aria-current");
  });

  it("expone un nav con label accesible", () => {
    render(<BottomNav pathname="/home" />);
    expect(screen.getByRole("navigation", { name: "Navegación principal" })).toBeInTheDocument();
  });

  it("el botón flotante enlaza a /movements por defecto", () => {
    render(<BottomNav pathname="/home" />);
    expect(screen.getByRole("link", { name: "Nuevo movimiento" })).toHaveAttribute(
      "href",
      "/movements",
    );
  });

  it("el botón flotante usa el callback onNewMovement cuando se provee", async () => {
    let clicked = false;
    render(<BottomNav pathname="/home" onNewMovement={() => (clicked = true)} />);
    await userEvent.click(screen.getByRole("button", { name: "Nuevo movimiento" }));
    expect(clicked).toBe(true);
  });
});
