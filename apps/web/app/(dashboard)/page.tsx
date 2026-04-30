import Link from "next/link";
import {
  Bot,
  Plus,
  MessageSquare,
  BookOpen,
  TrendingUp,
  Users,
  ArrowUpRight,
  Clock,
  Zap,
} from "lucide-react";

/**
 * 工作台首页 - 数据概览 + 快捷操作
 */
export default function DashboardPage() {
  // 数据概览卡片
  const stats = [
    {
      label: "我的智能体",
      value: "3",
      change: "+1 本周",
      icon: Bot,
      color: "bg-primary-50 text-primary-600",
      href: "/dashboard/agents",
    },
    {
      label: "今日对话",
      value: "128",
      change: "+12%",
      icon: MessageSquare,
      color: "bg-green-50 text-green-600",
      href: "/dashboard/chats",
    },
    {
      label: "知识库文档",
      value: "24",
      change: "+3 本周",
      icon: BookOpen,
      color: "bg-purple-50 text-purple-600",
      href: "/dashboard/knowledge",
    },
    {
      label: "活跃用户",
      value: "1,024",
      change: "+8.5%",
      icon: Users,
      color: "bg-orange-50 text-orange-600",
      href: "#",
    },
  ];

  // 快捷操作
  const quickActions = [
    {
      label: "创建智能体",
      desc: "快速创建一个新的AI智能体",
      icon: Plus,
      href: "/dashboard/agents/create",
      color: "bg-primary-600 hover:bg-primary-700",
    },
    {
      label: "上传知识",
      desc: "为智能体添加知识文档",
      icon: BookOpen,
      href: "/dashboard/knowledge",
      color: "bg-neutral-800 hover:bg-neutral-900",
    },
    {
      label: "查看对话",
      desc: "浏览最近的对话记录",
      icon: MessageSquare,
      href: "/dashboard/chats",
      color: "bg-neutral-800 hover:bg-neutral-900",
    },
    {
      label: "浏览市场",
      desc: "发现优质智能体模板",
      icon: Zap,
      href: "/marketplace",
      color: "bg-neutral-800 hover:bg-neutral-900",
    },
  ];

  // 最近活动
  const recentActivities = [
    {
      time: "10分钟前",
      text: '智能体"客服小助手"处理了5条新对话',
      type: "info",
    },
    {
      time: "1小时前",
      text: "知识库文档《产品FAQ》更新成功",
      type: "success",
    },
    {
      time: "3小时前",
      text: '智能体"销售顾问"获得3个五星好评',
      type: "success",
    },
    {
      time: "昨天",
      text: "新智能体"数据分析助手"创建成功",
      type: "info",
    },
  ];

  return (
    <div className="space-y-6">
      {/* 欢迎区域 */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-neutral-900">
            你好，张主理人
          </h2>
          <p className="text-neutral-500 mt-1">
            欢迎回到OPC智能体工作台，以下是你的运营概览
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

      {/* 数据概览卡片 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Link
            key={stat.label}
            href={stat.href}
            className="p-5 bg-white rounded-xl border border-neutral-200 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between mb-3">
              <div
                className={`w-10 h-10 rounded-lg flex items-center justify-center ${stat.color}`}
              >
                <stat.icon className="w-5 h-5" />
              </div>
              <ArrowUpRight className="w-4 h-4 text-neutral-300" />
            </div>
            <div className="text-2xl font-bold text-neutral-900">
              {stat.value}
            </div>
            <div className="flex items-center justify-between mt-1">
              <span className="text-sm text-neutral-500">{stat.label}</span>
              <span className="text-xs text-green-600 font-medium">
                {stat.change}
              </span>
            </div>
          </Link>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* 快捷操作 */}
        <div className="lg:col-span-2">
          <h3 className="text-lg font-semibold text-neutral-900 mb-4">
            快捷操作
          </h3>
          <div className="grid sm:grid-cols-2 gap-4">
            {quickActions.map((action) => (
              <Link
                key={action.label}
                href={action.href}
                className="group p-5 bg-white rounded-xl border border-neutral-200 hover:shadow-md transition-all"
              >
                <div className="flex items-start gap-4">
                  <div
                    className={`w-10 h-10 rounded-lg flex items-center justify-center text-white ${action.color} transition-colors`}
                  >
                    <action.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-medium text-neutral-900 group-hover:text-primary-600 transition-colors">
                      {action.label}
                    </h4>
                    <p className="text-sm text-neutral-500 mt-0.5">
                      {action.desc}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* 最近活动 */}
        <div>
          <h3 className="text-lg font-semibold text-neutral-900 mb-4">
            最近动态
          </h3>
          <div className="bg-white rounded-xl border border-neutral-200 divide-y divide-neutral-100">
            {recentActivities.map((activity, index) => (
              <div key={index} className="p-4">
                <div className="flex items-start gap-3">
                  <div
                    className={`mt-1 w-2 h-2 rounded-full ${
                      activity.type === "success"
                        ? "bg-green-500"
                        : "bg-primary-500"
                    }`}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-neutral-700">{activity.text}</p>
                    <div className="flex items-center gap-1 mt-1 text-xs text-neutral-400">
                      <Clock className="w-3 h-3" />
                      {activity.time}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 我的智能体列表 */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-neutral-900">我的智能体</h3>
          <Link
            href="/dashboard/agents"
            className="text-sm text-primary-600 hover:text-primary-700 font-medium"
          >
            查看全部
          </Link>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            {
              name: "客服小助手",
              desc: "处理客户咨询、售后问题、产品推荐",
              status: "运行中",
              conversations: 56,
            },
            {
              name: "销售顾问",
              desc: "产品介绍、方案推荐、客户跟进",
              status: "运行中",
              conversations: 34,
            },
            {
              name: "数据分析助手",
              desc: "数据查询、报表生成、趋势分析",
              status: "调试中",
              conversations: 12,
            },
          ].map((agent) => (
            <div
              key={agent.name}
              className="p-5 bg-white rounded-xl border border-neutral-200 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary-50 flex items-center justify-center">
                    <Bot className="w-5 h-5 text-primary-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-neutral-900">
                      {agent.name}
                    </h4>
                    <span
                      className={`inline-flex items-center gap-1 text-xs ${
                        agent.status === "运行中"
                          ? "text-green-600"
                          : "text-yellow-600"
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          agent.status === "运行中"
                            ? "bg-green-500"
                            : "bg-yellow-500"
                        }`}
                      />
                      {agent.status}
                    </span>
                  </div>
                </div>
              </div>
              <p className="text-sm text-neutral-500 mb-3">{agent.desc}</p>
              <div className="flex items-center justify-between text-xs text-neutral-400">
                <span>今日 {agent.conversations} 条对话</span>
                <Link
                  href={`/dashboard/agents/1/chat`}
                  className="text-primary-600 hover:text-primary-700 font-medium"
                >
                  进入对话
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
