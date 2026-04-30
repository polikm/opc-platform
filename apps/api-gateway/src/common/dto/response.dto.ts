import { ApiProperty } from '@nestjs/swagger';

/**
 * 统一响应DTO
 * 所有API响应都遵循此格式
 */
export class ResponseDto<T = unknown> {
  @ApiProperty({ description: '响应状态码，0表示成功', example: 0 })
  code: number;

  @ApiProperty({ description: '响应消息', example: 'success' })
  message: string;

  @ApiProperty({ description: '响应数据' })
  data: T;

  constructor(code: number, message: string, data: T) {
    this.code = code;
    this.message = message;
    this.data = data;
  }

  /** 创建成功响应 */
  static success<T>(data: T, message = 'success'): ResponseDto<T> {
    return new ResponseDto(0, message, data);
  }

  /** 创建失败响应 */
  static error<T = null>(
    code: number,
    message: string,
    data: T = null as T,
  ): ResponseDto<T> {
    return new ResponseDto(code, message, data);
  }
}

/**
 * 分页响应数据结构
 */
export class PaginatedResponseDto<T> {
  @ApiProperty({ description: '数据列表', type: [Object] })
  items: T[];

  @ApiProperty({ description: '总数量', example: 100 })
  total: number;

  @ApiProperty({ description: '当前页码', example: 1 })
  page: number;

  @ApiProperty({ description: '每页数量', example: 10 })
  pageSize: number;

  @ApiProperty({ description: '总页数', example: 10 })
  totalPages: number;

  constructor(items: T[], total: number, page: number, pageSize: number) {
    this.items = items;
    this.total = total;
    this.page = page;
    this.pageSize = pageSize;
    this.totalPages = Math.ceil(total / pageSize);
  }
}
