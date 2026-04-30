'use client';

import { useState } from 'react';
import Link from 'next/link';
import DataTable, { Column } from '@/components/admin/data-table';
import { cn, getStatusColor, getStatusLabel, getRoleLabel } from '@/lib/utils';
import { Search, Filter, Download, Eye, Ban, MoreHorizontal } from 'lucide-react';

/**
 * 用户模拟数据
 */
const mockUsers = [
  { id: '1', username: '张三', email: 'zhangsan@example.com', avatar: '', role: 'user', status: 'active', createdAt: '2024-04-14 15:30', lastLoginAt: '2024-04-14 16:00', agentCount: 3, conversationCount: 128 },
  { id: '2', username: '李四', email: 'lisi@example.com', avatar: '', role: 'vip', status: 'active', createdAt: '2024-04-13 14:20', lastLoginAt: '2024-04-14 12:30', agentCount: 8, conversationCount: 567 },
  { id: '3', username: '王五', email: 'wangwu@example.com', avatar: '', role: 'developer', status: 'active', createdAt: '2024-04-12 12:10', lastLoginAt: '2024-04-14 10:00', agentCount: 15, conversationCount: 1024 },
  { id: '4', username: '赵六', email: 'zhaoliu@example.com', avatar: '', role: 'user', status: 'pending', createdAt: '2024-04-14 10:45', lastLoginAt: '-', agentCount: 0, conversationCount: 0 },
  { id: '5', username: '钱七', email: 'qianqi@example.com', avatar: '', role: 'user', status: 'active', createdAt: '2024-04-11 09:30', lastLoginAt: '2024-04-13 18:20', agentCount: 2, conversationCount: 45 },
  { id: '6', username: '孙八', email: 'sunba@example.com', avatar: '', role: 'user', status: 'banned', createdAt: '2024-04-10 08:00', lastLoginAt: '2024-04-12 09:00', agentCount: 1, conversationCount: 23 },
  { id: '7', username: '周九', email: 'zhoujiu@example.com', avatar: '', role: 'vip', status: 'active', createdAt: '2024-04-09 16:30', lastLoginAt: '2024-04-14 14:50', agentCount: 5, conversationCount: 312 },
  { id: '8', username: '吴十', email: 'wushi@example.com', avatar: '', role: 'user', status: 'inactive', createdAt: '2024-04-08 11:20', lastLoginAt: '2024-04-08 11:20', agentCount: 0, conversationCount: 5 },
  { id: '9', username: '郑十一', email: 'zheng11@example.com', avatar: '', role: 'developer', status: 'active', createdAt: '2024-04-07 14:00', lastLoginAt: '2024-04-14 09:30', agentCount: 12, conversationCount: 890 },
  { id: '10', username: '冯十二', email: 'feng12@example.com', avatar: '', role: 'user', status: 'active', createdAt: '2024-04-06 10:15', lastLoginAt: '2024-04-13 20:10', agentCount: 1, conversationCount: 67 },
];

/**
 * 用户管理页面
 * 提供用户搜索、筛选、列表展示和操作功能
 */
