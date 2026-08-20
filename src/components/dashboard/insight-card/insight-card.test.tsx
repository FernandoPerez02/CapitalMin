import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import InsightCard from "./insight-card";

describe("InsightCard", () => {
  it("muestra la oración recibida", () => {
    render(<InsightCard sentence="Tu mayor gasto este mes es Vivienda." />);
    expect(screen.getByText("Tu mayor gasto este mes es Vivienda.")).toBeInTheDocument();
  });
});
