import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import GoalsList from "./goals-list";
import type { Goal } from "@/types/goal";

const goals: Goal[] = [
  {
    id: "g1",
    name: "Viaje a Cartagena",
    emoji: "🏝️",
    currentAmount: 3000000,
    targetAmount: 3900000,
    monthlyContribution: 300000,
  },
];

describe("GoalsList", () => {
  it("muestra el mensaje vacío sin metas", () => {
    render(<GoalsList goals={[]} />);
    expect(screen.getByText("No tenés metas activas todavía.")).toBeInTheDocument();
  });

  it("renderiza el porcentaje de avance de cada meta", () => {
    render(<GoalsList goals={goals} />);
    expect(screen.getByText("Viaje a Cartagena")).toBeInTheDocument();
    expect(screen.getByText("77%")).toBeInTheDocument();
  });

  it("acota el porcentaje a 100 cuando la meta ya se cumplió", () => {
    render(<GoalsList goals={[{ ...goals[0], currentAmount: 5000000 }]} />);
    expect(screen.getByText("100%")).toBeInTheDocument();
  });
});
