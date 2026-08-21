import { Injectable } from '@nestjs/common';
import { WalletsService } from '../wallets/wallets.service';
import { CardsService } from '../cards/cards.service';
import { DebtsService } from '../debts/debts.service';

@Injectable()
export class NetWorthService {
  constructor(
    private readonly walletsService: WalletsService,
    private readonly cardsService: CardsService,
    private readonly debtsService: DebtsService,
  ) {}

  /**
   * Patrimonio neto = activos - pasivos (spec sección 21). No es un dato
   * nuevo: se compone leyendo los saldos ya derivados de Wallet, Card y
   * Debt — nunca se recalculan ni se duplican aquí (Regla 9).
   */
  async calculate(accountId: string) {
    const [wallets, cards, debts] = await Promise.all([
      this.walletsService.list(accountId),
      this.cardsService.list(accountId),
      this.debtsService.list(accountId),
    ]);

    const creditCards = cards.filter((card) => card.type === 'CREDIT');

    const assets = wallets.reduce((sum, wallet) => sum + wallet.balance, 0);
    const cardLiabilities = creditCards.reduce(
      (sum, card) => sum + card.balance,
      0,
    );
    const debtLiabilities = debts.reduce(
      (sum, debt) => sum + debt.pendingBalance,
      0,
    );
    const liabilities = cardLiabilities + debtLiabilities;

    return {
      assets,
      liabilities,
      netWorth: assets - liabilities,
      breakdown: {
        wallets: wallets.map((wallet) => ({
          id: wallet.id,
          name: wallet.name,
          type: wallet.type,
          balance: wallet.balance,
        })),
        cards: creditCards.map((card) => ({
          id: card.id,
          name: card.name,
          balance: card.balance,
        })),
        debts: debts.map((debt) => ({
          id: debt.id,
          name: debt.name,
          pendingBalance: debt.pendingBalance,
        })),
      },
    };
  }
}
