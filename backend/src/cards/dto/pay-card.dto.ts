import {
  IsDateString,
  IsNumber,
  IsOptional,
  IsPositive,
  IsUUID,
} from 'class-validator';

export class PayCardDto {
  @IsUUID()
  walletId: string;

  @IsNumber()
  @IsPositive()
  amount: number;

  @IsOptional()
  @IsDateString()
  date?: string;
}
