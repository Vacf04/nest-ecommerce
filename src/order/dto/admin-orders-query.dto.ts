import { Type } from 'class-transformer';
import { IsOptional, IsString, IsInt, Min } from 'class-validator';
import { Status } from '../entities/order.entity';

export class AdminOrdersQueryDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit: number = 10;

  @IsOptional()
  @IsString()
  status: Status = Status.PENDING;
}
