import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import type { JwtPayload } from '../auth/types/jwt-payload.type';
import { AccountMemberGuard } from './guards/account-member.guard';
import { AccountsService } from './accounts.service';

@UseGuards(JwtAuthGuard)
@Controller('accounts')
export class AccountsController {
  constructor(private readonly accountsService: AccountsService) {}

  @Get()
  list(@CurrentUser() user: JwtPayload) {
    return this.accountsService.listForUser(user.sub);
  }

  @UseGuards(AccountMemberGuard)
  @Get(':accountId')
  findOne(@Param('accountId') accountId: string) {
    return this.accountsService.findOne(accountId);
  }

  @UseGuards(AccountMemberGuard)
  @Get(':accountId/members')
  listMembers(@Param('accountId') accountId: string) {
    return this.accountsService.listMembers(accountId);
  }
}
