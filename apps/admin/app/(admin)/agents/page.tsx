'use client';

import { useState } from 'react';
import DataTable, { Column } from '@/components/admin/data-table';
import { cn, getStatusColor, getStatusLabel, formatNumber } from '@/lib/utils';
import { Search, Filter, Download, Eye, Ban, Star, Zap } from 'lucide-react';

/**
 * 智能体模拟数据
 */
const mockAgents = [
  { id: '1', name: '智能客服助手', description: '专业的客户服务智能体，支持多轮对话', creatorName: '张三', status: 'published', conversationCount: 8520, tokenUsage: 1280000, rating: 4.8, createdAt: '2024-03-15' },
  { id: '2', name: '代码审查专家', description: '帮助开发者进行代码审查和优化建议', creatorName: '王五', status: 'published', conversationCount: 6230, tokenUsage: 980000, rating: 4.6, createdAt: '2024-03-20' },
  { id: '3', name: '学习伙伴', description: '个性化学习辅助，支持多种学科', creatorName: '李四', status: 'draft', conversationCount: 0, tokenUsage: 0, rating: 0, createdAt: '2024-04-10' },
  { id: '4', name: '创意写作助手', description: '帮助用户进行创意写作和内容生成', creatorName: '周九', status: 'published', conversationCount: 4560, tokenUsage: 720000, rating: 4.5, createdAt: '2024-03-25' },
  { id: '5', name: '数据分析顾问', description: '提供数据分析和可视化建议', creatorName: '郑十一', status: 'reviewing', conversationCount: 0, tokenUsage: 0, rating: 0, createdAt: '2024-04-12' },
  { id: '6', name: '心理咨询师', description: '提供心理健康咨询和情绪支持', creatorName: '钱七', status: 'published', conversationCount: 3210, tokenUsage: 510000, rating: 4.9, createdAt: '2024-03-18' },
  { id: '7', name: '翻译大师', description: '支持多语言翻译和语言学习', creatorName: '吴十', status: 'rejected', conversationCount: 0, tokenUsage: 0, rating: 0, createdAt: '2024-04-08' },
  { id: '8', name: '健身教练', description: '个性化健身计划和营养建议', creatorName: '冯十二', status: 'published', conversationCount: 2180, tokenUsage: 340000, rating: 4.3, createdAt: '2024-04-01' },
  { id: '9', name: '法律顾问', description: '提供法律咨询和合同审查', creatorName: '张三', status: 'published', conversationCount: 1890, tokenUsage: 290000, rating: 4.7, createdAt: '2024-03-28' },
  { id: '10', name: '旅行规划师', description: '智能旅行路线规划和景点推荐', creatorName: '李四', status: 'taken_down', conversationCount: 560, tokenUsage: 89000, rating: 3.8, createdAt: '2024-03-22' },
];

/**
 * 智能体管理页面
 * 展示智能体列表，支持搜索、筛选和操作
 */
