import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Debt, DebtPayment } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateDebtDto } from './dto/create-debt.dto';
import { CreateDebtPaymentDto } from './dto/create-debt-payment.dto';
import { UpdateDebtDto } from './dto/update-debt.dto';

@Injectable()
export class DebtsService {
  constructor(private readonly prisma: PrismaService) {}

  async list(accountId: string) {
    const debts = await this.prisma.debt.findMany({
      where: { accountId },
      orderBy: { createdAt: 'asc' },
    });
    return Promise.all(debts.map((debt) => this.toResponse(debt)));
  }

  async findOne(accountId: string, debtId: string) {
    const debt = await this.findDebtOrThrow(accountId, debtId);
    return this.toResponse(debt);
  }

  async create(accountId: string, dto: CreateDebtDto) {
    const debt = await this.prisma.debt.create({
      data: {
        accountId,
        name: dto.name,
        principal: dto.principal,
        interestRate: dto.interestRate,
        termMonths: dto.termMonths,
        startDate: new Date(dto.startDate),
      },
    });
    return this.toResponse(debt);
  }

  async update(accountId: string, debtId: string, dto: UpdateDebtDto) {
    const debt = await this.findDebtOrThrow(accountId, debtId);

    const updated = await this.prisma.debt.update({
      where: { id: debt.id },
      data: {
        ...(dto.isActive !== undefined && { isActive: dto.isActive }),
      },
    });
    return this.toResponse(updated);
  }

  /**
   * A diferencia de Obligation, el Movement de un DebtPayment no tiene
   * sentido como transacción independiente ("Pago deuda X"), así que
   * eliminar la deuda arrastra también sus movimientos asociados.
   */
  async remove(accountId: string, debtId: string) {
    await this.findDebtOrThrow(accountId, debtId);
    const payments = await this.prisma.debtPayment.findMany({
      where: { debtId },
      select: { movementId: true },
    });

    await this.prisma.$transaction(async (tx) => {
      await tx.debt.delete({ where: { id: debtId } });
      if (payments.length > 0) {
        await tx.movement.deleteMany({
          where: { id: { in: payments.map((p) => p.movementId) } },
        });
      }
    });
  }

  async listPayments(accountId: string, debtId: string) {
    await this.findDebtOrThrow(accountId, debtId);
    const payments = await this.prisma.debtPayment.findMany({
      where: { debtId },
      orderBy: { date: 'asc' },
    });
    return payments.map((payment) => this.toPaymentResponse(payment));
  }

  /**
   * Registra un pago real (Regla 1: la transacción es el hecho). El
   * desglose capital/interés lo aporta quien paga —igual que en un
   * extracto de crédito— en vez de calcularlo con una tabla de
   * amortización que el sistema no modela.
   */
  async addPayment(
    accountId: string,
    debtId: string,
    dto: CreateDebtPaymentDto,
  ) {
    const debt = await this.findDebtOrThrow(accountId, debtId);
    await this.assertWalletBelongsToAccount(accountId, dto.walletId);

    const portionsSum = this.round2(dto.principalPortion + dto.interestPortion);
    if (portionsSum !== this.round2(dto.amount)) {
      throw new BadRequestException(
        'principalPortion + interestPortion debe ser igual a amount',
      );
    }

    const pendingBalance = await this.getPendingBalance(debt);
    if (this.round2(dto.principalPortion) > this.round2(pendingBalance)) {
      throw new ConflictException(
        'El capital pagado no puede superar el saldo pendiente',
      );
    }

    const paidAt = dto.date ? new Date(dto.date) : new Date();

    const result = await this.prisma.$transaction(async (tx) => {
      const movement = await tx.movement.create({
        data: {
          accountId,
          walletId: dto.walletId,
          date: paidAt,
          typeMovement: 'Egreso',
          description: `Pago deuda ${debt.name}`,
          amount: dto.amount,
          status: 'Confirmado',
        },
      });

      const payment = await tx.debtPayment.create({
        data: {
          debtId: debt.id,
          movementId: movement.id,
          amount: dto.amount,
          principalPortion: dto.principalPortion,
          interestPortion: dto.interestPortion,
          date: paidAt,
        },
      });

      return { movement, payment };
    });

    return {
      debt: await this.toResponse(debt),
      movement: {
        ...result.movement,
        amount: Number(result.movement.amount),
      },
      payment: this.toPaymentResponse(result.payment),
    };
  }

  private async getPendingBalance(debt: Debt): Promise<number> {
    const result = await this.prisma.debtPayment.aggregate({
      where: { debtId: debt.id },
      _sum: { principalPortion: true },
    });
    const principalPaid = Number(result._sum.principalPortion ?? 0);
    return Number(debt.principal) - principalPaid;
  }

  private async findDebtOrThrow(accountId: string, debtId: string) {
    const debt = await this.prisma.debt.findFirst({
      where: { id: debtId, accountId },
    });
    if (!debt) {
      throw new NotFoundException('Deuda no encontrada');
    }
    return debt;
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

  private round2(value: number): number {
    return Math.round(value * 100) / 100;
  }

  private async toResponse(debt: Debt) {
    const totals = await this.prisma.debtPayment.aggregate({
      where: { debtId: debt.id },
      _sum: { principalPortion: true, interestPortion: true },
    });
    const principal = Number(debt.principal);
    const principalPaid = Number(totals._sum.principalPortion ?? 0);
    const interestPaid = Number(totals._sum.interestPortion ?? 0);
    const pendingBalance = principal - principalPaid;

    return {
      ...debt,
      principal,
      interestRate: Number(debt.interestRate),
      principalPaid,
      interestPaid,
      pendingBalance,
      percentPaid: principal > 0 ? Math.min(principalPaid / principal, 1) : 0,
      /** Estimación simple (principal / plazo); no es una tabla de amortización real. */
      estimatedInstallment: this.round2(principal / debt.termMonths),
    };
  }

  private toPaymentResponse(payment: DebtPayment) {
    return {
      ...payment,
      amount: Number(payment.amount),
      principalPortion: Number(payment.principalPortion),
      interestPortion: Number(payment.interestPortion),
    };
  }
}
