import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AccountMemberGuard } from '../accounts/guards/account-member.guard';
import { DebtsService } from './debts.service';
import { CreateDebtDto } from './dto/create-debt.dto';
import { CreateDebtPaymentDto } from './dto/create-debt-payment.dto';
import { UpdateDebtDto } from './dto/update-debt.dto';

@UseGuards(JwtAuthGuard, AccountMemberGuard)
@Controller('accounts/:accountId/debts')
export class DebtsController {
  constructor(private readonly debtsService: DebtsService) {}

  @Get()
  list(@Param('accountId') accountId: string) {
    return this.debtsService.list(accountId);
  }

  @Post()
  create(@Param('accountId') accountId: string, @Body() dto: CreateDebtDto) {
    return this.debtsService.create(accountId, dto);
  }

  @Get(':debtId')
  findOne(
    @Param('accountId') accountId: string,
    @Param('debtId') debtId: string,
  ) {
    return this.debtsService.findOne(accountId, debtId);
  }

  @Patch(':debtId')
  update(
    @Param('accountId') accountId: string,
    @Param('debtId') debtId: string,
    @Body() dto: UpdateDebtDto,
  ) {
    return this.debtsService.update(accountId, debtId, dto);
  }

  @Delete(':debtId')
  @HttpCode(204)
  remove(
    @Param('accountId') accountId: string,
    @Param('debtId') debtId: string,
  ) {
    return this.debtsService.remove(accountId, debtId);
  }

  @Get(':debtId/payments')
  listPayments(
    @Param('accountId') accountId: string,
    @Param('debtId') debtId: string,
  ) {
    return this.debtsService.listPayments(accountId, debtId);
  }

  @Post(':debtId/payments')
  addPayment(
    @Param('accountId') accountId: string,
    @Param('debtId') debtId: string,
    @Body() dto: CreateDebtPaymentDto,
  ) {
    return this.debtsService.addPayment(accountId, debtId, dto);
  }
}
