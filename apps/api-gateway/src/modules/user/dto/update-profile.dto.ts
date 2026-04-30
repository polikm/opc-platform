import {
  IsOptional,
  IsString,
  MinLength,
  MaxLength,
  IsEmail,
} from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

/**
 * 更新用户资料DTO
 */
export class UpdateProfileDto {
  @ApiPropertyOptional({ description: '用户名', example: '张三', minLength: 2, maxLength: 20 })
  @IsOptional()
  @IsString()
  @MinLength(2, { message: '用户名长度不能少于2位' })
  @MaxLength(20, { message: '用户名长度不能超过20位' })
  username?: string;

  @ApiPropertyOptional({ description: '头像URL', example: 'https://example.com/avatar.jpg' })
  @IsOptional()
  @IsString()
  @MaxLength(500, { message: '头像URL长度不能超过500位' })
  avatar?: string;

  @ApiPropertyOptional({ description: '个人简介', example: '这是一段个人简介', maxLength: 200 })
  @IsOptional()
  @IsString()
  @MaxLength(200, { message: '个人简介长度不能超过200位' })
  bio?: string;

  @ApiPropertyOptional({ description: '手机号', example: '13800138000' })
  @IsOptional()
  @IsString()
  phone?: string;
}
