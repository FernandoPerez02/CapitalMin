import type { CardType } from "@/types/card";

export const CARD_TYPE_OPTIONS: { value: CardType; label: string }[] = [
  { value: "DEBIT", label: "Débito" },
  { value: "CREDIT", label: "Crédito" },
];
