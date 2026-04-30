import {
  Bot,
  Star,
  Download,
  Users,
  ArrowRight,
  TrendingUp,
  Puzzle,
  Database,
  Sparkles,
  Search,
  SlidersHorizontal,
} from "lucide-react";

/**
 * 生态市场首页 - 分类导航 + 商品列表
 */
export default function MarketplacePage() {
  // 分类导航
  const categories = [
    { icon: Bot, label: "智能体模板", desc: "即用型智能体方案", count: 128 },
    { icon: Puzzle, label: "功能插件", desc: "扩展智能体能力", count: 86 },
    { icon: Sparkles, label: "能力扩展", desc: "AI能力增强包", count: 45 },
    { icon: Database, label: "数据集", desc: "预训练数据资源", count: 32 },
  ];

  // 热门模板
  const hotTemplates = [
    {
      id: "1",
      name: "电商客服Pro",
      desc: "专为电商场景打造的全能客服智能体，支持订单查询、退换货处理、产品推荐等",
      author: "OPC官方",
      avatar: "O",
      rating: 4.9,
      downloads: 5680,
      price: "免费",
      tags: ["客服", "电商", "热门"],
      featured: true,
    },
    {
      id: "2",
      name: "智能销售顾问",
      desc: "基于客户画像的智能销售助手，自动分析客户需求并推荐最佳方案",
      author: "销售达人",
      avatar: "S",
      rating: 4.8,
      downloads: 3420,
      price: "99元",
      tags: ["销售", "推荐"],
      featured: true,
    },
    {
      id: "3",
      name: "技术文档助手",
      desc: "自动检索技术文档、解释代码、提供开发指导的编程助手",
      author: "技术团队",
      avatar: "T",
      rating: 4.7,
      downloads: 2890,
      price: "免费",
      tags: ["技术", "编程"],
      featured: false,
    },
    {
      id: "4",
      name: "在线教育导师",
      desc: "个性化学习路径规划、知识点讲解、习题辅导的智能教育助手",
      author: "教育工坊",
      avatar: "E",
      rating: 4.8,
      downloads: 2150,
      price: "149元",
      tags: ["教育", "学习"],
      featured: false,
    },
    {
      id: "5",
      name: "数据分析专家",
      desc: "自动生成数据报表、趋势分析、异常检测的数据分析智能体",
      author: "数据实验室",
      avatar: "D",
      rating: 4.6,
      downloads: 1890,
      price: "免费",
      tags: ["数据", "分析"],
      featured: false,
    },
    {
      id: "6",
      name: "HR招聘助手",
      desc: "简历筛选、面试安排、候选人评估的全流程招聘管理智能体",
      author: "HR工具箱",
      avatar: "H",
      rating: 4.5,
      downloads: 1560,
      price: "199元",
      tags: ["HR", "招聘"],
      featured: false,
    },
  ];

  return (
    <div className="space-y-8">
      {/* ========== 顶部Banner ========== */}
      <div className="relative overflow-hidden rounded-2xl gradient-primary p-8 text-white">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/4" />
        <div className="absolute bottom-0 left-1/2 w-48 h-48 bg-white/5 rounded-full translate-y-1/2" />
        <div className="relative">
          <h1 className="text-2xl sm:text-3xl font-bold mb-2">
            OPC生态市场
          </h1>
          <p className="text-white/80 max-w-lg mb-6">
            发现优质智能体模板、功能插件和能力扩展，快速构建你的专属AI解决方案
          </p>
          <div className="flex items-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <Bot className="w-4 h-4" />
              <span>{categories.reduce((a, c) => a + c.count, 0)}+ 商品</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              <span>2,000+ 开发者</span>
            </div>
            <div className="flex items-center gap-2">
              <Download className="w-4 h-4" />
              <span>50,000+ 下载</span>
            </div>
          </div>
        </div>
      </div>

      {/* ========== 分类导航 ========== */}
      <div>
        <h2 className="text-lg font-semibold text-neutral-900 mb-4">
          浏览分类
        </h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {categories.map((cat) => (
            <button
              key={cat.label}
              className="group p-5 bg-white rounded-xl border border-neutral-200 hover:border-primary-200 hover:shadow-md transition-all text-left"
            >
              <div className="w-12 h-12 rounded-xl bg-primary-50 flex items-center justify-center mb-3 group-hover:bg-primary-100 transition-colors">
                <cat.icon className="w-6 h-6 text-primary-600" />
              </div>
              <h3 className="font-semibold text-neutral-900 mb-0.5">
                {cat.label}
              </h3>
              <p className="text-xs text-neutral-400">{cat.desc}</p>
              <div className="text-xs text-primary-600 mt-2 font-medium">
                {cat.count} 个商品
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* ========== 热门推荐 ========== */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-semibold text-neutral-900">
              热门推荐
            </h2>
            <TrendingUp className="w-4 h-4 text-orange-500" />
          </div>
          <div className="flex items-center gap-2">
            <button className="p-2 text-neutral-400 hover:text-neutral-600 hover:bg-neutral-100 rounded-lg transition-colors">
              <SlidersHorizontal className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {hotTemplates.map((template) => (
            <div
              key={template.id}
              className="group bg-white rounded-xl border border-neutral-200 hover:shadow-md transition-all overflow-hidden"
            >
              {/* 顶部标签 */}
              {template.featured && (
                <div className="px-4 py-1.5 bg-gradient-to-r from-primary-600 to-primary-400 text-white text-xs font-medium">
                  官方推荐
                </div>
              )}

              <div className="p-5">
                {/* 头部信息 */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary-50 flex items-center justify-center text-lg">
                      🤖
                    </div>
                    <div>
                      <h3 className="font-semibold text-neutral-900 group-hover:text-primary-600 transition-colors">
                        {template.name}
                      </h3>
                      <div className="flex items-center gap-1 text-xs text-neutral-400">
                        <span>{template.author}</span>
                      </div>
                    </div>
                  </div>
                  <span
                    className={`px-2 py-0.5 text-xs font-medium rounded-full ${
                      template.price === "免费"
                        ? "bg-green-50 text-green-600"
                        : "bg-orange-50 text-orange-600"
                    }`}
                  >
                    {template.price}
                  </span>
                </div>

                {/* 描述 */}
                <p className="text-sm text-neutral-500 mb-3 line-clamp-2">
                  {template.desc}
                </p>

                {/* 标签 */}
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {template.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-0.5 text-xs bg-neutral-100 text-neutral-500 rounded"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* 底部数据 */}
                <div className="flex items-center justify-between pt-3 border-t border-neutral-100">
                  <div className="flex items-center gap-4 text-xs text-neutral-400">
                    <span className="flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
                      {template.rating}
                    </span>
                    <span className="flex items-center gap-1">
                      <Download className="w-3.5 h-3.5" />
                      {template.downloads.toLocaleString()}
                    </span>
                  </div>
                  <button className="inline-flex items-center gap-1 text-xs font-medium text-primary-600 hover:text-primary-700 transition-colors">
                    查看详情
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* 查看更多 */}
        <div className="text-center mt-6">
          <button className="inline-flex items-center gap-2 px-6 py-2.5 text-sm font-medium text-primary-600 bg-primary-50 rounded-lg hover:bg-primary-100 transition-colors">
            查看全部商品
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
