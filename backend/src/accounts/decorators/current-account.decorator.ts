import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import type { Request } from 'express';
import { AccountContext } from '../types/account-context.type';

export const CurrentAccount = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): AccountContext => {
    const request = ctx.switchToHttp().getRequest<Request>();
    return request['accountContext'] as AccountContext;
  },
);
