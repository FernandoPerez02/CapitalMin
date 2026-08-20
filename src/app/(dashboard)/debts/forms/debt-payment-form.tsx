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
import {
  debtPaymentFormSchema,
  type DebtPaymentFormInput,
  type DebtPaymentFormValues,
} from "@/lib/schemas/debt-payment-schema";
import { addDebtPayment } from "@/services/debts-service.client";
import type { Debt } from "@/types/debt";
import type { Wallet } from "@/types/wallet";

interface DebtPaymentFormProps {
  debts: Debt[];
  wallets: Wallet[];
}

export default function DebtPaymentForm({ debts, wallets }: DebtPaymentFormProps) {
  const router = useRouter();
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(
    null,
  );
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<DebtPaymentFormInput, unknown, DebtPaymentFormValues>({
    resolver: zodResolver(debtPaymentFormSchema),
  });

  const dateField = register("date");

  const onSubmit = async (values: DebtPaymentFormValues) => {
    setFeedback(null);
    try {
      await addDebtPayment(values.debtId, {
        walletId: values.walletId,
        amount: values.amount,
        principalPortion: values.principalPortion,
        interestPortion: values.interestPortion,
        ...(values.date ? { date: values.date } : {}),
      });
      setFeedback({ type: "success", message: "Pago registrado." });
      reset();
      router.refresh();
    } catch {
      setFeedback({ type: "error", message: "No se pudo registrar el pago." });
    }
  };

  return (
    <div className={FORM_CARD}>
      <h2 className={FORM_CARD_HEADING}>Registrar Pago</h2>
      <form
        id="debt-payment-form"
        className={FORM_GRID}
        onSubmit={handleSubmit(onSubmit)}
        noValidate
      >
        <FormField
          id="debt-payment-debt"
          label="Deuda"
          as="select"
          error={errors.debtId?.message}
          {...register("debtId")}
        >
          <option value="" hidden></option>
          {debts.map((debt) => (
            <option key={debt.id} value={debt.id}>
              {debt.name}
            </option>
          ))}
        </FormField>
        <FormField
          id="debt-payment-wallet"
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
        <FormField
          id="debt-payment-date"
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
          id="debt-payment-amount"
          label="Monto total"
          type="text"
          inputMode="decimal"
          error={errors.amount?.message}
          {...register("amount")}
        />
        <FormField
          id="debt-payment-principal"
          label="Abono a capital"
          type="text"
          inputMode="decimal"
          error={errors.principalPortion?.message}
          {...register("principalPortion")}
        />
        <FormField
          id="debt-payment-interest"
          label="Abono a interés"
          type="text"
          inputMode="decimal"
          error={errors.interestPortion?.message}
          {...register("interestPortion")}
        />
      </form>
      {feedback && (
        <Alert tone={feedback.type} className="mx-6 mt-2" onDismiss={() => setFeedback(null)}>
          {feedback.message}
        </Alert>
      )}
      <div data-slot="form-actions" className={GROUP_BTN}>
        <Button type="submit" form="debt-payment-form" disabled={isSubmitting}>
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
