import Link from "next/link";
import { Bot, Phone, Mail, MessageCircle } from "lucide-react";

/**
 * 登录页 - 支持手机号/邮箱/微信登录
 */
export default function LoginPage() {
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
            构建你的AI智能体
            <br />
            开启智能化未来
          </h1>
          <p className="text-lg text-white/80 leading-relaxed max-w-md">
            登录你的账户，管理智能体、知识库，与社区主理人交流协作。
          </p>

          {/* 特色展示 */}
          <div className="mt-12 space-y-4">
            {[
              "10,000+ 活跃智能体正在运行",
              "5,000+ 主理人信赖之选",
              "99.9% 服务可用性保障",
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

      {/* 右侧 - 登录表单 */}
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
              欢迎回来
            </h2>
            <p className="text-neutral-500">登录你的账户以继续</p>
          </div>

          {/* 登录方式切换 */}
          <div className="flex gap-1 p-1 bg-neutral-200 rounded-lg mb-6">
            <button className="flex-1 py-2 text-sm font-medium text-white bg-primary-600 rounded-md transition-colors">
              手机号登录
            </button>
            <button className="flex-1 py-2 text-sm font-medium text-neutral-600 hover:text-neutral-900 rounded-md transition-colors">
              邮箱登录
            </button>
          </div>

          {/* 登录表单 */}
          <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
            {/* 手机号输入 */}
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
                  className="flex-1 px-4 py-2.5 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
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
                  className="flex-1 px-4 py-2.5 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
                />
                <button
                  type="button"
                  className="px-4 py-2.5 text-sm font-medium text-primary-600 bg-primary-50 border border-primary-200 rounded-lg hover:bg-primary-100 transition-colors whitespace-nowrap"
                >
                  获取验证码
                </button>
              </div>
            </div>

            {/* 登录按钮 */}
            <button
              type="submit"
              className="w-full py-3 text-base font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-colors"
            >
              登录
            </button>
          </form>

          {/* 分隔线 */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-neutral-200" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-neutral-50 text-neutral-400">
                其他登录方式
              </span>
            </div>
          </div>

          {/* 第三方登录 */}
          <div className="grid grid-cols-2 gap-3">
            <button className="flex items-center justify-center gap-2 px-4 py-2.5 border border-neutral-300 rounded-lg hover:bg-neutral-100 transition-colors text-sm text-neutral-700">
              <Phone className="w-4 h-4" />
              微信登录
            </button>
            <button className="flex items-center justify-center gap-2 px-4 py-2.5 border border-neutral-300 rounded-lg hover:bg-neutral-100 transition-colors text-sm text-neutral-700">
              <Mail className="w-4 h-4" />
              邮箱密码
            </button>
          </div>

          {/* 注册链接 */}
          <p className="mt-8 text-center text-sm text-neutral-500">
            还没有账户？{" "}
            <Link
              href="/register"
              className="font-medium text-primary-600 hover:text-primary-700 transition-colors"
            >
              立即注册
            </Link>
          </p>

          {/* 底部提示 */}
          <p className="mt-4 text-center text-xs text-neutral-400">
            登录即表示你同意{" "}
            <a href="#" className="underline hover:text-neutral-600">
              服务条款
            </a>{" "}
            和{" "}
            <a href="#" className="underline hover:text-neutral-600">
              隐私政策
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
