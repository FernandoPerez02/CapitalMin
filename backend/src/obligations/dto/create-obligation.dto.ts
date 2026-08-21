import {
  IsDateString,
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
import type { DirectMovementType } from '../../movements/dto/create-movement.dto';

export class CreateObligationDto {
  @IsString()
  @MinLength(1)
  name: string;

  @IsNumber()
  @IsPositive()
  amount: number;

  @IsIn(['Ingreso', 'Egreso'])
  typeMovement: DirectMovementType;

  @IsOptional()
  @IsUUID()
  categoryId?: string;

  /** Presente = obligación recurrente; dueDate se calcula automáticamente. */
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(31)
  recurrenceDayOfMonth?: number;

  /** Requerido si la obligación no es recurrente (puntual). */
  @IsOptional()
  @IsDateString()
  dueDate?: string;
}
