import Link from "next/link";
import {
  Bot,
  Brain,
  BookOpen,
  ArrowRight,
  Users,
  Zap,
  Shield,
  TrendingUp,
  CheckCircle,
} from "lucide-react";

/**
 * 首页 - OPC智能体平台介绍页
 */
export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* ========== 顶部导航 ========== */}
      <header className="fixed top-0 left-0 right-0 z-50 glass">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary-600 flex items-center justify-center">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-foreground">
                OPC<span className="text-primary-600">智能体</span>
              </span>
            </Link>

            {/* 导航链接 */}
            <nav className="hidden md:flex items-center gap-8">
              <a
                href="#features"
                className="text-sm text-neutral-600 hover:text-primary-600 transition-colors"
              >
                核心功能
              </a>
              <a
                href="#cases"
                className="text-sm text-neutral-600 hover:text-primary-600 transition-colors"
              >
                成功案例
              </a>
              <Link
                href="/community"
                className="text-sm text-neutral-600 hover:text-primary-600 transition-colors"
              >
                社区
              </Link>
              <Link
                href="/marketplace"
                className="text-sm text-neutral-600 hover:text-primary-600 transition-colors"
              >
                生态市场
              </Link>
            </nav>

            {/* 操作按钮 */}
            <div className="flex items-center gap-3">
              <Link
                href="/login"
                className="text-sm text-neutral-600 hover:text-primary-600 transition-colors"
              >
                登录
              </Link>
              <Link
                href="/register"
                className="px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700 transition-colors"
              >
                免费注册
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* ========== Hero 区域 ========== */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        {/* 背景装饰 */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary-50 via-white to-blue-50" />
        <div className="absolute top-20 right-0 w-96 h-96 bg-primary-200/30 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-primary-100/40 rounded-full blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* 标签 */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary-50 border border-primary-200 rounded-full text-sm text-primary-700 mb-6">
            <Zap className="w-4 h-4" />
            <span>新一代AI智能体平台</span>
          </div>

          {/* 主标题 */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-neutral-900 leading-tight mb-6">
            构建你的
            <span className="gradient-text"> AI智能体</span>
            <br />
            开启智能化运营新时代
          </h1>

          {/* 描述 */}
          <p className="text-lg sm:text-xl text-neutral-600 max-w-2xl mx-auto mb-10 leading-relaxed">
            OPC智能体平台帮助主理人快速创建、管理和部署专属AI智能体。
            无需编程，通过自然语言即可打造具备专业能力的智能助手，
            让AI为你的业务赋能。
          </p>

          {/* CTA按钮 */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/register"
              className="inline-flex items-center gap-2 px-8 py-3.5 text-base font-medium text-white bg-primary-600 rounded-xl hover:bg-primary-700 shadow-lg shadow-primary-600/25 hover:shadow-xl hover:shadow-primary-600/30 transition-all"
            >
              立即开始创建
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="/community"
              className="inline-flex items-center gap-2 px-8 py-3.5 text-base font-medium text-neutral-700 bg-white border border-neutral-200 rounded-xl hover:border-primary-300 hover:text-primary-600 transition-all"
            >
              浏览社区案例
            </Link>
          </div>

          {/* 数据统计 */}
          <div className="mt-16 grid grid-cols-3 gap-8 max-w-lg mx-auto">
            <div>
              <div className="text-2xl sm:text-3xl font-bold text-primary-600">
                10,000+
              </div>
              <div className="text-sm text-neutral-500 mt-1">活跃智能体</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-bold text-primary-600">
                5,000+
              </div>
              <div className="text-sm text-neutral-500 mt-1">主理人</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-bold text-primary-600">
                99.9%
              </div>
              <div className="text-sm text-neutral-500 mt-1">服务可用率</div>
            </div>
          </div>
        </div>
      </section>

      {/* ========== 核心功能展示 ========== */}
      <section id="features" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-neutral-900 mb-4">
              三大核心模块，全面覆盖智能体生命周期
            </h2>
            <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
              从创建到部署，从知识管理到社区协作，OPC平台提供一站式智能体解决方案
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* 智能体创建 */}
            <div className="group p-8 rounded-2xl border border-neutral-200 hover:border-primary-200 hover:shadow-lg hover:shadow-primary-600/5 transition-all">
              <div className="w-14 h-14 rounded-xl bg-primary-50 flex items-center justify-center mb-6 group-hover:bg-primary-100 transition-colors">
                <Bot className="w-7 h-7 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold text-neutral-900 mb-3">
                智能体创建与管理
              </h3>
              <p className="text-neutral-600 leading-relaxed mb-4">
                通过自然语言描述即可创建专属智能体。支持自定义角色设定、
                场景配置和能力编排，让你的智能体具备专业领域知识和服务能力。
              </p>
              <ul className="space-y-2">
                {["可视化智能体编排", "多场景模板", "实时对话测试"].map(
                  (item) => (
                    <li
                      key={item}
                      className="flex items-center gap-2 text-sm text-neutral-500"
                    >
                      <CheckCircle className="w-4 h-4 text-accent-500" />
                      {item}
                    </li>
                  )
                )}
              </ul>
            </div>

            {/* 知识库 */}
            <div className="group p-8 rounded-2xl border border-neutral-200 hover:border-primary-200 hover:shadow-lg hover:shadow-primary-600/5 transition-all">
              <div className="w-14 h-14 rounded-xl bg-accent-50 flex items-center justify-center mb-6 group-hover:bg-accent-100 transition-colors">
                <BookOpen className="w-7 h-7 text-accent-600" />
              </div>
              <h3 className="text-xl font-semibold text-neutral-900 mb-3">
                知识库管理
              </h3>
              <p className="text-neutral-600 leading-relaxed mb-4">
                上传文档、网页、FAQ等内容，自动构建专属知识库。
                智能体将基于你的知识库进行精准回答，确保信息准确可靠。
              </p>
              <ul className="space-y-2">
                {[
                  "多格式文档支持",
                  "智能分块与索引",
                  "知识库版本管理",
                ].map((item) => (
                  <li
                    key={item}
                    className="flex items-center gap-2 text-sm text-neutral-500"
                  >
                    <CheckCircle className="w-4 h-4 text-accent-500" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* 社区生态 */}
            <div className="group p-8 rounded-2xl border border-neutral-200 hover:border-primary-200 hover:shadow-lg hover:shadow-primary-600/5 transition-all">
              <div className="w-14 h-14 rounded-xl bg-purple-50 flex items-center justify-center mb-6 group-hover:bg-purple-100 transition-colors">
                <Users className="w-7 h-7 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-neutral-900 mb-3">
                社区与生态市场
              </h3>
              <p className="text-neutral-600 leading-relaxed mb-4">
                加入活跃的主理人社区，分享经验、交流心得。
                在生态市场中发现优质智能体模板、插件和能力扩展。
              </p>
              <ul className="space-y-2">
                {[
                  "智能体模板市场",
                  "主理人社区交流",
                  "插件与能力扩展",
                ].map((item) => (
                  <li
                    key={item}
                    className="flex items-center gap-2 text-sm text-neutral-500"
                  >
                    <CheckCircle className="w-4 h-4 text-accent-500" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ========== 成功案例/数据展示 ========== */}
      <section id="cases" className="py-20 bg-neutral-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-neutral-900 mb-4">
              被各行业主理人信赖
            </h2>
            <p className="text-lg text-neutral-600">
              从电商到教育，从金融到医疗，OPC智能体正在赋能千行百业
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: TrendingUp,
                title: "电商客服",
                desc: "智能体自动处理80%的客户咨询，响应时间缩短至3秒内",
                metric: "效率提升300%",
              },
              {
                icon: Brain,
                title: "在线教育",
                desc: "7x24小时智能辅导，个性化学习路径推荐",
                metric: "学员满意度98%",
              },
              {
                icon: Shield,
                title: "金融顾问",
                desc: "智能风险评估与投资建议，合规审查自动化",
                metric: "风险降低60%",
              },
              {
                icon: Users,
                title: "企业HR",
                desc: "智能招聘筛选、员工问答、培训管理一体化",
                metric: "节省70%人力",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="p-6 bg-white rounded-xl border border-neutral-200 hover:shadow-md transition-shadow"
              >
                <item.icon className="w-10 h-10 text-primary-600 mb-4" />
                <h3 className="text-lg font-semibold text-neutral-900 mb-2">
                  {item.title}
                </h3>
                <p className="text-sm text-neutral-600 mb-4">{item.desc}</p>
                <div className="text-lg font-bold text-primary-600">
                  {item.metric}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========== 底部CTA ========== */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-neutral-900 mb-4">
            准备好打造你的专属智能体了吗？
          </h2>
          <p className="text-lg text-neutral-600 mb-8">
            加入10,000+主理人的行列，让AI成为你最得力的助手
          </p>
          <Link
            href="/register"
            className="inline-flex items-center gap-2 px-8 py-3.5 text-base font-medium text-white bg-primary-600 rounded-xl hover:bg-primary-700 shadow-lg shadow-primary-600/25 transition-all"
          >
            免费开始使用
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* ========== 底部 ========== */}
      <footer className="py-12 bg-neutral-900 text-neutral-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary-600 flex items-center justify-center">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <span className="text-lg font-bold text-white">
                OPC智能体平台
              </span>
            </div>
            <div className="flex items-center gap-6 text-sm">
              <a href="#" className="hover:text-white transition-colors">
                关于我们
              </a>
              <a href="#" className="hover:text-white transition-colors">
                使用条款
              </a>
              <a href="#" className="hover:text-white transition-colors">
                隐私政策
              </a>
              <a href="#" className="hover:text-white transition-colors">
                联系我们
              </a>
            </div>
            <div className="text-sm">
              &copy; 2026 OPC智能体平台. 保留所有权利.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
