import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

type Trend = 'increasing' | 'decreasing' | 'stable' | 'insufficient_data';

const DEFAULT_MONTHS = 3;
const UNCATEGORIZED_KEY = 'sin-categoria';

@Injectable()
export class AnalyticsService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Detecta tendencia de gasto por categoría en los últimos N meses (spec
   * sección 19), reutilizando el mismo patrón de bucket mensual que
   * ReportsService.byMonth pero agrupado también por categoría.
   */
  async categoryTrends(accountId: string, months: number = DEFAULT_MONTHS) {
    const now = new Date();
    const start = new Date(
      Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - (months - 1), 1),
    );

    const [categories, movements] = await Promise.all([
      this.prisma.category.findMany({ where: { accountId } }),
      this.prisma.movement.findMany({
        where: {
          accountId,
          status: 'Confirmado',
          typeMovement: 'Egreso',
          date: { gte: start },
        },
        select: { date: true, categoryId: true, amount: true },
      }),
    ]);

    const monthKeys: string[] = [];
    for (let i = 0; i < months; i += 1) {
      const d = new Date(
        Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - (months - 1) + i, 1),
      );
      monthKeys.push(this.monthKey(d));
    }

    const nameById = new Map(categories.map((c) => [c.id, c.name]));
    const bucketsByCategory = new Map<string, Map<string, number>>();

    for (const movement of movements) {
      const key = movement.categoryId ?? UNCATEGORIZED_KEY;
      const bucket = bucketsByCategory.get(key) ?? new Map<string, number>();
      const monthKey = this.monthKey(movement.date);
      bucket.set(
        monthKey,
        (bucket.get(monthKey) ?? 0) + Number(movement.amount),
      );
      bucketsByCategory.set(key, bucket);
    }

    const results = Array.from(bucketsByCategory.entries()).map(
      ([categoryId, bucket]) => {
        const series = monthKeys.map((key) => ({
          period: key,
          amount: bucket.get(key) ?? 0,
        }));
        const categoryName =
          categoryId === UNCATEGORIZED_KEY
            ? 'Sin categoría'
            : (nameById.get(categoryId) ?? 'Sin categoría');
        const { trend, changePercent } = this.detectTrend(
          series.map((point) => point.amount),
        );

        return {
          categoryId,
          categoryName,
          series,
          trend,
          changePercent,
          message: this.buildMessage(
            categoryName,
            trend,
            changePercent,
            months,
          ),
        };
      },
    );

    return results
      .filter((result) => result.series.some((point) => point.amount > 0))
      .sort(
        (a, b) =>
          b.series[b.series.length - 1].amount -
          a.series[a.series.length - 1].amount,
      );
  }

  /** Monótonamente creciente/decreciente a lo largo de toda la serie. */
  private detectTrend(amounts: number[]): {
    trend: Trend;
    changePercent: number | null;
  } {
    const nonZeroCount = amounts.filter((a) => a > 0).length;
    if (nonZeroCount < 2) {
      return { trend: 'insufficient_data', changePercent: null };
    }

    let increasing = true;
    let decreasing = true;
    for (let i = 1; i < amounts.length; i += 1) {
      if (amounts[i] < amounts[i - 1]) increasing = false;
      if (amounts[i] > amounts[i - 1]) decreasing = false;
    }

    const first = amounts[0];
    const last = amounts[amounts.length - 1];
    const changePercent = first > 0 ? ((last - first) / first) * 100 : null;

    if (increasing && !decreasing)
      return { trend: 'increasing', changePercent };
    if (decreasing && !increasing)
      return { trend: 'decreasing', changePercent };
    return { trend: 'stable', changePercent };
  }

  private buildMessage(
    categoryName: string,
    trend: Trend,
    changePercent: number | null,
    months: number,
  ): string | null {
    if (
      (trend !== 'increasing' && trend !== 'decreasing') ||
      changePercent === null
    ) {
      return null;
    }
    const verb = trend === 'increasing' ? 'aumentado' : 'disminuido';
    return `Tu gasto en ${categoryName} ha ${verb} un ${Math.abs(Math.round(changePercent))}% en los últimos ${months} meses.`;
  }

  private monthKey(date: Date): string {
    return `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, '0')}`;
  }
}
