'use client';

import { cn, getStatusColor, getStatusLabel, getRoleLabel, formatNumber, formatCurrency } from '@/lib/utils';
import {
  ArrowLeft,
  Mail,
  Calendar,
  Bot,
  MessageSquare,
  Shield,
  Clock,
  Coins,
  FileText,
} from 'lucide-react';
import Link from 'next/link';
import { use } from 'react';

/**
 * 用户详情模拟数据
 */
const mockUserDetail = {
  id: '1',
  username: '张三',
  email: 'zhangsan@example.com',
  phone: '138****8888',
  avatar: '',
  role: 'user',
  status: 'active',
  bio: '热爱AI技术的开发者，专注于智能体应用开发。',
  createdAt: '2024-01-15 10:30:00',
  lastLoginAt: '2024-04-14 16:00:00',
  agentCount: 3,
  conversationCount: 128,
  tokenUsage: 256000,
  balance: 128.50,
};

/**
 * 用户智能体列表模拟数据
 */
const mockAgents = [
  { id: 'a1', name: '智能客服助手', status: 'published', conversationCount: 85, rating: 4.8 },
  { id: 'a2', name: '代码审查专家', status: 'published', conversationCount: 32, rating: 4.5 },
  { id: 'a3', name: '学习伙伴', status: 'draft', conversationCount: 11, rating: 4.2 },
];

/**
 * 对话记录模拟数据
 */
const mockConversations = [
  { id: 'c1', agentName: '智能客服助手', messageCount: 15, tokenUsage: 3200, createdAt: '2024-04-14 15:30' },
  { id: 'c2', agentName: '代码审查专家', messageCount: 8, tokenUsage: 1800, createdAt: '2024-04-14 14:20' },
  { id: 'c3', agentName: '智能客服助手', messageCount: 22, tokenUsage: 4500, createdAt: '2024-04-13 16:45' },
  { id: 'c4', agentName: '学习伙伴', messageCount: 5, tokenUsage: 900, createdAt: '2024-04-13 10:10' },
  { id: 'c5', agentName: '智能客服助手', messageCount: 18, tokenUsage: 3600, createdAt: '2024-04-12 20:30' },
];

/**
 * 操作日志模拟数据
 */
const mockLogs = [
  { id: 'l1', action: '创建智能体', detail: '创建了智能体「智能客服助手」', createdAt: '2024-04-14 15:00' },
  { id: 'l2', action: '充值', detail: '通过微信充值 ¥50.00', createdAt: '2024-04-13 12:00' },
  { id: 'l3', action: '修改资料', detail: '更新了个人简介', createdAt: '2024-04-12 09:30' },
  { id: 'l4', action: '创建智能体', detail: '创建了智能体「代码审查专家」', createdAt: '2024-04-10 14:20' },
  { id: 'l5', action: '注册', detail: '用户注册成功', createdAt: '2024-01-15 10:30' },
];

/**
 * 用户详情页
 * 展示用户的完整信息，包括基本信息、智能体、对话记录和操作日志
 */
