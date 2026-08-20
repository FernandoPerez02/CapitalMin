import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import MoneyDistributionBar from "./money-distribution-bar";

describe("MoneyDistributionBar", () => {
  it("muestra el total disponible y los 3 segmentos", () => {
    render(
      <MoneyDistributionBar
        distribution={{
          disponible: 1000000,
          metas: 500000,
          ahorro: 250000,
          disponibleLibre: 250000,
        }}
      />,
    );
    expect(screen.getByText(/1\.000\.000/)).toBeInTheDocument();
    expect(screen.getByText("Metas")).toBeInTheDocument();
    expect(screen.getByText("Ahorro")).toBeInTheDocument();
    expect(screen.getByText("Disponible libre")).toBeInTheDocument();
    expect(screen.getByText("50%")).toBeInTheDocument();
  });

  it("no rompe cuando el disponible es cero", () => {
    render(
      <MoneyDistributionBar
        distribution={{ disponible: 0, metas: 0, ahorro: 0, disponibleLibre: 0 }}
      />,
    );
    expect(screen.getAllByText("0%")).toHaveLength(3);
  });
});
