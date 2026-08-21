import { IsDateString, IsOptional, IsUUID } from 'class-validator';

export class PayObligationDto {
  @IsUUID()
  walletId: string;

  @IsOptional()
  @IsDateString()
  paidAt?: string;
}
