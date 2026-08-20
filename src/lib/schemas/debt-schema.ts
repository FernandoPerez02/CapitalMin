import { z } from "zod";

export const debtFormSchema = z.object({
  name: z.string().min(1, "El nombre es obligatorio"),
  principal: z.coerce
    .number({ message: "Ingresa un monto válido" })
    .positive("El capital debe ser mayor a 0"),
  interestRate: z.coerce
    .number({ message: "Ingresa una tasa válida" })
    .min(0, "La tasa no puede ser negativa"),
  termMonths: z.coerce
    .number({ message: "Ingresa un plazo válido" })
    .int()
    .min(1, "El plazo debe ser de al menos 1 mes"),
  startDate: z.string().min(1, "La fecha de inicio es obligatoria"),
});

export type DebtFormInput = z.input<typeof debtFormSchema>;
export type DebtFormValues = z.output<typeof debtFormSchema>;
