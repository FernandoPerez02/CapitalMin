import { MovementStatus, MovementType } from '@prisma/client';
import {
  IsDateString,
  IsEnum,
  IsIn,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  IsUUID,
  MinLength,
} from 'class-validator';

/** Transferencia se crea únicamente vía MovementsService.transfer(). */
export type DirectMovementType = Extract<MovementType, 'Ingreso' | 'Egreso'>;

export class CreateMovementDto {
  /** Requerido salvo para una compra con tarjeta de crédito (usar cardId). */
  @IsOptional()
  @IsUUID()
  walletId?: string;

  /** Compra con tarjeta: cardId sin walletId (tarjeta debe ser CREDIT). */
  @IsOptional()
  @IsUUID()
  cardId?: string;

  @IsDateString()
  date: string;

  @IsIn(['Ingreso', 'Egreso'])
  typeMovement: DirectMovementType;

  @IsString()
  @MinLength(1)
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
