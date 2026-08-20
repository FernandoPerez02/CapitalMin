import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import UpcomingPaymentsList from "./upcoming-payments-list";
import type { Obligation } from "@/types/obligation";

// Coincide con la normalización UTC interna de daysUntilDue, para que la
// prueba no dependa de la zona horaria de la máquina donde corre.
function daysFromNow(n: number): string {
  const now = new Date();
  const utcToday = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
  utcToday.setUTCDate(utcToday.getUTCDate() + n);
  return utcToday.toISOString().slice(0, 10);
}

function obligation(overrides: Partial<Obligation>): Obligation {
  return {
    id: "p1",
    name: "Netflix",
    amount: 39900,
    typeMovement: "Egreso",
    categoryId: null,
    dueDate: daysFromNow(3),
    recurrenceDayOfMonth: null,
    status: "PENDIENTE",
    overdue: false,
    isActive: true,
    ...overrides,
  };
}

describe("UpcomingPaymentsList", () => {
  it("muestra el mensaje vacío sin pagos", () => {
    render(<UpcomingPaymentsList payments={[]} />);
    expect(screen.getByText("No tenés pagos próximos registrados.")).toBeInTheDocument();
  });

  it("muestra el nombre, monto y días restantes", () => {
    const payments = [obligation({ dueDate: daysFromNow(3) })];
    render(<UpcomingPaymentsList payments={payments} />);
    expect(screen.getByText("Netflix")).toBeInTheDocument();
    expect(screen.getByText("en 3 días")).toBeInTheDocument();
    expect(screen.getByText(/39\.900/)).toBeInTheDocument();
  });

  it("muestra 'Vence hoy' cuando el vencimiento es hoy", () => {
    const payments = [obligation({ name: "Spotify", amount: 16500, dueDate: daysFromNow(0) })];
    render(<UpcomingPaymentsList payments={payments} />);
    expect(screen.getByText("Vence hoy")).toBeInTheDocument();
  });

  it("muestra 'Vencida' cuando overdue es true", () => {
    const payments = [obligation({ name: "Internet", dueDate: daysFromNow(-2), overdue: true })];
    render(<UpcomingPaymentsList payments={payments} />);
    expect(screen.getByText("Vencida")).toBeInTheDocument();
  });
});
