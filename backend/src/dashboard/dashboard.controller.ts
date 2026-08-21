import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AccountMemberGuard } from '../accounts/guards/account-member.guard';
import { DashboardService } from './dashboard.service';

@UseGuards(JwtAuthGuard, AccountMemberGuard)
@Controller('accounts/:accountId/dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get()
  get(@Param('accountId') accountId: string) {
    return this.dashboardService.get(accountId);
  }
}
