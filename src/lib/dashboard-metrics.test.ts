import { describe, expect, it } from "vitest";
import type { Goal } from "@/types/goal";
import type { CategoryTrend } from "@/types/analytics";
import {
  trendPct,
  computeHealthScore,
  computeMoneyDistribution,
  computeInsight,
  daysUntilDue,
} from "./dashboard-metrics";

const REFERENCE_DATE = new Date("2026-01-15");

describe("trendPct", () => {
  it("calcula el cambio porcentual entre dos valores", () => {
    expect(trendPct(1500, 1000)).toBeCloseTo(50);
  });

  it("no reporta tendencia cuando el valor anterior fue cero", () => {
    expect(trendPct(1000, 0)).toBeUndefined();
  });
});

describe("computeHealthScore", () => {
  it("acota el score entre 0 y 100", () => {
    expect(computeHealthScore(1000, 0).score).toBe(100);
    expect(computeHealthScore(100, 500).score).toBe(0);
  });

  it("es 0 sin ingresos en el mes", () => {
    expect(computeHealthScore(0, 0).score).toBe(0);
  });
});

describe("computeMoneyDistribution", () => {
  it("cumple el invariante metas + ahorro + disponibleLibre = disponible", () => {
    const goals: Goal[] = [
      {
        id: "g1",
        name: "Meta",
        emoji: "🎯",
        currentAmount: 0,
        targetAmount: 100,
        monthlyContribution: 300,
      },
    ];
    const result = computeMoneyDistribution(1500, goals);
    expect(result.metas + result.ahorro + result.disponibleLibre).toBeCloseTo(result.disponible);
  });

  it("no deja que las metas superen el disponible", () => {
    const goals: Goal[] = [
      {
        id: "g1",
        name: "Meta",
        emoji: "🎯",
        currentAmount: 0,
        targetAmount: 100,
        monthlyContribution: 999,
      },
    ];
    const result = computeMoneyDistribution(100, goals);
    expect(result.metas).toBeLessThanOrEqual(result.disponible);
  });

  it("no queda negativo si el disponible del mes es negativo", () => {
    const result = computeMoneyDistribution(-500, []);
    expect(result.disponible).toBe(0);
  });
});

describe("computeInsight", () => {
  function trend(overrides: Partial<CategoryTrend>): CategoryTrend {
    return {
      categoryId: "cat-1",
      categoryName: "Vivienda",
      series: [{ period: "2026-01", amount: 500 }],
      trend: "stable",
      changePercent: null,
      message: null,
      ...overrides,
    };
  }

  it("usa el primer mensaje ya formateado por el backend cuando existe", () => {
    const trends = [
      trend({ message: "Tu gasto en Vivienda ha aumentado un 20% en los últimos 3 meses." }),
    ];
    const result = computeInsight(trends);
    expect(result.sentence).toContain("Vivienda");
    expect(result.sentence).toContain("aumentado");
  });

  it("cae a un mensaje genérico con la categoría top si ninguna tendencia trae mensaje", () => {
    const trends = [trend({ message: null })];
    const result = computeInsight(trends);
    expect(result.sentence).toContain("Vivienda");
  });

  it("avisa que no hay gastos cuando no hay tendencias", () => {
    const result = computeInsight([]);
    expect(result.sentence).toContain("Todavía no hay gastos");
  });
});

describe("daysUntilDue", () => {
  it("calcula los días restantes", () => {
    expect(daysUntilDue("2026-01-20", REFERENCE_DATE)).toBe(5);
  });
});
