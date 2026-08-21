import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { AccountsModule } from '../accounts/accounts.module';
import { WalletsModule } from '../wallets/wallets.module';
import { CardsModule } from '../cards/cards.module';
import { DebtsModule } from '../debts/debts.module';
import { NetWorthController } from './net-worth.controller';
import { NetWorthService } from './net-worth.service';

@Module({
  imports: [
    AuthModule,
    AccountsModule,
    WalletsModule,
    CardsModule,
    DebtsModule,
  ],
  controllers: [NetWorthController],
  providers: [NetWorthService],
  exports: [NetWorthService],
})
export class NetWorthModule {}
