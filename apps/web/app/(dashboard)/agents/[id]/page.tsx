"use client";

import Link from "next/link";
import {
  ArrowLeft,
  Save,
  MessageSquare,
  Settings,
  BookOpen,
  BarChart3,
  Trash2,
  Power,
  ExternalLink,
} from "lucide-react";

/**
 * 智能体详情/编辑页
 */
export default function AgentDetailPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* 返回导航 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard/agents"
            className="p-2 text-neutral-400 hover:text-neutral-600 hover:bg-neutral-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary-50 flex items-center justify-center text-xl">
              🤖
            </div>
            <div>
              <h2 className="text-2xl font-bold text-neutral-900">
                客服小助手
              </h2>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="inline-flex items-center gap-1 text-xs text-green-600">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                  运行中
                </span>
                <span className="text-xs text-neutral-400">
                  创建于 2026-01-15
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/dashboard/agents/1/chat"
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700 transition-colors"
          >
            <MessageSquare className="w-4 h-4" />
            对话
          </Link>
          <button className="p-2 text-neutral-400 hover:text-neutral-600 hover:bg-neutral-100 rounded-lg transition-colors">
            <ExternalLink className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Tab导航 */}
      <div className="border-b border-neutral-200">
        <nav className="flex gap-6">
          {[
            { icon: Settings, label: "基本设置", active: true },
            { icon: BookOpen, label: "知识库", active: false },
            { icon: BarChart3, label: "数据统计", active: false },
          ].map((tab) => (
            <button
              key={tab.label}
              className={`flex items-center gap-2 px-1 py-3 text-sm font-medium border-b-2 transition-colors ${
                tab.active
                  ? "border-primary-600 text-primary-600"
                  : "border-transparent text-neutral-500 hover:text-neutral-700"
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* 编辑表单 */}
      <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
        {/* 基本信息 */}
        <div className="bg-white rounded-xl border border-neutral-200 p-6 space-y-5">
          <h3 className="text-lg font-semibold text-neutral-900">基本信息</h3>

          <div className="grid sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1.5">
                智能体名称
              </label>
              <input
                type="text"
                defaultValue="客服小助手"
                className="w-full px-4 py-2.5 border border-neutral-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1.5">
                应用场景
              </label>
              <select className="w-full px-4 py-2.5 border border-neutral-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white">
                <option>客服</option>
                <option>销售</option>
                <option>技术支持</option>
                <option>内容创作</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1.5">
              简要描述
            </label>
            <textarea
              defaultValue="处理客户咨询、售后问题、产品推荐"
              rows={2}
              className="w-full px-4 py-2.5 border border-neutral-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
            />
          </div>
        </div>

        {/* 角色设定 */}
        <div className="bg-white rounded-xl border border-neutral-200 p-6 space-y-5">
          <h3 className="text-lg font-semibold text-neutral-900">角色设定</h3>

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1.5">
              角色名称
            </label>
            <input
              type="text"
              defaultValue="资深客服专家"
              className="w-full px-4 py-2.5 border border-neutral-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1.5">
              系统提示词
            </label>
            <textarea
              defaultValue="你是一个专业的客服代表，拥有丰富的产品知识。你的回复风格应该友好、专业、耐心。当遇到无法回答的问题时，请诚实地告知用户并建议联系人工客服。"
              rows={5}
              className="w-full px-4 py-2.5 border border-neutral-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none font-mono"
            />
            <p className="mt-1 text-xs text-neutral-400">
              当前字数：68 / 建议不超过500字
            </p>
          </div>
        </div>

        {/* 能力配置 */}
        <div className="bg-white rounded-xl border border-neutral-200 p-6 space-y-5">
          <h3 className="text-lg font-semibold text-neutral-900">能力配置</h3>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: "自然语言理解", checked: true },
              { label: "多轮对话", checked: true },
              { label: "知识库检索", checked: true },
              { label: "文档生成", checked: false },
              { label: "数据分析", checked: false },
              { label: "代码生成", checked: false },
              { label: "图片识别", checked: false },
              { label: "语音合成", checked: false },
            ].map((cap) => (
              <label
                key={cap.label}
                className={`flex items-center gap-2 p-3 border rounded-lg cursor-pointer transition-colors ${
                  cap.checked
                    ? "border-primary-300 bg-primary-50"
                    : "border-neutral-200 hover:border-primary-300 hover:bg-primary-50"
                }`}
              >
                <input
                  type="checkbox"
                  defaultChecked={cap.checked}
                  className="w-4 h-4 rounded border-neutral-300 text-primary-600 focus:ring-primary-500"
                />
                <span className="text-sm text-neutral-700">{cap.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* 危险操作 */}
        <div className="bg-white rounded-xl border border-red-200 p-6 space-y-4">
          <h3 className="text-lg font-semibold text-red-600">危险操作</h3>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-neutral-700">暂停智能体</p>
              <p className="text-xs text-neutral-400">
                暂停后智能体将不再响应对话请求
              </p>
            </div>
            <button className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-yellow-700 bg-yellow-50 border border-yellow-200 rounded-lg hover:bg-yellow-100 transition-colors">
              <Power className="w-4 h-4" />
              暂停
            </button>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-neutral-700">删除智能体</p>
              <p className="text-xs text-neutral-400">
                删除后数据不可恢复，请谨慎操作
              </p>
            </div>
            <button className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-700 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 transition-colors">
              <Trash2 className="w-4 h-4" />
              删除
            </button>
          </div>
        </div>

        {/* 保存按钮 */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <Link
            href="/dashboard/agents"
            className="px-6 py-2.5 text-sm font-medium text-neutral-600 bg-white border border-neutral-300 rounded-lg hover:bg-neutral-50 transition-colors"
          >
            取消
          </Link>
          <button
            type="submit"
            className="inline-flex items-center gap-2 px-6 py-2.5 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700 transition-colors"
          >
            <Save className="w-4 h-4" />
            保存修改
          </button>
        </div>
      </form>
    </div>
  );
}
