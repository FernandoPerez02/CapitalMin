export type CardType = "DEBIT" | "CREDIT";

export interface Card {
  id: string;
  name: string;
  type: CardType;
  walletId: string | null;
  creditLimit: number | null;
  cutoffDay: number | null;
  paymentDueDay: number | null;
  isActive: boolean;
  balance: number;
  availableCredit: number | null;
}
