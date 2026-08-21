import {
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  Min,
  MinLength,
} from 'class-validator';

export class CreateGoalDto {
  @IsString()
  @MinLength(1)
  name: string;

  @IsString()
  @MinLength(1)
  emoji: string;

  @IsNumber()
  @IsPositive()
  targetAmount: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  monthlyContribution?: number;

  /** Si se envía, se registra como el primer aporte de la meta. */
  @IsOptional()
  @IsNumber()
  @Min(0)
  initialContribution?: number;
}
