import { z } from "zod";

export const obligationFormSchema = z
  .object({
    name: z.string().min(1, "El nombre es obligatorio"),
    amount: z.coerce
      .number({ message: "Ingresa un monto válido" })
      .positive("El monto debe ser mayor a 0"),
    typeMovement: z.enum(["Ingreso", "Egreso"], { message: "Selecciona un tipo" }),
    categoryId: z.string().optional(),
    recurrenceDayOfMonth: z.coerce
      .number({ message: "Ingresa un día válido" })
      .int()
      .min(1, "Debe ser un día entre 1 y 31")
      .max(31, "Debe ser un día entre 1 y 31")
      .optional(),
    dueDate: z.string().optional(),
  })
  .refine((data) => Boolean(data.recurrenceDayOfMonth) || Boolean(data.dueDate), {
    message: "Indica el día del mes o la fecha de vencimiento",
    path: ["dueDate"],
  });

export type ObligationFormInput = z.input<typeof obligationFormSchema>;
export type ObligationFormValues = z.output<typeof obligationFormSchema>;
