import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import MovementTypeBadge from "./movement-type-badge";

describe("MovementTypeBadge", () => {
  it("usa tono success para Ingreso", () => {
    render(<MovementTypeBadge type="Ingreso" />);
    expect(screen.getByText("Ingreso")).toHaveAttribute("data-tone", "success");
  });

  it("usa tono danger para Egreso", () => {
    render(<MovementTypeBadge type="Egreso" />);
    expect(screen.getByText("Egreso")).toHaveAttribute("data-tone", "danger");
  });

  it("usa tono warning para Transferencia (pago de tarjeta o transferencia entre wallets)", () => {
    render(<MovementTypeBadge type="Transferencia" />);
    expect(screen.getByText("Transferencia")).toHaveAttribute("data-tone", "warning");
  });
});
