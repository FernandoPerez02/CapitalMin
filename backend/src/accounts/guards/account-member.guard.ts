import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import type { Request } from 'express';
import { PrismaService } from '../../prisma/prisma.service';
import type { JwtPayload } from '../../auth/types/jwt-payload.type';
import type { AccountContext } from '../types/account-context.type';

@Injectable()
export class AccountMemberGuard implements CanActivate {
  constructor(private readonly prisma: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const accountId = request.params.accountId as string | undefined;
    if (!accountId) {
      throw new ForbiddenException('Ruta sin accountId');
    }

    const user = request['user'] as JwtPayload | undefined;
    if (!user) {
      throw new UnauthorizedException('Token no proporcionado');
    }

    const membership = await this.prisma.accountMember.findUnique({
      where: { accountId_userId: { accountId, userId: user.sub } },
    });

    if (!membership) {
      throw new ForbiddenException('No perteneces a esta cuenta');
    }

    request['accountContext'] = {
      accountId,
      role: membership.role,
    } satisfies AccountContext;
    return true;
  }
}
