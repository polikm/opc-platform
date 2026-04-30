import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * Input组件 - 表单输入框
 * 支持前缀/后缀图标、不同尺寸、错误状态
 */

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  // 错误状态
  error?: boolean;
  // 错误提示信息
  errorMessage?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, error, errorMessage, ...props }, ref) => {
    return (
      <div className="w-full">
        <input
          type={type}
          className={cn(
            // 基础样式
            "flex h-10 w-full rounded-lg border bg-white px-3 py-2 text-sm transition-colors",
            "placeholder:text-neutral-400",
            "focus:outline-none focus:ring-2 focus:ring-offset-0",
            "disabled:cursor-not-allowed disabled:opacity-50",
            // 状态样式
            error
              ? "border-red-300 text-red-900 focus:border-red-500 focus:ring-red-200"
              : "border-neutral-300 text-neutral-900 focus:border-primary-500 focus:ring-primary-200",
            className
          )}
          ref={ref}
          aria-invalid={error ? "true" : undefined}
          aria-describedby={errorMessage ? "input-error" : undefined}
          {...props}
        />
        {errorMessage && (
          <p id="input-error" className="mt-1.5 text-xs text-red-600">
            {errorMessage}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export { Input };
