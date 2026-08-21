import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AccountsService {
  constructor(private readonly prisma: PrismaService) {}

  async listForUser(userId: string) {
    const memberships = await this.prisma.accountMember.findMany({
      where: { userId },
      include: { account: true },
      orderBy: { joinedAt: 'asc' },
    });

    return memberships.map((membership) => ({
      id: membership.accountId,
      name: membership.account.name,
      currency: membership.account.currency,
      role: membership.role,
    }));
  }

  async findOne(accountId: string) {
    const account = await this.prisma.account.findUnique({
      where: { id: accountId },
    });
    if (!account) {
      throw new NotFoundException('Cuenta no encontrada');
    }
    return account;
  }

  async listMembers(accountId: string) {
    const members = await this.prisma.accountMember.findMany({
      where: { accountId },
      include: { user: true },
      orderBy: { joinedAt: 'asc' },
    });

    return members.map((member) => ({
      userId: member.userId,
      name: member.user.name,
      email: member.user.email,
      role: member.role,
      joinedAt: member.joinedAt,
    }));
  }
}
