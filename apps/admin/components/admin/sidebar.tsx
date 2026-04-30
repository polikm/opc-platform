'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Users,
  Bot,
  FileText,
  BarChart3,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState } from 'react';

/**
 * 导航菜单项配置
 */
const navItems = [
  { label: '仪表盘', href: '/', icon: LayoutDashboard },
  { label: '用户管理', href: '/users', icon: Users },
  { label: '智能体管理', href: '/agents', icon: Bot },
  { label: '内容审核', href: '/content', icon: FileText },
  { label: '数据分析', href: '/analytics', icon: BarChart3 },
  { label: '系统设置', href: '/settings', icon: Settings },
];

/**
 * 管理后台侧边栏组件
 * 包含平台Logo、导航菜单、折叠功能
 */
export default function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={cn(
        'fixed left-0 top-0 h-screen bg-sidebar text-white flex flex-col transition-all duration-300 z-30',
        collapsed ? 'w-16' : 'w-60'
      )}
    >
      {/* Logo区域 */}
      <div className="flex items-center h-16 px-4 border-b border-white/10">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center flex-shrink-0">
            <Bot className="w-5 h-5 text-white" />
          </div>
          {!collapsed && (
            <div className="whitespace-nowrap">
              <h1 className="text-base font-bold">OPC管理后台</h1>
            </div>
          )}
        </div>
      </div>

      {/* 导航菜单 */}
      <nav className="flex-1 py-4 px-2 space-y-1 overflow-y-auto scrollbar-thin">
        {navItems.map((item) => {
          const isActive =
            item.href === '/'
              ? pathname === '/'
              : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors duration-200',
                isActive
                  ? 'bg-primary text-white'
                  : 'text-gray-300 hover:bg-sidebar-hover hover:text-white'
              )}
              title={collapsed ? item.label : undefined}
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />
              {!collapsed && <span>{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* 底部操作区 */}
      <div className="border-t border-white/10 p-2 space-y-1">
        {/* 折叠按钮 */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-300 hover:bg-sidebar-hover hover:text-white transition-colors duration-200 w-full"
        >
          {collapsed ? (
            <ChevronRight className="w-5 h-5 flex-shrink-0" />
          ) : (
            <>
              <ChevronLeft className="w-5 h-5 flex-shrink-0" />
              <span>收起菜单</span>
            </>
          )}
        </button>

        {/* 退出登录 */}
        <Link
          href="/login"
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-300 hover:bg-sidebar-hover hover:text-white transition-colors duration-200"
          title={collapsed ? '退出登录' : undefined}
        >
          <LogOut className="w-5 h-5 flex-shrink-0" />
          {!collapsed && <span>退出登录</span>}
        </Link>
      </div>
    </aside>
  );
}
