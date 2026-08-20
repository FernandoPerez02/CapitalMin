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
import { STATUS_OPTIONS } from "@/lib/status-options";
import {
  transferFormSchema,
  type TransferFormInput,
  type TransferFormValues,
} from "@/lib/schemas/transfer-schema";
import { createTransfer } from "@/services/wallets-service.client";
import type { Wallet } from "@/types/wallet";

interface TransferFormProps {
  wallets: Wallet[];
}

export default function TransferForm({ wallets }: TransferFormProps) {
  const router = useRouter();
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(
    null,
  );
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<TransferFormInput, unknown, TransferFormValues>({
    resolver: zodResolver(transferFormSchema),
  });

  const dateField = register("date");

  const onSubmit = async (values: TransferFormValues) => {
    setFeedback(null);
    try {
      await createTransfer(values);
      setFeedback({ type: "success", message: "Transferencia registrada." });
      reset();
      router.refresh();
    } catch {
      setFeedback({ type: "error", message: "No se pudo registrar la transferencia." });
    }
  };

  return (
    <div className={FORM_CARD}>
      <h2 className={FORM_CARD_HEADING}>Nueva Transferencia</h2>
      <form id="transfer-form" className={FORM_GRID} onSubmit={handleSubmit(onSubmit)} noValidate>
        <FormField
          id="transfer-date"
          label="Fecha"
          type="text"
          error={errors.date?.message}
          {...dateField}
          onFocus={(e) => (e.currentTarget.type = "date")}
          onBlur={(e) => {
            if (!e.currentTarget.value) e.currentTarget.type = "text";
            dateField.onBlur(e);
          }}
        />
        <FormField
          id="transfer-status"
          label="Estado"
          as="select"
          error={errors.status?.message}
          {...register("status")}
        >
          <option value="" hidden></option>
          {STATUS_OPTIONS.map(({ value, label }) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </FormField>
        <FormField
          id="transfer-from"
          label="Cuenta origen"
          as="select"
          error={errors.fromWalletId?.message}
          {...register("fromWalletId")}
        >
          <option value="" hidden></option>
          {wallets.map((wallet) => (
            <option key={wallet.id} value={wallet.id}>
              {wallet.name}
            </option>
          ))}
        </FormField>
        <FormField
          id="transfer-to"
          label="Cuenta destino"
          as="select"
          error={errors.toWalletId?.message}
          {...register("toWalletId")}
        >
          <option value="" hidden></option>
          {wallets.map((wallet) => (
            <option key={wallet.id} value={wallet.id}>
              {wallet.name}
            </option>
          ))}
        </FormField>
        <FormField
          id="transfer-amount"
          label="Monto"
          type="text"
          inputMode="decimal"
          error={errors.amount?.message}
          {...register("amount")}
        />
        <FormField
          id="transfer-description"
          label="Descripción"
          as="textarea"
          error={errors.description?.message}
          {...register("description")}
        />
      </form>
      {feedback && (
        <Alert tone={feedback.type} className="mx-6 mt-2" onDismiss={() => setFeedback(null)}>
          {feedback.message}
        </Alert>
      )}
      <div data-slot="form-actions" className={GROUP_BTN}>
        <Button type="submit" form="transfer-form" disabled={isSubmitting}>
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
