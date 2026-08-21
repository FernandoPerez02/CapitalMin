import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Category, Movement, Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateMovementDto } from './dto/create-movement.dto';
import { UpdateMovementDto } from './dto/update-movement.dto';
import { ListMovementsQueryDto } from './dto/list-movements-query.dto';
import { CreateTransferDto } from './dto/create-transfer.dto';

type MovementWithCategory = Movement & { category: Category | null };

@Injectable()
export class MovementsService {
  constructor(private readonly prisma: PrismaService) {}

  async list(accountId: string, filters: ListMovementsQueryDto) {
    const where: Prisma.MovementWhereInput = {
      accountId,
      ...(filters.walletId && { walletId: filters.walletId }),
      ...(filters.cardId && { cardId: filters.cardId }),
      ...(filters.typeMovement && { typeMovement: filters.typeMovement }),
      ...(filters.status && { status: filters.status }),
      ...(filters.categoryId && { categoryId: filters.categoryId }),
    };

    if (filters.dateFrom || filters.dateTo) {
      where.date = {
        ...(filters.dateFrom && { gte: new Date(filters.dateFrom) }),
        ...(filters.dateTo && { lte: new Date(filters.dateTo) }),
      };
    }

    const movements = await this.prisma.movement.findMany({
      where,
      include: { category: true },
      orderBy: { date: 'desc' },
    });
    return movements.map((movement) => this.toResponse(movement));
  }

  async create(accountId: string, dto: CreateMovementDto) {
    await this.assertWalletAndCard(accountId, dto.walletId, dto.cardId);
    if (dto.categoryId) {
      await this.assertCategoryBelongsToAccount(accountId, dto.categoryId);
    }

    const movement = await this.prisma.movement.create({
      data: {
        accountId,
        walletId: dto.walletId,
        cardId: dto.cardId,
        categoryId: dto.categoryId,
        date: new Date(dto.date),
        typeMovement: dto.typeMovement,
        description: dto.description,
        amount: dto.amount,
        status: dto.status,
      },
      include: { category: true },
    });

    return this.toResponse(movement);
  }

  async update(accountId: string, movementId: string, dto: UpdateMovementDto) {
    const movement = await this.prisma.movement.findFirst({
      where: { id: movementId, accountId },
    });
    if (!movement) {
      throw new NotFoundException('Movimiento no encontrado');
    }
    if (movement.typeMovement === 'Transferencia') {
      throw new ConflictException(
        'Las transferencias no se editan; anúlala y crea una nueva',
      );
    }

    if (dto.walletId) {
      await this.assertWalletBelongsToAccount(accountId, dto.walletId);
    }
    if (dto.cardId) {
      await this.assertCardBelongsToAccount(accountId, dto.cardId);
    }
    if (dto.categoryId) {
      await this.assertCategoryBelongsToAccount(accountId, dto.categoryId);
    }

    const updated = await this.prisma.movement.update({
      where: { id: movement.id },
      data: {
        ...(dto.walletId !== undefined && { walletId: dto.walletId }),
        ...(dto.cardId !== undefined && { cardId: dto.cardId }),
        ...(dto.date !== undefined && { date: new Date(dto.date) }),
        ...(dto.typeMovement !== undefined && {
          typeMovement: dto.typeMovement,
        }),
        ...(dto.description !== undefined && { description: dto.description }),
        ...(dto.amount !== undefined && { amount: dto.amount }),
        ...(dto.status !== undefined && { status: dto.status }),
        ...(dto.categoryId !== undefined && { categoryId: dto.categoryId }),
      },
      include: { category: true },
    });

    return this.toResponse(updated);
  }

