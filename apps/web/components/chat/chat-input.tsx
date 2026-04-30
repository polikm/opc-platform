"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Send, Paperclip, Mic, Image } from "lucide-react";

/**
 * ChatInput组件 - 聊天输入框
 * 支持文本输入、附件上传、语音输入、发送
 */

export interface ChatInputProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "onSubmit"> {
  /** 发送消息回调 */
  onSubmit?: (message: string) => void;
  /** 上传附件回调 */
  onUpload?: (files: FileList) => void;
  /** 语音输入回调 */
  onVoiceInput?: () => void;
  /** 是否正在加载（AI回复中） */
  loading?: boolean;
  /** 占位符文本 */
  placeholder?: string;
  /** 是否禁用 */
  disabled?: boolean;
}

const ChatInput = React.forwardRef<HTMLDivElement, ChatInputProps>(
  (
    {
      className,
      onSubmit,
      onUpload,
      onVoiceInput,
      loading = false,
      placeholder = "输入消息... (Enter发送，Shift+Enter换行)",
      disabled = false,
      ...props
    },
    ref
  ) => {
    const [value, setValue] = React.useState("");

    const handleSend = () => {
      const trimmed = value.trim();
      if (!trimmed || disabled || loading) return;
      onSubmit?.(trimmed);
      setValue("");
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleSend();
      }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files.length > 0) {
        onUpload?.(e.target.files);
        e.target.value = "";
      }
    };

    return (
      <div
        ref={ref}
        className={cn(
          "bg-white border-t border-neutral-200 p-4",
          className
        )}
        {...props}
      >
        <div className="flex items-end gap-3 max-w-4xl mx-auto">
          {/* 附件上传按钮 */}
          <div className="flex items-center gap-1 flex-shrink-0">
            <label className="p-2.5 text-neutral-400 hover:text-neutral-600 hover:bg-neutral-100 rounded-lg transition-colors cursor-pointer">
              <Paperclip className="w-5 h-5" />
              <input
                type="file"
                multiple
                className="hidden"
                onChange={handleFileChange}
                accept=".pdf,.doc,.docx,.txt,.xlsx,.csv,.png,.jpg,.jpeg"
              />
            </label>
            <label className="p-2.5 text-neutral-400 hover:text-neutral-600 hover:bg-neutral-100 rounded-lg transition-colors cursor-pointer">
              <Image className="w-5 h-5" />
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
              />
            </label>
          </div>

          {/* 输入框 */}
          <div className="flex-1 relative">
            <textarea
              value={value}
              onChange={(e) => setValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={placeholder}
              rows={1}
              disabled={disabled}
              className="w-full px-4 py-2.5 border border-neutral-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none max-h-32 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                minHeight: "42px",
                height: "auto",
              }}
              onInput={(e) => {
                const target = e.target as HTMLTextAreaElement;
                target.style.height = "auto";
                target.style.height = Math.min(target.scrollHeight, 128) + "px";
              }}
            />
          </div>

          {/* 语音输入按钮 */}
          <button
            onClick={onVoiceInput}
            className="p-2.5 text-neutral-400 hover:text-neutral-600 hover:bg-neutral-100 rounded-lg transition-colors flex-shrink-0"
            title="语音输入"
          >
            <Mic className="w-5 h-5" />
          </button>

          {/* 发送按钮 */}
          <button
            onClick={handleSend}
            disabled={!value.trim() || disabled || loading}
            className="p-2.5 text-white bg-primary-600 rounded-lg hover:bg-primary-700 disabled:bg-neutral-300 disabled:cursor-not-allowed transition-colors flex-shrink-0"
            title="发送"
          >
            {loading ? (
              <svg
                className="w-5 h-5 animate-spin"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                />
              </svg>
            ) : (
              <Send className="w-5 h-5" />
            )}
          </button>
        </div>

        {/* 底部提示 */}
        <p className="text-xs text-neutral-400 text-center mt-2">
          AI回复仅供参考，重要信息请以官方渠道确认为准
        </p>
      </div>
    );
  }
);

ChatInput.displayName = "ChatInput";

export { ChatInput };
