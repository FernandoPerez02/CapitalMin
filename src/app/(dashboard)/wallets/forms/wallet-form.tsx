"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import FormField from "@/components/forms/form-field";
import Button from "@/components/forms/button";
import Alert from "@/components/ui/alert";
import {
  FORM_CARD,
  FORM_CARD_HEADING,
  FORM_GRID,
  GROUP_BTN,
} from "@/components/forms/form-classes";
import { WALLET_TYPE_OPTIONS } from "@/lib/wallet-type-options";
import {
  walletFormSchema,
  type WalletFormInput,
  type WalletFormValues,
} from "@/lib/schemas/wallet-schema";
import { createWallet } from "@/services/wallets-service.client";

export default function WalletForm() {
  const router = useRouter();
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(
    null,
  );
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<WalletFormInput, unknown, WalletFormValues>({
    resolver: zodResolver(walletFormSchema),
  });

  const onSubmit = async (values: WalletFormValues) => {
    setFeedback(null);
    try {
      await createWallet(values);
      setFeedback({ type: "success", message: "Cuenta guardada." });
      reset();
      router.refresh();
    } catch {
      setFeedback({ type: "error", message: "No se pudo guardar la cuenta." });
    }
  };

  return (
    <div className={FORM_CARD}>
      <h2 className={FORM_CARD_HEADING}>Nueva Cuenta</h2>
      <form id="wallet-form" className={FORM_GRID} onSubmit={handleSubmit(onSubmit)} noValidate>
        <FormField
          id="wallet-name"
          label="Nombre"
          type="text"
          error={errors.name?.message}
          {...register("name")}
        />
        <FormField
          id="wallet-type"
          label="Tipo"
          as="select"
          error={errors.type?.message}
          {...register("type")}
        >
          <option value="" hidden></option>
          {WALLET_TYPE_OPTIONS.map(({ value, label }) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </FormField>
        <FormField
          id="wallet-initial-balance"
          label="Saldo inicial"
          type="text"
          inputMode="decimal"
          error={errors.initialBalance?.message}
          {...register("initialBalance")}
        />
      </form>
      {feedback && (
        <Alert tone={feedback.type} className="mx-6 mt-2" onDismiss={() => setFeedback(null)}>
          {feedback.message}
        </Alert>
      )}
      <div data-slot="form-actions" className={GROUP_BTN}>
        <Button type="submit" form="wallet-form" disabled={isSubmitting}>
          {isSubmitting ? "Guardando..." : "Guardar"}
        </Button>
        <Button
          type="button"
          onClick={() => {
            reset();
            setFeedback(null);
          }}
        >
          Cancelar
        </Button>
      </div>
    </div>
  );
}
