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
import { CARD_TYPE_OPTIONS } from "@/lib/card-type-options";
import { cardFormSchema, type CardFormInput, type CardFormValues } from "@/lib/schemas/card-schema";
import { createCard } from "@/services/cards-service.client";
import type { CardType } from "@/types/card";
import type { Wallet } from "@/types/wallet";

interface CardFormProps {
  wallets: Wallet[];
}

export default function CardForm({ wallets }: CardFormProps) {
  const router = useRouter();
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(
    null,
  );
  const [type, setType] = useState<CardType | "">("");
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CardFormInput, unknown, CardFormValues>({
    resolver: zodResolver(cardFormSchema),
  });

  const onSubmit = async (values: CardFormValues) => {
    setFeedback(null);
    try {
      await createCard({
        name: values.name,
        type: values.type,
        ...(values.type === "DEBIT"
          ? { walletId: values.walletId }
          : { creditLimit: values.creditLimit }),
        ...(values.cutoffDay ? { cutoffDay: values.cutoffDay } : {}),
        ...(values.paymentDueDay ? { paymentDueDay: values.paymentDueDay } : {}),
      });
      setFeedback({ type: "success", message: "Tarjeta guardada." });
      reset();
      setType("");
      router.refresh();
    } catch {
      setFeedback({ type: "error", message: "No se pudo guardar la tarjeta." });
    }
  };

  return (
    <div className={FORM_CARD}>
      <h2 className={FORM_CARD_HEADING}>Nueva Tarjeta</h2>
      <form id="card-form" className={FORM_GRID} onSubmit={handleSubmit(onSubmit)} noValidate>
        <FormField
          id="card-name"
          label="Nombre"
          type="text"
          error={errors.name?.message}
          {...register("name")}
        />
        <FormField
          id="card-type"
          label="Tipo"
          as="select"
          error={errors.type?.message}
          {...register("type", { onChange: (e) => setType(e.target.value as CardType) })}
        >
          <option value="" hidden></option>
          {CARD_TYPE_OPTIONS.map(({ value, label }) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </FormField>
        {type === "DEBIT" && (
          <FormField
            id="card-wallet"
            label="Cuenta asociada"
            as="select"
            error={errors.walletId?.message}
            {...register("walletId")}
          >
            <option value="" hidden></option>
            {wallets.map((wallet) => (
              <option key={wallet.id} value={wallet.id}>
                {wallet.name}
              </option>
            ))}
          </FormField>
        )}
        {type === "CREDIT" && (
          <>
            <FormField
              id="card-credit-limit"
              label="Cupo"
              type="text"
              inputMode="decimal"
              error={errors.creditLimit?.message}
              {...register("creditLimit")}
            />
            <FormField
              id="card-cutoff-day"
              label="Día de corte"
              type="text"
              inputMode="numeric"
              error={errors.cutoffDay?.message}
              {...register("cutoffDay")}
            />
            <FormField
              id="card-payment-due-day"
              label="Día de pago"
              type="text"
              inputMode="numeric"
              error={errors.paymentDueDay?.message}
              {...register("paymentDueDay")}
            />
          </>
        )}
      </form>
      {feedback && (
        <Alert tone={feedback.type} className="mx-6 mt-2" onDismiss={() => setFeedback(null)}>
          {feedback.message}
        </Alert>
      )}
      <div data-slot="form-actions" className={GROUP_BTN}>
        <Button type="submit" form="card-form" disabled={isSubmitting}>
          {isSubmitting ? "Guardando..." : "Guardar"}
        </Button>
        <Button
          type="button"
          onClick={() => {
            reset();
            setType("");
            setFeedback(null);
          }}
        >
          Cancelar
        </Button>
      </div>
    </div>
  );
}
