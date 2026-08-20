import { z } from "zod";

export const cardFormSchema = z
  .object({
    name: z.string().min(1, "El nombre es obligatorio"),
    type: z.enum(["DEBIT", "CREDIT"], { message: "Selecciona un tipo de tarjeta" }),
    walletId: z.string().optional(),
    creditLimit: z.coerce
      .number({ message: "Ingresa un monto válido" })
      .positive("El cupo debe ser mayor a 0")
      .optional(),
    cutoffDay: z.coerce
      .number({ message: "Ingresa un día válido" })
      .int()
      .min(1, "Debe ser un día entre 1 y 31")
      .max(31, "Debe ser un día entre 1 y 31")
      .optional(),
    paymentDueDay: z.coerce
      .number({ message: "Ingresa un día válido" })
      .int()
      .min(1, "Debe ser un día entre 1 y 31")
      .max(31, "Debe ser un día entre 1 y 31")
      .optional(),
  })
  .refine((data) => data.type !== "DEBIT" || Boolean(data.walletId), {
    message: "Una tarjeta débito requiere una cuenta asociada",
    path: ["walletId"],
  })
  .refine((data) => data.type !== "CREDIT" || Boolean(data.creditLimit), {
    message: "Una tarjeta de crédito requiere un cupo",
    path: ["creditLimit"],
  });

export type CardFormInput = z.input<typeof cardFormSchema>;
export type CardFormValues = z.output<typeof cardFormSchema>;
