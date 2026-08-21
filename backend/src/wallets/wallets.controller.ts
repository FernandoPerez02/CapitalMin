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
import { WalletsService } from './wallets.service';
import { CreateWalletDto } from './dto/create-wallet.dto';
import { UpdateWalletDto } from './dto/update-wallet.dto';

@UseGuards(JwtAuthGuard, AccountMemberGuard)
@Controller('accounts/:accountId/wallets')
export class WalletsController {
  constructor(private readonly walletsService: WalletsService) {}

  @Get()
  list(@Param('accountId') accountId: string) {
    return this.walletsService.list(accountId);
  }

  @Get(':walletId')
  findOne(
    @Param('accountId') accountId: string,
    @Param('walletId') walletId: string,
  ) {
    return this.walletsService.findOne(accountId, walletId);
  }

  @Post()
  create(@Param('accountId') accountId: string, @Body() dto: CreateWalletDto) {
    return this.walletsService.create(accountId, dto);
  }

  @Patch(':walletId')
  update(
    @Param('accountId') accountId: string,
    @Param('walletId') walletId: string,
    @Body() dto: UpdateWalletDto,
  ) {
    return this.walletsService.update(accountId, walletId, dto);
  }

  @Delete(':walletId')
  @HttpCode(204)
  remove(
    @Param('accountId') accountId: string,
    @Param('walletId') walletId: string,
  ) {
    return this.walletsService.remove(accountId, walletId);
  }
}
