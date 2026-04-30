import Sidebar from '@/components/admin/sidebar';
import { Bell, Search, User } from 'lucide-react';

/**
 * 管理后台布局组件
 * 包含左侧导航栏、顶部栏和内容区域
 */
export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[var(--background)]">
      {/* 左侧导航栏 */}
      <Sidebar />

      {/* 主内容区域 */}
      <div className="ml-60 transition-all duration-300">
        {/* 顶部栏 */}
        <header className="sticky top-0 z-20 h-16 bg-white border-b border-[var(--border)] flex items-center justify-between px-6">
          {/* 左侧：页面标题 */}
          <div className="flex items-center gap-4">
            <h2 className="text-lg font-semibold text-gray-900">管理后台</h2>
          </div>

          {/* 右侧：搜索和操作 */}
          <div className="flex items-center gap-4">
            {/* 搜索框 */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="全局搜索..."
                className="w-64 pl-9 pr-4 py-2 rounded-lg border border-[var(--border)] bg-gray-50 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
              />
            </div>

            {/* 通知 */}
            <button className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors">
              <Bell className="w-5 h-5 text-gray-500" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
            </button>

            {/* 用户信息 */}
            <div className="flex items-center gap-3 pl-4 border-l border-[var(--border)]">
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                <User className="w-4 h-4 text-white" />
              </div>
              <div className="hidden md:block">
                <p className="text-sm font-medium text-gray-900">管理员</p>
                <p className="text-xs text-gray-400">admin@opc.ai</p>
              </div>
            </div>
          </div>
        </header>

        {/* 内容区域 */}
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
