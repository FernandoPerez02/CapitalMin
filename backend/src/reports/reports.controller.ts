import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AccountMemberGuard } from '../accounts/guards/account-member.guard';
import { ReportsService } from './reports.service';
import { RangeQueryDto } from './dto/range-query.dto';
import { ByMonthQueryDto } from './dto/by-month-query.dto';

const DEFAULT_RANGE = 'month';
const DEFAULT_MONTHS = 6;

@UseGuards(JwtAuthGuard, AccountMemberGuard)
@Controller('accounts/:accountId')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get('summary')
  summary(
    @Param('accountId') accountId: string,
    @Query() query: RangeQueryDto,
  ) {
    return this.reportsService.summary(accountId, query.range ?? DEFAULT_RANGE);
  }

  @Get('reports/by-category')
  byCategory(
    @Param('accountId') accountId: string,
    @Query() query: RangeQueryDto,
  ) {
    return this.reportsService.byCategory(
      accountId,
      query.range ?? DEFAULT_RANGE,
    );
  }

  @Get('reports/by-month')
  byMonth(
    @Param('accountId') accountId: string,
    @Query() query: ByMonthQueryDto,
  ) {
    return this.reportsService.byMonth(
      accountId,
      query.months ?? DEFAULT_MONTHS,
    );
  }
}
