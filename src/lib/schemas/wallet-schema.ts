import { z } from "zod";

export const walletFormSchema = z.object({
  name: z.string().min(1, "El nombre es obligatorio"),
  type: z.enum(["CHECKING", "SAVINGS", "CASH", "DIGITAL", "INVESTMENT"], {
    message: "Selecciona un tipo de cuenta",
  }),
  initialBalance: z.coerce
    .number({ message: "Ingresa un monto válido" })
    .min(0, "El saldo inicial no puede ser negativo"),
});

export type WalletFormInput = z.input<typeof walletFormSchema>;
export type WalletFormValues = z.output<typeof walletFormSchema>;
