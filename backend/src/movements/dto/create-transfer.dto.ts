import { MovementStatus } from '@prisma/client';
import {
  IsDateString,
  IsEnum,
  IsNumber,
  IsPositive,
  IsString,
  IsUUID,
  MinLength,
} from 'class-validator';

export class CreateTransferDto {
  @IsUUID()
  fromWalletId: string;

  @IsUUID()
  toWalletId: string;

  @IsDateString()
  date: string;

  @IsString()
  @MinLength(1)
  description: string;

  @IsNumber()
  @IsPositive()
  amount: number;

  @IsEnum(MovementStatus)
  status: MovementStatus;
}
