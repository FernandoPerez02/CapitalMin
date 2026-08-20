"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import AuthField from "@/components/forms/auth-field";
import AuthPasswordField from "@/components/forms/auth-password-field";
import Alert from "@/components/ui/alert";
import {
  AUTH_CARD,
  AUTH_CARD_HEADER,
  AUTH_CARD_LOGO,
  AUTH_GRID,
  AUTH_SUBMIT,
  AUTH_SWITCH,
} from "@/components/forms/auth-form-classes";
import { registerFormSchema, type RegisterFormValues } from "@/lib/schemas/register-schema";

export default function RegisterForm() {
  const router = useRouter();
  const [feedback, setFeedback] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({ resolver: zodResolver(registerFormSchema) });

  const onSubmit = async (values: RegisterFormValues) => {
    setFeedback(null);
    const response = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });

    if (!response.ok) {
      const body = (await response.json().catch(() => null)) as { error?: string } | null;
      setFeedback(body?.error ?? "No pudimos crear tu cuenta. Intenta de nuevo.");
      return;
    }

    router.push("/home");
    router.refresh();
  };

  return (
    <div className={AUTH_CARD}>
      <div className={AUTH_CARD_LOGO}>
        <Image src="/logoCM.png" alt="CapitalMin" width={56} height={56} />
      </div>
      <div className={AUTH_CARD_HEADER}>
        <h2>Crea tu cuenta</h2>
        <p>Empieza a organizar tus finanzas en minutos</p>
      </div>

      <form id="register-form" className={AUTH_GRID} onSubmit={handleSubmit(onSubmit)} noValidate>
        <AuthField
          id="name"
          label="Nombre"
          type="text"
          icon="bi-person"
          autoComplete="name"
          placeholder="Tu nombre completo"
          error={errors.name?.message}
          {...register("name")}
        />
        <AuthField
          id="email"
          label="Correo"
          type="email"
          icon="bi-envelope"
          autoComplete="email"
          placeholder="ejemplo@correo.com"
          error={errors.email?.message}
          {...register("email")}
        />
        <AuthPasswordField
          id="password"
          label="Contraseña"
          autoComplete="new-password"
          placeholder="Mínimo 8 caracteres"
          error={errors.password?.message}
          {...register("password")}
        />
        <AuthPasswordField
          id="confirmPassword"
          label="Confirmar contraseña"
          autoComplete="new-password"
          placeholder="Repite tu contraseña"
          error={errors.confirmPassword?.message}
          {...register("confirmPassword")}
        />
      </form>

      {feedback && (
        <Alert tone="error" className="mt-3" onDismiss={() => setFeedback(null)}>
          {feedback}
        </Alert>
      )}

      <button type="submit" form="register-form" className={AUTH_SUBMIT} disabled={isSubmitting}>
        {isSubmitting ? "Creando cuenta..." : "Crear cuenta"}
      </button>

      <p className={AUTH_SWITCH}>
        ¿Ya tienes una cuenta? <Link href="/login">Inicia sesión</Link>
      </p>
    </div>
  );
}
