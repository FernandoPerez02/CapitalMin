import { z } from "zod";

export const movementFormSchema = z.object({
  date: z.string().min(1, "La fecha es obligatoria"),
  walletId: z.string().optional(),
  cardId: z.string().optional(),
  typeMovement: z.enum(["Ingreso", "Egreso"], {
    message: "Selecciona un tipo de movimiento",
  }),
  status: z.enum(["Confirmado", "Pendiente", "Procesado", "Rechazado", "Programado", "Revertido"], {
    message: "Selecciona un estado",
  }),
  amount: z.coerce
    .number({ message: "Ingresa un monto válido" })
    .positive("El monto debe ser mayor a 0"),
  description: z.string().min(1, "La descripción es obligatoria"),
  categoryId: z.string().min(1, "Selecciona una categoría"),
});

export type MovementFormInput = z.input<typeof movementFormSchema>;
export type MovementFormValues = z.output<typeof movementFormSchema>;
