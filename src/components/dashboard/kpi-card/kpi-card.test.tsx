import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import KpiCard from "./kpi-card";

describe("KpiCard", () => {
  it("muestra el título y el monto formateado", () => {
    render(<KpiCard title="Saldo Disponible" amount={1350000} />);
    expect(screen.getByText("Saldo Disponible")).toBeInTheDocument();
    expect(screen.getByText(/1\.350\.000/)).toBeInTheDocument();
  });

  it("no muestra tendencia cuando trendPct es undefined", () => {
    render(<KpiCard title="Ingresos" amount={1000} />);
    expect(screen.queryByText(/vs\. el mes pasado/)).not.toBeInTheDocument();
  });

  it("muestra la tendencia positiva", () => {
    render(<KpiCard title="Ingresos" amount={1000} trendPct={12.3} />);
    expect(screen.getByText(/12\.3% vs\. el mes pasado/)).toBeInTheDocument();
  });
});
