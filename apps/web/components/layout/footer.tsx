import Link from "next/link";
import { Bot } from "lucide-react";

/**
 * Footer组件 - 页面底部
 * 包含品牌信息、导航链接、版权声明
 */

const footerLinks = {
  产品: [
    { label: "智能体创建", href: "/dashboard/agents/create" },
    { label: "知识库管理", href: "/dashboard/knowledge" },
    { label: "社区", href: "/community" },
    { label: "生态市场", href: "/marketplace" },
  ],
  支持: [
    { label: "帮助中心", href: "#" },
    { label: "开发文档", href: "#" },
    { label: "API参考", href: "#" },
    { label: "联系我们", href: "#" },
  ],
  公司: [
    { label: "关于我们", href: "#" },
    { label: "加入团队", href: "#" },
    { label: "合作伙伴", href: "#" },
    { label: "媒体报道", href: "#" },
  ],
  法律: [
    { label: "服务条款", href: "#" },
    { label: "隐私政策", href: "#" },
    { label: "Cookie政策", href: "#" },
    { label: "知识产权", href: "#" },
  ],
};

export function Footer() {
  return (
    <footer className="bg-neutral-900 text-neutral-400">
      {/* 主要内容 */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          {/* 品牌信息 */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-primary-600 flex items-center justify-center">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <span className="text-lg font-bold text-white">
                OPC智能体
              </span>
            </Link>
            <p className="text-sm leading-relaxed mb-4">
              构建你的AI智能体，开启智能化运营新时代。
            </p>
            {/* 社交媒体 */}
            <div className="flex items-center gap-3">
              {["微信", "微博", "GitHub"].map((platform) => (
                <a
                  key={platform}
                  href="#"
                  className="w-8 h-8 rounded-lg bg-neutral-800 flex items-center justify-center text-xs text-neutral-400 hover:bg-neutral-700 hover:text-white transition-colors"
                >
                  {platform[0]}
                </a>
              ))}
            </div>
          </div>

          {/* 链接列表 */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h3 className="text-sm font-semibold text-white mb-4">
                {category}
              </h3>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-sm hover:text-white transition-colors"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* 底部版权 */}
      <div className="border-t border-neutral-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-sm">
            &copy; 2026 OPC智能体平台. 保留所有权利.
          </div>
          <div className="flex items-center gap-4 text-sm">
            <a href="#" className="hover:text-white transition-colors">
              京ICP备XXXXXXXX号
            </a>
            <a href="#" className="hover:text-white transition-colors">
              京公网安备XXXXXXXXXXX号
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
