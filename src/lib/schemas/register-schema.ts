import { z } from "zod";

export const registerFormSchema = z
  .object({
    name: z.string().min(1, "El nombre es obligatorio"),
    email: z.string().min(1, "El correo es obligatorio").email("Ingresa un correo válido"),
    password: z.string().min(8, "La contraseña debe tener al menos 8 caracteres"),
    confirmPassword: z.string().min(1, "Confirma tu contraseña"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmPassword"],
  });

export type RegisterFormValues = z.infer<typeof registerFormSchema>;
