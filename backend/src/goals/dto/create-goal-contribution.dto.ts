import {
  IsDateString,
  IsNumber,
  IsOptional,
  IsPositive,
} from 'class-validator';

export class CreateGoalContributionDto {
  @IsNumber()
  @IsPositive()
  amount: number;

  @IsOptional()
  @IsDateString()
  date?: string;
}
