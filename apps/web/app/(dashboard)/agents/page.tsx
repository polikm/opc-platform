import Link from "next/link";
import {
  Plus,
  Bot,
  MoreVertical,
  Search,
  Filter,
  MessageSquare,
  Settings,
  Power,
  Trash2,
} from "lucide-react";

/**
 * 智能体管理页 - 列表 + 创建按钮
 */
export default function AgentsPage() {
  // 模拟智能体列表数据
  const agents = [
    {
      id: "1",
      name: "客服小助手",
      desc: "处理客户咨询、售后问题、产品推荐",
      status: "running",
      conversations: 1256,
      satisfaction: 98.5,
      createdAt: "2026-01-15",
      avatar: "🤖",
    },
    {
      id: "2",
      name: "销售顾问",
      desc: "产品介绍、方案推荐、客户跟进",
      status: "running",
      conversations: 834,
      satisfaction: 96.2,
      createdAt: "2026-02-20",
      avatar: "💼",
    },
    {
      id: "3",
      name: "数据分析助手",
      desc: "数据查询、报表生成、趋势分析",
      status: "debugging",
      conversations: 156,
      satisfaction: 94.8,
      createdAt: "2026-03-10",
      avatar: "📊",
    },
    {
      id: "4",
      name: "技术文档助手",
      desc: "技术文档检索、代码解释、开发指导",
      status: "stopped",
      conversations: 423,
      satisfaction: 97.1,
      createdAt: "2026-04-01",
      avatar: "📝",
    },
  ];

  const statusMap: Record<string, { label: string; color: string }> = {
    running: { label: "运行中", color: "bg-green-50 text-green-700 border-green-200" },
    debugging: { label: "调试中", color: "bg-yellow-50 text-yellow-700 border-yellow-200" },
    stopped: { label: "已停止", color: "bg-neutral-100 text-neutral-600 border-neutral-200" },
  };

  return (
    <div className="space-y-6">
      {/* 页面标题和操作 */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-neutral-900">智能体管理</h2>
          <p className="text-neutral-500 mt-1">
            管理你的所有AI智能体，共 {agents.length} 个
          </p>
        </div>
        <Link
          href="/dashboard/agents/create"
          className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          创建智能体
        </Link>
      </div>

      {/* 搜索和筛选 */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
          <input
            type="text"
            placeholder="搜索智能体..."
            className="w-full pl-10 pr-4 py-2.5 border border-neutral-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white"
          />
        </div>
        <button className="inline-flex items-center gap-2 px-4 py-2.5 border border-neutral-300 rounded-lg text-sm text-neutral-600 hover:bg-neutral-50 transition-colors bg-white">
          <Filter className="w-4 h-4" />
          筛选
        </button>
      </div>

      {/* 智能体列表 */}
      <div className="bg-white rounded-xl border border-neutral-200 divide-y divide-neutral-100">
        {agents.map((agent) => {
          const status = statusMap[agent.status];
          return (
            <div
              key={agent.id}
              className="flex items-center gap-4 p-5 hover:bg-neutral-50 transition-colors"
            >
              {/* 头像 */}
              <div className="w-12 h-12 rounded-xl bg-primary-50 flex items-center justify-center text-2xl flex-shrink-0">
                {agent.avatar}
              </div>

              {/* 信息 */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-1">
                  <h3 className="font-semibold text-neutral-900">
                    {agent.name}
                  </h3>
                  <span
                    className={`inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-full border ${status.color}`}
                  >
                    {status.label}
                  </span>
                </div>
                <p className="text-sm text-neutral-500 truncate">
                  {agent.desc}
                </p>
              </div>

              {/* 数据指标 */}
              <div className="hidden md:flex items-center gap-8">
                <div className="text-center">
                  <div className="text-lg font-semibold text-neutral-900">
                    {agent.conversations.toLocaleString()}
                  </div>
                  <div className="text-xs text-neutral-400">总对话</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-semibold text-neutral-900">
                    {agent.satisfaction}%
                  </div>
                  <div className="text-xs text-neutral-400">满意度</div>
                </div>
              </div>

              {/* 操作按钮 */}
              <div className="flex items-center gap-2">
                <Link
                  href={`/dashboard/agents/${agent.id}/chat`}
                  className="p-2 text-neutral-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                  title="对话"
                >
                  <MessageSquare className="w-4 h-4" />
                </Link>
                <Link
                  href={`/dashboard/agents/${agent.id}`}
                  className="p-2 text-neutral-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                  title="设置"
                >
                  <Settings className="w-4 h-4" />
                </Link>
                <button
                  className="p-2 text-neutral-400 hover:text-neutral-600 hover:bg-neutral-100 rounded-lg transition-colors"
                  title="更多"
                >
                  <MoreVertical className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
