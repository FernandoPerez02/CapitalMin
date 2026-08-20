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
  FORM_CHECKBOX_LABEL,
  FORM_GRID,
  GROUP_BTN,
} from "@/components/forms/form-classes";
import { TYPE_OPTIONS } from "@/lib/movement-type-options";
import {
  obligationFormSchema,
  type ObligationFormInput,
  type ObligationFormValues,
} from "@/lib/schemas/obligation-schema";
import { createObligation } from "@/services/obligations-service.client";
import type { Category } from "@/types/category";

interface ObligationFormProps {
  categories: Category[];
}

export default function ObligationForm({ categories }: ObligationFormProps) {
  const router = useRouter();
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(
    null,
  );
  const [isRecurring, setIsRecurring] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ObligationFormInput, unknown, ObligationFormValues>({
    resolver: zodResolver(obligationFormSchema),
  });

  const dueDateField = register("dueDate");

  const onSubmit = async (values: ObligationFormValues) => {
    setFeedback(null);
    try {
      await createObligation({
        name: values.name,
        amount: values.amount,
        typeMovement: values.typeMovement,
        ...(values.categoryId ? { categoryId: values.categoryId } : {}),
        ...(isRecurring
          ? { recurrenceDayOfMonth: values.recurrenceDayOfMonth }
          : { dueDate: values.dueDate }),
      });
      setFeedback({ type: "success", message: "Obligación guardada." });
      reset();
      setIsRecurring(false);
      router.refresh();
    } catch {
      setFeedback({ type: "error", message: "No se pudo guardar la obligación." });
    }
  };

  return (
    <div className={FORM_CARD}>
      <h2 className={FORM_CARD_HEADING}>Nueva Obligación</h2>
      <form id="obligation-form" className={FORM_GRID} onSubmit={handleSubmit(onSubmit)} noValidate>
        <FormField
          id="obligation-name"
          label="Nombre"
          type="text"
          error={errors.name?.message}
          {...register("name")}
        />
        <FormField
          id="obligation-type"
          label="Tipo"
          as="select"
          error={errors.typeMovement?.message}
          {...register("typeMovement")}
        >
          <option value="" hidden></option>
          {TYPE_OPTIONS.map(({ value, label }) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </FormField>
        <FormField
          id="obligation-category"
          label="Categoría"
          as="select"
          error={errors.categoryId?.message}
          {...register("categoryId")}
        >
          <option value="">Sin categoría</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </FormField>
        <FormField
          id="obligation-amount"
          label="Monto"
          type="text"
          inputMode="decimal"
          error={errors.amount?.message}
          {...register("amount")}
        />
        <div className="flex flex-col gap-3">
          <label className={FORM_CHECKBOX_LABEL}>
            <input
              type="checkbox"
              checked={isRecurring}
              onChange={(e) => setIsRecurring(e.currentTarget.checked)}
            />
            Es recurrente (se repite cada mes)
          </label>
        </div>
        {isRecurring ? (
          <FormField
            id="obligation-recurrence-day"
            label="Día del mes"
            type="text"
            inputMode="numeric"
            error={errors.recurrenceDayOfMonth?.message}
            {...register("recurrenceDayOfMonth")}
          />
        ) : (
          <FormField
            id="obligation-due-date"
            label="Fecha de vencimiento"
            type="text"
            error={errors.dueDate?.message}
            {...dueDateField}
            onFocus={(e) => (e.currentTarget.type = "date")}
            onBlur={(e) => {
              if (!e.currentTarget.value) e.currentTarget.type = "text";
              dueDateField.onBlur(e);
            }}
          />
        )}
      </form>
      {feedback && (
        <Alert tone={feedback.type} className="mx-6 mt-2" onDismiss={() => setFeedback(null)}>
          {feedback.message}
        </Alert>
      )}
      <div data-slot="form-actions" className={GROUP_BTN}>
        <Button type="submit" form="obligation-form" disabled={isSubmitting}>
          {isSubmitting ? "Guardando..." : "Guardar"}
        </Button>
        <Button
          type="button"
          onClick={() => {
            reset();
            setIsRecurring(false);
            setFeedback(null);
          }}
        >
          Cancelar
        </Button>
      </div>
    </div>
  );
}
