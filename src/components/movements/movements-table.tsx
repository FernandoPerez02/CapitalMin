"use client";
import { useCallback, useEffect, useState, type ReactNode } from "react";
import type { ZodType } from "zod";
import Card from "@/components/ui/card";
import MovementTypeBadge from "@/components/ui/movement-type-badge";
import StatusBadge from "@/components/ui/status-badge";
import MovementRowActions from "@/components/ui/movement-row-actions";
import MovementEditableField from "./movement-editable-field";
import { formatCurrency } from "@/lib/format-currency";
import { STATUS_OPTIONS } from "@/lib/status-options";
import { TYPE_OPTIONS } from "@/lib/movement-type-options";
import { movementFormSchema, type MovementFormValues } from "@/lib/schemas/movement-schema";
import { updateMovement } from "@/services/movements-service.client";
import type { Movement } from "@/types/movement";
import type { Category } from "@/types/category";
import type { Wallet } from "@/types/wallet";
import type { Card as PaymentCard } from "@/types/card";
import {
  BODY_CELL,
  CARD_VIEW,
  EMPTY_ICON,
  EMPTY_STATE,
  EMPTY_TEXT,
  HEAD_CELL,
  ROW_CARD_CLASSES,
  ROW_CARD_FIELD,
  ROW_CARD_LABEL,
  ROW_CARD_VALUE,
  TABLE,
  TABLE_WRAPPER,
  TABLET_TITLE,
} from "@/components/tables/tablet-classes";

type EditableField = keyof MovementFormValues;

interface MovementsTableProps {
  tableTitle: string;
  movements: Movement[];
  categories: Category[];
  wallets: Wallet[];
  cards: PaymentCard[];
  emptyMessage?: string;
}

function fieldError(schema: ZodType, raw: string): string | null {
  const result = schema.safeParse(raw);
  return result.success ? null : (result.error.issues[0]?.message ?? "Valor inválido");
}

interface FieldNodes {
  date: ReactNode;
  wallet: ReactNode;
  type: ReactNode;
  status: ReactNode;
  category: ReactNode;
  amount: ReactNode;
  description: ReactNode;
}

function buildFields(
  movement: Movement,
  categories: Category[],
  wallets: Wallet[],
  cards: PaymentCard[],
  onFieldSave: (field: EditableField, raw: string) => Promise<void>,
): FieldNodes {
  const categoryOptions = movement.categoryId
    ? categories.map((category) => ({ value: category.id, label: category.name }))
    : [
        { value: "", label: "Sin categoría" },
        ...categories.map((category) => ({ value: category.id, label: category.name })),
      ];
  const walletOptions = wallets.map((wallet) => ({ value: wallet.id, label: wallet.name }));
  const walletName = wallets.find((wallet) => wallet.id === movement.walletId)?.name ?? "—";
  const cardName = cards.find((card) => card.id === movement.cardId)?.name ?? "—";

  return {
    date: (
      <MovementEditableField
        ariaLabel="fecha"
        type="date"
        value={movement.date.slice(0, 10)}
        displayNode={movement.date.slice(0, 10)}
        validate={(raw) => fieldError(movementFormSchema.shape.date, raw)}
        onSave={(raw) => onFieldSave("date", raw)}
      />
    ),
    wallet: movement.walletId ? (
      <MovementEditableField
        ariaLabel="cuenta"
        type="select"
        options={walletOptions}
        value={movement.walletId}
        displayNode={walletName}
        validate={(raw) => fieldError(movementFormSchema.shape.walletId, raw)}
        onSave={(raw) => onFieldSave("walletId", raw)}
      />
    ) : (
      <span>{cardName} (tarjeta)</span>
    ),
    type: (
      <MovementEditableField
        ariaLabel="tipo"
        type="select"
        options={TYPE_OPTIONS}
        value={movement.typeMovement}
        displayNode={<MovementTypeBadge type={movement.typeMovement} />}
        validate={(raw) => fieldError(movementFormSchema.shape.typeMovement, raw)}
        onSave={(raw) => onFieldSave("typeMovement", raw)}
      />
    ),
    status: (
      <MovementEditableField
        ariaLabel="estado"
        type="select"
        options={STATUS_OPTIONS}
        value={movement.status}
        displayNode={<StatusBadge status={movement.status} />}
        validate={(raw) => fieldError(movementFormSchema.shape.status, raw)}
        onSave={(raw) => onFieldSave("status", raw)}
      />
    ),
    category: (
      <MovementEditableField
        ariaLabel="categoría"
        type="select"
        options={categoryOptions}
        value={movement.categoryId ?? ""}
        displayNode={movement.category?.name ?? "Sin categoría"}
        validate={(raw) => fieldError(movementFormSchema.shape.categoryId, raw)}
        onSave={(raw) => onFieldSave("categoryId", raw)}
      />
    ),
    amount: (
      <MovementEditableField
        ariaLabel="monto"
        type="number"
        value={String(movement.amount)}
        displayNode={formatCurrency(movement.amount)}
        validate={(raw) => fieldError(movementFormSchema.shape.amount, raw)}
        onSave={(raw) => onFieldSave("amount", raw)}
      />
    ),
    description: (
      <MovementEditableField
        ariaLabel="descripción"
        type="text"
        value={movement.description}
        displayNode={movement.description}
        validate={(raw) => fieldError(movementFormSchema.shape.description, raw)}
        onSave={(raw) => onFieldSave("description", raw)}
      />
    ),
  };
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className={EMPTY_STATE}>
      <i className={`bi bi-inbox ${EMPTY_ICON}`} aria-hidden="true" />
      <p className={EMPTY_TEXT}>{message}</p>
    </div>
  );
}