export default function AgentsPage() {
  const [searchKeyword, setSearchKeyword] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);

  // 过滤数据
  const filteredAgents = mockAgents.filter((agent) => {
    const matchSearch =
      !searchKeyword ||
      agent.name.includes(searchKeyword) ||
      agent.creatorName.includes(searchKeyword) ||
      agent.description.includes(searchKeyword);
    const matchStatus = statusFilter === 'all' || agent.status === statusFilter;
    return matchSearch && matchStatus;
  });

  // 表格列定义
  const columns: Column<typeof mockAgents[0]>[] = [
    {
      key: 'name',
      title: '智能体',
      sortable: true,
      render: (_, row) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center flex-shrink-0">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-900">{row.name}</p>
            <p className="text-xs text-gray-400 max-w-[200px] truncate">{row.description}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'creatorName',
      title: '创建者',
      sortable: true,
      width: '100px',
    },
    {
      key: 'status',
      title: '状态',
      sortable: true,
      width: '100px',
      render: (value) => (
        <span className={cn('admin-badge', getStatusColor(String(value)))}>
          {getStatusLabel(String(value))}
        </span>
      ),
    },
    {
      key: 'conversationCount',
      title: '对话量',
      sortable: true,
      width: '100px',
      align: 'center' as const,
      render: (value) => Number(value).toLocaleString(),
    },
    {
      key: 'tokenUsage',
      title: 'Token消耗',
      sortable: true,
      width: '120px',
      align: 'center' as const,
      render: (value) => {
        const num = Number(value);
        if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
        if (num >= 1000) return `${(num / 1000).toFixed(0)}K`;
        return String(num);
      },
    },
    {
      key: 'rating',
      title: '评分',
      sortable: true,
      width: '80px',
      align: 'center' as const,
      render: (value) => {
        const rating = Number(value);
        if (rating === 0) return <span className="text-gray-400">-</span>;
        return (
          <div className="flex items-center justify-center gap-1">
            <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
            <span className="text-sm font-medium text-gray-900">{rating}</span>
          </div>
        );
      },
    },
    {
      key: 'actions',
      title: '操作',
      width: '100px',
      align: 'center' as const,
      render: (_, row) => (
        <div className="flex items-center justify-center gap-1">
          <button
            className="p-1.5 rounded-md hover:bg-blue-50 text-blue-600 transition-colors"
            title="查看详情"
          >
            <Eye className="w-4 h-4" />
          </button>
          {row.status === 'published' && (
            <button
              className="p-1.5 rounded-md hover:bg-red-50 text-red-600 transition-colors"
              title="下架"
              onClick={(e) => {
                e.stopPropagation();
                alert(`确认下架智能体「${row.name}」？`);
              }}
            >
              <Ban className="w-4 h-4" />
            </button>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* 页面标题 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">智能体管理</h1>
          <p className="text-sm text-gray-500 mt-1">管理平台上的所有智能体，审核和监控智能体状态</p>
        </div>
        <button className="admin-btn-primary flex items-center gap-2">
          <Download className="w-4 h-4" />
          导出数据
        </button>
      </div>

      {/* 统计概览 */}
      <div className="grid grid-cols-4 gap-4">
        <div className="admin-card p-4">
          <p className="text-sm text-gray-500">智能体总数</p>
          <p className="text-xl font-bold text-gray-900 mt-1">{mockAgents.length}</p>
        </div>
        <div className="admin-card p-4">
          <p className="text-sm text-gray-500">已发布</p>
          <p className="text-xl font-bold text-green-600 mt-1">
            {mockAgents.filter((a) => a.status === 'published').length}
          </p>
        </div>
        <div className="admin-card p-4">
          <p className="text-sm text-gray-500">待审核</p>
          <p className="text-xl font-bold text-yellow-600 mt-1">
            {mockAgents.filter((a) => a.status === 'reviewing').length}
          </p>
        </div>
        <div className="admin-card p-4">
          <p className="text-sm text-gray-500">总对话量</p>
          <p className="text-xl font-bold text-primary mt-1">
            {formatNumber(mockAgents.reduce((sum, a) => sum + a.conversationCount, 0))}
          </p>
        </div>
      </div>

      {/* 搜索和筛选 */}
      <div className="admin-card p-4">
        <div className="flex items-center gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="搜索智能体名称、创建者..."
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              className="admin-input pl-9"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="admin-input w-32"
            >
              <option value="all">全部状态</option>
              <option value="published">已发布</option>
              <option value="draft">草稿</option>
              <option value="reviewing">审核中</option>
              <option value="rejected">已拒绝</option>
              <option value="taken_down">已下架</option>
            </select>
          </div>
        </div>
      </div>

      {/* 智能体列表 */}
      <DataTable
        columns={columns}
        data={filteredAgents as any}
        rowKey="id"
        pagination={{
          page: currentPage,
          pageSize: 10,
          total: filteredAgents.length,
          onPageChange: setCurrentPage,
        }}
      />
    </div>
  );
}
