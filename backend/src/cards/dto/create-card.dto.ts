import { CardType } from '@prisma/client';
import {
  IsIn,
  IsInt,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  IsUUID,
  Max,
  Min,
  MinLength,
} from 'class-validator';

export class CreateCardDto {
  @IsString()
  @MinLength(1)
  name: string;

  @IsIn(['DEBIT', 'CREDIT'])
  type: CardType;

  /** Requerido si type = DEBIT; no debe enviarse si type = CREDIT. */
  @IsOptional()
  @IsUUID()
  walletId?: string;

  /** Requerido si type = CREDIT. */
  @IsOptional()
  @IsNumber()
  @IsPositive()
  creditLimit?: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(31)
  cutoffDay?: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(31)
  paymentDueDay?: number;
}
