import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';

/** JWT载荷接口 */
export interface JwtPayload {
  sub: number;
  email: string;
  role: string;
  username: string;
}

/**
 * JWT策略
 * 从请求头中提取并验证JWT令牌
 */
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET', 'default-secret-key'),
    });
  }

  /**
   * 验证JWT载荷，返回用户信息
   * 此返回值会被挂载到 request.user 上
   */
  async validate(payload: JwtPayload): Promise<JwtPayload> {
    if (!payload.sub) {
      throw new UnauthorizedException('无效的令牌');
    }

    return {
      sub: payload.sub,
      email: payload.email,
      role: payload.role,
      username: payload.username,
    };
  }
}
