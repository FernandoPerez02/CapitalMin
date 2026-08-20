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
import { debtFormSchema, type DebtFormInput, type DebtFormValues } from "@/lib/schemas/debt-schema";
import { createDebt } from "@/services/debts-service.client";

export default function DebtForm() {
  const router = useRouter();
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(
    null,
  );
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<DebtFormInput, unknown, DebtFormValues>({
    resolver: zodResolver(debtFormSchema),
  });

  const startDateField = register("startDate");

  const onSubmit = async (values: DebtFormValues) => {
    setFeedback(null);
    try {
      await createDebt(values);
      setFeedback({ type: "success", message: "Deuda guardada." });
      reset();
      router.refresh();
    } catch {
      setFeedback({ type: "error", message: "No se pudo guardar la deuda." });
    }
  };

  return (
    <div className={FORM_CARD}>
      <h2 className={FORM_CARD_HEADING}>Nueva Deuda</h2>
      <form id="debt-form" className={FORM_GRID} onSubmit={handleSubmit(onSubmit)} noValidate>
        <FormField
          id="debt-name"
          label="Nombre"
          type="text"
          error={errors.name?.message}
          {...register("name")}
        />
        <FormField
          id="debt-principal"
          label="Capital"
          type="text"
          inputMode="decimal"
          error={errors.principal?.message}
          {...register("principal")}
        />
        <FormField
          id="debt-interest-rate"
          label="Tasa de interés (%)"
          type="text"
          inputMode="decimal"
          error={errors.interestRate?.message}
          {...register("interestRate")}
        />
        <FormField
          id="debt-term-months"
          label="Plazo (meses)"
          type="text"
          inputMode="numeric"
          error={errors.termMonths?.message}
          {...register("termMonths")}
        />
        <FormField
          id="debt-start-date"
          label="Fecha de inicio"
          type="text"
          error={errors.startDate?.message}
          {...startDateField}
          onFocus={(e) => (e.currentTarget.type = "date")}
          onBlur={(e) => {
            if (!e.currentTarget.value) e.currentTarget.type = "text";
            startDateField.onBlur(e);
          }}
        />
      </form>
      {feedback && (
        <Alert tone={feedback.type} className="mx-6 mt-2" onDismiss={() => setFeedback(null)}>
          {feedback.message}
        </Alert>
      )}
      <div data-slot="form-actions" className={GROUP_BTN}>
        <Button type="submit" form="debt-form" disabled={isSubmitting}>
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
