'use client';

import { useState, useMemo } from 'react';
import { cn } from '@/lib/utils';
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Search,
} from 'lucide-react';

/**
 * 表格列定义
 */
export interface Column<T> {
  /** 列标识 */
  key: string;
  /** 列标题 */
  title: string;
  /** 列宽度 */
  width?: string;
  /** 是否可排序 */
  sortable?: boolean;
  /** 自定义渲染 */
  render?: (value: unknown, row: T, index: number) => React.ReactNode;
  /** 对齐方式 */
  align?: 'left' | 'center' | 'right';
}

/**
 * 数据表格组件属性
 */
interface DataTableProps<T> {
  /** 列定义 */
  columns: Column<T>[];
  /** 数据源 */
  data: T[];
  /** 加载状态 */
  loading?: boolean;
  /** 分页信息 */
  pagination?: {
    page: number;
    pageSize: number;
    total: number;
    onPageChange: (page: number) => void;
    onPageSizeChange?: (pageSize: number) => void;
  };
  /** 行唯一标识 */
  rowKey?: keyof T;
  /** 行点击事件 */
  onRowClick?: (row: T) => void;
  /** 空数据文案 */
  emptyText?: string;
  /** 搜索占位符 */
  searchPlaceholder?: string;
  /** 是否显示搜索框 */
  showSearch?: boolean;
  /** 搜索回调 */
  onSearch?: (keyword: string) => void;
  /** 额外操作区（右上角） */
  actions?: React.ReactNode;
  /** 自定义类名 */
  className?: string;
}

/**
 * 通用数据表格组件
 * 支持排序、搜索、分页功能
 */
export default function DataTable<T extends Record<string, unknown>>({
  columns,
  data,
  loading = false,
  pagination,
  rowKey = 'id' as keyof T,
  onRowClick,
  emptyText = '暂无数据',
  searchPlaceholder = '搜索...',
  showSearch = false,
  onSearch,
  actions,
  className,
}: DataTableProps<T>) {
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [searchKeyword, setSearchKeyword] = useState('');

  // 排序数据
  const sortedData = useMemo(() => {
    if (!sortKey) return data;
    return [...data].sort((a, b) => {
      const aVal = a[sortKey];
      const bVal = b[sortKey];
      if (aVal === bVal) return 0;
      if (aVal == null) return 1;
      if (bVal == null) return -1;
      const result = aVal > bVal ? 1 : -1;
      return sortOrder === 'asc' ? result : -result;
    });
  }, [data, sortKey, sortOrder]);

  // 处理排序
  const handleSort = (key: string) => {
    if (sortKey === key) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortOrder('asc');
    }
  };

  // 处理搜索
  const handleSearch = (value: string) => {
    setSearchKeyword(value);
    onSearch?.(value);
  };

  // 计算总页数
  const totalPages = pagination
    ? Math.ceil(pagination.total / pagination.pageSize)
    : 1;

  return (
    <div className={cn('admin-card overflow-hidden', className)}>
      {/* 顶部工具栏 */}
      {(showSearch || actions) && (
        <div className="flex items-center justify-between p-4 border-b border-[var(--border)]">
          {/* 搜索框 */}
          {showSearch && (
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder={searchPlaceholder}
                value={searchKeyword}
                onChange={(e) => handleSearch(e.target.value)}
                className="admin-input pl-9 w-64"
              />
            </div>
          )}

          {/* 操作区 */}
          {actions && <div className="flex items-center gap-2">{actions}</div>}
        </div>
      )}

      {/* 表格区域 */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50">
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={cn(
                    'px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider',
                    col.align === 'center' && 'text-center',
                    col.align === 'right' && 'text-right',
                    col.sortable && 'cursor-pointer select-none hover:bg-gray-100'
                  )}
                  style={col.width ? { width: col.width } : undefined}
                  onClick={() => col.sortable && handleSort(col.key)}
                >
                  <div className={cn('flex items-center gap-1', col.align === 'center' && 'justify-center', col.align === 'right' && 'justify-end')}>
                    {col.title}
                    {col.sortable && (
                      <span className="text-gray-400">
                        {sortKey === col.key ? (
                          sortOrder === 'asc' ? (
                            <ArrowUp className="w-3.5 h-3.5" />
                          ) : (
                            <ArrowDown className="w-3.5 h-3.5" />
                          )
                        ) : (
                          <ArrowUpDown className="w-3.5 h-3.5" />
                        )}
                      </span>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-4 py-12 text-center text-gray-400"
                >
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                    加载中...
                  </div>
                </td>
              </tr>
            ) : sortedData.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-4 py-12 text-center text-gray-400"
                >
                  {emptyText}
                </td>
              </tr>
            ) : (
              sortedData.map((row, index) => (
                <tr
                  key={String(row[rowKey] ?? index)}
                  className={cn(
                    'hover:bg-gray-50 transition-colors duration-150',
                    onRowClick && 'cursor-pointer'
                  )}
                  onClick={() => onRowClick?.(row)}
                >
                  {columns.map((col) => (
                    <td
                      key={col.key}
                      className={cn(
                        'px-4 py-3 text-sm text-gray-700',
                        col.align === 'center' && 'text-center',
                        col.align === 'right' && 'text-right'
                      )}
                    >
                      {col.render
                        ? col.render(row[col.key], row, index)
                        : String(row[col.key] ?? '-')}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* 分页区域 */}
      {pagination && (
        <div className="flex items-center justify-between px-4 py-3 border-t border-[var(--border)]">
          {/* 分页信息 */}
          <div className="text-sm text-gray-500">
            共 {pagination.total} 条记录，第 {pagination.page}/{totalPages} 页
          </div>

          {/* 分页按钮 */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => pagination.onPageChange(1)}
              disabled={pagination.page <= 1}
              className="p-1.5 rounded-md hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronsLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => pagination.onPageChange(pagination.page - 1)}
              disabled={pagination.page <= 1}
              className="p-1.5 rounded-md hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {/* 页码按钮 */}
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let pageNum: number;
              if (totalPages <= 5) {
                pageNum = i + 1;
              } else if (pagination.page <= 3) {
                pageNum = i + 1;
              } else if (pagination.page >= totalPages - 2) {
                pageNum = totalPages - 4 + i;
              } else {
                pageNum = pagination.page - 2 + i;
              }
              return (
                <button
                  key={pageNum}
                  onClick={() => pagination.onPageChange(pageNum)}
                  className={cn(
                    'w-8 h-8 rounded-md text-sm font-medium transition-colors',
                    pagination.page === pageNum
                      ? 'bg-primary text-white'
                      : 'hover:bg-gray-100 text-gray-700'
                  )}
                >
                  {pageNum}
                </button>
              );
            })}

            <button
              onClick={() => pagination.onPageChange(pagination.page + 1)}
              disabled={pagination.page >= totalPages}
              className="p-1.5 rounded-md hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => pagination.onPageChange(totalPages)}
              disabled={pagination.page >= totalPages}
              className="p-1.5 rounded-md hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronsRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
