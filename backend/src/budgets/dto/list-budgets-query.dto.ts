import { MovementStatus } from '@prisma/client';
import { IsEnum, IsOptional, IsString, IsUUID } from 'class-validator';

export class ListBudgetsQueryDto {
  @IsOptional()
  @IsString()
  period?: string;

  @IsOptional()
  @IsEnum(MovementStatus)
  status?: MovementStatus;

  @IsOptional()
  @IsUUID()
  categoryId?: string;
}
