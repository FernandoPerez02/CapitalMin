export interface Debt {
  id: string;
  name: string;
  principal: number;
  interestRate: number;
  termMonths: number;
  startDate: string;
  isActive: boolean;
  principalPaid: number;
  interestPaid: number;
  pendingBalance: number;
  percentPaid: number;
  estimatedInstallment: number;
}

export interface DebtPayment {
  id: string;
  debtId: string;
  movementId: string;
  amount: number;
  principalPortion: number;
  interestPortion: number;
  date: string;
}
