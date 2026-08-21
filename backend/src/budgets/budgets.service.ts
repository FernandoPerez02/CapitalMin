import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Budget, Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBudgetDto } from './dto/create-budget.dto';
import { ListBudgetsQueryDto } from './dto/list-budgets-query.dto';

type AlertLevel = 'ok' | 'near' | 'exceeded';

@Injectable()
export class BudgetsService {
  constructor(private readonly prisma: PrismaService) {}

  async list(accountId: string, filters: ListBudgetsQueryDto) {
    const where: Prisma.BudgetWhereInput = {
      accountId,
      ...(filters.period && { period: filters.period }),
      ...(filters.status && { status: filters.status }),
      ...(filters.categoryId && { categoryId: filters.categoryId }),
    };

    const budgets = await this.prisma.budget.findMany({
      where,
      orderBy: { date: 'desc' },
    });
    return budgets.map((budget) => this.toResponse(budget));
  }

  async create(accountId: string, dto: CreateBudgetDto) {
    if (dto.categoryId) {
      await this.assertCategoryBelongsToAccount(accountId, dto.categoryId);
    }

    const budget = await this.prisma.budget.create({
      data: {
        accountId,
        categoryId: dto.categoryId,
        date: new Date(dto.date),
        period: dto.period,
        description: dto.description,
        amount: dto.amount,
        status: dto.status,
      },
    });

    return this.toResponse(budget);
  }

  async getProjection(accountId: string, budgetId: string) {
    const budget = await this.findBudgetOrThrow(accountId, budgetId);
    return this.buildProjection(accountId, budget);
  }

  async remove(accountId: string, budgetId: string) {
    await this.findBudgetOrThrow(accountId, budgetId);
    await this.prisma.budget.delete({ where: { id: budgetId } });
  }

  /**
   * Resumen agregado de todos los presupuestos de un periodo (usado por el
   * dashboard) — reutiliza buildProjection en vez de recalcular gastado.
   */
  async getPeriodSummary(accountId: string, period: string) {
    const budgets = await this.prisma.budget.findMany({
      where: { accountId, period },
    });
    const projections = await Promise.all(
      budgets.map((budget) => this.buildProjection(accountId, budget)),
    );

    const totalBudgeted = projections.reduce((sum, p) => sum + p.amount, 0);
    const totalSpent = projections.reduce((sum, p) => sum + p.spent, 0);

    return {
      period,
      totalBudgeted,
      totalSpent,
      percentUsed: totalBudgeted > 0 ? totalSpent / totalBudgeted : 0,
      budgets: projections,
    };
  }

  /**
   * Presupuesto predictivo (spec sección 10): proyecta el gasto total del
   * periodo al ritmo actual (gastado / días transcurridos × días totales) y
   * marca los umbrales 80%/90%/100% (sección 9). `spent` incluye el rollup
   * de subcategorías cuando el presupuesto apunta a una categoría padre,
   * igual que ReportsService.byCategory.
   */
  private async buildProjection(accountId: string, budget: Budget) {
    const { start, end, totalDays } = this.parsePeriod(budget.period);
    const now = new Date();
    const today = new Date(
      Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()),
    );

    const spent = await this.sumSpent(accountId, budget.categoryId, start, end);

    const daysElapsed =
      today <= start
        ? 0
        : today >= end
          ? totalDays
          : Math.ceil((today.getTime() - start.getTime()) / 86_400_000);

    const amount = Number(budget.amount);
    const projectedTotal =
      daysElapsed > 0 ? (spent / daysElapsed) * totalDays : spent;
    const percentUsed = amount > 0 ? spent / amount : 0;

    let alertLevel: AlertLevel = 'ok';
    if (percentUsed >= 1) alertLevel = 'exceeded';
    else if (percentUsed >= 0.8) alertLevel = 'near';

    return {
      budgetId: budget.id,
      categoryId: budget.categoryId,
      period: budget.period,
      amount,
      spent,
      available: amount - spent,
      percentUsed,
      daysElapsed,
      daysTotal: totalDays,
      projectedTotal,
      projectedExceedsBy: Math.max(projectedTotal - amount, 0),
      alertLevel,
    };
  }

  private async sumSpent(
    accountId: string,
    categoryId: string | null,
    start: Date,
    end: Date,
  ) {
    const categoryIds = categoryId
      ? await this.collectCategoryIds(accountId, categoryId)
      : undefined;

    const result = await this.prisma.movement.aggregate({
      where: {
        accountId,
        status: 'Confirmado',
        typeMovement: 'Egreso',
        date: { gte: start, lt: end },
        ...(categoryIds ? { categoryId: { in: categoryIds } } : {}),
      },
      _sum: { amount: true },
    });
    return Number(result._sum.amount ?? 0);
  }

  /** El propio id + todos sus descendientes (para el rollup jerárquico). */
  private async collectCategoryIds(
    accountId: string,
    categoryId: string,
  ): Promise<string[]> {
    const categories = await this.prisma.category.findMany({
      where: { accountId },
      select: { id: true, parentId: true },
    });
    const childrenByParent = new Map<string, string[]>();
    for (const category of categories) {
      if (!category.parentId) continue;
      const siblings = childrenByParent.get(category.parentId) ?? [];
      siblings.push(category.id);
      childrenByParent.set(category.parentId, siblings);
    }

    const collected: string[] = [];
    const stack = [categoryId];
    while (stack.length > 0) {
      const id = stack.pop() as string;
      collected.push(id);
      stack.push(...(childrenByParent.get(id) ?? []));
    }
    return collected;
  }

  private parsePeriod(period: string): {
    start: Date;
    end: Date;
    totalDays: number;
  } {
    const match = /^(\d{4})-(\d{2})$/.exec(period);
    if (!match) {
      throw new BadRequestException('El periodo debe tener el formato YYYY-MM');
    }
    const year = Number(match[1]);
    const month = Number(match[2]) - 1;
    const start = new Date(Date.UTC(year, month, 1));
    const end = new Date(Date.UTC(year, month + 1, 1));
    const totalDays = Math.round(
      (end.getTime() - start.getTime()) / 86_400_000,
    );
    return { start, end, totalDays };
  }

  private async findBudgetOrThrow(accountId: string, budgetId: string) {
    const budget = await this.prisma.budget.findFirst({
      where: { id: budgetId, accountId },
    });
    if (!budget) {
      throw new NotFoundException('Presupuesto no encontrado');
    }
    return budget;
  }

  private async assertCategoryBelongsToAccount(
    accountId: string,
    categoryId: string,
  ) {
    const category = await this.prisma.category.findFirst({
      where: { id: categoryId, accountId },
    });
    if (!category) {
      throw new NotFoundException('Categoría no encontrada en esta cuenta');
    }
  }

  private toResponse(budget: Budget) {
    return { ...budget, amount: Number(budget.amount) };
  }
}
