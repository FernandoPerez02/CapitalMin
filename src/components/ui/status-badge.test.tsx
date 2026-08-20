import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import StatusBadge from "./status-badge";
import type { MovementStatus } from "@/types/movement";

const EXPECTED_TONE: Record<MovementStatus, string> = {
  Confirmado: "success",
  Procesado: "success",
  Pendiente: "warning",
  Programado: "warning",
  Rechazado: "danger",
  Revertido: "danger",
};

describe("StatusBadge", () => {
  Object.entries(EXPECTED_TONE).forEach(([status, tone]) => {
    it(`usa el tono correcto para "${status}"`, () => {
      render(<StatusBadge status={status as MovementStatus} />);
      expect(screen.getByText(status)).toHaveAttribute("data-tone", tone);
    });
  });
});
