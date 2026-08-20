import type { NetWorth } from "@/types/net-worth";

export function emptyNetWorth(): NetWorth {
  return {
    assets: 0,
    liabilities: 0,
    netWorth: 0,
    breakdown: { wallets: [], cards: [], debts: [] },
  };
}
