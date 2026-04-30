"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Send,
  Paperclip,
  Mic,
  Bot,
  User,
  Copy,
  ThumbsUp,
  ThumbsDown,
  RotateCcw,
  MoreHorizontal,
} from "lucide-react";

/**
 * 智能体对话页 - 聊天界面布局
 */

// 模拟对话消息
interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

const initialMessages: Message[] = [
  {
    id: "1",
    role: "assistant",
    content:
      "你好！我是客服小助手，很高兴为你服务。请问有什么可以帮助你的吗？",
    timestamp: "10:00",
  },
  {
    id: "2",
    role: "user",
    content: "我想了解一下你们的产品退货政策",
    timestamp: "10:01",
  },
  {
    id: "3",
    role: "assistant",
    content: `好的，我来为您介绍我们的退货政策：

**退货条件：**
- 商品自签收之日起 7 天内可申请退货
- 商品需保持原包装完好，不影响二次销售
- 定制类商品不支持无理由退货

**退货流程：**
1. 在"我的订单"中找到对应订单
2. 点击"申请退货"按钮
3. 选择退货原因并提交申请
4. 等待客服审核（1-2个工作日）
5. 审核通过后按照指引寄回商品
6. 收到商品后 3 个工作日内退款

**运费说明：**
- 质量问题：由我们承担运费
- 非质量问题：由买家承担运费

请问您需要申请退货吗？我可以帮您查看订单信息。`,
    timestamp: "10:01",
  },
];

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [inputValue, setInputValue] = useState("");

  const handleSend = () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: inputValue,
      timestamp: new Date().toLocaleTimeString("zh-CN", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
  };

  return (
    <div className="flex h-[calc(100vh-4rem)] -m-6">
      {/* ========== 左侧对话列表 ========== */}
      <div className="w-72 bg-white border-r border-neutral-200 flex flex-col flex-shrink-0">
        {/* 对话列表头部 */}
        <div className="p-4 border-b border-neutral-200">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-neutral-900 text-sm">对话列表</h3>
            <button className="p-1.5 text-neutral-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors">
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
            </button>
          </div>
          <div className="relative">
            <input
              type="text"
              placeholder="搜索对话..."
              className="w-full pl-8 pr-3 py-2 text-sm border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-neutral-50"
            />
            <svg
              className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-neutral-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>

        {/* 对话列表 */}
        <div className="flex-1 overflow-y-auto">
          {[
            { title: "退货政策咨询", time: "10:01", active: true },
            { title: "产品功能介绍", time: "昨天" },
            { title: "订单查询", time: "昨天" },
            { title: "会员权益说明", time: "3天前" },
            { title: "配送时效咨询", time: "1周前" },
          ].map((chat) => (
            <button
              key={chat.title}
              className={`w-full text-left px-4 py-3 border-b border-neutral-100 transition-colors ${
                chat.active
                  ? "bg-primary-50 border-l-2 border-l-primary-600"
                  : "hover:bg-neutral-50"
              }`}
            >
              <div className="flex items-center justify-between">
                <span
                  className={`text-sm font-medium truncate ${
                    chat.active ? "text-primary-700" : "text-neutral-900"
                  }`}
                >
                  {chat.title}
                </span>
                <span className="text-xs text-neutral-400 ml-2 flex-shrink-0">
                  {chat.time}
                </span>
              </div>
              <p className="text-xs text-neutral-400 truncate mt-0.5">
                客服小助手
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* ========== 右侧对话区域 ========== */}
      <div className="flex-1 flex flex-col bg-neutral-50">
        {/* 对话头部 */}
        <div className="h-14 bg-white border-b border-neutral-200 flex items-center justify-between px-4 flex-shrink-0">
          <div className="flex items-center gap-3">
            <Link
              href="/dashboard/agents/1"
              className="p-1.5 text-neutral-400 hover:text-neutral-600 hover:bg-neutral-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div className="w-8 h-8 rounded-lg bg-primary-50 flex items-center justify-center text-sm">
              🤖
            </div>
            <div>
              <h3 className="text-sm font-semibold text-neutral-900">
                客服小助手
              </h3>
              <span className="text-xs text-green-600">在线</span>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <button className="p-2 text-neutral-400 hover:text-neutral-600 hover:bg-neutral-100 rounded-lg transition-colors">
              <MoreHorizontal className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* 消息列表 */}
        <div className="flex-1 overflow-y-auto px-4 py-6 space-y-6">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-3 ${
                message.role === "user" ? "flex-row-reverse" : ""
              }`}
            >
              {/* 头像 */}
              <div
                className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                  message.role === "assistant"
                    ? "bg-primary-100 text-primary-700"
                    : "bg-neutral-200 text-neutral-600"
                }`}
              >
                {message.role === "assistant" ? (
                  <Bot className="w-4 h-4" />
                ) : (
                  <User className="w-4 h-4" />
                )}
              </div>

              {/* 消息内容 */}
              <div
                className={`max-w-[70%] ${
                  message.role === "user" ? "items-end" : ""
                }`}
              >
                <div
                  className={`px-4 py-3 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${
                    message.role === "assistant"
                      ? "bg-white border border-neutral-200 text-neutral-800 rounded-tl-md"
                      : "bg-primary-600 text-white rounded-tr-md"
                  }`}
                >
                  {message.content}
                </div>

                {/* 消息操作 */}
                {message.role === "assistant" && (
                  <div className="flex items-center gap-1 mt-1.5 ml-1">
                    <button className="p-1 text-neutral-300 hover:text-neutral-500 rounded transition-colors">
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                    <button className="p-1 text-neutral-300 hover:text-green-500 rounded transition-colors">
                      <ThumbsUp className="w-3.5 h-3.5" />
                    </button>
                    <button className="p-1 text-neutral-300 hover:text-red-400 rounded transition-colors">
                      <ThumbsDown className="w-3.5 h-3.5" />
                    </button>
                    <button className="p-1 text-neutral-300 hover:text-neutral-500 rounded transition-colors">
                      <RotateCcw className="w-3.5 h-3.5" />
                    </button>
                    <span className="text-xs text-neutral-300 ml-1">
                      {message.timestamp}
                    </span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* 输入区域 */}
        <div className="bg-white border-t border-neutral-200 p-4">
          <div className="flex items-end gap-3 max-w-4xl mx-auto">
            {/* 附件按钮 */}
            <button className="p-2.5 text-neutral-400 hover:text-neutral-600 hover:bg-neutral-100 rounded-lg transition-colors flex-shrink-0">
              <Paperclip className="w-5 h-5" />
            </button>

            {/* 输入框 */}
            <div className="flex-1 relative">
              <textarea
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
                placeholder="输入消息... (Enter发送，Shift+Enter换行)"
                rows={1}
                className="w-full px-4 py-2.5 border border-neutral-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none max-h-32"
              />
            </div>

            {/* 语音按钮 */}
            <button className="p-2.5 text-neutral-400 hover:text-neutral-600 hover:bg-neutral-100 rounded-lg transition-colors flex-shrink-0">
              <Mic className="w-5 h-5" />
            </button>

            {/* 发送按钮 */}
            <button
              onClick={handleSend}
              disabled={!inputValue.trim()}
              className="p-2.5 text-white bg-primary-600 rounded-lg hover:bg-primary-700 disabled:bg-neutral-300 disabled:cursor-not-allowed transition-colors flex-shrink-0"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
          <p className="text-xs text-neutral-400 text-center mt-2">
            AI回复仅供参考，重要信息请以官方渠道确认为准
          </p>
        </div>
      </div>
    </div>
  );
}
