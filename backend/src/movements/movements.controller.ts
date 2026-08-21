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
import { MovementsService } from './movements.service';
import { CreateMovementDto } from './dto/create-movement.dto';
import { UpdateMovementDto } from './dto/update-movement.dto';
import { ListMovementsQueryDto } from './dto/list-movements-query.dto';
import { CreateTransferDto } from './dto/create-transfer.dto';

@UseGuards(JwtAuthGuard, AccountMemberGuard)
@Controller('accounts/:accountId/movements')
export class MovementsController {
  constructor(private readonly movementsService: MovementsService) {}

  @Get()
  list(
    @Param('accountId') accountId: string,
    @Query() query: ListMovementsQueryDto,
  ) {
    return this.movementsService.list(accountId, query);
  }

  @Post()
  create(
    @Param('accountId') accountId: string,
    @Body() dto: CreateMovementDto,
  ) {
    return this.movementsService.create(accountId, dto);
  }

  @Post('transfer')
  transfer(
    @Param('accountId') accountId: string,
    @Body() dto: CreateTransferDto,
  ) {
    return this.movementsService.transfer(accountId, dto);
  }

  @Post(':movementId/reverse')
  reverse(
    @Param('accountId') accountId: string,
    @Param('movementId') movementId: string,
  ) {
    return this.movementsService.reverse(accountId, movementId);
  }

  @Patch(':movementId')
  update(
    @Param('accountId') accountId: string,
    @Param('movementId') movementId: string,
    @Body() dto: UpdateMovementDto,
  ) {
    return this.movementsService.update(accountId, movementId, dto);
  }

  @Delete(':movementId')
  @HttpCode(204)
  remove(
    @Param('accountId') accountId: string,
    @Param('movementId') movementId: string,
  ) {
    return this.movementsService.remove(accountId, movementId);
  }
}
