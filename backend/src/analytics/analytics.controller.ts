import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AccountMemberGuard } from '../accounts/guards/account-member.guard';
import { AnalyticsService } from './analytics.service';
import { CategoryTrendsQueryDto } from './dto/category-trends-query.dto';

@UseGuards(JwtAuthGuard, AccountMemberGuard)
@Controller('accounts/:accountId/analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('category-trends')
  categoryTrends(
    @Param('accountId') accountId: string,
    @Query() query: CategoryTrendsQueryDto,
  ) {
    return this.analyticsService.categoryTrends(accountId, query.months);
  }
}
