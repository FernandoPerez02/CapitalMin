import { Injectable } from '@nestjs/common';
import { MovementType } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { ReportRange } from './dto/range-query.dto';

@Injectable()
export class ReportsService {
  constructor(private readonly prisma: PrismaService) {}

  async summary(accountId: string, range: ReportRange) {
    const { start, end } = this.resolveRange(range);

    const [allTimeIncome, allTimeExpense, rangeIncome, rangeExpense] =
      await Promise.all([
        this.sumMovements(accountId, 'Ingreso'),
        this.sumMovements(accountId, 'Egreso'),
        this.sumMovements(accountId, 'Ingreso', start, end),
        this.sumMovements(accountId, 'Egreso', start, end),
      ]);

    return {
      range,
      balance: allTimeIncome - allTimeExpense,
      incomeTotal: rangeIncome,
      expenseTotal: rangeExpense,
    };
  }

  /**
   * El total de una categoría padre incluye lo gastado directamente en ella
   * más lo gastado en todas sus subcategorías (Regla: la jerarquía se
   * consulta, no se duplica). "Sin categoría" agrupa lo no clasificado.
   */
  async byCategory(accountId: string, range: ReportRange) {
    const { start, end } = this.resolveRange(range);

    const [categories, grouped] = await Promise.all([
      this.prisma.category.findMany({ where: { accountId } }),
      this.prisma.movement.groupBy({
        by: ['categoryId'],
        where: {
          accountId,
          status: 'Confirmado',
          typeMovement: 'Egreso',
          date: { gte: start, lt: end },
        },
        _sum: { amount: true },
      }),
    ]);

    const directTotalById = new Map<string, number>();
    let uncategorized = 0;
    for (const g of grouped) {
      const amount = Number(g._sum.amount ?? 0);
      if (g.categoryId) {
        directTotalById.set(g.categoryId, amount);
      } else {
        uncategorized = amount;
      }
    }

    const childrenByParentId = new Map<string, string[]>();
    for (const category of categories) {
      if (!category.parentId) continue;
      const siblings = childrenByParentId.get(category.parentId) ?? [];
      siblings.push(category.id);
      childrenByParentId.set(category.parentId, siblings);
    }

    const rollupCache = new Map<string, number>();
    const rollup = (categoryId: string): number => {
      const cached = rollupCache.get(categoryId);
      if (cached !== undefined) return cached;
      const own = directTotalById.get(categoryId) ?? 0;
      const childrenTotal = (childrenByParentId.get(categoryId) ?? []).reduce(
        (sum, childId) => sum + rollup(childId),
        0,
      );
      const total = own + childrenTotal;
      rollupCache.set(categoryId, total);
      return total;
    };

    const results = categories
      .map((category) => ({
        id: category.id,
        label: category.name,
        value: rollup(category.id),
      }))
      .filter((entry) => entry.value > 0);

    if (uncategorized > 0) {
      results.push({
        id: 'sin-categoria',
        label: 'Sin categoría',
        value: uncategorized,
      });
    }

    return results.sort((a, b) => b.value - a.value);
  }

  async byMonth(accountId: string, months: number) {
    const now = new Date();
    const start = new Date(
      Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - (months - 1), 1),
    );

    const movements = await this.prisma.movement.findMany({
      where: { accountId, status: 'Confirmado', date: { gte: start } },
      select: { date: true, typeMovement: true, amount: true },
    });

    const buckets = new Map<string, { income: number; expense: number }>();
    for (let i = 0; i < months; i += 1) {
      const d = new Date(
        Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - (months - 1) + i, 1),
      );
      buckets.set(this.monthKey(d), { income: 0, expense: 0 });
    }

    for (const movement of movements) {
      if (movement.typeMovement === 'Transferencia') continue;
      const bucket = buckets.get(this.monthKey(movement.date));
      if (!bucket) continue;
      const amount = Number(movement.amount);
      if (movement.typeMovement === 'Ingreso') {
        bucket.income += amount;
      } else {
        bucket.expense += amount;
      }
    }

    return Array.from(buckets.entries()).map(([period, totals]) => ({
      period,
      ...totals,
    }));
  }

  private async sumMovements(
    accountId: string,
    typeMovement: MovementType,
    start?: Date,
    end?: Date,
  ) {
    const result = await this.prisma.movement.aggregate({
      where: {
        accountId,
        status: 'Confirmado',
        typeMovement,
        ...(start && end ? { date: { gte: start, lt: end } } : {}),
      },
      _sum: { amount: true },
    });
    return Number(result._sum.amount ?? 0);
  }

  /**
   * Todo en UTC: `Movement.date` se guarda como medianoche UTC (ver
   * MovementsService.create, `new Date("YYYY-MM-DD")`), así que los límites
   * de rango deben construirse con `Date.UTC` — usar el constructor de
   * Date con argumentos sueltos los interpreta en hora local del servidor,
   * lo que desplaza los rangos en cualquier timezone distinto de UTC.
   */
  private resolveRange(range: ReportRange): { start: Date; end: Date } {
    const now = new Date();
    const end = new Date(
      Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + 1),
    );
    let start: Date;

    switch (range) {
      case 'day':
        start = new Date(
          Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()),
        );
        break;
      case 'week': {
        const diffToMonday = (now.getUTCDay() + 6) % 7;
        start = new Date(
          Date.UTC(
            now.getUTCFullYear(),
            now.getUTCMonth(),
            now.getUTCDate() - diffToMonday,
          ),
        );
        break;
      }
      case 'year':
        start = new Date(Date.UTC(now.getUTCFullYear(), 0, 1));
        break;
      case 'month':
      default:
        start = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1));
        break;
    }

    return { start, end };
  }

  private monthKey(date: Date): string {
    return `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, '0')}`;
  }
}
