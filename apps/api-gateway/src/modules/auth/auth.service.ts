import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { User } from '../user/entities/user.entity';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { JwtPayload } from './strategies/jwt.strategy';

/** 登录返回结果 */
export interface LoginResult {
  accessToken: string;
  user: {
    id: number;
    username: string;
    email: string;
    role: string;
    avatar: string | null;
  };
}

/**
 * 认证服务
 * 处理用户登录、注册、令牌生成等认证相关业务
 */
@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  /**
   * 用户注册
   */
  async register(registerDto: RegisterDto): Promise<LoginResult> {
    // 检查邮箱是否已注册
    const existingUser = await this.userRepository.findOne({
      where: { email: registerDto.email },
    });
    if (existingUser) {
      throw new Error('该邮箱已被注册');
    }

    // 检查用户名是否已存在
    const existingUsername = await this.userRepository.findOne({
      where: { username: registerDto.username },
    });
    if (existingUsername) {
      throw new Error('该用户名已被使用');
    }

    // 密码加密
    const hashedPassword = await bcrypt.hash(registerDto.password, 10);

    // 创建用户
    const user = this.userRepository.create({
      username: registerDto.username,
      email: registerDto.email,
      password: hashedPassword,
      phone: registerDto.phone || null,
    });

    await this.userRepository.save(user);

    // 生成JWT令牌
    const accessToken = this.generateToken(user);

    return {
      accessToken,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
      },
    };
  }

  /**
   * 用户登录
   */
  async login(loginDto: LoginDto): Promise<LoginResult> {
    // 查找用户
    const user = await this.userRepository.findOne({
      where: { email: loginDto.email },
    });

    if (!user) {
      throw new Error('邮箱或密码错误');
    }

    // 验证密码
    const isPasswordValid = await bcrypt.compare(
      loginDto.password,
      user.password,
    );
    if (!isPasswordValid) {
      throw new Error('邮箱或密码错误');
    }

    // 检查用户是否被禁用
    if (user.status === 'disabled') {
      throw new Error('账号已被禁用，请联系管理员');
    }

    // 生成JWT令牌
    const accessToken = this.generateToken(user);

    return {
      accessToken,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
      },
    };
  }

  /**
   * 生成JWT令牌
   */
  private generateToken(user: User): string {
    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      role: user.role,
      username: user.username,
    };

    return this.jwtService.sign(payload, {
      expiresIn: this.configService.get<string>('JWT_EXPIRES_IN', '7d'),
    });
  }

  /**
   * 验证用户（用于JWT策略）
   */
  async validateUser(userId: number): Promise<User | null> {
    return this.userRepository.findOne({
      where: { id: userId },
      select: ['id', 'username', 'email', 'role', 'avatar', 'status'],
    });
  }
}
