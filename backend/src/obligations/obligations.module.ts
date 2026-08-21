import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { AccountsModule } from '../accounts/accounts.module';
import { ObligationsController } from './obligations.controller';
import { ObligationsService } from './obligations.service';

@Module({
  imports: [AuthModule, AccountsModule],
  controllers: [ObligationsController],
  providers: [ObligationsService],
  exports: [ObligationsService],
})
export class ObligationsModule {}
