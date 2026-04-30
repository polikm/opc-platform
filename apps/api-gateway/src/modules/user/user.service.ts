import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { UpdateProfileDto } from './dto/update-profile.dto';

/** 用户信息（不包含敏感字段） */
export interface UserProfile {
  id: number;
  username: string;
  email: string;
  phone: string | null;
  avatar: string | null;
  bio: string | null;
  role: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * 用户服务
 * 处理用户查询、资料更新等业务
 */
@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  /**
   * 根据ID查找用户
   */
  async findById(id: number): Promise<UserProfile> {
    const user = await this.userRepository.findOne({
      where: { id },
      select: [
        'id',
        'username',
        'email',
        'phone',
        'avatar',
        'bio',
        'role',
        'status',
        'createdAt',
        'updatedAt',
      ],
    });

    if (!user) {
      throw new NotFoundException('用户不存在');
    }

    return user;
  }

  /**
   * 根据邮箱查找用户
   */
  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOne({
      where: { email },
    });
  }

  /**
   * 更新用户资料
   */
  async updateProfile(
    userId: number,
    updateProfileDto: UpdateProfileDto,
  ): Promise<UserProfile> {
    const user = await this.userRepository.findOne({ where: { id: userId } });

    if (!user) {
      throw new NotFoundException('用户不存在');
    }

    // 检查用户名是否被其他用户占用
    if (updateProfileDto.username && updateProfileDto.username !== user.username) {
      const existingUser = await this.userRepository.findOne({
        where: { username: updateProfileDto.username },
      });
      if (existingUser) {
        throw new Error('该用户名已被使用');
      }
    }

    // 更新字段
    if (updateProfileDto.username !== undefined) {
      user.username = updateProfileDto.username;
    }
    if (updateProfileDto.avatar !== undefined) {
      user.avatar = updateProfileDto.avatar;
    }
    if (updateProfileDto.bio !== undefined) {
      user.bio = updateProfileDto.bio;
    }
    if (updateProfileDto.phone !== undefined) {
      user.phone = updateProfileDto.phone;
    }

    await this.userRepository.save(user);

    // 返回不包含密码的用户信息
    const { password: _password, ...profile } = user;
    return profile as UserProfile;
  }

  /**
   * 获取用户列表（分页）
   */
  async findAll(
    page: number = 1,
    pageSize: number = 10,
  ): Promise<{ items: UserProfile[]; total: number }> {
    const [users, total] = await this.userRepository.findAndCount({
      select: [
        'id',
        'username',
        'email',
        'phone',
        'avatar',
        'bio',
        'role',
        'status',
        'createdAt',
        'updatedAt',
      ],
      skip: (page - 1) * pageSize,
      take: pageSize,
      order: { createdAt: 'DESC' },
    });

    return {
      items: users as UserProfile[],
      total,
    };
  }

  /**
   * 删除用户（软删除）
   */
  async remove(userId: number): Promise<void> {
    const user = await this.userRepository.findOne({ where: { id: userId } });

    if (!user) {
      throw new NotFoundException('用户不存在');
    }

    user.status = 'deleted';
    await this.userRepository.softRemove(user);
  }
}
