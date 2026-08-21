import { Injectable, NotFoundException } from '@nestjs/common';
import { Goal, GoalContribution } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateGoalDto } from './dto/create-goal.dto';
import { CreateGoalContributionDto } from './dto/create-goal-contribution.dto';

@Injectable()
export class GoalsService {
  constructor(private readonly prisma: PrismaService) {}

  async list(accountId: string) {
    const goals = await this.prisma.goal.findMany({
      where: { accountId },
      orderBy: { createdAt: 'asc' },
    });
    return Promise.all(goals.map((goal) => this.toResponse(goal)));
  }

  async create(accountId: string, dto: CreateGoalDto) {
    const goal = await this.prisma.$transaction(async (tx) => {
      const created = await tx.goal.create({
        data: {
          accountId,
          name: dto.name,
          emoji: dto.emoji,
          targetAmount: dto.targetAmount,
          monthlyContribution: dto.monthlyContribution ?? 0,
        },
      });
      if (dto.initialContribution) {
        await tx.goalContribution.create({
          data: {
            goalId: created.id,
            amount: dto.initialContribution,
            date: new Date(),
          },
        });
      }
      return created;
    });

    return this.toResponse(goal);
  }

  async listContributions(accountId: string, goalId: string) {
    await this.findGoalOrThrow(accountId, goalId);
    const contributions = await this.prisma.goalContribution.findMany({
      where: { goalId },
      orderBy: { date: 'asc' },
    });
    return contributions.map((c) => this.toContributionResponse(c));
  }

  async addContribution(
    accountId: string,
    goalId: string,
    dto: CreateGoalContributionDto,
  ) {
    await this.findGoalOrThrow(accountId, goalId);

    const contribution = await this.prisma.goalContribution.create({
      data: {
        goalId,
        amount: dto.amount,
        date: dto.date ? new Date(dto.date) : new Date(),
      },
    });

    return this.toContributionResponse(contribution);
  }

  private async findGoalOrThrow(accountId: string, goalId: string) {
    const goal = await this.prisma.goal.findFirst({
      where: { id: goalId, accountId },
    });
    if (!goal) {
      throw new NotFoundException('Meta no encontrada');
    }
    return goal;
  }

  private async getCurrentAmount(goalId: string): Promise<number> {
    const result = await this.prisma.goalContribution.aggregate({
      where: { goalId },
      _sum: { amount: true },
    });
    return Number(result._sum.amount ?? 0);
  }

  private async toResponse(goal: Goal) {
    const currentAmount = await this.getCurrentAmount(goal.id);
    const targetAmount = Number(goal.targetAmount);
    return {
      ...goal,
      targetAmount,
      monthlyContribution: Number(goal.monthlyContribution),
      currentAmount,
      progress:
        targetAmount > 0 ? Math.min(currentAmount / targetAmount, 1) : 0,
    };
  }

  private toContributionResponse(contribution: GoalContribution) {
    return {
      ...contribution,
      amount: Number(contribution.amount),
      date: contribution.date.toISOString().slice(0, 10),
    };
  }
}
