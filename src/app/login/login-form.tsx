"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import AuthField from "@/components/forms/auth-field";
import AuthPasswordField from "@/components/forms/auth-password-field";
import Alert from "@/components/ui/alert";
import {
  AUTH_CARD,
  AUTH_CARD_HEADER,
  AUTH_CARD_LOGO,
  AUTH_CHECKBOX,
  AUTH_GRID,
  AUTH_OPTIONS_ROW,
  AUTH_SUBMIT,
  AUTH_SWITCH,
} from "@/components/forms/auth-form-classes";
import { loginFormSchema, type LoginFormValues } from "@/lib/schemas/login-schema";

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [feedback, setFeedback] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: { remember: true },
  });

  const onSubmit = async (values: LoginFormValues) => {
    setFeedback(null);
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });

    if (!response.ok) {
      setFeedback("No pudimos iniciar sesión. Verifica tus datos.");
      return;
    }

    const next = searchParams.get("next") || "/home";
    router.push(next);
    router.refresh();
  };

  return (
    <div className={AUTH_CARD}>
      <div className={AUTH_CARD_LOGO}>
        <Image src="/logoCM.png" alt="CapitalMin" width={56} height={56} />
      </div>
      <div className={AUTH_CARD_HEADER}>
        <h2>¡Bienvenido de nuevo!</h2>
        <p>Ingresa a tu cuenta para continuar</p>
      </div>

      <form id="login-form" className={AUTH_GRID} onSubmit={handleSubmit(onSubmit)} noValidate>
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
          autoComplete="current-password"
          placeholder="Ingresa tu contraseña"
          error={errors.password?.message}
          {...register("password")}
        />

        <div className={AUTH_OPTIONS_ROW}>
          <label className={AUTH_CHECKBOX}>
            <input type="checkbox" {...register("remember")} />
            Recordarme
          </label>
        </div>
      </form>

      {feedback && (
        <Alert tone="error" className="mt-3" onDismiss={() => setFeedback(null)}>
          {feedback}
        </Alert>
      )}

      <button type="submit" form="login-form" className={AUTH_SUBMIT} disabled={isSubmitting}>
        {isSubmitting ? "Ingresando..." : "Ingresar"}
      </button>

      <p className={AUTH_SWITCH}>
        ¿No tienes una cuenta? <Link href="/register">Crear cuenta</Link>
      </p>
    </div>
  );
}
