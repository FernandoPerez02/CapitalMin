import { z } from "zod";

export const transferFormSchema = z
  .object({
    date: z.string().min(1, "La fecha es obligatoria"),
    fromWalletId: z.string().min(1, "Selecciona la cuenta de origen"),
    toWalletId: z.string().min(1, "Selecciona la cuenta de destino"),
    amount: z.coerce
      .number({ message: "Ingresa un monto válido" })
      .positive("El monto debe ser mayor a 0"),
    description: z.string().min(1, "La descripción es obligatoria"),
    status: z.enum(
      ["Confirmado", "Pendiente", "Procesado", "Rechazado", "Programado", "Revertido"],
      { message: "Selecciona un estado" },
    ),
  })
  .refine((data) => data.fromWalletId !== data.toWalletId, {
    message: "La cuenta de origen y destino no pueden ser la misma",
    path: ["toWalletId"],
  });

export type TransferFormInput = z.input<typeof transferFormSchema>;
export type TransferFormValues = z.output<typeof transferFormSchema>;
