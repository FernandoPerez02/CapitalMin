import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AccountMemberGuard } from '../accounts/guards/account-member.guard';
import { ObligationsService } from './obligations.service';
import { CreateObligationDto } from './dto/create-obligation.dto';
import { UpdateObligationDto } from './dto/update-obligation.dto';
import { ListObligationsQueryDto } from './dto/list-obligations-query.dto';
import { PayObligationDto } from './dto/pay-obligation.dto';

@UseGuards(JwtAuthGuard, AccountMemberGuard)
@Controller('accounts/:accountId/obligations')
export class ObligationsController {
  constructor(private readonly obligationsService: ObligationsService) {}

  @Get()
  list(
    @Param('accountId') accountId: string,
    @Query() query: ListObligationsQueryDto,
  ) {
    return this.obligationsService.list(accountId, query);
  }

  @Post()
  create(
    @Param('accountId') accountId: string,
    @Body() dto: CreateObligationDto,
  ) {
    return this.obligationsService.create(accountId, dto);
  }

  @Patch(':obligationId')
  update(
    @Param('accountId') accountId: string,
    @Param('obligationId') obligationId: string,
    @Body() dto: UpdateObligationDto,
  ) {
    return this.obligationsService.update(accountId, obligationId, dto);
  }

  @Delete(':obligationId')
  @HttpCode(204)
  remove(
    @Param('accountId') accountId: string,
    @Param('obligationId') obligationId: string,
  ) {
    return this.obligationsService.remove(accountId, obligationId);
  }

  @Post(':obligationId/pay')
  pay(
    @Param('accountId') accountId: string,
    @Param('obligationId') obligationId: string,
    @Body() dto: PayObligationDto,
  ) {
    return this.obligationsService.pay(accountId, obligationId, dto);
  }
}
