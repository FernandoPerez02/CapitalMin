import { IsBoolean, IsOptional } from 'class-validator';

export class UpdateDebtDto {
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
