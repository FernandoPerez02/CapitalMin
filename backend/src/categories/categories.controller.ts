import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AccountMemberGuard } from '../accounts/guards/account-member.guard';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { ListCategoriesQueryDto } from './dto/list-categories-query.dto';

@UseGuards(JwtAuthGuard, AccountMemberGuard)
@Controller('accounts/:accountId/categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get()
  list(
    @Param('accountId') accountId: string,
    @Query() query: ListCategoriesQueryDto,
  ) {
    return this.categoriesService.list(accountId, query);
  }

  @Post()
  create(
    @Param('accountId') accountId: string,
    @Body() dto: CreateCategoryDto,
  ) {
    return this.categoriesService.create(accountId, dto);
  }
}
