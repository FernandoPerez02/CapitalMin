import { describe, expect, it } from "vitest";
import { movementFormSchema } from "./movement-schema";

const validMovement = {
  date: "2026-01-15",
  walletId: "wallet-1",
  typeMovement: "Ingreso",
  description: "Pago de cliente",
  amount: "500",
  status: "Confirmado",
  categoryId: "cat-1",
};

describe("movementFormSchema", () => {
  it("acepta un movimiento válido y coacciona el monto a número", () => {
    const result = movementFormSchema.safeParse(validMovement);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.amount).toBe(500);
    }
  });

  it("rechaza un monto negativo o cero", () => {
    const result = movementFormSchema.safeParse({ ...validMovement, amount: "0" });
    expect(result.success).toBe(false);
  });

  it("rechaza una descripción vacía", () => {
    const result = movementFormSchema.safeParse({ ...validMovement, description: "" });
    expect(result.success).toBe(false);
  });

  it("rechaza un tipo de movimiento fuera del dominio", () => {
    const result = movementFormSchema.safeParse({
      ...validMovement,
      typeMovement: "Transferencia",
    });
    expect(result.success).toBe(false);
  });

  it("acepta una compra con tarjeta de crédito (cardId sin walletId)", () => {
    const cardPurchase: Record<string, unknown> = { ...validMovement, cardId: "card-1" };
    delete cardPurchase.walletId;
    const result = movementFormSchema.safeParse(cardPurchase);
    expect(result.success).toBe(true);
  });
});
