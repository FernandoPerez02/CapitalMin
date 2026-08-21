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
import { CardsService } from './cards.service';
import { CreateCardDto } from './dto/create-card.dto';
import { UpdateCardDto } from './dto/update-card.dto';
import { PayCardDto } from './dto/pay-card.dto';

@UseGuards(JwtAuthGuard, AccountMemberGuard)
@Controller('accounts/:accountId/cards')
export class CardsController {
  constructor(private readonly cardsService: CardsService) {}

  @Get()
  list(@Param('accountId') accountId: string) {
    return this.cardsService.list(accountId);
  }

  @Get(':cardId')
  findOne(
    @Param('accountId') accountId: string,
    @Param('cardId') cardId: string,
  ) {
    return this.cardsService.findOne(accountId, cardId);
  }

  @Post()
  create(@Param('accountId') accountId: string, @Body() dto: CreateCardDto) {
    return this.cardsService.create(accountId, dto);
  }

  @Patch(':cardId')
  update(
    @Param('accountId') accountId: string,
    @Param('cardId') cardId: string,
    @Body() dto: UpdateCardDto,
  ) {
    return this.cardsService.update(accountId, cardId, dto);
  }

  @Delete(':cardId')
  @HttpCode(204)
  remove(
    @Param('accountId') accountId: string,
    @Param('cardId') cardId: string,
  ) {
    return this.cardsService.remove(accountId, cardId);
  }

  @Post(':cardId/pay')
  pay(
    @Param('accountId') accountId: string,
    @Param('cardId') cardId: string,
    @Body() dto: PayCardDto,
  ) {
    return this.cardsService.pay(accountId, cardId, dto);
  }
}
