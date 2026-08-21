import { MovementStatus } from '@prisma/client';
import {
  IsDateString,
  IsEnum,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  IsUUID,
} from 'class-validator';

export class CreateBudgetDto {
  @IsDateString()
  date: string;

  @IsString()
  period: string;

  @IsString()
  description: string;

  @IsNumber()
  @IsPositive()
  amount: number;

  @IsEnum(MovementStatus)
  status: MovementStatus;

  @IsOptional()
  @IsUUID()
  categoryId?: string;
}
