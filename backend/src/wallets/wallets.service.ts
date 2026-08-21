import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma, Wallet } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateWalletDto } from './dto/create-wallet.dto';
import { UpdateWalletDto } from './dto/update-wallet.dto';

@Injectable()
export class WalletsService {
  constructor(private readonly prisma: PrismaService) {}

  async list(accountId: string) {
    const wallets = await this.prisma.wallet.findMany({
      where: { accountId },
      orderBy: { createdAt: 'asc' },
    });
    return Promise.all(wallets.map((wallet) => this.toResponse(wallet)));
  }

  async findOne(accountId: string, walletId: string) {
    const wallet = await this.findWalletOrThrow(accountId, walletId);
    return this.toResponse(wallet);
  }

  async create(accountId: string, dto: CreateWalletDto) {
    try {
      const wallet = await this.prisma.wallet.create({
        data: {
          accountId,
          name: dto.name,
          type: dto.type,
          currency: dto.currency,
          initialBalance: dto.initialBalance ?? 0,
        },
      });
      return this.toResponse(wallet);
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new ConflictException('Ya existe una cuenta con este nombre');
      }
      throw error;
    }
  }

  async update(accountId: string, walletId: string, dto: UpdateWalletDto) {
    await this.findWalletOrThrow(accountId, walletId);

    try {
      const wallet = await this.prisma.wallet.update({
        where: { id: walletId },
        data: {
          ...(dto.name !== undefined && { name: dto.name }),
          ...(dto.type !== undefined && { type: dto.type }),
          ...(dto.currency !== undefined && { currency: dto.currency }),
          ...(dto.isActive !== undefined && { isActive: dto.isActive }),
        },
      });
      return this.toResponse(wallet);
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new ConflictException('Ya existe una cuenta con este nombre');
      }
      throw error;
    }
  }

  async remove(accountId: string, walletId: string) {
    await this.findWalletOrThrow(accountId, walletId);

    try {
      await this.prisma.wallet.delete({ where: { id: walletId } });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2003'
      ) {
        throw new ConflictException(
          'No se puede eliminar una cuenta que tiene movimientos asociados',
        );
      }
      throw error;
    }
  }

  /**
   * Saldo derivado: initialBalance + Ingresos - Egresos de esta wallet
   * +/- transferencias. Una fila `Transferencia` con transferPairId != null
   * es la pierna de destino (dinero entrante); con transferPairId == null es
   * la pierna de origen (dinero saliente) — ver comentario en schema.prisma.
   */
  async getBalance(walletId: string): Promise<number> {
    const wallet = await this.prisma.wallet.findUniqueOrThrow({
      where: { id: walletId },
    });

    const [income, expense, transferIn, transferOut] = await Promise.all([
      this.sum(walletId, { typeMovement: 'Ingreso' }),
      this.sum(walletId, { typeMovement: 'Egreso' }),
      this.sum(walletId, {
        typeMovement: 'Transferencia',
        transferPairId: { not: null },
      }),
      this.sum(walletId, {
        typeMovement: 'Transferencia',
        transferPairId: null,
      }),
    ]);

    return (
      Number(wallet.initialBalance) +
      income -
      expense +
      transferIn -
      transferOut
    );
  }

  private async sum(
    walletId: string,
    where: Omit<Prisma.MovementWhereInput, 'walletId' | 'status'>,
  ) {
    const result = await this.prisma.movement.aggregate({
      where: { walletId, status: 'Confirmado', ...where },
      _sum: { amount: true },
    });
    return Number(result._sum.amount ?? 0);
  }

  private async findWalletOrThrow(accountId: string, walletId: string) {
    const wallet = await this.prisma.wallet.findFirst({
      where: { id: walletId, accountId },
    });
    if (!wallet) {
      throw new NotFoundException('Cuenta no encontrada en este espacio');
    }
    return wallet;
  }

  private async toResponse(wallet: Wallet) {
    const balance = await this.getBalance(wallet.id);
    return {
      ...wallet,
      initialBalance: Number(wallet.initialBalance),
      balance,
    };
  }
}
