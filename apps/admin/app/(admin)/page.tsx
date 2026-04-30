'use client';

import { Users, Bot, MessageSquare, DollarSign, Activity, Clock, Server, Wifi } from 'lucide-react';
import StatsCard from '@/components/admin/stats-card';
import UserGrowthChart from '@/components/admin/charts/user-growth-chart';
import ConversationChart from '@/components/admin/charts/conversation-chart';
import { cn, getStatusColor, getStatusLabel } from '@/lib/utils';
import Link from 'next/link';

/**
 * 最近注册用户模拟数据
 */
const recentUsers = [
  { id: '1', username: '张三', email: 'zhangsan@example.com', role: 'user', status: 'active', createdAt: '2024-04-14 15:30' },
  { id: '2', username: '李四', email: 'lisi@example.com', role: 'vip', status: 'active', createdAt: '2024-04-14 14:20' },
  { id: '3', username: '王五', email: 'wangwu@example.com', role: 'developer', status: 'active', createdAt: '2024-04-14 12:10' },
  { id: '4', username: '赵六', email: 'zhaoliu@example.com', role: 'user', status: 'pending', createdAt: '2024-04-14 10:45' },
  { id: '5', username: '钱七', email: 'qianqi@example.com', role: 'user', status: 'active', createdAt: '2024-04-14 09:30' },
];

/**
 * 系统状态模拟数据
 */
const systemStatus = [
  { label: 'API服务', status: 'running', latency: '23ms', icon: Server },
  { label: '数据库', status: 'running', latency: '5ms', icon: Activity },
  { label: '缓存服务', status: 'running', latency: '2ms', icon: Wifi },
  { label: '消息队列', status: 'running', latency: '8ms', icon: Clock },
];

/**
 * 管理后台首页/仪表盘
 * 展示核心数据概览、图表和系统状态
 */
export default function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* 页面标题 */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">仪表盘</h1>
        <p className="text-sm text-gray-500 mt-1">OPC智能体系统运营数据概览</p>
      </div>

      {/* 数据概览卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="用户总数"
          value="5,467"
          change={12.5}
          icon={Users}
          iconBgColor="bg-blue-50"
          iconColor="text-blue-600"
        />
        <StatsCard
          title="智能体总数"
          value="1,283"
          change={8.3}
          icon={Bot}
          iconBgColor="bg-purple-50"
          iconColor="text-purple-600"
        />
        <StatsCard
          title="今日对话量"
          value="2,050"
          change={-3.2}
          icon={MessageSquare}
          iconBgColor="bg-green-50"
          iconColor="text-green-600"
        />
        <StatsCard
          title="今日收入"
          value="¥12,580"
          change={15.8}
          icon={DollarSign}
          iconBgColor="bg-orange-50"
          iconColor="text-orange-600"
        />
      </div>

      {/* 图表区域 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <UserGrowthChart />
        <ConversationChart />
      </div>

      {/* 底部区域：最近用户 + 系统状态 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 最近注册用户 */}
        <div className="lg:col-span-2 admin-card">
          <div className="flex items-center justify-between p-4 border-b border-[var(--border)]">
            <div>
              <h3 className="text-base font-semibold text-gray-900">最近注册用户</h3>
              <p className="text-sm text-gray-500 mt-0.5">最近24小时新注册用户</p>
            </div>
            <Link
              href="/users"
              className="text-sm text-primary hover:text-primary-700 font-medium"
            >
              查看全部
            </Link>
          </div>
          <div className="divide-y divide-gray-100">
            {recentUsers.map((user) => (
              <div
                key={user.id}
                className="flex items-center justify-between px-4 py-3 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  {/* 头像 */}
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-blue-400 flex items-center justify-center text-white text-sm font-medium">
                    {user.username[0]}
                  </div>
                  {/* 用户信息 */}
                  <div>
                    <p className="text-sm font-medium text-gray-900">{user.username}</p>
                    <p className="text-xs text-gray-400">{user.email}</p>
                  </div>
                </div>
                {/* 右侧信息 */}
                <div className="flex items-center gap-4">
                  <span className={cn('admin-badge', getStatusColor(user.role))}>
                    {user.role === 'vip' ? 'VIP' : user.role === 'developer' ? '开发者' : '普通用户'}
                  </span>
                  <span className="text-xs text-gray-400 w-28 text-right">{user.createdAt}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 系统状态 */}
        <div className="admin-card">
          <div className="p-4 border-b border-[var(--border)]">
            <h3 className="text-base font-semibold text-gray-900">系统状态</h3>
            <p className="text-sm text-gray-500 mt-0.5">服务运行状态监控</p>
          </div>
          <div className="p-4 space-y-4">
            {systemStatus.map((service) => (
              <div
                key={service.label}
                className="flex items-center justify-between p-3 rounded-lg bg-gray-50"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center shadow-sm">
                    <service.icon className="w-4 h-4 text-gray-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{service.label}</p>
                    <p className="text-xs text-gray-400">延迟: {service.latency}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  <span className="text-xs font-medium text-green-600">运行中</span>
                </div>
              </div>
            ))}

            {/* 系统资源使用 */}
            <div className="pt-4 border-t border-gray-200 space-y-3">
              <div>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-gray-500">CPU使用率</span>
                  <span className="font-medium text-gray-700">32%</span>
                </div>
                <div className="w-full h-1.5 bg-gray-200 rounded-full">
                  <div className="h-full bg-green-500 rounded-full" style={{ width: '32%' }} />
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-gray-500">内存使用率</span>
                  <span className="font-medium text-gray-700">68%</span>
                </div>
                <div className="w-full h-1.5 bg-gray-200 rounded-full">
                  <div className="h-full bg-yellow-500 rounded-full" style={{ width: '68%' }} />
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-gray-500">磁盘使用率</span>
                  <span className="font-medium text-gray-700">45%</span>
                </div>
                <div className="w-full h-1.5 bg-gray-200 rounded-full">
                  <div className="h-full bg-blue-500 rounded-full" style={{ width: '45%' }} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
