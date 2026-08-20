import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import QuickActionsGrid from "./quick-actions-grid";

describe("QuickActionsGrid", () => {
  it("'Nuevo movimiento' es un enlace real a /movements", () => {
    render(<QuickActionsGrid />);
    expect(screen.getByRole("link", { name: /Nuevo movimiento/ })).toHaveAttribute(
      "href",
      "/movements",
    );
  });

  it("'Transferir' es un enlace real al formulario de transferencias en /wallets", () => {
    render(<QuickActionsGrid />);
    expect(screen.getByRole("link", { name: /Transferir/ })).toHaveAttribute(
      "href",
      "/wallets?form=transfer",
    );
  });

  it("las otras 2 acciones están deshabilitadas (no tienen funcionalidad real)", () => {
    render(<QuickActionsGrid />);
    expect(screen.getByRole("button", { name: /Escanear ticket/ })).toBeDisabled();
    expect(screen.getByRole("button", { name: /Más/ })).toBeDisabled();
  });
});
