'use client';

import { cn } from '@/lib/utils';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { LucideIcon } from 'lucide-react';

/**
 * 统计卡片组件属性
 */
interface StatsCardProps {
  /** 卡片标题 */
  title: string;
  /** 主要数值 */
  value: string | number;
  /** 增长率（百分比） */
  change?: number;
  /** 图标 */
  icon: LucideIcon;
  /** 图标背景色 */
  iconBgColor?: string;
  /** 图标颜色 */
  iconColor?: string;
  /** 附加描述 */
  description?: string;
  /** 自定义类名 */
  className?: string;
}

/**
 * 统计卡片组件
 * 用于仪表盘展示核心指标数据
 */
export default function StatsCard({
  title,
  value,
  change,
  icon: Icon,
  iconBgColor = 'bg-primary-50',
  iconColor = 'text-primary-600',
  description,
  className,
}: StatsCardProps) {
  const isPositive = change !== undefined && change >= 0;
  const isNegative = change !== undefined && change < 0;

  return (
    <div className={cn('admin-card p-6', className)}>
      <div className="flex items-start justify-between">
        {/* 左侧：标题和数值 */}
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>

          {/* 增长率 */}
          {change !== undefined && (
            <div className="flex items-center gap-1 mt-2">
              {isPositive && (
                <span className="inline-flex items-center text-xs font-medium text-green-600">
                  <TrendingUp className="w-3.5 h-3.5 mr-0.5" />
                  +{change}%
                </span>
              )}
              {isNegative && (
                <span className="inline-flex items-center text-xs font-medium text-red-600">
                  <TrendingDown className="w-3.5 h-3.5 mr-0.5" />
                  {change}%
                </span>
              )}
              <span className="text-xs text-gray-400">较昨日</span>
            </div>
          )}

          {/* 附加描述 */}
          {description && (
            <p className="text-xs text-gray-400 mt-1">{description}</p>
          )}
        </div>

        {/* 右侧：图标 */}
        <div className={cn('w-12 h-12 rounded-xl flex items-center justify-center', iconBgColor)}>
          <Icon className={cn('w-6 h-6', iconColor)} />
        </div>
      </div>
    </div>
  );
}
