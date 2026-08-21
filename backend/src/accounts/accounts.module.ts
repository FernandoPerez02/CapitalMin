import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { AccountsController } from './accounts.controller';
import { AccountsService } from './accounts.service';
import { AccountMemberGuard } from './guards/account-member.guard';

@Module({
  imports: [AuthModule],
  controllers: [AccountsController],
  providers: [AccountsService, AccountMemberGuard],
  exports: [AccountMemberGuard, AccountsService],
})
export class AccountsModule {}
