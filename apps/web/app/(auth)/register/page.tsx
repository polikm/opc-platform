import Link from "next/link";
import { Bot, Eye, EyeOff } from "lucide-react";

/**
 * 注册页 - 新用户注册
 */
export default function RegisterPage() {
  return (
    <div className="min-h-screen flex">
      {/* 左侧 - 品牌展示 */}
      <div className="hidden lg:flex lg:w-1/2 gradient-primary relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10" />
        <div className="relative z-10 flex flex-col justify-center px-16 text-white">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <Bot className="w-7 h-7 text-white" />
            </div>
            <span className="text-2xl font-bold">OPC智能体平台</span>
          </div>
          <h1 className="text-4xl font-bold mb-4 leading-tight">
            加入我们
            <br />
            成为AI主理人
          </h1>
          <p className="text-lg text-white/80 leading-relaxed max-w-md">
            注册成为OPC平台主理人，创建你的专属AI智能体，
            开启智能化运营之旅。
          </p>

          {/* 注册优势 */}
          <div className="mt-12 space-y-4">
            {[
              "免费创建最多3个智能体",
              "10MB免费知识库存储空间",
              "加入主理人社区获取支持",
            ].map((text) => (
              <div key={text} className="flex items-center gap-3 text-white/90">
                <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-xs">
                  ✓
                </div>
                <span>{text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 右侧 - 注册表单 */}
      <div className="flex-1 flex items-center justify-center px-4 py-12 bg-neutral-50">
        <div className="w-full max-w-md">
          {/* 移动端Logo */}
          <div className="lg:hidden flex items-center gap-2 mb-8 justify-center">
            <div className="w-10 h-10 rounded-xl bg-primary-600 flex items-center justify-center">
              <Bot className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold text-neutral-900">
              OPC智能体
            </span>
          </div>

          {/* 标题 */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-neutral-900 mb-2">
              创建新账户
            </h2>
            <p className="text-neutral-500">填写以下信息完成注册</p>
          </div>

          {/* 注册表单 */}
          <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
            {/* 用户名 */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1.5">
                用户名
              </label>
              <input
                type="text"
                placeholder="请输入用户名"
                className="w-full px-4 py-2.5 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm bg-white"
              />
            </div>

            {/* 手机号 */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1.5">
                手机号
              </label>
              <div className="flex gap-2">
                <div className="flex items-center px-3 border border-neutral-300 rounded-lg bg-white text-sm text-neutral-600">
                  +86
                </div>
                <input
                  type="tel"
                  placeholder="请输入手机号"
                  className="flex-1 px-4 py-2.5 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm bg-white"
                />
              </div>
            </div>

            {/* 验证码 */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1.5">
                验证码
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="请输入验证码"
                  className="flex-1 px-4 py-2.5 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm bg-white"
                />
                <button
                  type="button"
                  className="px-4 py-2.5 text-sm font-medium text-primary-600 bg-primary-50 border border-primary-200 rounded-lg hover:bg-primary-100 transition-colors whitespace-nowrap"
                >
                  获取验证码
                </button>
              </div>
            </div>

            {/* 密码 */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1.5">
                设置密码
              </label>
              <div className="relative">
                <input
                  type="password"
                  placeholder="请设置密码（至少8位）"
                  className="w-full px-4 py-2.5 pr-10 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm bg-white"
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
                >
                  <EyeOff className="w-4 h-4" />
                </button>
              </div>
              <p className="mt-1 text-xs text-neutral-400">
                密码需包含字母和数字，至少8个字符
              </p>
            </div>

            {/* 确认密码 */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1.5">
                确认密码
              </label>
              <div className="relative">
                <input
                  type="password"
                  placeholder="请再次输入密码"
                  className="w-full px-4 py-2.5 pr-10 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm bg-white"
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
                >
                  <EyeOff className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* 用户协议 */}
            <div className="flex items-start gap-2">
              <input
                type="checkbox"
                id="agreement"
                className="mt-1 w-4 h-4 rounded border-neutral-300 text-primary-600 focus:ring-primary-500"
              />
              <label htmlFor="agreement" className="text-sm text-neutral-500">
                我已阅读并同意{" "}
                <a href="#" className="text-primary-600 hover:underline">
                  服务条款
                </a>{" "}
                和{" "}
                <a href="#" className="text-primary-600 hover:underline">
                  隐私政策
                </a>
              </label>
            </div>

            {/* 注册按钮 */}
            <button
              type="submit"
              className="w-full py-3 text-base font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-colors"
            >
              注册
            </button>
          </form>

          {/* 登录链接 */}
          <p className="mt-8 text-center text-sm text-neutral-500">
            已有账户？{" "}
            <Link
              href="/login"
              className="font-medium text-primary-600 hover:text-primary-700 transition-colors"
            >
              立即登录
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
