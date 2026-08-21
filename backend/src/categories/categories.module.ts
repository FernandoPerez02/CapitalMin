import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { AccountsModule } from '../accounts/accounts.module';
import { CategoriesController } from './categories.controller';
import { CategoriesService } from './categories.service';

@Module({
  imports: [AuthModule, AccountsModule],
  controllers: [CategoriesController],
  providers: [CategoriesService],
})
export class CategoriesModule {}
