import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Obligation } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateObligationDto } from './dto/create-obligation.dto';
import { UpdateObligationDto } from './dto/update-obligation.dto';
import { ListObligationsQueryDto } from './dto/list-obligations-query.dto';
import { PayObligationDto } from './dto/pay-obligation.dto';

@Injectable()
export class ObligationsService {
  constructor(private readonly prisma: PrismaService) {}

  async list(accountId: string, filters: ListObligationsQueryDto) {
    const obligations = await this.prisma.obligation.findMany({
      where: {
        accountId,
        ...(filters.status && { status: filters.status }),
      },
      orderBy: { dueDate: 'asc' },
    });
    return obligations.map((obligation) => this.toResponse(obligation));
  }

  async create(accountId: string, dto: CreateObligationDto) {
    if (dto.categoryId) {
      await this.assertCategoryBelongsToAccount(accountId, dto.categoryId);
    }

    const dueDate = this.resolveInitialDueDate(dto);

    const obligation = await this.prisma.obligation.create({
      data: {
        accountId,
        categoryId: dto.categoryId,
        name: dto.name,
        amount: dto.amount,
        typeMovement: dto.typeMovement,
        dueDate,
        recurrenceDayOfMonth: dto.recurrenceDayOfMonth,
      },
    });

    return this.toResponse(obligation);
  }

  async update(
    accountId: string,
    obligationId: string,
    dto: UpdateObligationDto,
  ) {
    const obligation = await this.findOrThrow(accountId, obligationId);
    if (dto.categoryId) {
      await this.assertCategoryBelongsToAccount(accountId, dto.categoryId);
    }

    const updated = await this.prisma.obligation.update({
      where: { id: obligation.id },
      data: {
        ...(dto.name !== undefined && { name: dto.name }),
        ...(dto.amount !== undefined && { amount: dto.amount }),
        ...(dto.categoryId !== undefined && { categoryId: dto.categoryId }),
        ...(dto.dueDate !== undefined && { dueDate: new Date(dto.dueDate) }),
        ...(dto.isActive !== undefined && { isActive: dto.isActive }),
      },
    });

    return this.toResponse(updated);
  }

  async remove(accountId: string, obligationId: string) {
    await this.findOrThrow(accountId, obligationId);
    await this.prisma.obligation.delete({ where: { id: obligationId } });
  }

  /**
   * "Ya pagué": crea el Movement real y lo enlaza vía ObligationPayment
   * (spec sección 14). Si es recurrente, avanza dueDate a la próxima
   * ocurrencia y sigue PENDIENTE; si es puntual, pasa a PAGADA.
   */
  async pay(accountId: string, obligationId: string, dto: PayObligationDto) {
    const obligation = await this.findOrThrow(accountId, obligationId);
    if (obligation.status === 'PAGADA') {
      throw new ConflictException('Esta obligación ya fue pagada');
    }
    await this.assertWalletBelongsToAccount(accountId, dto.walletId);

    const paidAt = dto.paidAt ? new Date(dto.paidAt) : new Date();

    const result = await this.prisma.$transaction(async (tx) => {
      const movement = await tx.movement.create({
        data: {
          accountId,
          walletId: dto.walletId,
          categoryId: obligation.categoryId,
          date: paidAt,
          typeMovement: obligation.typeMovement,
          description: obligation.name,
          amount: obligation.amount,
          status: 'Confirmado',
        },
      });

      const payment = await tx.obligationPayment.create({
        data: {
          obligationId: obligation.id,
          movementId: movement.id,
          amount: obligation.amount,
          paidAt,
        },
      });

      const nextDueDate = obligation.recurrenceDayOfMonth
        ? this.nextOccurrenceStrictlyAfter(
            obligation.recurrenceDayOfMonth,
            paidAt,
          )
        : obligation.dueDate;

      const updatedObligation = await tx.obligation.update({
        where: { id: obligation.id },
        data: {
          dueDate: nextDueDate,
          status: obligation.recurrenceDayOfMonth ? 'PENDIENTE' : 'PAGADA',
        },
      });

      return { movement, payment, obligation: updatedObligation };
    });

    return {
      obligation: this.toResponse(result.obligation),
      movement: {
        ...result.movement,
        amount: Number(result.movement.amount),
      },
      payment: { ...result.payment, amount: Number(result.payment.amount) },
    };
  }

  private resolveInitialDueDate(dto: CreateObligationDto): Date {
    if (dto.recurrenceDayOfMonth) {
      return this.nextOccurrence(dto.recurrenceDayOfMonth, new Date());
    }
    if (!dto.dueDate) {
      throw new BadRequestException(
        'Una obligación puntual requiere dueDate; una recurrente requiere recurrenceDayOfMonth',
      );
    }
    return new Date(dto.dueDate);
  }

  /** Próxima fecha (hoy o futura) en la que cae ese día del mes, en UTC. */
  private nextOccurrence(dayOfMonth: number, from: Date): Date {
    const fromDateOnly = new Date(
      Date.UTC(from.getUTCFullYear(), from.getUTCMonth(), from.getUTCDate()),
    );
    const year = fromDateOnly.getUTCFullYear();
    const month = fromDateOnly.getUTCMonth();
    const candidate = new Date(Date.UTC(year, month, dayOfMonth));
    const resolved =
      candidate.getUTCMonth() !== month
        ? new Date(Date.UTC(year, month + 1, 0)) // el mes no tiene ese día: último día del mes
        : candidate;

    if (resolved < fromDateOnly) {
      return this.nextOccurrence(
        dayOfMonth,
        new Date(Date.UTC(year, month + 1, 1)),
      );
    }
    return resolved;
  }

  /** Igual que nextOccurrence pero nunca devuelve el mismo día que `from`. */
  private nextOccurrenceStrictlyAfter(dayOfMonth: number, from: Date): Date {
    const dayAfter = new Date(
      Date.UTC(
        from.getUTCFullYear(),
        from.getUTCMonth(),
        from.getUTCDate() + 1,
      ),
    );
    return this.nextOccurrence(dayOfMonth, dayAfter);
  }

  private async findOrThrow(accountId: string, obligationId: string) {
    const obligation = await this.prisma.obligation.findFirst({
      where: { id: obligationId, accountId },
    });
    if (!obligation) {
      throw new NotFoundException('Obligación no encontrada');
    }
    return obligation;
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

  private async assertWalletBelongsToAccount(
    accountId: string,
    walletId: string,
  ) {
    const wallet = await this.prisma.wallet.findFirst({
      where: { id: walletId, accountId },
    });
    if (!wallet) {
      throw new NotFoundException(
        'Cuenta financiera no encontrada en este espacio',
      );
    }
  }

  private toResponse(obligation: Obligation) {
    return {
      ...obligation,
      amount: Number(obligation.amount),
      dueDate: obligation.dueDate.toISOString().slice(0, 10),
      overdue:
        obligation.status === 'PENDIENTE' && obligation.dueDate < new Date(),
    };
  }
}
