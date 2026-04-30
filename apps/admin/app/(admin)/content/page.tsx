'use client';

import { useState } from 'react';
import { cn, getStatusColor, getStatusLabel } from '@/lib/utils';
import {
  Search,
  Filter,
  CheckCircle,
  XCircle,
  Trash2,
  AlertTriangle,
  Eye,
  Flag,
  MessageSquare,
  Bot,
  User,
} from 'lucide-react';

/**
 * 待审核内容模拟数据
 */
const mockPendingContent = [
  {
    id: '1',
    type: 'agent',
    title: '金融投资顾问',
    content: '提供专业的金融投资建议和市场分析...',
    authorName: '张三',
    status: 'pending',
    createdAt: '2024-04-14 15:30',
    reportCount: 0,
  },
  {
    id: '2',
    type: 'agent',
    title: '医疗健康助手',
    content: '提供健康咨询和医疗建议...',
    authorName: '李四',
    status: 'pending',
    createdAt: '2024-04-14 14:20',
    reportCount: 2,
  },
  {
    id: '3',
    type: 'review',
    title: '用户评价 #1024',
    content: '这个智能体非常好用，帮我解决了很多问题！强烈推荐给大家...',
    authorName: '王五',
    status: 'pending',
    createdAt: '2024-04-14 12:10',
    reportCount: 0,
  },
  {
    id: '4',
    type: 'comment',
    title: '评论 #2048',
    content: '内容涉嫌虚假宣传，夸大智能体功能...',
    authorName: '赵六',
    status: 'pending',
    createdAt: '2024-04-14 10:45',
    reportCount: 5,
  },
  {
    id: '5',
    type: 'agent',
    title: '情感咨询师',
    content: '提供情感咨询和心理健康支持...',
    authorName: '钱七',
    status: 'pending',
    createdAt: '2024-04-14 09:30',
    reportCount: 0,
  },
];

/**
 * 举报列表模拟数据
 */
const mockReports = [
  {
    id: 'r1',
    targetType: 'agent',
    targetName: '虚假广告助手',
    reporterName: '用户A',
    reason: '该智能体发布虚假广告，诱导用户消费',
    status: 'pending',
    createdAt: '2024-04-14 16:00',
  },
  {
    id: 'r2',
    targetType: 'conversation',
    targetName: '对话 #3072',
    reporterName: '用户B',
    reason: '对话内容包含不当言论和歧视性语言',
    status: 'pending',
    createdAt: '2024-04-14 15:20',
  },
  {
    id: 'r3',
    targetType: 'user',
    targetName: '恶意用户C',
    reporterName: '用户D',
    reason: '该用户频繁骚扰其他用户，发送垃圾信息',
    status: 'pending',
    createdAt: '2024-04-14 14:00',
  },
  {
    id: 'r4',
    targetType: 'agent',
    targetName: '未授权数据采集器',
    reporterName: '用户E',
    reason: '该智能体未经授权收集用户隐私数据',
    status: 'resolved',
    createdAt: '2024-04-13 20:30',
  },
];

/**
 * 内容类型图标映射
 */
const typeIcons: Record<string, React.ReactNode> = {
  agent: <Bot className="w-4 h-4 text-purple-600" />,
  conversation: <MessageSquare className="w-4 h-4 text-blue-600" />,
  review: <Star className="w-4 h-4 text-yellow-600" />,
  comment: <MessageSquare className="w-4 h-4 text-green-600" />,
  user: <User className="w-4 h-4 text-gray-600" />,
};

/**
 * 内容类型标签
 */
const typeLabels: Record<string, string> = {
  agent: '智能体',
  conversation: '对话',
  review: '评价',
  comment: '评论',
  user: '用户',
};

/**
 * 内容审核页面
 * 提供待审核内容列表和举报处理功能
 */