export default function UserDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const user = mockUserDetail;

  return (
    <div className="space-y-6">
      {/* 返回导航 */}
      <div className="flex items-center gap-4">
        <Link
          href="/users"
          className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          返回用户列表
        </Link>
        <span className="text-gray-300">|</span>
        <span className="text-sm text-gray-500">用户ID: {id}</span>
      </div>

      {/* 用户基本信息卡片 */}
      <div className="admin-card">
        <div className="p-6">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-5">
              {/* 头像 */}
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary to-blue-400 flex items-center justify-center text-white text-2xl font-bold flex-shrink-0">
                {user.username[0]}
              </div>
              {/* 基本信息 */}
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <h1 className="text-xl font-bold text-gray-900">{user.username}</h1>
                  <span className={cn('admin-badge', getStatusColor(user.role))}>
                    {getRoleLabel(user.role)}
                  </span>
                  <span className={cn('admin-badge', getStatusColor(user.status))}>
                    {getStatusLabel(user.status)}
                  </span>
                </div>
                <p className="text-sm text-gray-500 mb-3">{user.bio}</p>
                <div className="flex items-center gap-4 text-sm text-gray-400">
                  <span className="flex items-center gap-1">
                    <Mail className="w-3.5 h-3.5" />
                    {user.email}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    注册于 {user.createdAt.split(' ')[0]}
                  </span>
                </div>
              </div>
            </div>

            {/* 操作按钮 */}
            <div className="flex items-center gap-2">
              {user.status !== 'banned' ? (
                <button className="admin-btn-danger flex items-center gap-2">
                  <Shield className="w-4 h-4" />
                  封禁用户
                </button>
              ) : (
                <button className="admin-btn-primary flex items-center gap-2">
                  <Shield className="w-4 h-4" />
                  解封用户
                </button>
              )}
            </div>
          </div>
        </div>

        {/* 统计数据 */}
        <div className="grid grid-cols-4 divide-x divide-gray-100 border-t border-gray-100">
          <div className="p-4 text-center">
            <div className="flex items-center justify-center gap-1.5 mb-1">
              <Bot className="w-4 h-4 text-gray-400" />
              <span className="text-xs text-gray-400">智能体</span>
            </div>
            <p className="text-lg font-bold text-gray-900">{user.agentCount}</p>
          </div>
          <div className="p-4 text-center">
            <div className="flex items-center justify-center gap-1.5 mb-1">
              <MessageSquare className="w-4 h-4 text-gray-400" />
              <span className="text-xs text-gray-400">对话量</span>
            </div>
            <p className="text-lg font-bold text-gray-900">{formatNumber(user.conversationCount)}</p>
          </div>
          <div className="p-4 text-center">
            <div className="flex items-center justify-center gap-1.5 mb-1">
              <Coins className="w-4 h-4 text-gray-400" />
              <span className="text-xs text-gray-400">Token消耗</span>
            </div>
            <p className="text-lg font-bold text-gray-900">{formatNumber(user.tokenUsage)}</p>
          </div>
          <div className="p-4 text-center">
            <div className="flex items-center justify-center gap-1.5 mb-1">
              <Coins className="w-4 h-4 text-gray-400" />
              <span className="text-xs text-gray-400">账户余额</span>
            </div>
            <p className="text-lg font-bold text-gray-900">{formatCurrency(user.balance)}</p>
          </div>
        </div>
      </div>

      {/* OPC档案信息 */}
      <div className="admin-card p-6">
        <h2 className="text-base font-semibold text-gray-900 mb-4">OPC档案信息</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-3 rounded-lg bg-gray-50">
            <p className="text-xs text-gray-400 mb-1">OPC等级</p>
            <p className="text-sm font-medium text-gray-900">Lv.5 创作者</p>
          </div>
          <div className="p-3 rounded-lg bg-gray-50">
            <p className="text-xs text-gray-400 mb-1">OPC积分</p>
            <p className="text-sm font-medium text-gray-900">2,580</p>
          </div>
          <div className="p-3 rounded-lg bg-gray-50">
            <p className="text-xs text-gray-400 mb-1">创建智能体数</p>
            <p className="text-sm font-medium text-gray-900">{user.agentCount}</p>
          </div>
          <div className="p-3 rounded-lg bg-gray-50">
            <p className="text-xs text-gray-400 mb-1">获得评价数</p>
            <p className="text-sm font-medium text-gray-900">86</p>
          </div>
        </div>
      </div>

      {/* 智能体列表 */}
      <div className="admin-card">
        <div className="p-4 border-b border-gray-100">
          <h2 className="text-base font-semibold text-gray-900">智能体列表</h2>
        </div>
        <div className="divide-y divide-gray-100">
          {mockAgents.map((agent) => (
            <div key={agent.id} className="flex items-center justify-between px-4 py-3 hover:bg-gray-50 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center">
                  <Bot className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">{agent.name}</p>
                  <p className="text-xs text-gray-400">对话量: {agent.conversationCount} | 评分: {agent.rating}</p>
                </div>
              </div>
              <span className={cn('admin-badge', getStatusColor(agent.status))}>
                {getStatusLabel(agent.status)}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* 对话记录 */}
      <div className="admin-card">
        <div className="p-4 border-b border-gray-100">
          <h2 className="text-base font-semibold text-gray-900">最近对话记录</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-4 py-3 text-xs font-semibold text-gray-500 text-left">智能体</th>
                <th className="px-4 py-3 text-xs font-semibold text-gray-500 text-center">消息数</th>
                <th className="px-4 py-3 text-xs font-semibold text-gray-500 text-center">Token消耗</th>
                <th className="px-4 py-3 text-xs font-semibold text-gray-500 text-right">时间</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {mockConversations.map((conv) => (
                <tr key={conv.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 text-sm text-gray-700">{conv.agentName}</td>
                  <td className="px-4 py-3 text-sm text-gray-700 text-center">{conv.messageCount}</td>
                  <td className="px-4 py-3 text-sm text-gray-700 text-center">{formatNumber(conv.tokenUsage)}</td>
                  <td className="px-4 py-3 text-sm text-gray-400 text-right">{conv.createdAt}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 操作日志 */}
      <div className="admin-card">
        <div className="p-4 border-b border-gray-100">
          <h2 className="text-base font-semibold text-gray-900">操作日志</h2>
        </div>
        <div className="divide-y divide-gray-100">
          {mockLogs.map((log) => (
            <div key={log.id} className="flex items-start gap-3 px-4 py-3">
              <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Clock className="w-4 h-4 text-gray-400" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-gray-900">{log.action}</p>
                  <span className="text-xs text-gray-400">{log.createdAt}</span>
                </div>
                <p className="text-sm text-gray-500 mt-0.5">{log.detail}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
