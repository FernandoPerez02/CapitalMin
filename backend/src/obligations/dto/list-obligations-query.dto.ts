import { ObligationStatus } from '@prisma/client';
import { IsEnum, IsOptional } from 'class-validator';

export class ListObligationsQueryDto {
  @IsOptional()
  @IsEnum(ObligationStatus)
  status?: ObligationStatus;
}
