import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * 合并Tailwind CSS类名
 * 结合clsx和tailwind-merge，避免类名冲突
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * 格式化数字（千分位）
 */
export function formatNumber(num: number): string {
  return new Intl.NumberFormat('zh-CN').format(num);
}

/**
 * 格式化金额（人民币）
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('zh-CN', {
    style: 'currency',
    currency: 'CNY',
    minimumFractionDigits: 2,
  }).format(amount);
}

/**
 * 格式化百分比
 */
export function formatPercent(value: number, total: number): string {
  if (total === 0) return '0%';
  return `${((value / total) * 100).toFixed(1)}%`;
}

/**
 * 截断文本
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
}

/**
 * 生成随机ID
 */
export function generateId(): string {
  return Math.random().toString(36).substring(2, 15);
}

/**
 * 延迟函数（用于模拟加载）
 */
export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * 获取状态颜色
 */
export function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    active: 'text-green-600 bg-green-100',
    inactive: 'text-gray-600 bg-gray-100',
    pending: 'text-yellow-600 bg-yellow-100',
    banned: 'text-red-600 bg-red-100',
    published: 'text-green-600 bg-green-100',
    draft: 'text-gray-600 bg-gray-100',
    reviewing: 'text-blue-600 bg-blue-100',
    rejected: 'text-red-600 bg-red-100',
  };
  return colors[status] || 'text-gray-600 bg-gray-100';
}

/**
 * 获取状态中文标签
 */
export function getStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    active: '活跃',
    inactive: '未激活',
    pending: '待审核',
    banned: '已封禁',
    published: '已发布',
    draft: '草稿',
    reviewing: '审核中',
    rejected: '已拒绝',
  };
  return labels[status] || status;
}

/**
 * 获取角色中文标签
 */
export function getRoleLabel(role: string): string {
  const labels: Record<string, string> = {
    admin: '管理员',
    user: '普通用户',
    vip: 'VIP用户',
    developer: '开发者',
  };
  return labels[role] || role;
}
