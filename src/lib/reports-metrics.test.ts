import { describe, expect, it } from "vitest";
import { toCategoryDatum } from "./reports-metrics";
import type { CategoryReportItem } from "@/types/report";

describe("toCategoryDatum", () => {
  it("calcula el porcentaje de cada categoría sobre el total", () => {
    const items: CategoryReportItem[] = [
      { id: "1", label: "Vivienda", value: 600 },
      { id: "2", label: "Alimentación", value: 400 },
    ];
    const result = toCategoryDatum(items);
    expect(result[0].percentage).toBeCloseTo(60);
    expect(result[1].percentage).toBeCloseTo(40);
  });

  it("asigna un color distinto por posición", () => {
    const items: CategoryReportItem[] = [
      { id: "1", label: "A", value: 10 },
      { id: "2", label: "B", value: 10 },
    ];
    const result = toCategoryDatum(items);
    expect(result[0].color).not.toBe(result[1].color);
  });

  it("no rompe con una lista vacía", () => {
    expect(toCategoryDatum([])).toEqual([]);
  });

  it("no divide por cero cuando el total es 0", () => {
    const items: CategoryReportItem[] = [{ id: "1", label: "Vivienda", value: 0 }];
    const result = toCategoryDatum(items);
    expect(result[0].percentage).toBe(0);
  });
});
