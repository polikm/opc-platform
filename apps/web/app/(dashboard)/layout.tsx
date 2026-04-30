import Link from "next/link";
import {
  Bot,
  LayoutDashboard,
  Users,
  BookOpen,
  Store,
  MessageSquare,
  Settings,
  Bell,
  Search,
  ChevronDown,
  Menu,
} from "lucide-react";

/**
 * 主理人工作台布局 - 侧边栏 + 顶栏 + 内容区
 */
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // 侧边栏导航菜单
  const navItems = [
    { icon: LayoutDashboard, label: "工作台", href: "/dashboard", active: true },
    { icon: Bot, label: "智能体管理", href: "/dashboard/agents" },
    { icon: BookOpen, label: "知识库", href: "/dashboard/knowledge" },
    { icon: MessageSquare, label: "对话记录", href: "/dashboard/chats" },
    { icon: Users, label: "社区", href: "/community" },
    { icon: Store, label: "生态市场", href: "/marketplace" },
  ];

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* ========== 侧边栏 ========== */}
      <aside className="fixed left-0 top-0 bottom-0 w-64 bg-white border-r border-neutral-200 z-40 flex flex-col">
        {/* Logo */}
        <div className="h-16 flex items-center px-6 border-b border-neutral-200">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary-600 flex items-center justify-center">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-bold text-neutral-900">
              OPC<span className="text-primary-600">智能体</span>
            </span>
          </Link>
        </div>

        {/* 导航菜单 */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                item.active
                  ? "bg-primary-50 text-primary-700"
                  : "text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900"
              }`}
            >
              <item.icon className={`w-5 h-5 ${item.active ? "text-primary-600" : ""}`} />
              {item.label}
            </Link>
          ))}
        </nav>

        {/* 底部用户信息 */}
        <div className="px-3 py-4 border-t border-neutral-200">
          <Link
            href="/dashboard/profile"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-neutral-600 hover:bg-neutral-100 transition-colors"
          >
            <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-medium text-sm">
              张
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-medium text-neutral-900 truncate">张主理人</div>
              <div className="text-xs text-neutral-400 truncate">pro@opc.com</div>
            </div>
            <Settings className="w-4 h-4 text-neutral-400" />
          </Link>
        </div>
      </aside>

      {/* ========== 主内容区 ========== */}
      <div className="ml-64">
        {/* 顶栏 */}
        <header className="sticky top-0 z-30 h-16 bg-white border-b border-neutral-200 flex items-center justify-between px-6">
          {/* 左侧 - 页面标题 */}
          <div className="flex items-center gap-4">
            <button className="lg:hidden p-2 text-neutral-400 hover:text-neutral-600">
              <Menu className="w-5 h-5" />
            </button>
            <h1 className="text-lg font-semibold text-neutral-900">工作台</h1>
          </div>

          {/* 右侧 - 操作区 */}
          <div className="flex items-center gap-4">
            {/* 搜索 */}
            <button className="p-2 text-neutral-400 hover:text-neutral-600 hover:bg-neutral-100 rounded-lg transition-colors">
              <Search className="w-5 h-5" />
            </button>

            {/* 通知 */}
            <button className="relative p-2 text-neutral-400 hover:text-neutral-600 hover:bg-neutral-100 rounded-lg transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
            </button>

            {/* 用户下拉 */}
            <button className="flex items-center gap-2 pl-2 pr-3 py-1.5 hover:bg-neutral-100 rounded-lg transition-colors">
              <div className="w-7 h-7 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-medium text-xs">
                张
              </div>
              <span className="text-sm font-medium text-neutral-700">张主理人</span>
              <ChevronDown className="w-4 h-4 text-neutral-400" />
            </button>
          </div>
        </header>

        {/* 页面内容 */}
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}
