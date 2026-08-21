import {
  IsDateString,
  IsInt,
  IsNumber,
  IsPositive,
  IsString,
  Min,
  MinLength,
} from 'class-validator';

export class CreateDebtDto {
  @IsString()
  @MinLength(1)
  name: string;

  @IsNumber()
  @IsPositive()
  principal: number;

  /** Tasa de interés en porcentaje, ej. 1.5 = 1.5%. */
  @IsNumber()
  @Min(0)
  interestRate: number;

  @IsInt()
  @Min(1)
  termMonths: number;

  @IsDateString()
  startDate: string;
}
