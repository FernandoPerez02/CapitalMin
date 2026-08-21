import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Card, Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { WalletsService } from '../wallets/wallets.service';
import { CreateCardDto } from './dto/create-card.dto';
import { UpdateCardDto } from './dto/update-card.dto';
import { PayCardDto } from './dto/pay-card.dto';

@Injectable()
export class CardsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly walletsService: WalletsService,
  ) {}

  async list(accountId: string) {
    const cards = await this.prisma.card.findMany({
      where: { accountId },
      orderBy: { createdAt: 'asc' },
    });
    return Promise.all(cards.map((card) => this.toResponse(card)));
  }

  async findOne(accountId: string, cardId: string) {
    const card = await this.findCardOrThrow(accountId, cardId);
    return this.toResponse(card);
  }

  async create(accountId: string, dto: CreateCardDto) {
    if (dto.type === 'DEBIT') {
      if (!dto.walletId) {
        throw new BadRequestException('Una tarjeta débito requiere walletId');
      }
      await this.assertWalletBelongsToAccount(accountId, dto.walletId);
    } else {
      if (dto.walletId) {
        throw new BadRequestException(
          'Una tarjeta de crédito no se asocia a una cuenta bancaria directamente',
        );
      }
      if (dto.creditLimit === undefined) {
        throw new BadRequestException(
          'Una tarjeta de crédito requiere creditLimit',
        );
      }
    }

    try {
      const card = await this.prisma.card.create({
        data: {
          accountId,
          name: dto.name,
          type: dto.type,
          walletId: dto.walletId,
          creditLimit: dto.creditLimit,
          cutoffDay: dto.cutoffDay,
          paymentDueDay: dto.paymentDueDay,
        },
      });
      return this.toResponse(card);
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new ConflictException('Ya existe una tarjeta con este nombre');
      }
      throw error;
    }
  }

  async update(accountId: string, cardId: string, dto: UpdateCardDto) {
    const card = await this.findCardOrThrow(accountId, cardId);

    try {
      const updated = await this.prisma.card.update({
        where: { id: card.id },
        data: {
          ...(dto.name !== undefined && { name: dto.name }),
          ...(dto.creditLimit !== undefined && {
            creditLimit: dto.creditLimit,
          }),
          ...(dto.cutoffDay !== undefined && { cutoffDay: dto.cutoffDay }),
          ...(dto.paymentDueDay !== undefined && {
            paymentDueDay: dto.paymentDueDay,
          }),
          ...(dto.isActive !== undefined && { isActive: dto.isActive }),
        },
      });
      return this.toResponse(updated);
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new ConflictException('Ya existe una tarjeta con este nombre');
      }
      throw error;
    }
  }

  async remove(accountId: string, cardId: string) {
    await this.findCardOrThrow(accountId, cardId);
    try {
      await this.prisma.card.delete({ where: { id: cardId } });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2003'
      ) {
        throw new ConflictException(
          'No se puede eliminar una tarjeta que tiene movimientos asociados',
        );
      }
      throw error;
    }
  }

  /**
   * Pago de tarjeta de crédito: un único Movement tipo Transferencia que
   * sale de la wallet indicada y reduce el saldo utilizado de la tarjeta.
   * No es un gasto nuevo — el gasto real ya se contó en cada compra
   * (Regla 6/7: una transferencia interna no es ingreso ni gasto).
   */
  async pay(accountId: string, cardId: string, dto: PayCardDto) {
    const card = await this.findCardOrThrow(accountId, cardId);
    if (card.type !== 'CREDIT') {
      throw new ConflictException(
        'Solo las tarjetas de crédito reciben pagos; una débito ya gasta directo de la wallet',
      );
    }
    await this.assertWalletBelongsToAccount(accountId, dto.walletId);

    const movement = await this.prisma.movement.create({
      data: {
        accountId,
        walletId: dto.walletId,
        cardId: card.id,
        date: dto.date ? new Date(dto.date) : new Date(),
        typeMovement: 'Transferencia',
        description: `Pago tarjeta ${card.name}`,
        amount: dto.amount,
        status: 'Confirmado',
      },
    });

    return { ...movement, amount: Number(movement.amount) };
  }

  /**
   * Débito: el saldo ES el de la wallet asociada, no hay saldo propio.
   * Crédito: saldo utilizado = Σ compras (Egreso, sin wallet) - Σ pagos
   * (Transferencia con wallet) — mismo patrón de agregación que Wallet.
   */
  private async getBalance(card: Card): Promise<number> {
    if (card.type === 'DEBIT') {
      return card.walletId ? this.walletsService.getBalance(card.walletId) : 0;
    }

    const [purchases, refunds, payments] = await Promise.all([
      this.sum(card.id, { typeMovement: 'Egreso', walletId: null }),
      // Reversar una compra genera un Ingreso ligado a la tarjeta (ver
      // MovementsService.reverse) y debe reducir el saldo utilizado.
      this.sum(card.id, { typeMovement: 'Ingreso', walletId: null }),
      this.sum(card.id, {
        typeMovement: 'Transferencia',
        walletId: { not: null },
      }),
    ]);

    return purchases - refunds - payments;
  }

  private async sum(
    cardId: string,
    where: Omit<Prisma.MovementWhereInput, 'cardId' | 'status'>,
  ) {
    const result = await this.prisma.movement.aggregate({
      where: { cardId, status: 'Confirmado', ...where },
      _sum: { amount: true },
    });
    return Number(result._sum.amount ?? 0);
  }

  private async findCardOrThrow(accountId: string, cardId: string) {
    const card = await this.prisma.card.findFirst({
      where: { id: cardId, accountId },
    });
    if (!card) {
      throw new NotFoundException('Tarjeta no encontrada en esta cuenta');
    }
    return card;
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

  private async toResponse(card: Card) {
    const balance = await this.getBalance(card);
    const creditLimit =
      card.creditLimit === null ? null : Number(card.creditLimit);
    return {
      ...card,
      creditLimit,
      balance,
      availableCredit: creditLimit === null ? null : creditLimit - balance,
    };
  }
}
