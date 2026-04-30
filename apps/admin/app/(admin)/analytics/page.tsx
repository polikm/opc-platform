'use client';

import { useState } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import StatsCard from '@/components/admin/stats-card';
import { cn, formatNumber, formatCurrency } from '@/lib/utils';
import {
  Users,
  MessageSquare,
  DollarSign,
  Bot,
  TrendingUp,
  Calendar,
  Download,
} from 'lucide-react';

/**
 * 核心指标模拟数据
 */
const overviewData = {
  totalUsers: 5467,
  totalAgents: 1283,
  totalConversations: 28450,
  totalRevenue: 156800,
  userGrowthRate: 12.5,
  agentGrowthRate: 8.3,
  conversationGrowthRate: 15.2,
  revenueGrowthRate: 22.1,
};

/**
 * 用户活跃度模拟数据
 */
const userActivityData = [
  { date: '04-08', DAU: 1200, WAU: 2800, MAU: 4200 },
  { date: '04-09', DAU: 1350, WAU: 2900, MAU: 4300 },
  { date: '04-10', DAU: 1280, WAU: 2950, MAU: 4350 },
  { date: '04-11', DAU: 1420, WAU: 3050, MAU: 4400 },
  { date: '04-12', DAU: 1560, WAU: 3100, MAU: 4480 },
  { date: '04-13', DAU: 1380, WAU: 3150, MAU: 4520 },
  { date: '04-14', DAU: 1620, WAU: 3200, MAU: 4580 },
];

/**
 * 智能体使用排行模拟数据
 */
const agentRankingData = [
  { name: '智能客服助手', conversations: 8520, tokens: 1280000, color: '#2563EB' },
  { name: '代码审查专家', conversations: 6230, tokens: 980000, color: '#7C3AED' },
  { name: '创意写作助手', conversations: 4560, tokens: 720000, color: '#EC4899' },
  { name: '心理咨询师', conversations: 3210, tokens: 510000, color: '#F59E0B' },
  { name: '健身教练', conversations: 2180, tokens: 340000, color: '#22C55E' },
  { name: '法律顾问', conversations: 1890, tokens: 290000, color: '#06B6D4' },
];

/**
 * 收入统计模拟数据
 */
const revenueData = [
  { date: '04-08', tokenRevenue: 8500, subscriptionRevenue: 3200, total: 11700 },
  { date: '04-09', tokenRevenue: 9200, subscriptionRevenue: 3500, total: 12700 },
  { date: '04-10', tokenRevenue: 8800, subscriptionRevenue: 3100, total: 11900 },
  { date: '04-11', tokenRevenue: 10500, subscriptionRevenue: 3800, total: 14300 },
  { date: '04-12', tokenRevenue: 11200, subscriptionRevenue: 4000, total: 15200 },
  { date: '04-13', tokenRevenue: 9800, subscriptionRevenue: 3600, total: 13400 },
  { date: '04-14', tokenRevenue: 12580, subscriptionRevenue: 4200, total: 16780 },
];

/**
 * 收入来源分布数据
 */
const revenueDistributionData = [
  { name: 'Token消费', value: 65, color: '#2563EB' },
  { name: '订阅收入', value: 25, color: '#22C55E' },
  { name: '增值服务', value: 10, color: '#F59E0B' },
];

/**
 * 自定义Tooltip
 */
function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload || !payload.length) return null;
  return (
    <div className="bg-white rounded-lg shadow-lg border border-gray-100 p-3">
      <p className="text-sm font-medium text-gray-600 mb-2">{label}</p>
      {payload.map((entry: any, index: number) => (
        <div key={index} className="flex items-center gap-2 text-sm">
          <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: entry.color }} />
          <span className="text-gray-500">{entry.name}:</span>
          <span className="font-medium text-gray-900">
            {typeof entry.value === 'number' && entry.value > 10000
              ? `¥${(entry.value / 10000).toFixed(1)}万`
              : entry.value.toLocaleString()}
          </span>
        </div>
      ))}
    </div>
  );
}

/**
 * 数据分析页面
 * 提供日期范围选择、核心指标、用户活跃度、智能体排行和收入统计
 */
