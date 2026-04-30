import Link from "next/link";
import {
  Plus,
  Search,
  FileText,
  FolderOpen,
  MoreVertical,
  Upload,
  Clock,
  HardDrive,
  File,
  FileSpreadsheet,
  FileType,
} from "lucide-react";

/**
 * 知识库管理页
 */
export default function KnowledgePage() {
  // 模拟知识库数据
  const knowledgeBases = [
    {
      id: "1",
      name: "产品知识库",
      desc: "包含产品介绍、规格参数、使用说明等",
      docs: 12,
      size: "5.2MB",
      updatedAt: "2小时前",
      status: "active",
    },
    {
      id: "2",
      name: "FAQ知识库",
      desc: "常见问题与标准答案",
      docs: 8,
      size: "1.8MB",
      updatedAt: "昨天",
      status: "active",
    },
    {
      id: "3",
      name: "政策法规库",
      desc: "相关行业政策法规文档",
      docs: 4,
      size: "3.1MB",
      updatedAt: "3天前",
      status: "building",
    },
  ];

  // 模拟文档列表
  const recentDocs = [
    {
      name: "产品使用手册v3.pdf",
      type: "pdf",
      size: "2.1MB",
      updatedAt: "2小时前",
      status: "indexed",
    },
    {
      name: "常见问题FAQ.xlsx",
      type: "xlsx",
      size: "156KB",
      updatedAt: "昨天",
      status: "indexed",
    },
    {
      name: "售后服务政策.docx",
      type: "docx",
      size: "89KB",
      updatedAt: "昨天",
      status: "indexed",
    },
    {
      name: "产品规格参数表.pdf",
      type: "pdf",
      size: "1.5MB",
      updatedAt: "3天前",
      status: "indexing",
    },
    {
      name: "行业法规汇编.pdf",
      type: "pdf",
      size: "3.1MB",
      updatedAt: "3天前",
      status: "pending",
    },
  ];

  const getFileIcon = (type: string) => {
    switch (type) {
      case "pdf":
        return <FileType className="w-5 h-5 text-red-500" />;
      case "xlsx":
        return <FileSpreadsheet className="w-5 h-5 text-green-500" />;
      case "docx":
        return <FileText className="w-5 h-5 text-blue-500" />;
      default:
        return <File className="w-5 h-5 text-neutral-400" />;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "indexed":
        return { label: "已索引", color: "text-green-600 bg-green-50" };
      case "indexing":
        return { label: "索引中", color: "text-yellow-600 bg-yellow-50" };
      case "pending":
        return { label: "待处理", color: "text-neutral-500 bg-neutral-100" };
      default:
        return { label: status, color: "text-neutral-500 bg-neutral-100" };
    }
  };

  return (
    <div className="space-y-6">
      {/* 页面标题 */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-neutral-900">知识库管理</h2>
          <p className="text-neutral-500 mt-1">
            管理智能体的知识文档，构建专属知识体系
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-neutral-600 bg-white border border-neutral-300 rounded-lg hover:bg-neutral-50 transition-colors">
            <Upload className="w-4 h-4" />
            上传文档
          </button>
          <button className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700 transition-colors">
            <Plus className="w-4 h-4" />
            新建知识库
          </button>
        </div>
      </div>

      {/* 存储概览 */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 bg-white rounded-xl border border-neutral-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary-50 flex items-center justify-center">
              <FolderOpen className="w-5 h-5 text-primary-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-neutral-900">
                {knowledgeBases.length}
              </div>
              <div className="text-sm text-neutral-500">知识库</div>
            </div>
          </div>
        </div>
        <div className="p-4 bg-white rounded-xl border border-neutral-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center">
              <FileText className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-neutral-900">24</div>
              <div className="text-sm text-neutral-500">总文档数</div>
            </div>
          </div>
        </div>
        <div className="p-4 bg-white rounded-xl border border-neutral-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-purple-50 flex items-center justify-center">
              <HardDrive className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-neutral-900">
                10.1MB
              </div>
              <div className="text-sm text-neutral-500">
                已用 / 100MB
              </div>
            </div>
          </div>
          {/* 存储进度条 */}
          <div className="mt-2 w-full bg-neutral-200 rounded-full h-1.5">
            <div
              className="bg-primary-600 h-1.5 rounded-full"
              style={{ width: "10.1%" }}
            />
          </div>
        </div>
      </div>

      {/* 知识库列表 */}
      <div>
        <h3 className="text-lg font-semibold text-neutral-900 mb-4">
          我的知识库
        </h3>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {knowledgeBases.map((kb) => (
            <div
              key={kb.id}
              className="p-5 bg-white rounded-xl border border-neutral-200 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="w-10 h-10 rounded-lg bg-primary-50 flex items-center justify-center">
                  <FolderOpen className="w-5 h-5 text-primary-600" />
                </div>
                <button className="p-1 text-neutral-400 hover:text-neutral-600">
                  <MoreVertical className="w-4 h-4" />
                </button>
              </div>
              <h4 className="font-semibold text-neutral-900 mb-1">{kb.name}</h4>
              <p className="text-sm text-neutral-500 mb-3 line-clamp-2">
                {kb.desc}
              </p>
              <div className="flex items-center justify-between text-xs text-neutral-400">
                <span>{kb.docs} 个文档</span>
                <div className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {kb.updatedAt}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 最近文档 */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-neutral-900">
            最近上传的文档
          </h3>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
            <input
              type="text"
              placeholder="搜索文档..."
              className="pl-9 pr-4 py-2 border border-neutral-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white w-64"
            />
          </div>
        </div>
        <div className="bg-white rounded-xl border border-neutral-200 divide-y divide-neutral-100">
          {recentDocs.map((doc) => {
            const status = getStatusLabel(doc.status);
            return (
              <div
                key={doc.name}
                className="flex items-center gap-4 px-5 py-3.5 hover:bg-neutral-50 transition-colors"
              >
                {getFileIcon(doc.type)}
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-neutral-900 truncate">
                    {doc.name}
                  </div>
                  <div className="text-xs text-neutral-400">{doc.size}</div>
                </div>
                <span
                  className={`inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-full ${status.color}`}
                >
                  {status.label}
                </span>
                <div className="flex items-center gap-1 text-xs text-neutral-400">
                  <Clock className="w-3 h-3" />
                  {doc.updatedAt}
                </div>
                <button className="p-1 text-neutral-400 hover:text-neutral-600">
                  <MoreVertical className="w-4 h-4" />
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
