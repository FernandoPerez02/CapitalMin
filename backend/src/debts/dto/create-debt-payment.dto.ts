import {
  IsDateString,
  IsNumber,
  IsOptional,
  IsPositive,
  IsUUID,
  Min,
} from 'class-validator';

export class CreateDebtPaymentDto {
  @IsUUID()
  walletId: string;

  @IsNumber()
  @IsPositive()
  amount: number;

  /** amount = principalPortion + interestPortion (se valida en el servicio). */
  @IsNumber()
  @Min(0)
  principalPortion: number;

  @IsNumber()
  @Min(0)
  interestPortion: number;

  @IsOptional()
  @IsDateString()
  date?: string;
}
