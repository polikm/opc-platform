import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  Index,
} from 'typeorm';

/**
 * 用户实体
 * 使用TypeORM风格定义，映射数据库中的users表
 */
@Entity('users')
export class User {
  @PrimaryGeneratedColumn({ type: 'bigint', comment: '用户ID' })
  id: number;

  @Column({ type: 'varchar', length: 50, unique: true, comment: '用户名' })
  @Index()
  username: string;

  @Column({ type: 'varchar', length: 100, unique: true, comment: '邮箱' })
  @Index()
  email: string;

  @Column({ type: 'varchar', length: 255, comment: '密码（加密存储）' })
  password: string;

  @Column({ type: 'varchar', length: 20, nullable: true, comment: '手机号' })
  phone: string | null;

  @Column({
    type: 'varchar',
    length: 500,
    nullable: true,
    comment: '头像URL',
  })
  avatar: string | null;

  @Column({
    type: 'varchar',
    length: 200,
    nullable: true,
    comment: '个人简介',
  })
  bio: string | null;

  @Column({
    type: 'enum',
    enum: ['admin', 'user', 'creator'],
    default: 'user',
    comment: '用户角色',
  })
  role: string;

  @Column({
    type: 'enum',
    enum: ['active', 'disabled', 'deleted'],
    default: 'active',
    comment: '账号状态',
  })
  status: string;

  @Column({
    type: 'varchar',
    length: 100,
    nullable: true,
    comment: '最后登录IP',
  })
  lastLoginIp: string | null;

  @Column({ type: 'timestamp', nullable: true, comment: '最后登录时间' })
  lastLoginAt: Date | null;

  @CreateDateColumn({ type: 'timestamp', comment: '创建时间' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', comment: '更新时间' })
  updatedAt: Date;

  @DeleteDateColumn({ type: 'timestamp', nullable: true, comment: '删除时间（软删除）' })
  deletedAt: Date | null;
}