interface RowProps {
  movement: Movement;
  categories: Category[];
  wallets: Wallet[];
  cards: PaymentCard[];
  onFieldSave: (movementId: string, field: EditableField, raw: string) => Promise<void>;
}

function MovementRow({ movement, categories, wallets, cards, onFieldSave }: RowProps) {
  const fields = buildFields(movement, categories, wallets, cards, (field, raw) =>
    onFieldSave(movement.id, field, raw),
  );
  return (
    <tr>
      <td className={BODY_CELL}>{fields.date}</td>
      <td className={BODY_CELL}>{fields.wallet}</td>
      <td className={BODY_CELL}>{fields.type}</td>
      <td className={BODY_CELL}>{fields.status}</td>
      <td className={BODY_CELL}>{fields.category}</td>
      <td className={BODY_CELL} style={{ textAlign: "right" }}>
        {fields.amount}
      </td>
      <td className={BODY_CELL}>{fields.description}</td>
      <td className={BODY_CELL} style={{ textAlign: "right" }}>
        <MovementRowActions movementId={movement.id} />
      </td>
    </tr>
  );
}

function MovementCardRow({ movement, categories, wallets, cards, onFieldSave }: RowProps) {
  const fields = buildFields(movement, categories, wallets, cards, (field, raw) =>
    onFieldSave(movement.id, field, raw),
  );
  return (
    <Card padding="sm" className={ROW_CARD_CLASSES}>
      <div className={ROW_CARD_FIELD}>
        <span className={ROW_CARD_LABEL}>Fecha</span>
        <span className={ROW_CARD_VALUE}>{fields.date}</span>
      </div>
      <div className={ROW_CARD_FIELD}>
        <span className={ROW_CARD_LABEL}>Cuenta</span>
        <span className={ROW_CARD_VALUE}>{fields.wallet}</span>
      </div>
      <div className={ROW_CARD_FIELD}>
        <span className={ROW_CARD_LABEL}>Tipo</span>
        <span className={ROW_CARD_VALUE}>{fields.type}</span>
      </div>
      <div className={ROW_CARD_FIELD}>
        <span className={ROW_CARD_LABEL}>Estado</span>
        <span className={ROW_CARD_VALUE}>{fields.status}</span>
      </div>
      <div className={ROW_CARD_FIELD}>
        <span className={ROW_CARD_LABEL}>Categoría</span>
        <span className={ROW_CARD_VALUE}>{fields.category}</span>
      </div>
      <div className={ROW_CARD_FIELD}>
        <span className={ROW_CARD_LABEL}>Monto</span>
        <span className={ROW_CARD_VALUE}>{fields.amount}</span>
      </div>
      <div className={ROW_CARD_FIELD}>
        <span className={ROW_CARD_LABEL}>Descripción</span>
        <span className={ROW_CARD_VALUE}>{fields.description}</span>
      </div>
      <div className={ROW_CARD_FIELD}>
        <span className={ROW_CARD_LABEL}></span>
        <span className={ROW_CARD_VALUE}>
          <MovementRowActions movementId={movement.id} />
        </span>
      </div>
    </Card>
  );
}

const HEADERS = ["Fecha", "Cuenta", "Tipo", "Estado", "Categoría", "Monto", "Descripción", ""];

export default function MovementsTable({
  tableTitle,
  movements,
  categories,
  wallets,
  cards,
  emptyMessage = "No hay registros para mostrar",
}: MovementsTableProps) {
  const [rows, setRows] = useState(movements);

  useEffect(() => {
    setRows(movements);
  }, [movements]);

  const handleFieldSave = useCallback(
    async (movementId: string, field: EditableField, raw: string) => {
      const schema = movementFormSchema.shape[field];
      const parsed = schema.parse(raw);
      const updated = await updateMovement(movementId, {
        [field]: parsed,
      } as Partial<MovementFormValues>);
      setRows((prev) => prev.map((movement) => (movement.id === movementId ? updated : movement)));
    },
    [],
  );

  if (rows.length === 0) {
    return (
      <div className="w-full">
        <p className={TABLET_TITLE}>{tableTitle}</p>
        <div className={TABLE_WRAPPER}>
          <table className={TABLE}>
            <thead>
              <tr>
                {HEADERS.map((header) => (
                  <th key={header} className={HEAD_CELL}>
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr>
                <td colSpan={HEADERS.length}>
                  <EmptyState message={emptyMessage} />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className={CARD_VIEW}>
          <EmptyState message={emptyMessage} />
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <p className={TABLET_TITLE}>{tableTitle}</p>
      <div className={TABLE_WRAPPER}>
        <table className={TABLE}>
          <thead>
            <tr>
              {HEADERS.map((header) => (
                <th key={header} className={HEAD_CELL}>
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((movement) => (
              <MovementRow
                key={movement.id}
                movement={movement}
                categories={categories}
                wallets={wallets}
                cards={cards}
                onFieldSave={handleFieldSave}
              />
            ))}
          </tbody>
        </table>
      </div>
      <div className={CARD_VIEW}>
        {rows.map((movement) => (
          <MovementCardRow
            key={movement.id}
            movement={movement}
            categories={categories}
            wallets={wallets}
            cards={cards}
            onFieldSave={handleFieldSave}
          />
        ))}
      </div>
    </div>
  );
}
