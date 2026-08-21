import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AccountMemberGuard } from '../accounts/guards/account-member.guard';
import { BudgetsService } from './budgets.service';
import { CreateBudgetDto } from './dto/create-budget.dto';
import { ListBudgetsQueryDto } from './dto/list-budgets-query.dto';

@UseGuards(JwtAuthGuard, AccountMemberGuard)
@Controller('accounts/:accountId/budgets')
export class BudgetsController {
  constructor(private readonly budgetsService: BudgetsService) {}

  @Get()
  list(
    @Param('accountId') accountId: string,
    @Query() query: ListBudgetsQueryDto,
  ) {
    return this.budgetsService.list(accountId, query);
  }

  @Post()
  create(@Param('accountId') accountId: string, @Body() dto: CreateBudgetDto) {
    return this.budgetsService.create(accountId, dto);
  }

  @Get(':budgetId/projection')
  getProjection(
    @Param('accountId') accountId: string,
    @Param('budgetId') budgetId: string,
  ) {
    return this.budgetsService.getProjection(accountId, budgetId);
  }

  @Delete(':budgetId')
  @HttpCode(204)
  remove(
    @Param('accountId') accountId: string,
    @Param('budgetId') budgetId: string,
  ) {
    return this.budgetsService.remove(accountId, budgetId);
  }
}