  async transfer(accountId: string, dto: CreateTransferDto) {
    if (dto.fromWalletId === dto.toWalletId) {
      throw new ConflictException(
        'La cuenta de origen y destino no pueden ser la misma',
      );
    }
    await this.assertWalletBelongsToAccount(accountId, dto.fromWalletId);
    await this.assertWalletBelongsToAccount(accountId, dto.toWalletId);

    const result = await this.prisma.$transaction(async (tx) => {
      const outgoing = await tx.movement.create({
        data: {
          accountId,
          walletId: dto.fromWalletId,
          date: new Date(dto.date),
          typeMovement: 'Transferencia',
          description: dto.description,
          amount: dto.amount,
          status: dto.status,
        },
      });

      const incoming = await tx.movement.create({
        data: {
          accountId,
          walletId: dto.toWalletId,
          date: new Date(dto.date),
          typeMovement: 'Transferencia',
          description: dto.description,
          amount: dto.amount,
          status: dto.status,
          transferPairId: outgoing.id,
        },
        include: { category: true },
      });

      return { outgoing: { ...outgoing, category: null }, incoming };
    });

    return {
      outgoing: this.toResponse(result.outgoing),
      incoming: this.toResponse(result.incoming),
    };
  }

  async remove(accountId: string, movementId: string) {
    const movement = await this.prisma.movement.findFirst({
      where: { id: movementId, accountId },
    });
    if (!movement) {
      throw new NotFoundException('Movimiento no encontrado');
    }

    try {
      await this.prisma.movement.delete({ where: { id: movement.id } });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2003'
      ) {
        throw new ConflictException(
          'No se puede eliminar un movimiento que tiene una reversión asociada',
        );
      }
      throw error;
    }
  }

  async reverse(accountId: string, movementId: string) {
    const result = await this.prisma.$transaction(async (tx) => {
      const original = await tx.movement.findFirst({
        where: { id: movementId, accountId },
      });
      if (!original) {
        throw new NotFoundException('Movimiento no encontrado');
      }
      if (original.status !== 'Confirmado') {
        throw new ConflictException(
          'Solo se puede anular un movimiento Confirmado',
        );
      }
      if (original.typeMovement === 'Transferencia') {
        throw new ConflictException(
          'Las transferencias no se anulan; crea una transferencia inversa',
        );
      }

      const reversal = await tx.movement.create({
        data: {
          accountId,
          walletId: original.walletId,
          cardId: original.cardId,
          categoryId: original.categoryId,
          date: new Date(),
          typeMovement:
            original.typeMovement === 'Ingreso' ? 'Egreso' : 'Ingreso',
          description: `Reversión de: ${original.description}`,
          amount: original.amount,
          status: 'Confirmado',
          reversedMovementId: original.id,
        },
        include: { category: true },
      });

      const reverted = await tx.movement.update({
        where: { id: original.id },
        data: { status: 'Revertido' },
        include: { category: true },
      });

      return { original: reverted, reversal };
    });

    return {
      original: this.toResponse(result.original),
      reversal: this.toResponse(result.reversal),
    };
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

  private async assertCardBelongsToAccount(accountId: string, cardId: string) {
    const card = await this.prisma.card.findFirst({
      where: { id: cardId, accountId },
    });
    if (!card) {
      throw new NotFoundException('Tarjeta no encontrada en esta cuenta');
    }
    return card;
  }

  /**
   * Todo movimiento afecta una wallet, una tarjeta, o ambas — nunca ninguna.
   * Una compra con tarjeta de crédito puede omitir walletId (no toca ningún
   * saldo de cuenta todavía, ver Card); cualquier otro caso requiere wallet.
   */
  private async assertWalletAndCard(
    accountId: string,
    walletId: string | undefined,
    cardId: string | undefined,
  ) {
    if (!walletId && !cardId) {
      throw new BadRequestException(
        'Un movimiento debe tener walletId o cardId',
      );
    }
    if (walletId) {
      await this.assertWalletBelongsToAccount(accountId, walletId);
    }
    if (cardId) {
      const card = await this.assertCardBelongsToAccount(accountId, cardId);
      if (!walletId && card.type !== 'CREDIT') {
        throw new ConflictException(
          'Solo una compra con tarjeta de crédito puede registrarse sin walletId',
        );
      }
    }
  }

  private toResponse(movement: MovementWithCategory) {
    const { category, ...rest } = movement;
    return {
      ...rest,
      amount: Number(movement.amount),
      category: category ? { id: category.id, name: category.name } : null,
    };
  }
}
