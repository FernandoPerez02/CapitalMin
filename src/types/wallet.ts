export type WalletType = "CHECKING" | "SAVINGS" | "CASH" | "DIGITAL" | "INVESTMENT";

export interface Wallet {
  id: string;
  name: string;
  type: WalletType;
  currency: string;
  initialBalance: number;
  isActive: boolean;
  balance: number;
}
