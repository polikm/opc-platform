import * as React from "react";
import { cn } from "@/lib/utils";
import { Bot, User, Copy, ThumbsUp, ThumbsDown, RotateCcw } from "lucide-react";

/**
 * MessageBubble组件 - 聊天气泡
 * 支持用户消息和AI助手消息，包含操作按钮
 */

export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp?: string;
}

export interface MessageBubbleProps extends React.HTMLAttributes<HTMLDivElement> {
  /** 消息数据 */
  message: Message;
  /** 是否显示操作按钮 */
  showActions?: boolean;
  /** 操作按钮点击回调 */
  onAction?: (action: string, messageId: string) => void;
}

const MessageBubble = React.forwardRef<HTMLDivElement, MessageBubbleProps>(
  ({ className, message, showActions = true, onAction, ...props }, ref) => {
    const isAssistant = message.role === "assistant";

    return (
      <div
        ref={ref}
        className={cn(
          "flex gap-3 animate-fade-in",
          isAssistant ? "" : "flex-row-reverse",
          className
        )}
        {...props}
      >
        {/* 头像 */}
        <div
          className={cn(
            "w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0",
            isAssistant
              ? "bg-primary-100 text-primary-700"
              : "bg-neutral-200 text-neutral-600"
          )}
        >
          {isAssistant ? (
            <Bot className="w-4 h-4" />
          ) : (
            <User className="w-4 h-4" />
          )}
        </div>

        {/* 消息内容 */}
        <div className={cn("max-w-[75%]", isAssistant ? "" : "items-end")}>
          {/* 气泡 */}
          <div
            className={cn(
              "px-4 py-3 rounded-2xl text-sm leading-relaxed",
              isAssistant
                ? "bg-white border border-neutral-200 text-neutral-800 rounded-tl-md"
                : "bg-primary-600 text-white rounded-tr-md"
            )}
          >
            {/* 支持简单的Markdown加粗 */}
            {message.content.split("\n").map((line, i) => (
              <React.Fragment key={i}>
                {line.split(/(\*\*.*?\*\*)/g).map((part, j) => {
                  if (part.startsWith("**") && part.endsWith("**")) {
                    return (
                      <strong key={j} className="font-semibold">
                        {part.slice(2, -2)}
                      </strong>
                    );
                  }
                  return <React.Fragment key={j}>{part}</React.Fragment>;
                })}
                {i < message.content.split("\n").length - 1 && <br />}
              </React.Fragment>
            ))}
          </div>

          {/* 时间和操作 */}
          <div
            className={cn(
              "flex items-center gap-1 mt-1.5",
              isAssistant ? "ml-1" : "mr-1 justify-end"
            )}
          >
            {message.timestamp && (
              <span className="text-xs text-neutral-300">{message.timestamp}</span>
            )}

            {/* AI消息操作按钮 */}
            {showActions && isAssistant && (
              <>
                <button
                  onClick={() => onAction?.("copy", message.id)}
                  className="p-1 text-neutral-300 hover:text-neutral-500 rounded transition-colors"
                  title="复制"
                >
                  <Copy className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => onAction?.("like", message.id)}
                  className="p-1 text-neutral-300 hover:text-green-500 rounded transition-colors"
                  title="有帮助"
                >
                  <ThumbsUp className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => onAction?.("dislike", message.id)}
                  className="p-1 text-neutral-300 hover:text-red-400 rounded transition-colors"
                  title="无帮助"
                >
                  <ThumbsDown className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => onAction?.("regenerate", message.id)}
                  className="p-1 text-neutral-300 hover:text-neutral-500 rounded transition-colors"
                  title="重新生成"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    );
  }
);

MessageBubble.displayName = "MessageBubble";

export { MessageBubble };
