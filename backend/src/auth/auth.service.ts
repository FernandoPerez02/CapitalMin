import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as argon2 from 'argon2';
import { createHash, randomBytes } from 'node:crypto';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { JwtPayload } from './types/jwt-payload.type';

const DURATION_MULTIPLIERS: Record<string, number> = {
  s: 1000,
  m: 60_000,
  h: 3_600_000,
  d: 86_400_000,
};

const DEFAULT_CATEGORIES = [
  'Vivienda',
  'Alimentación',
  'Transporte',
  'Ahorro',
  'Otros',
];

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async register(dto: RegisterDto) {
    const existing = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });
    if (existing) {
      throw new ConflictException('Ya existe una cuenta con este correo');
    }

    const passwordHash = await argon2.hash(dto.password, {
      type: argon2.argon2id,
    });

    const user = await this.prisma.$transaction(async (tx) => {
      const created = await tx.user.create({
        data: { email: dto.email, passwordHash, name: dto.name },
      });
      const account = await tx.account.create({
        data: { name: dto.accountName ?? `Cuenta de ${dto.name}` },
      });
      await tx.accountMember.create({
        data: { accountId: account.id, userId: created.id, role: 'OWNER' },
      });
      await tx.category.createMany({
        data: DEFAULT_CATEGORIES.map((name) => ({
          accountId: account.id,
          name,
        })),
      });
      await tx.wallet.create({
        data: { accountId: account.id, name: 'Efectivo', type: 'CASH' },
      });
      return created;
    });

    return this.issueTokens(user.id, user.email);
  }

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });
    if (!user || !(await argon2.verify(user.passwordHash, dto.password))) {
      throw new UnauthorizedException('Credenciales inválidas');
    }
    return this.issueTokens(user.id, user.email);
  }

  async refresh(refreshToken: string) {
    const tokenHash = this.hashToken(refreshToken);
    const stored = await this.prisma.refreshToken.findUnique({
      where: { tokenHash },
    });
    if (!stored || stored.expiresAt < new Date()) {
      throw new UnauthorizedException('Sesión expirada');
    }

    await this.prisma.refreshToken.delete({ where: { id: stored.id } });

    const user = await this.prisma.user.findUniqueOrThrow({
      where: { id: stored.userId },
    });
    return this.issueTokens(user.id, user.email);
  }

  async logout(refreshToken: string) {
    const tokenHash = this.hashToken(refreshToken);
    await this.prisma.refreshToken.deleteMany({ where: { tokenHash } });
  }

  async me(userId: string) {
    const user = await this.prisma.user.findUniqueOrThrow({
      where: { id: userId },
      include: { memberships: { include: { account: true } } },
    });

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      accounts: user.memberships.map((membership) => ({
        id: membership.accountId,
        name: membership.account.name,
        role: membership.role,
      })),
    };
  }

  private async issueTokens(userId: string, email: string) {
    const payload: JwtPayload = { sub: userId, email };
    const accessToken = await this.jwtService.signAsync(payload);

    const refreshToken = randomBytes(40).toString('hex');
    const tokenHash = this.hashToken(refreshToken);
    const refreshTtl = this.configService.get<string>(
      'JWT_REFRESH_EXPIRES_IN',
      '30d',
    );
    const expiresAt = new Date(Date.now() + this.parseDurationMs(refreshTtl));

    await this.prisma.refreshToken.create({
      data: { userId, tokenHash, expiresAt },
    });

    return { accessToken, refreshToken };
  }

  private hashToken(token: string): string {
    return createHash('sha256').update(token).digest('hex');
  }

  private parseDurationMs(input: string): number {
    const match = /^(\d+)(s|m|h|d)$/.exec(input);
    if (!match) {
      return DURATION_MULTIPLIERS.d * 30;
    }
    const [, value, unit] = match;
    return Number(value) * DURATION_MULTIPLIERS[unit];
  }
}
