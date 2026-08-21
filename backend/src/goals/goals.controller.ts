import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AccountMemberGuard } from '../accounts/guards/account-member.guard';
import { GoalsService } from './goals.service';
import { CreateGoalDto } from './dto/create-goal.dto';
import { CreateGoalContributionDto } from './dto/create-goal-contribution.dto';

@UseGuards(JwtAuthGuard, AccountMemberGuard)
@Controller('accounts/:accountId/goals')
export class GoalsController {
  constructor(private readonly goalsService: GoalsService) {}

  @Get()
  list(@Param('accountId') accountId: string) {
    return this.goalsService.list(accountId);
  }

  @Post()
  create(@Param('accountId') accountId: string, @Body() dto: CreateGoalDto) {
    return this.goalsService.create(accountId, dto);
  }

  @Get(':goalId/contributions')
  listContributions(
    @Param('accountId') accountId: string,
    @Param('goalId') goalId: string,
  ) {
    return this.goalsService.listContributions(accountId, goalId);
  }

  @Post(':goalId/contributions')
  addContribution(
    @Param('accountId') accountId: string,
    @Param('goalId') goalId: string,
    @Body() dto: CreateGoalContributionDto,
  ) {
    return this.goalsService.addContribution(accountId, goalId, dto);
  }
}
