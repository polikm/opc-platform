import {
  ThumbsUp,
  MessageSquare,
  Share2,
  Bookmark,
  MoreHorizontal,
  Eye,
  TrendingUp,
  Bot,
} from "lucide-react";

/**
 * 社区首页 - 信息流
 */
export default function CommunityPage() {
  // 模拟帖子数据
  const posts = [
    {
      id: "1",
      author: "AI探索者",
      avatar: "A",
      role: "认证主理人",
      title: "如何打造一个高效的电商客服智能体？分享我的实战经验",
      content:
        "经过3个月的打磨，我的电商客服智能体已经能处理80%以上的客户咨询。今天分享一下我的配置思路和优化经验，包括知识库搭建、多轮对话设计、异常处理等关键环节...",
      tags: ["经验分享", "客服智能体", "电商"],
      likes: 256,
      comments: 48,
      views: 3420,
      time: "2小时前",
      pinned: true,
    },
    {
      id: "2",
      author: "数据小王",
      avatar: "D",
      role: "资深用户",
      title: "OPC知识库最佳实践：文档分块策略对比",
      content:
        "最近测试了不同的知识库文档分块策略，发现对智能体回答质量影响很大。这里对比了固定长度分块、语义分块和混合分块三种方案的效果差异...",
      tags: ["知识库", "技术分享"],
      likes: 189,
      comments: 32,
      views: 2150,
      time: "5小时前",
      pinned: false,
    },
    {
      id: "3",
      author: "创业老李",
      avatar: "L",
      role: "认证主理人",
      title: "用智能体做销售跟进，客户转化率提升了40%",
      content:
        "我们团队开发了一个销售跟进智能体，自动分析客户意向、生成跟进方案、发送个性化消息。上线一个月后，客户转化率从15%提升到了21%...",
      tags: ["销售", "案例分享", "转化率"],
      likes: 342,
      comments: 67,
      views: 5680,
      time: "昨天",
      pinned: false,
    },
    {
      id: "4",
      author: "教育工作者小张",
      avatar: "Z",
      role: "新用户",
      title: "求助：如何让智能体更好地理解教育领域的专业术语？",
      content:
        "我正在搭建一个在线教育智能体，但发现它对一些教育领域的专业术语理解不够准确。有没有好的方法可以提升这方面的能力？",
      tags: ["求助", "教育", "专业术语"],
      likes: 45,
      comments: 23,
      views: 890,
      time: "昨天",
      pinned: false,
    },
    {
      id: "5",
      author: "技术达人",
      avatar: "T",
      role: "认证主理人",
      title: "智能体Prompt工程进阶：从基础到高级的完整指南",
      content:
        "系统提示词的质量直接决定了智能体的表现。这篇指南从角色设定、上下文管理、输出格式控制等维度，全面介绍如何编写高质量的Prompt...",
      tags: ["Prompt", "教程", "进阶"],
      likes: 521,
      comments: 89,
      views: 8920,
      time: "2天前",
      pinned: false,
    },
  ];

  // 热门话题
  const trendingTopics = [
    { name: "智能体优化技巧", count: 1234 },
    { name: "知识库搭建指南", count: 856 },
    { name: "客服场景实战", count: 672 },
    { name: "Prompt工程", count: 543 },
    { name: "多模态能力", count: 321 },
  ];

  return (
    <div className="flex gap-6">
      {/* ========== 左侧 - 帖子列表 ========== */}
      <div className="flex-1 min-w-0 space-y-4">
        {posts.map((post) => (
          <article
            key={post.id}
            className="bg-white rounded-xl border border-neutral-200 p-5 hover:shadow-sm transition-shadow"
          >
            {/* 帖子头部 */}
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-medium">
                {post.avatar}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-sm text-neutral-900">
                    {post.author}
                  </span>
                  {post.role === "认证主理人" && (
                    <span className="inline-flex items-center gap-1 px-1.5 py-0.5 text-xs font-medium bg-primary-50 text-primary-600 rounded">
                      <Bot className="w-3 h-3" />
                      认证
                    </span>
                  )}
                </div>
                <span className="text-xs text-neutral-400">{post.time}</span>
              </div>
              <button className="p-1.5 text-neutral-400 hover:text-neutral-600 hover:bg-neutral-100 rounded-lg transition-colors">
                <MoreHorizontal className="w-4 h-4" />
              </button>
            </div>

            {/* 置顶标签 */}
            {post.pinned && (
              <div className="mb-2">
                <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium bg-red-50 text-red-600 rounded">
                  <TrendingUp className="w-3 h-3" />
                  置顶
                </span>
              </div>
            )}

            {/* 标题 */}
            <h3 className="text-base font-semibold text-neutral-900 mb-2 hover:text-primary-600 cursor-pointer transition-colors">
              {post.title}
            </h3>

            {/* 内容摘要 */}
            <p className="text-sm text-neutral-600 leading-relaxed mb-3 line-clamp-3">
              {post.content}
            </p>

            {/* 标签 */}
            <div className="flex flex-wrap gap-2 mb-3">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-0.5 text-xs bg-neutral-100 text-neutral-500 rounded hover:bg-primary-50 hover:text-primary-600 cursor-pointer transition-colors"
                >
                  #{tag}
                </span>
              ))}
            </div>

            {/* 操作栏 */}
            <div className="flex items-center gap-6 text-sm text-neutral-400">
              <button className="flex items-center gap-1.5 hover:text-primary-600 transition-colors">
                <ThumbsUp className="w-4 h-4" />
                <span>{post.likes}</span>
              </button>
              <button className="flex items-center gap-1.5 hover:text-primary-600 transition-colors">
                <MessageSquare className="w-4 h-4" />
                <span>{post.comments}</span>
              </button>
              <button className="flex items-center gap-1.5 hover:text-primary-600 transition-colors">
                <Eye className="w-4 h-4" />
                <span>{post.views}</span>
              </button>
              <button className="flex items-center gap-1.5 hover:text-primary-600 transition-colors">
                <Bookmark className="w-4 h-4" />
              </button>
              <button className="flex items-center gap-1.5 hover:text-primary-600 transition-colors">
                <Share2 className="w-4 h-4" />
              </button>
            </div>
          </article>
        ))}

        {/* 加载更多 */}
        <div className="text-center py-4">
          <button className="px-6 py-2.5 text-sm font-medium text-primary-600 bg-primary-50 rounded-lg hover:bg-primary-100 transition-colors">
            加载更多
          </button>
        </div>
      </div>

      {/* ========== 右侧 - 侧边栏 ========== */}
      <div className="hidden lg:block w-72 space-y-4">
        {/* 热门话题 */}
        <div className="bg-white rounded-xl border border-neutral-200 p-5">
          <h3 className="font-semibold text-neutral-900 mb-4">热门话题</h3>
          <div className="space-y-3">
            {trendingTopics.map((topic, index) => (
              <div
                key={topic.name}
                className="flex items-center gap-3 cursor-pointer group"
              >
                <span
                  className={`w-5 h-5 rounded flex items-center justify-center text-xs font-bold ${
                    index < 3
                      ? "bg-primary-600 text-white"
                      : "bg-neutral-100 text-neutral-500"
                  }`}
                >
                  {index + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="text-sm text-neutral-700 group-hover:text-primary-600 transition-colors truncate">
                    {topic.name}
                  </div>
                  <div className="text-xs text-neutral-400">
                    {topic.count} 讨论
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 活跃主理人 */}
        <div className="bg-white rounded-xl border border-neutral-200 p-5">
          <h3 className="font-semibold text-neutral-900 mb-4">活跃主理人</h3>
          <div className="space-y-3">
            {[
              { name: "AI探索者", agents: 5, avatar: "A" },
              { name: "技术达人", agents: 8, avatar: "T" },
              { name: "创业老李", agents: 3, avatar: "L" },
              { name: "数据小王", agents: 4, avatar: "D" },
            ].map((user) => (
              <div
                key={user.name}
                className="flex items-center gap-3 cursor-pointer group"
              >
                <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 text-xs font-medium">
                  {user.avatar}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm text-neutral-700 group-hover:text-primary-600 transition-colors truncate">
                    {user.name}
                  </div>
                  <div className="text-xs text-neutral-400">
                    {user.agents} 个智能体
                  </div>
                </div>
                <button className="px-2.5 py-1 text-xs font-medium text-primary-600 bg-primary-50 rounded-full hover:bg-primary-100 transition-colors">
                  关注
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* 社区规则 */}
        <div className="bg-white rounded-xl border border-neutral-200 p-5">
          <h3 className="font-semibold text-neutral-900 mb-3">社区公约</h3>
          <ul className="space-y-2 text-xs text-neutral-500">
            <li className="flex items-start gap-2">
              <span className="text-primary-500 mt-0.5">1.</span>
              尊重他人，友好交流
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary-500 mt-0.5">2.</span>
              分享有价值的内容和经验
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary-500 mt-0.5">3.</span>
              禁止发布广告和垃圾信息
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary-500 mt-0.5">4.</span>
              保护个人隐私和商业机密
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