export default function AnalyticsPage() {
  const [dateRange, setDateRange] = useState('7d');

  return (
    <div className="space-y-6">
      {/* 页面标题和工具栏 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">数据分析</h1>
          <p className="text-sm text-gray-500 mt-1">平台运营数据分析和趋势洞察</p>
        </div>
        <div className="flex items-center gap-3">
          {/* 日期范围选择 */}
          <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
            {[
              { value: '24h', label: '24小时' },
              { value: '7d', label: '7天' },
              { value: '30d', label: '30天' },
              { value: '90d', label: '90天' },
            ].map((item) => (
              <button
                key={item.value}
                onClick={() => setDateRange(item.value)}
                className={cn(
                  'px-3 py-1.5 rounded-md text-xs font-medium transition-colors',
                  dateRange === item.value
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-500 hover:text-gray-700'
                )}
              >
                {item.label}
              </button>
            ))}
          </div>
          <button className="admin-btn-primary flex items-center gap-2">
            <Download className="w-4 h-4" />
            导出报告
          </button>
        </div>
      </div>

      {/* 核心指标卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="用户总数"
          value={formatNumber(overviewData.totalUsers)}
          change={overviewData.userGrowthRate}
          icon={Users}
          iconBgColor="bg-blue-50"
          iconColor="text-blue-600"
        />
        <StatsCard
          title="智能体总数"
          value={formatNumber(overviewData.totalAgents)}
          change={overviewData.agentGrowthRate}
          icon={Bot}
          iconBgColor="bg-purple-50"
          iconColor="text-purple-600"
        />
        <StatsCard
          title="对话总量"
          value={formatNumber(overviewData.totalConversations)}
          change={overviewData.conversationGrowthRate}
          icon={MessageSquare}
          iconBgColor="bg-green-50"
          iconColor="text-green-600"
        />
        <StatsCard
          title="总收入"
          value={formatCurrency(overviewData.totalRevenue)}
          change={overviewData.revenueGrowthRate}
          icon={DollarSign}
          iconBgColor="bg-orange-50"
          iconColor="text-orange-600"
        />
      </div>

      {/* 图表区域 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 用户活跃度图表 */}
        <div className="admin-card p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-base font-semibold text-gray-900">用户活跃度</h3>
              <p className="text-sm text-gray-500 mt-0.5">DAU/WAU/MAU趋势</p>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-full bg-blue-500" />
                <span className="text-gray-500">DAU</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-full bg-purple-500" />
                <span className="text-gray-500">WAU</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-full bg-green-500" />
                <span className="text-gray-500">MAU</span>
              </div>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={userActivityData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
              <defs>
                <linearGradient id="colorDAU" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.1} />
                  <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
              <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94A3B8' }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94A3B8' }} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="MAU" stroke="#22C55E" strokeWidth={2} fill="none" />
              <Area type="monotone" dataKey="WAU" stroke="#7C3AED" strokeWidth={2} fill="none" />
              <Area type="monotone" dataKey="DAU" stroke="#3B82F6" strokeWidth={2} fill="url(#colorDAU)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* 收入统计图表 */}
        <div className="admin-card p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-base font-semibold text-gray-900">收入统计</h3>
              <p className="text-sm text-gray-500 mt-0.5">Token消费和订阅收入</p>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-full bg-blue-500" />
                <span className="text-gray-500">Token消费</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-full bg-green-500" />
                <span className="text-gray-500">订阅收入</span>
              </div>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={revenueData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
              <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94A3B8' }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94A3B8' }} tickFormatter={(v) => `¥${(v / 1000).toFixed(0)}k`} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="tokenRevenue" name="Token消费" fill="#2563EB" radius={[4, 4, 0, 0]} barSize={16} />
              <Bar dataKey="subscriptionRevenue" name="订阅收入" fill="#22C55E" radius={[4, 4, 0, 0]} barSize={16} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 智能体排行 + 收入分布 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 智能体使用排行 */}
        <div className="lg:col-span-2 admin-card">
          <div className="p-4 border-b border-gray-100">
            <h3 className="text-base font-semibold text-gray-900">智能体使用排行</h3>
            <p className="text-sm text-gray-500 mt-0.5">按对话量排序的热门智能体</p>
          </div>
          <div className="p-4 space-y-3">
            {agentRankingData.map((agent, index) => (
              <div key={agent.name} className="flex items-center gap-4">
                {/* 排名 */}
                <div className={cn(
                  'w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0',
                  index < 3 ? 'bg-primary text-white' : 'bg-gray-100 text-gray-500'
                )}>
                  {index + 1}
                </div>
                {/* 名称和进度条 */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-gray-900 truncate">{agent.name}</span>
                    <span className="text-sm text-gray-500 ml-2 flex-shrink-0">
                      {agent.conversations.toLocaleString()} 次对话
                    </span>
                  </div>
                  <div className="w-full h-2 bg-gray-100 rounded-full">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${(agent.conversations / agentRankingData[0].conversations) * 100}%`,
                        backgroundColor: agent.color,
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 收入来源分布 */}
        <div className="admin-card p-6">
          <h3 className="text-base font-semibold text-gray-900 mb-1">收入来源分布</h3>
          <p className="text-sm text-gray-500 mb-6">各收入渠道占比</p>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={revenueDistributionData}
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={80}
                paddingAngle={4}
                dataKey="value"
              >
                {revenueDistributionData.map((entry, index) => (
                  <Cell key={index} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value: number) => `${value}%`}
                contentStyle={{
                  borderRadius: '8px',
                  border: '1px solid #E2E8F0',
                  boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
                }}
              />
            </PieChart>
          </ResponsiveContainer>
          {/* 图例 */}
          <div className="space-y-2 mt-4">
            {revenueDistributionData.map((item) => (
              <div key={item.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-sm text-gray-600">{item.name}</span>
                </div>
                <span className="text-sm font-medium text-gray-900">{item.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
