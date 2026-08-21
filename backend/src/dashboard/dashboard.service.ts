import { Injectable } from '@nestjs/common';
import { NetWorthService } from '../net-worth/net-worth.service';
import { ReportsService } from '../reports/reports.service';
import { BudgetsService } from '../budgets/budgets.service';
import { GoalsService } from '../goals/goals.service';
import { ObligationsService } from '../obligations/obligations.service';

const UPCOMING_PAYMENTS_LIMIT = 5;

@Injectable()
export class DashboardService {
  constructor(
    private readonly netWorthService: NetWorthService,
    private readonly reportsService: ReportsService,
    private readonly budgetsService: BudgetsService,
    private readonly goalsService: GoalsService,
    private readonly obligationsService: ObligationsService,
  ) {}

  /**
   * Vista consolidada (spec sección 18): compone servicios que ya existen,
   * no guarda ni recalcula nada propio (Regla 9 — el dashboard no es una
   * segunda fuente de información).
   */
  async get(accountId: string) {
    const period = this.currentPeriod();

    const [netWorth, monthSummary, budgetSummary, goals, obligations] =
      await Promise.all([
        this.netWorthService.calculate(accountId),
        this.reportsService.summary(accountId, 'month'),
        this.budgetsService.getPeriodSummary(accountId, period),
        this.goalsService.list(accountId),
        this.obligationsService.list(accountId, { status: 'PENDIENTE' }),
      ]);

    const totalGoalTarget = goals.reduce(
      (sum, goal) => sum + goal.targetAmount,
      0,
    );
    const totalGoalCurrent = goals.reduce(
      (sum, goal) => sum + goal.currentAmount,
      0,
    );

    return {
      netWorth,
      month: {
        period,
        income: monthSummary.incomeTotal,
        expense: monthSummary.expenseTotal,
        savings: monthSummary.incomeTotal - monthSummary.expenseTotal,
      },
      budget: {
        totalBudgeted: budgetSummary.totalBudgeted,
        totalSpent: budgetSummary.totalSpent,
        percentUsed: budgetSummary.percentUsed,
      },
      goals: {
        totalTarget: totalGoalTarget,
        totalCurrent: totalGoalCurrent,
        percentUsed:
          totalGoalTarget > 0
            ? Math.min(totalGoalCurrent / totalGoalTarget, 1)
            : 0,
      },
      upcomingPayments: obligations
        .slice(0, UPCOMING_PAYMENTS_LIMIT)
        .map((obligation) => ({
          id: obligation.id,
          name: obligation.name,
          amount: obligation.amount,
          dueDate: obligation.dueDate,
          overdue: obligation.overdue,
        })),
    };
  }

  private currentPeriod(): string {
    const now = new Date();
    return `${now.getUTCFullYear()}-${String(now.getUTCMonth() + 1).padStart(2, '0')}`;
  }
}
