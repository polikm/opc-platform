import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MinLength,
  MaxLength,
  IsOptional,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

/**
 * 用户注册DTO
 */
export class RegisterDto {
  @ApiProperty({ description: '用户名', example: '张三', minLength: 2, maxLength: 20 })
  @IsNotEmpty({ message: '用户名不能为空' })
  @IsString()
  @MinLength(2, { message: '用户名长度不能少于2位' })
  @MaxLength(20, { message: '用户名长度不能超过20位' })
  username: string;

  @ApiProperty({ description: '邮箱地址', example: 'user@example.com' })
  @IsNotEmpty({ message: '邮箱不能为空' })
  @IsEmail({}, { message: '邮箱格式不正确' })
  email: string;

  @ApiProperty({ description: '密码', example: '123456', minLength: 6 })
  @IsNotEmpty({ message: '密码不能为空' })
  @IsString()
  @MinLength(6, { message: '密码长度不能少于6位' })
  password: string;

  @ApiPropertyOptional({ description: '确认密码', example: '123456' })
  @IsOptional()
  @IsString()
  @MinLength(6, { message: '确认密码长度不能少于6位' })
  confirmPassword?: string;

  @ApiPropertyOptional({ description: '手机号', example: '13800138000' })
  @IsOptional()
  @IsString()
  phone?: string;
}
