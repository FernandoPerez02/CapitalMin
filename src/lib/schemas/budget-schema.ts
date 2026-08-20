import { z } from "zod";

export const budgetFormSchema = z.object({
  date: z.string().min(1, "La fecha es obligatoria"),
  period: z.string(),
  status: z.enum(["Confirmado", "Pendiente", "Procesado", "Rechazado", "Programado", "Revertido"], {
    message: "Selecciona un estado",
  }),
  amount: z.coerce
    .number({ message: "Ingresa un monto válido" })
    .positive("El monto debe ser mayor a 0"),
  description: z.string(),
});

export type BudgetFormInput = z.input<typeof budgetFormSchema>;
export type BudgetFormValues = z.output<typeof budgetFormSchema>;
