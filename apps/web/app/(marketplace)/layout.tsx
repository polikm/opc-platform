import Link from "next/link";
import { Bot, Search, ShoppingBag, User } from "lucide-react";

/**
 * 生态市场布局 - 顶部导航 + 内容区
 */
export default function MarketplaceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-neutral-50">
      {/* 顶部导航 */}
      <header className="sticky top-0 z-50 bg-white border-b border-neutral-200">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary-600 flex items-center justify-center">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <span className="text-lg font-bold text-neutral-900">
                OPC<span className="text-primary-600">市场</span>
              </span>
            </Link>

            {/* 市场导航 */}
            <nav className="hidden md:flex items-center gap-1">
              {["全部", "智能体模板", "插件", "能力扩展", "数据集"].map(
                (item, index) => (
                  <button
                    key={item}
                    className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
                      index === 0
                        ? "bg-primary-50 text-primary-700"
                        : "text-neutral-500 hover:text-neutral-700 hover:bg-neutral-100"
                    }`}
                  >
                    {item}
                  </button>
                )
              )}
            </nav>
          </div>

          {/* 右侧操作 */}
          <div className="flex items-center gap-3">
            <div className="relative hidden sm:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
              <input
                type="text"
                placeholder="搜索模板、插件..."
                className="pl-9 pr-4 py-2 border border-neutral-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent w-56"
              />
            </div>
            <button className="relative p-2 text-neutral-400 hover:text-neutral-600 hover:bg-neutral-100 rounded-lg transition-colors">
              <ShoppingBag className="w-5 h-5" />
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                2
              </span>
            </button>
            <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-medium text-sm cursor-pointer">
              张
            </div>
          </div>
        </div>
      </header>

      {/* 内容区 */}
      <main className="max-w-6xl mx-auto px-4 py-6">{children}</main>
    </div>
  );
}
