import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * Avatar组件 - 用户头像
 * 支持图片、文字回退、不同尺寸和状态指示器
 */

export interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  // 头像图片URL
  src?: string;
  // 回退文字（通常为用户名首字）
  fallback?: string;
  // 尺寸
  size?: "sm" | "md" | "lg" | "xl";
  // 在线状态
  status?: "online" | "offline" | "busy";
}

const sizeMap = {
  sm: "w-8 h-8 text-xs",
  md: "w-10 h-10 text-sm",
  lg: "w-12 h-12 text-base",
  xl: "w-16 h-16 text-lg",
};

const statusSizeMap = {
  sm: "w-2 h-2",
  md: "w-2.5 h-2.5",
  lg: "w-3 h-3",
  xl: "w-3.5 h-3.5",
};

const statusColorMap = {
  online: "bg-green-500",
  offline: "bg-neutral-400",
  busy: "bg-red-500",
};

const Avatar = React.forwardRef<HTMLDivElement, AvatarProps>(
  ({ className, src, fallback, size = "md", status, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("relative inline-flex flex-shrink-0", className)}
        {...props}
      >
        <div
          className={cn(
            "rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-medium overflow-hidden",
            sizeMap[size]
          )}
        >
          {src ? (
            <img
              src={src}
              alt={fallback || "头像"}
              className="w-full h-full object-cover"
            />
          ) : (
            <span>{fallback || "用"}</span>
          )}
        </div>

        {/* 状态指示器 */}
        {status && (
          <span
            className={cn(
              "absolute bottom-0 right-0 rounded-full border-2 border-white",
              statusSizeMap[size],
              statusColorMap[status]
            )}
          />
        )}
      </div>
    );
  }
);

Avatar.displayName = "Avatar";

export { Avatar };
