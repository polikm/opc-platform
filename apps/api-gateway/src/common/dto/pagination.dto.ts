import { IsOptional, IsInt, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';

/**
 * 分页查询DTO
 * 提供统一的分页参数验证
 */
export class PaginationDto {
  @ApiPropertyOptional({ description: '页码', default: 1, minimum: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page: number = 1;

  @ApiPropertyOptional({
    description: '每页数量',
    default: 10,
    minimum: 1,
    maximum: 100,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  pageSize: number = 10;

  /** 计算偏移量 */
  get offset(): number {
    return (this.page - 1) * this.pageSize;
  }

  /** 计算跳过数量（TypeORM风格） */
  get skip(): number {
    return this.offset;
  }

  /** 获取每页数量（TypeORM风格） */
  get take(): number {
    return this.pageSize;
  }
}
