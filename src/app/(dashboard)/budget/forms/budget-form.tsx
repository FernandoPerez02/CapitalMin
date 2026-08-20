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
  budgetFormSchema,
  type BudgetFormInput,
  type BudgetFormValues,
} from "@/lib/schemas/budget-schema";
import { createBudget } from "@/services/budget-service.client";

export default function BudgetForm() {
  const router = useRouter();
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(
    null,
  );
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<BudgetFormInput, unknown, BudgetFormValues>({
    resolver: zodResolver(budgetFormSchema),
  });

  const dateField = register("date");

  const onSubmit = async (values: BudgetFormValues) => {
    setFeedback(null);
    try {
      await createBudget(values);
      setFeedback({ type: "success", message: "Presupuesto guardado." });
      reset();
      router.refresh();
    } catch {
      setFeedback({ type: "error", message: "No se pudo guardar el presupuesto." });
    }
  };

  return (
    <div className={FORM_CARD}>
      <h2 className={FORM_CARD_HEADING}>Nuevo Presupuesto</h2>
      <form id="budget-form" className={FORM_GRID} onSubmit={handleSubmit(onSubmit)} noValidate>
        <FormField
          id="date"
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
          id="period"
          label="Periodo"
          type="text"
          error={errors.period?.message}
          {...register("period")}
        />
        <FormField
          id="status"
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
          id="amount"
          label="Monto"
          type="text"
          inputMode="decimal"
          error={errors.amount?.message}
          {...register("amount")}
        />
        <FormField
          id="description"
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
        <Button type="submit" form="budget-form" disabled={isSubmitting}>
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
