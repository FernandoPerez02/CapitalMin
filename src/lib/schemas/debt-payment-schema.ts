import { z } from "zod";

export const debtPaymentFormSchema = z
  .object({
    debtId: z.string().min(1, "Selecciona una deuda"),
    walletId: z.string().min(1, "Selecciona una cuenta"),
    date: z.string().optional(),
    amount: z.coerce
      .number({ message: "Ingresa un monto válido" })
      .positive("El monto debe ser mayor a 0"),
    principalPortion: z.coerce
      .number({ message: "Ingresa un valor válido" })
      .min(0, "No puede ser negativo"),
    interestPortion: z.coerce
      .number({ message: "Ingresa un valor válido" })
      .min(0, "No puede ser negativo"),
  })
  .refine(
    (data) =>
      Math.round((data.principalPortion + data.interestPortion) * 100) ===
      Math.round(data.amount * 100),
    {
      message: "Capital + interés debe ser igual al monto",
      path: ["interestPortion"],
    },
  );

export type DebtPaymentFormInput = z.input<typeof debtPaymentFormSchema>;
export type DebtPaymentFormValues = z.output<typeof debtPaymentFormSchema>;
