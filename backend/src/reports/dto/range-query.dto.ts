import { IsIn, IsOptional } from 'class-validator';

export type ReportRange = 'day' | 'week' | 'month' | 'year';

export class RangeQueryDto {
  @IsOptional()
  @IsIn(['day', 'week', 'month', 'year'])
  range?: ReportRange;
}
