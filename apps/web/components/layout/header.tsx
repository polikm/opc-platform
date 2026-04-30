"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Bot,
  Search,
  Bell,
  Menu,
  X,
  ChevronDown,
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

/**
 * Header组件 - 顶部导航栏
 * Logo + 导航链接 + 用户头像
 */

// 导航链接配置
const navLinks = [
  { label: "首页", href: "/" },
  { label: "社区", href: "/community" },
  { label: "生态市场", href: "/marketplace" },
];

export function Header() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 glass border-b border-neutral-200/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 flex-shrink-0">
            <div className="w-8 h-8 rounded-lg bg-primary-600 flex items-center justify-center">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-foreground">
              OPC<span className="text-primary-600">智能体</span>
            </span>
          </Link>

          {/* 桌面端导航 */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "px-4 py-2 text-sm font-medium rounded-lg transition-colors",
                    isActive
                      ? "bg-primary-50 text-primary-700"
                      : "text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100"
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* 右侧操作区 */}
          <div className="flex items-center gap-3">
            {/* 搜索 */}
            <button className="hidden sm:flex p-2 text-neutral-400 hover:text-neutral-600 hover:bg-neutral-100 rounded-lg transition-colors">
              <Search className="w-5 h-5" />
            </button>

            {/* 通知 */}
            <button className="relative p-2 text-neutral-400 hover:text-neutral-600 hover:bg-neutral-100 rounded-lg transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
            </button>

            {/* 用户菜单 */}
            <div className="hidden sm:flex items-center gap-2 pl-2 pr-3 py-1.5 hover:bg-neutral-100 rounded-lg transition-colors cursor-pointer">
              <div className="w-7 h-7 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-medium text-xs">
                张
              </div>
              <span className="text-sm font-medium text-neutral-700">张主理人</span>
              <ChevronDown className="w-4 h-4 text-neutral-400" />
            </div>

            {/* 登录/注册（未登录时显示） */}
            <div className="hidden sm:flex items-center gap-2">
              <Link
                href="/login"
                className="px-3 py-1.5 text-sm text-neutral-600 hover:text-primary-600 transition-colors"
              >
                登录
              </Link>
              <Link
                href="/register"
                className="px-4 py-1.5 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700 transition-colors"
              >
                注册
              </Link>
            </div>

            {/* 移动端菜单按钮 */}
            <button
              className="md:hidden p-2 text-neutral-400 hover:text-neutral-600"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {/* 移动端菜单 */}
        {mobileMenuOpen && (
          <div className="md:hidden py-3 border-t border-neutral-200">
            <nav className="space-y-1">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      "block px-4 py-2.5 text-sm font-medium rounded-lg transition-colors",
                      isActive
                        ? "bg-primary-50 text-primary-700"
                        : "text-neutral-600 hover:bg-neutral-100"
                    )}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>
            <div className="mt-3 pt-3 border-t border-neutral-100 flex items-center gap-3 px-4">
              <Link
                href="/login"
                className="flex-1 text-center py-2 text-sm font-medium text-neutral-600 border border-neutral-300 rounded-lg"
              >
                登录
              </Link>
              <Link
                href="/register"
                className="flex-1 text-center py-2 text-sm font-medium text-white bg-primary-600 rounded-lg"
              >
                注册
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