export default function ContentPage() {
  const [activeTab, setActiveTab] = useState<'pending' | 'reports'>('pending');
  const [typeFilter, setTypeFilter] = useState('all');
  const [searchKeyword, setSearchKeyword] = useState('');

  // 过滤待审核内容
  const filteredContent = mockPendingContent.filter((item) => {
    const matchSearch =
      !searchKeyword ||
      item.title.includes(searchKeyword) ||
      item.authorName.includes(searchKeyword);
    const matchType = typeFilter === 'all' || item.type === typeFilter;
    return matchSearch && matchType;
  });

  return (
    <div className="space-y-6">
      {/* 页面标题 */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">内容审核</h1>
        <p className="text-sm text-gray-500 mt-1">审核平台内容，处理用户举报</p>
      </div>

      {/* Tab切换 */}
      <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1 w-fit">
        <button
          onClick={() => setActiveTab('pending')}
          className={cn(
            'px-4 py-2 rounded-md text-sm font-medium transition-colors',
            activeTab === 'pending'
              ? 'bg-white text-gray-900 shadow-sm'
              : 'text-gray-500 hover:text-gray-700'
          )}
        >
          待审核内容
          {mockPendingContent.length > 0 && (
            <span className="ml-2 px-1.5 py-0.5 bg-red-100 text-red-600 text-xs rounded-full">
              {mockPendingContent.length}
            </span>
          )}
        </button>
        <button
          onClick={() => setActiveTab('reports')}
          className={cn(
            'px-4 py-2 rounded-md text-sm font-medium transition-colors',
            activeTab === 'reports'
              ? 'bg-white text-gray-900 shadow-sm'
              : 'text-gray-500 hover:text-gray-700'
          )}
        >
          举报处理
          {mockReports.filter((r) => r.status === 'pending').length > 0 && (
            <span className="ml-2 px-1.5 py-0.5 bg-red-100 text-red-600 text-xs rounded-full">
              {mockReports.filter((r) => r.status === 'pending').length}
            </span>
          )}
        </button>
      </div>

      {/* 搜索和筛选 */}
      <div className="admin-card p-4">
        <div className="flex items-center gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="搜索内容标题或作者..."
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              className="admin-input pl-9"
            />
          </div>
          {activeTab === 'pending' && (
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-400" />
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="admin-input w-32"
              >
                <option value="all">全部类型</option>
                <option value="agent">智能体</option>
                <option value="review">评价</option>
                <option value="comment">评论</option>
              </select>
            </div>
          )}
        </div>
      </div>

      {/* 待审核内容列表 */}
      {activeTab === 'pending' && (
        <div className="space-y-3">
          {filteredContent.length === 0 ? (
            <div className="admin-card p-12 text-center">
              <CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-3" />
              <p className="text-gray-500">暂无待审核内容</p>
            </div>
          ) : (
            filteredContent.map((item) => (
              <div key={item.id} className="admin-card p-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3 flex-1">
                    {/* 类型图标 */}
                    <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                      {typeIcons[item.type]}
                    </div>
                    {/* 内容信息 */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-sm font-semibold text-gray-900">{item.title}</h3>
                        <span className="admin-badge-info">{typeLabels[item.type]}</span>
                        {item.reportCount > 0 && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-600">
                            <AlertTriangle className="w-3 h-3" />
                            {item.reportCount}次举报
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-500 mb-2 line-clamp-2">{item.content}</p>
                      <div className="flex items-center gap-4 text-xs text-gray-400">
                        <span>作者: {item.authorName}</span>
                        <span>提交时间: {item.createdAt}</span>
                      </div>
                    </div>
                  </div>

                  {/* 操作按钮 */}
                  <div className="flex items-center gap-2 ml-4 flex-shrink-0">
                    <button
                      className="p-1.5 rounded-md hover:bg-blue-50 text-blue-600 transition-colors"
                      title="查看详情"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      className="admin-btn-primary flex items-center gap-1.5 !py-1.5 !px-3 !text-xs"
                      onClick={() => alert(`已通过「${item.title}」`)}
                    >
                      <CheckCircle className="w-3.5 h-3.5" />
                      通过
                    </button>
                    <button
                      className="flex items-center gap-1.5 !py-1.5 !px-3 !text-xs bg-yellow-50 text-yellow-700 rounded-lg font-medium hover:bg-yellow-100 transition-colors"
                      onClick={() => {
                        const reason = prompt('请输入拒绝原因：');
                        if (reason) alert(`已拒绝「${item.title}」，原因：${reason}`);
                      }}
                    >
                      <XCircle className="w-3.5 h-3.5" />
                      拒绝
                    </button>
                    <button
                      className="flex items-center gap-1.5 !py-1.5 !px-3 !text-xs bg-red-50 text-red-600 rounded-lg font-medium hover:bg-red-100 transition-colors"
                      onClick={() => alert(`已删除「${item.title}」`)}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      删除
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* 举报处理列表 */}
      {activeTab === 'reports' && (
        <div className="space-y-3">
          {mockReports.length === 0 ? (
            <div className="admin-card p-12 text-center">
              <CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-3" />
              <p className="text-gray-500">暂无待处理举报</p>
            </div>
          ) : (
            mockReports.map((report) => (
              <div key={report.id} className="admin-card p-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3 flex-1">
                    {/* 举报图标 */}
                    <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Flag className="w-5 h-5 text-red-500" />
                    </div>
                    {/* 举报信息 */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-sm font-semibold text-gray-900">{report.targetName}</h3>
                        <span className="admin-badge-info">{typeLabels[report.targetType]}</span>
                        <span className={cn('admin-badge', getStatusColor(report.status))}>
                          {report.status === 'pending' ? '待处理' : '已处理'}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">
                        <span className="font-medium">举报原因：</span>{report.reason}
                      </p>
                      <div className="flex items-center gap-4 text-xs text-gray-400">
                        <span>举报人: {report.reporterName}</span>
                        <span>举报时间: {report.createdAt}</span>
                      </div>
                    </div>
                  </div>

                  {/* 操作按钮 */}
                  {report.status === 'pending' && (
                    <div className="flex items-center gap-2 ml-4 flex-shrink-0">
                      <button
                        className="admin-btn-secondary flex items-center gap-1.5 !py-1.5 !px-3 !text-xs"
                        onClick={() => alert('已忽略该举报')}
                      >
                        忽略
                      </button>
                      <button
                        className="flex items-center gap-1.5 !py-1.5 !px-3 !text-xs bg-yellow-50 text-yellow-700 rounded-lg font-medium hover:bg-yellow-100 transition-colors"
                        onClick={() => alert('已发送警告通知')}
                      >
                        警告
                      </button>
                      <button
                        className="admin-btn-danger flex items-center gap-1.5 !py-1.5 !px-3 !text-xs"
                        onClick={() => alert('已封禁相关内容/用户')}
                      >
                        封禁
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

/** 星标图标组件 */
function Star({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
}