export default function UsersPage() {
  const [searchKeyword, setSearchKeyword] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedUser, setSelectedUser] = useState<typeof mockUsers[0] | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  // 过滤数据
  const filteredUsers = mockUsers.filter((user) => {
    const matchSearch =
      !searchKeyword ||
      user.username.includes(searchKeyword) ||
      user.email.includes(searchKeyword);
    const matchRole = roleFilter === 'all' || user.role === roleFilter;
    const matchStatus = statusFilter === 'all' || user.status === statusFilter;
    return matchSearch && matchRole && matchStatus;
  });

  // 表格列定义
  const columns: Column<typeof mockUsers[0]>[] = [
    {
      key: 'username',
      title: '用户',
      sortable: true,
      render: (_, row) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-blue-400 flex items-center justify-center text-white text-xs font-medium flex-shrink-0">
            {row.username[0]}
          </div>
          <div>
            <p className="text-sm font-medium text-gray-900">{row.username}</p>
            <p className="text-xs text-gray-400">{row.email}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'role',
      title: '角色',
      sortable: true,
      width: '100px',
      render: (value) => (
        <span className={cn('admin-badge', getStatusColor(String(value)))}>
          {getRoleLabel(String(value))}
        </span>
      ),
    },
    {
      key: 'status',
      title: '状态',
      sortable: true,
      width: '90px',
      render: (value) => (
        <span className={cn('admin-badge', getStatusColor(String(value)))}>
          {getStatusLabel(String(value))}
        </span>
      ),
    },
    {
      key: 'agentCount',
      title: '智能体',
      sortable: true,
      width: '80px',
      align: 'center' as const,
    },
    {
      key: 'conversationCount',
      title: '对话量',
      sortable: true,
      width: '80px',
      align: 'center' as const,
      render: (value) => Number(value).toLocaleString(),
    },
    {
      key: 'createdAt',
      title: '注册时间',
      sortable: true,
      width: '140px',
    },
    {
      key: 'actions',
      title: '操作',
      width: '120px',
      align: 'center' as const,
      render: (_, row) => (
        <div className="flex items-center justify-center gap-1">
          <Link
            href={`/users/${row.id}`}
            className="p-1.5 rounded-md hover:bg-blue-50 text-blue-600 transition-colors"
            title="查看详情"
          >
            <Eye className="w-4 h-4" />
          </Link>
          {row.status !== 'banned' && (
            <button
              className="p-1.5 rounded-md hover:bg-red-50 text-red-600 transition-colors"
              title="封禁用户"
              onClick={(e) => {
                e.stopPropagation();
                alert(`确认封禁用户 ${row.username}？`);
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
          <h1 className="text-2xl font-bold text-gray-900">用户管理</h1>
          <p className="text-sm text-gray-500 mt-1">管理平台注册用户，查看用户信息和操作记录</p>
        </div>
        <button className="admin-btn-primary flex items-center gap-2">
          <Download className="w-4 h-4" />
          导出用户
        </button>
      </div>

      {/* 搜索和筛选栏 */}
      <div className="admin-card p-4">
        <div className="flex items-center gap-4">
          {/* 搜索框 */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="搜索用户名或邮箱..."
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              className="admin-input pl-9"
            />
          </div>

          {/* 角色筛选 */}
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-400" />
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="admin-input w-32"
            >
              <option value="all">全部角色</option>
              <option value="user">普通用户</option>
              <option value="vip">VIP用户</option>
              <option value="developer">开发者</option>
            </select>
          </div>

          {/* 状态筛选 */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="admin-input w-32"
          >
            <option value="all">全部状态</option>
            <option value="active">活跃</option>
            <option value="inactive">未激活</option>
            <option value="pending">待审核</option>
            <option value="banned">已封禁</option>
          </select>
        </div>
      </div>

      {/* 用户列表表格 */}
      <DataTable
        columns={columns}
        data={filteredUsers as any}
        rowKey="id"
        onRowClick={(row) => {
          setSelectedUser(row as any);
          setShowDetailModal(true);
        }}
        pagination={{
          page: currentPage,
          pageSize: 10,
          total: filteredUsers.length,
          onPageChange: setCurrentPage,
        }}
      />

      {/* 用户详情弹窗 */}
      {showDetailModal && selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* 遮罩 */}
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setShowDetailModal(false)}
          />
          {/* 弹窗内容 */}
          <div className="relative bg-white rounded-xl shadow-xl w-full max-w-lg mx-4 overflow-hidden">
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">用户详情</h3>
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="p-1 rounded-md hover:bg-gray-100 transition-colors"
                >
                  <span className="text-gray-400 text-xl">&times;</span>
                </button>
              </div>
            </div>
            <div className="p-6 space-y-4">
              {/* 用户基本信息 */}
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-blue-400 flex items-center justify-center text-white text-xl font-bold">
                  {selectedUser.username[0]}
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-gray-900">{selectedUser.username}</h4>
                  <p className="text-sm text-gray-500">{selectedUser.email}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={cn('admin-badge', getStatusColor(selectedUser.role))}>
                      {getRoleLabel(selectedUser.role)}
                    </span>
                    <span className={cn('admin-badge', getStatusColor(selectedUser.status))}>
                      {getStatusLabel(selectedUser.status)}
                    </span>
                  </div>
                </div>
              </div>

              {/* 详细信息 */}
              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-100">
                <div>
                  <p className="text-xs text-gray-400">注册时间</p>
                  <p className="text-sm font-medium text-gray-900">{selectedUser.createdAt}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400">最后登录</p>
                  <p className="text-sm font-medium text-gray-900">{selectedUser.lastLoginAt}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400">智能体数量</p>
                  <p className="text-sm font-medium text-gray-900">{selectedUser.agentCount}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400">对话总量</p>
                  <p className="text-sm font-medium text-gray-900">{selectedUser.conversationCount}</p>
                </div>
              </div>
            </div>
            <div className="p-4 border-t border-gray-100 flex justify-end gap-2">
              <button
                onClick={() => setShowDetailModal(false)}
                className="admin-btn-secondary"
              >
                关闭
              </button>
              <Link
                href={`/users/${selectedUser.id}`}
                className="admin-btn-primary"
                onClick={() => setShowDetailModal(false)}
              >
                查看完整详情
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
