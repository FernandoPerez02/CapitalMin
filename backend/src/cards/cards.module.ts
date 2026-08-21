import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { AccountsModule } from '../accounts/accounts.module';
import { WalletsModule } from '../wallets/wallets.module';
import { CardsController } from './cards.controller';
import { CardsService } from './cards.service';

@Module({
  imports: [AuthModule, AccountsModule, WalletsModule],
  controllers: [CardsController],
  providers: [CardsService],
  exports: [CardsService],
})
export class CardsModule {}
