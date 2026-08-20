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
import { STATUS_OPTIONS } from "@/lib/status-options";
import { TYPE_OPTIONS } from "@/lib/movement-type-options";
import { formatCurrency } from "@/lib/format-currency";
import {
  movementFormSchema,
  type MovementFormInput,
  type MovementFormValues,
} from "@/lib/schemas/movement-schema";
import { createMovement } from "@/services/movements-service.client";
import ObligationRowActions from "@/components/obligations/obligation-row-actions";
import type { Obligation } from "@/types/obligation";
import type { Category } from "@/types/category";
import type { Wallet } from "@/types/wallet";
import type { Card } from "@/types/card";

const OBLIGATIONS_CARD =
  "w-full rounded-2xl bg-surface p-4 shadow-[0_1px_2px_rgba(16,21,28,0.04),0_4px_12px_rgba(16,21,28,0.06)]";
const OBLIGATION_ROW =
  "flex items-center justify-between gap-3 py-2 [&:not(:last-child)]:border-b [&:not(:last-child)]:border-border";
const OBLIGATION_INFO = "min-w-0 text-sm text-text";
const OBLIGATION_META = "text-xs text-text-muted";

interface MovementsFormsProps {
  obligations: Obligation[];
  categories: Category[];
  wallets: Wallet[];
  cards: Card[];
}

export default function MovementsForms({
  obligations,
  categories,
  wallets,
  cards,
}: MovementsFormsProps) {
  const router = useRouter();
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(
    null,
  );
  const [payWithCard, setPayWithCard] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<MovementFormInput, unknown, MovementFormValues>({
    resolver: zodResolver(movementFormSchema),
  });

  const dateField = register("date");
  const creditCards = cards.filter((card) => card.type === "CREDIT");

  const onSubmit = async (values: MovementFormValues) => {
    setFeedback(null);
    if (!values.walletId && !values.cardId) {
      setFeedback({ type: "error", message: "Selecciona una cuenta o una tarjeta de crédito." });
      return;
    }
    try {
      await createMovement(
        payWithCard ? { ...values, walletId: undefined } : { ...values, cardId: undefined },
      );
      setFeedback({ type: "success", message: "Movimiento guardado." });
      reset();
      setPayWithCard(false);
      router.refresh();
    } catch {
      setFeedback({ type: "error", message: "No se pudo guardar el movimiento." });
    }
  };

  return (
    <div className="flex w-full flex-col gap-6 md:basis-[360px] md:flex-none">
      <div className={FORM_CARD}>
        <h2 className={FORM_CARD_HEADING}>Nuevo Movimiento</h2>
        <form id="movement-form" className={FORM_GRID} onSubmit={handleSubmit(onSubmit)} noValidate>
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
          {payWithCard ? (
            <FormField
              id="card"
              label="Tarjeta de crédito"
              as="select"
              error={errors.cardId?.message}
              {...register("cardId")}
            >
              <option value="" hidden></option>
              {creditCards.map((card) => (
                <option key={card.id} value={card.id}>
                  {card.name}
                </option>
              ))}
            </FormField>
          ) : (
            <FormField
              id="wallet"
              label="Cuenta"
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
          {creditCards.length > 0 && (
            <label className={FORM_CHECKBOX_LABEL}>
              <input
                type="checkbox"
                checked={payWithCard}
                onChange={(e) => setPayWithCard(e.currentTarget.checked)}
              />
              Pagar con tarjeta de crédito
            </label>
          )}
          <FormField
            id="type"
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
            id="category"
            label="Categoría"
            as="select"
            error={errors.categoryId?.message}
            {...register("categoryId")}
          >
            <option value="" hidden></option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
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
          <Button type="submit" form="movement-form" disabled={isSubmitting}>
            {isSubmitting ? "Guardando..." : "Guardar"}
          </Button>
          <Button
            type="button"
            onClick={() => {
              reset();
              setPayWithCard(false);
              setFeedback(null);
            }}
          >
            Cancelar
          </Button>
        </div>
      </div>
      {obligations.length > 0 && (
        <div className={OBLIGATIONS_CARD}>
          <p className="m-0 mb-2 text-sm font-semibold text-text">Obligaciones pendientes</p>
          <ul className="m-0 flex list-none flex-col p-0">
            {obligations.map((obligation) => (
              <li key={obligation.id} className={OBLIGATION_ROW}>
                <span className={OBLIGATION_INFO}>
                  {obligation.name}
                  <span className={OBLIGATION_META}>
                    {" "}
                    · {formatCurrency(obligation.amount)} · vence {obligation.dueDate}
                  </span>
                </span>
                <ObligationRowActions
                  obligationId={obligation.id}
                  wallets={wallets}
                  showPay
                  isActive={obligation.isActive}
                />
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
