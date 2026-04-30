"use client";

import Link from "next/link";
import { ArrowLeft, Sparkles, Bot, Target, Briefcase, Zap } from "lucide-react";

/**
 * 创建智能体页 - 表单：名称/场景/角色/能力
 */
export default function CreateAgentPage() {
  // 预设场景模板
  const sceneTemplates = [
    { icon: Briefcase, label: "客服", desc: "客户咨询与售后服务" },
    { icon: Target, label: "销售", desc: "产品推荐与客户转化" },
    { icon: Bot, label: "技术", desc: "技术支持与开发辅助" },
    { icon: Sparkles, label: "创意", desc: "内容创作与灵感激发" },
    { icon: Zap, label: "效率", desc: "流程自动化与任务管理" },
  ];

  // 预设能力
  const capabilities = [
    "自然语言理解",
    "多轮对话",
    "知识库检索",
    "文档生成",
    "数据分析",
    "代码生成",
    "图片识别",
    "语音合成",
  ];

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* 返回导航 */}
      <div className="flex items-center gap-3">
        <Link
          href="/dashboard/agents"
          className="p-2 text-neutral-400 hover:text-neutral-600 hover:bg-neutral-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h2 className="text-2xl font-bold text-neutral-900">创建智能体</h2>
          <p className="text-neutral-500 text-sm mt-0.5">
            填写以下信息来创建你的专属AI智能体
          </p>
        </div>
      </div>

      {/* 创建表单 */}
      <form className="space-y-8" onSubmit={(e) => e.preventDefault()}>
        {/* 基本信息 */}
        <div className="bg-white rounded-xl border border-neutral-200 p-6 space-y-5">
          <h3 className="text-lg font-semibold text-neutral-900">基本信息</h3>

          {/* 智能体名称 */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1.5">
              智能体名称 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="给你的智能体起个名字，例如：客服小助手"
              className="w-full px-4 py-2.5 border border-neutral-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
            <p className="mt-1 text-xs text-neutral-400">
              名称长度2-20个字符，建议使用有辨识度的名称
            </p>
          </div>

          {/* 智能体描述 */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1.5">
              简要描述 <span className="text-red-500">*</span>
            </label>
            <textarea
              placeholder="描述你的智能体的主要功能和用途"
              rows={3}
              className="w-full px-4 py-2.5 border border-neutral-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
            />
          </div>

          {/* 头像选择 */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1.5">
              头像
            </label>
            <div className="flex items-center gap-3">
              <div className="w-16 h-16 rounded-xl bg-primary-50 border-2 border-dashed border-primary-300 flex items-center justify-center text-2xl cursor-pointer hover:bg-primary-100 transition-colors">
                🤖
              </div>
              <div className="flex gap-2">
                {["🤖", "💼", "📊", "📝", "🎯", "💡", "🎨", "🔧"].map(
                  (emoji) => (
                    <button
                      key={emoji}
                      type="button"
                      className="w-10 h-10 rounded-lg bg-neutral-50 border border-neutral-200 flex items-center justify-center text-lg hover:bg-primary-50 hover:border-primary-300 transition-colors"
                    >
                      {emoji}
                    </button>
                  )
                )}
              </div>
            </div>
          </div>
        </div>

        {/* 应用场景 */}
        <div className="bg-white rounded-xl border border-neutral-200 p-6 space-y-5">
          <h3 className="text-lg font-semibold text-neutral-900">应用场景</h3>
          <p className="text-sm text-neutral-500">
            选择一个预设场景模板，或自定义你的应用场景
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {sceneTemplates.map((template) => (
              <button
                key={template.label}
                type="button"
                className="p-4 border border-neutral-200 rounded-xl text-left hover:border-primary-300 hover:bg-primary-50 transition-all group"
              >
                <template.icon className="w-6 h-6 text-neutral-400 group-hover:text-primary-600 mb-2 transition-colors" />
                <div className="font-medium text-sm text-neutral-900">
                  {template.label}
                </div>
                <div className="text-xs text-neutral-400 mt-0.5">
                  {template.desc}
                </div>
              </button>
            ))}
          </div>

          {/* 自定义场景描述 */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1.5">
              场景描述
            </label>
            <textarea
              placeholder="详细描述你的智能体将应用于什么场景，面对什么样的用户，解决什么问题..."
              rows={4}
              className="w-full px-4 py-2.5 border border-neutral-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
            />
          </div>
        </div>

        {/* 角色设定 */}
        <div className="bg-white rounded-xl border border-neutral-200 p-6 space-y-5">
          <h3 className="text-lg font-semibold text-neutral-900">角色设定</h3>
          <p className="text-sm text-neutral-500">
            定义智能体的角色人设和回复风格
          </p>

          {/* 角色名称 */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1.5">
              角色名称
            </label>
            <input
              type="text"
              placeholder="例如：资深客服专家、数据分析师"
              className="w-full px-4 py-2.5 border border-neutral-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>

          {/* 角色描述 */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1.5">
              角色描述 / 系统提示词
            </label>
            <textarea
              placeholder="你是一个专业的客服代表，拥有丰富的产品知识。你的回复风格应该友好、专业、耐心..."
              rows={5}
              className="w-full px-4 py-2.5 border border-neutral-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
            />
            <p className="mt-1 text-xs text-neutral-400">
              这将作为智能体的系统提示词，定义其行为和回复方式
            </p>
          </div>

          {/* 回复风格 */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1.5">
              回复风格
            </label>
            <div className="flex flex-wrap gap-2">
              {["专业严谨", "亲切友好", "简洁高效", "幽默风趣", "耐心细致"].map(
                (style) => (
                  <button
                    key={style}
                    type="button"
                    className="px-3 py-1.5 text-sm border border-neutral-300 rounded-full text-neutral-600 hover:border-primary-300 hover:text-primary-600 hover:bg-primary-50 transition-colors"
                  >
                    {style}
                  </button>
                )
              )}
            </div>
          </div>
        </div>

        {/* 能力配置 */}
        <div className="bg-white rounded-xl border border-neutral-200 p-6 space-y-5">
          <h3 className="text-lg font-semibold text-neutral-900">能力配置</h3>
          <p className="text-sm text-neutral-500">
            选择智能体需要具备的能力
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {capabilities.map((cap) => (
              <label
                key={cap}
                className="flex items-center gap-2 p-3 border border-neutral-200 rounded-lg cursor-pointer hover:border-primary-300 hover:bg-primary-50 transition-colors"
              >
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded border-neutral-300 text-primary-600 focus:ring-primary-500"
                />
                <span className="text-sm text-neutral-700">{cap}</span>
              </label>
            ))}
          </div>
        </div>

        {/* 提交按钮 */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <Link
            href="/dashboard/agents"
            className="px-6 py-2.5 text-sm font-medium text-neutral-600 bg-white border border-neutral-300 rounded-lg hover:bg-neutral-50 transition-colors"
          >
            取消
          </Link>
          <button
            type="submit"
            className="px-6 py-2.5 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700 transition-colors"
          >
            创建智能体
          </button>
        </div>
      </form>
    </div>
  );
}
