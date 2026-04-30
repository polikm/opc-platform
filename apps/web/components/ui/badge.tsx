import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

/**
 * Badge组件 - 标签/徽章
 * 用于状态标记、分类标签等场景
 */

const badgeVariants = cva(
  // 基础样式
  "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors",
  {
    variants: {
      // 样式变体
      variant: {
        default: "bg-primary-50 text-primary-700 border border-primary-200",
        secondary: "bg-neutral-100 text-neutral-700 border border-neutral-200",
        success: "bg-green-50 text-green-700 border border-green-200",
        warning: "bg-yellow-50 text-yellow-700 border border-yellow-200",
        destructive: "bg-red-50 text-red-700 border border-red-200",
        outline: "border border-neutral-300 text-neutral-600",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {
  // 可选的圆点指示器
  dot?: boolean;
}

const Badge = React.forwardRef<HTMLDivElement, BadgeProps>(
  ({ className, variant, dot, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(badgeVariants({ variant }), className)}
        {...props}
      >
        {dot && (
          <span
            className={cn("w-1.5 h-1.5 rounded-full", {
              "bg-primary-500": variant === "default",
              "bg-neutral-500": variant === "secondary" || variant === "outline",
              "bg-green-500": variant === "success",
              "bg-yellow-500": variant === "warning",
              "bg-red-500": variant === "destructive",
            })}
          />
        )}
        {children}
      </div>
    );
  }
);

Badge.displayName = "Badge";

export { Badge, badgeVariants };
