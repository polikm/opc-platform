import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * Loading组件 - 加载状态指示器
 * 支持多种尺寸和变体（spinner、dots、skeleton）
 */

export interface LoadingProps extends React.HTMLAttributes<HTMLDivElement> {
  // 加载指示器类型
  variant?: "spinner" | "dots" | "skeleton";
  // 尺寸
  size?: "sm" | "md" | "lg";
  // 加载提示文字
  text?: string;
  // 全屏加载
  fullscreen?: boolean;
}

const sizeMap = {
  sm: { spinner: "w-4 h-4", dot: "w-1.5 h-1.5", text: "text-xs" },
  md: { spinner: "w-8 h-8", dot: "w-2 h-2", text: "text-sm" },
  lg: { spinner: "w-12 h-12", dot: "w-2.5 h-2.5", text: "text-base" },
};

const Loading = React.forwardRef<HTMLDivElement, LoadingProps>(
  ({ className, variant = "spinner", size = "md", text, fullscreen, ...props }, ref) => {
    const sizes = sizeMap[size];

    // Spinner变体
    const spinnerContent = (
      <svg
        className={cn("animate-spin text-primary-600", sizes.spinner)}
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
    );

    // Dots变体
    const dotsContent = (
      <div className="flex items-center gap-1.5">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className={cn(
              "rounded-full bg-primary-600 animate-bounce",
              sizes.dot
            )}
            style={{ animationDelay: `${i * 0.15}s` }}
          />
        ))}
      </div>
    );

    // Skeleton变体
    const skeletonContent = (
      <div className="space-y-3 w-full">
        <div className="h-4 bg-neutral-200 rounded animate-pulse w-3/4" />
        <div className="h-4 bg-neutral-200 rounded animate-pulse w-1/2" />
        <div className="h-4 bg-neutral-200 rounded animate-pulse w-5/6" />
      </div>
    );

    const content = (
      <div
        ref={ref}
        className={cn(
          "flex flex-col items-center justify-center gap-3",
          fullscreen && "fixed inset-0 z-50 bg-white/80 backdrop-blur-sm",
          className
        )}
        {...props}
      >
        {variant === "spinner" && spinnerContent}
        {variant === "dots" && dotsContent}
        {variant === "skeleton" && skeletonContent}
        {text && variant !== "skeleton" && (
          <p className={cn("text-neutral-500", sizes.text)}>{text}</p>
        )}
      </div>
    );

    return content;
  }
);

Loading.displayName = "Loading";

export { Loading };
