"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Bot,
  LayoutDashboard,
  Users,
  BookOpen,
  Store,
  MessageSquare,
  Settings,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

/**
 * Sidebar组件 - 侧边栏导航
 * 工作台导航菜单，支持折叠
 */

// 导航菜单配置
const menuItems = [
  { icon: LayoutDashboard, label: "工作台", href: "/dashboard" },
  { icon: Bot, label: "智能体管理", href: "/dashboard/agents" },
  { icon: BookOpen, label: "知识库", href: "/dashboard/knowledge" },
  { icon: MessageSquare, label: "对话记录", href: "/dashboard/chats" },
];

const externalLinks = [
  { icon: Users, label: "社区", href: "/community" },
  { icon: Store, label: "生态市场", href: "/marketplace" },
];

export function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  const isActive = (href: string) => {
    if (href === "/dashboard") return pathname === "/dashboard";
    return pathname.startsWith(href);
  };

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 bottom-0 bg-white border-r border-neutral-200 z-40 flex flex-col transition-all duration-300",
        collapsed ? "w-16" : "w-64"
      )}
    >
      {/* Logo区域 */}
      <div className="h-16 flex items-center px-4 border-b border-neutral-200 flex-shrink-0">
        <Link href="/" className="flex items-center gap-2 overflow-hidden">
          <div className="w-8 h-8 rounded-lg bg-primary-600 flex items-center justify-center flex-shrink-0">
            <Bot className="w-5 h-5 text-white" />
          </div>
          {!collapsed && (
            <span className="text-lg font-bold text-neutral-900 whitespace-nowrap">
              OPC<span className="text-primary-600">智能体</span>
            </span>
          )}
        </Link>
      </div>

      {/* 主导航 */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {!collapsed && (
          <div className="px-3 mb-2 text-xs font-medium text-neutral-400 uppercase tracking-wider">
            主菜单
          </div>
        )}
        {menuItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-3 rounded-lg transition-colors relative",
              collapsed ? "justify-center px-2 py-2.5" : "px-3 py-2.5",
              isActive(item.href)
                ? "bg-primary-50 text-primary-700"
                : "text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900"
            )}
            title={collapsed ? item.label : undefined}
          >
            {isActive(item.href) && (
              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-primary-600 rounded-r-full" />
            )}
            <item.icon className="w-5 h-5 flex-shrink-0" />
            {!collapsed && (
              <span className="text-sm font-medium">{item.label}</span>
            )}
          </Link>
        ))}

        {/* 分隔线 */}
        <div className="my-3 border-t border-neutral-100" />

        {!collapsed && (
          <div className="px-3 mb-2 text-xs font-medium text-neutral-400 uppercase tracking-wider">
            探索
          </div>
        )}
        {externalLinks.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-3 rounded-lg transition-colors",
              collapsed ? "justify-center px-2 py-2.5" : "px-3 py-2.5",
              "text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900"
            )}
            title={collapsed ? item.label : undefined}
          >
            <item.icon className="w-5 h-5 flex-shrink-0" />
            {!collapsed && (
              <span className="text-sm font-medium">{item.label}</span>
            )}
          </Link>
        ))}
      </nav>

      {/* 折叠按钮 */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="flex items-center justify-center h-12 border-t border-neutral-200 text-neutral-400 hover:text-neutral-600 hover:bg-neutral-50 transition-colors"
      >
        {collapsed ? (
          <ChevronRight className="w-4 h-4" />
        ) : (
          <ChevronLeft className="w-4 h-4" />
        )}
      </button>

      {/* 底部用户信息 */}
      {!collapsed && (
        <div className="px-3 py-4 border-t border-neutral-200">
          <Link
            href="/dashboard/profile"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-neutral-600 hover:bg-neutral-100 transition-colors"
          >
            <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-medium text-sm flex-shrink-0">
              张
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-medium text-neutral-900 truncate">
                张主理人
              </div>
              <div className="text-xs text-neutral-400 truncate">
                pro@opc.com
              </div>
            </div>
            <Settings className="w-4 h-4 text-neutral-400 flex-shrink-0" />
          </Link>
        </div>
      )}
    </aside>
  );
}
