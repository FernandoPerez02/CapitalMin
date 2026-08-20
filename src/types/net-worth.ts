export interface NetWorthWalletBreakdown {
  id: string;
  name: string;
  type: string;
  balance: number;
}

export interface NetWorthCardBreakdown {
  id: string;
  name: string;
  balance: number;
}

export interface NetWorthDebtBreakdown {
  id: string;
  name: string;
  pendingBalance: number;
}

export interface NetWorth {
  assets: number;
  liabilities: number;
  netWorth: number;
  breakdown: {
    wallets: NetWorthWalletBreakdown[];
    cards: NetWorthCardBreakdown[];
    debts: NetWorthDebtBreakdown[];
  };
}
