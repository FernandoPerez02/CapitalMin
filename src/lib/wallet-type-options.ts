import type { WalletType } from "@/types/wallet";

export const WALLET_TYPE_OPTIONS: { value: WalletType; label: string }[] = [
  { value: "CHECKING", label: "Cuenta corriente" },
  { value: "SAVINGS", label: "Cuenta de ahorros" },
  { value: "CASH", label: "Efectivo" },
  { value: "DIGITAL", label: "Billetera digital" },
  { value: "INVESTMENT", label: "Inversión" },
];
