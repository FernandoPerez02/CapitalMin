import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { AccountsModule } from '../accounts/accounts.module';
import { NetWorthModule } from '../net-worth/net-worth.module';
import { ReportsModule } from '../reports/reports.module';
import { BudgetsModule } from '../budgets/budgets.module';
import { GoalsModule } from '../goals/goals.module';
import { ObligationsModule } from '../obligations/obligations.module';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';

@Module({
  imports: [
    AuthModule,
    AccountsModule,
    NetWorthModule,
    ReportsModule,
    BudgetsModule,
    GoalsModule,
    ObligationsModule,
  ],
  controllers: [DashboardController],
  providers: [DashboardService],
})
export class DashboardModule {}
