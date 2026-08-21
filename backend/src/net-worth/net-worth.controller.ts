import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AccountMemberGuard } from '../accounts/guards/account-member.guard';
import { NetWorthService } from './net-worth.service';

@UseGuards(JwtAuthGuard, AccountMemberGuard)
@Controller('accounts/:accountId/net-worth')
export class NetWorthController {
  constructor(private readonly netWorthService: NetWorthService) {}

  @Get()
  calculate(@Param('accountId') accountId: string) {
    return this.netWorthService.calculate(accountId);
  }
}
