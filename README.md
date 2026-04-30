<p align="center">
  <h1 align="center">🚀 OPC 智能体系统</h1>
  <p align="center">
    <strong>一人公司（One Person Company）社区智能体平台</strong>
  </p>
  <p align="center">
    <a href="#功能特性">功能特性</a> • <a href="#技术架构">技术架构</a> • <a href="#快速部署">快速部署</a> • <a href="#开发指南">开发指南</a> • <a href="#项目结构">项目结构</a>
  </p>
</p>

---

## 📖 项目介绍

**OPC智能体系统**是一个面向"一人公司"（One Person Company）创业者的综合性AI赋能平台。通过集成Dify智能体引擎、LangGraph工作流编排和MCP协议，为个人创业者提供从入驻注册、AI业务助手搭建到生态交易的完整闭环服务。

### 核心价值

- 🎯 **降低创业门槛** — AI智能体替代传统团队职能，一个人也能运营复杂业务
- ⚡ **加速业务验证** — 从想法到MVP的快速验证链路，缩短商业假设验证周期
- 🌐 **构建互助生态** — OPC主理人之间的知识共享、工具交易、资源互通

### 三大核心模块

| 模块 | 说明 |
|------|------|
| **OPC主理人注册流程** | AI就绪度评估 → 个人档案建立 → OPC主页自动生成 → 认证体系 |
| **个人专属AI智能体** | 智能体创建向导 → 知识库管理 → 工作流编排 → 对话与嵌入 → 运营面板 |
| **OPC业务生态平台** | 内容社区 → 知识交易市场 → 智能体市场 → 营销增长工具 → 数据分析 |

---

## ✨ 功能特性

### 🔐 用户与认证
- 手机号/邮箱/微信OAuth多种登录方式
- JWT认证 + RBAC角色权限管理
- AI驱动的OPC就绪度评估报告
- 自动生成个人OPC展示主页

### 🤖 AI智能体引擎
- 基于 **Dify** 私有化部署的核心智能体引擎
- **LangGraph** 复杂工作流编排（就绪度评估/内容创作/客户接待）
- **MCP协议** 标准化工具接入与动态发现
- 多模型智能路由（成本优化 + 质量保障）
- SSE流式对话 + 长短期记忆管理
- AI安全护栏（Prompt注入检测 + 内容过滤）

### 💬 知识库与对话
- 多格式文档上传（PDF/Word/Markdown/TXT）
- 自动分段 + pgvector向量化存储
- 多轮对话 + 上下文记忆 + 流式输出
- 智能体一键嵌入外部页面（iframe Widget）

### 🏪 业务生态
- 社区动态信息流 + 话题圈子
- 数字产品交易市场（电子书/课程/模板/工具包）
- 智能体市场（体验/购买/克隆/API订阅）
- 多渠道支付（微信支付/支付宝/Stripe）
- 营销增长工具 + 数据分析看板

---

## 🏗️ 技术架构

### 系统架构图

```
┌─────────────────────────────────────────────────────────────┐
│                        客户端层                              │
│   Next.js 15 (Web)  │  Uni-app (H5+小程序)  │  Admin后台    │
└──────────┬───────────┴──────────┬─────────────┴──────┬──────┘
           │                      │                    │
           ▼                      ▼                    ▼
┌─────────────────────────────────────────────────────────────┐
│                    Nginx API Gateway                         │
│              SSL终止 · 速率限制 · JWT验证 · 路由              │
└──────────┬──────────────────────┬───────────────────────────┘
           │                      │
           ▼                      ▼
┌──────────────────┐  ┌──────────────────────────────────────┐ │
│  NestJS 业务层    │  │  FastAPI AI层                         │ │
│  用户·认证·订单   │  │  LangGraph · MCP · 多模型路由 · 记忆   │ │
│  支付·社区·内容   │  │  Token配额 · 安全护栏 · 成本控制       │ │
└────────┬─────────┘  └──────────────┬───────────────────────┘ │
         │                           │                          │
         └───────────┬───────────────┘                          │
                     ▼                                          │
┌──────────────────────────────────────────────────────────────┐
│              Dify 私有化部署（核心智能体引擎）                   │
│     知识库RAG · 工作流引擎 · Agent编排 · 插件系统 · 多租户     │
└──────────────────────────────────────────────────────────────┘
                     │
         ┌───────────┼───────────┐
         ▼           ▼           ▼
┌────────────┐ ┌──────────┐ ┌──────────┐
│ PostgreSQL  │ │  Redis   │ │ MinIO/S3 │
│ + pgvector  │ │ 缓存·队列│ │ 文件存储  │
└────────────┘ └──────────┘ └──────────┘
```

### 技术栈

| 层级 | 技术 | 说明 |
|------|------|------|
| **Web前端** | Next.js 15 + React 19 + Tailwind CSS | SSR/SSG/ISR, App Router |
| **移动端** | Uni-app (Vue 3) | H5 + 微信小程序 + 支付宝小程序 |
| **管理后台** | Next.js + Recharts | 数据可视化 + 内容管理 |
| **业务后端** | NestJS + TypeORM + Passport | 模块化架构, JWT认证, Swagger文档 |
| **AI后端** | FastAPI + LangGraph + LangChain | 异步高性能, Python AI生态 |
| **智能体引擎** | Dify (私有化) | 知识库+工作流+Agent+插件+多租户 |
| **AI协议** | MCP + A2A | 标准化工具接入 + Agent互操作 |
| **数据库** | PostgreSQL 16 + pgvector | 关系型 + 向量搜索 (HNSW索引) |
| **缓存** | Redis 7 | 会话/限流/队列/实时通知 |
| **对象存储** | MinIO (S3兼容) | 文件/知识库文档/模型文件 |
| **反向代理** | Nginx | SSL终止/路由/压缩/安全头 |
| **容器化** | Docker + Docker Compose | 一键部署, 服务编排 |

---

## 🚀 快速部署（Docker一键部署）

### 前置要求

| 要求 | 最低版本 | 说明 |
|------|---------|------|
| **Docker** | 20.10+ | [安装指南](https://docs.docker.com/get-docker/) |
| **Docker Compose** | V2.0+ | Docker Desktop自带，或[单独安装](https://docs.docker.com/compose/install/) |
| **Git** | 2.0+ | 用于克隆项目 |
| **系统资源** | 8GB+ RAM, 20GB+ 磁盘 | Dify + PostgreSQL + Redis 等服务需要一定资源 |

### 一键部署

```bash
# 1. 克隆项目
git clone https://github.com/polikm/opc-platform.git
cd opc-platform

# 2. 一键启动（自动检查环境、配置、拉取镜像、启动服务）
chmod +x infrastructure/scripts/setup.sh
./infrastructure/scripts/setup.sh
```

脚本会自动完成以下操作：
1. ✅ 检查 Docker 和 Docker Compose 是否安装
2. ✅ 从 `.env.example` 创建环境变量文件
3. ✅ 创建必要的目录
4. ✅ 拉取所有 Docker 镜像
5. ✅ 启动所有服务（后台模式）
6. ✅ 等待健康检查通过并输出访问地址

### 手动部署

如果需要手动控制部署流程：

```bash
# 1. 克隆项目
git clone https://github.com/polikm/opc-platform.git
cd opc-platform

# 2. 配置环境变量
cd infrastructure/docker
cp .env.example .env
# 编辑 .env 文件，修改数据库密码、JWT密钥等敏感配置
nano .env

# 3. 启动所有服务
docker compose up -d

# 4. 查看服务状态
docker compose ps

# 5. 查看日志
docker compose logs -f
```

### 服务访问地址

启动成功后，可通过以下地址访问各服务：

| 服务 | 地址 | 说明 |
|------|------|------|
| **OPC平台首页** | http://localhost | Nginx统一入口 |
| **Web前端** | http://localhost:3001 | Next.js应用 |
| **API网关** | http://localhost:3000 | NestJS业务API |
| **API文档** | http://localhost:3000/api/docs | Swagger交互式文档 |
| **AI服务** | http://localhost:8000 | FastAPI AI服务 |
| **AI文档** | http://localhost:8000/docs | FastAPI Swagger文档 |
| **管理后台** | http://localhost:3001/admin | 管理后台（开发阶段） |
| **Dify平台** | http://localhost:3002 | Dify智能体管理界面 |
| **Dify API** | http://localhost:5001 | Dify API服务 |
| **MinIO控制台** | http://localhost:9001 | 对象存储管理（admin/minioadmin123） |

### Nginx路由规则

| 路径 | 目标服务 | 说明 |
|------|---------|------|
| `/` | Web前端 (3001) | OPC平台首页 |
| `/api/` | API网关 (3000) | 业务API |
| `/ai/` | AI服务 (8000) | AI智能体API |
| `/dify/` | Dify Web (3002) | Dify管理界面 |
| `/dify-api/` | Dify API (5001) | Dify API |

---

## ⚙️ 环境变量配置

环境变量文件位于 `infrastructure/docker/.env`，关键配置项说明：

### 必须修改（生产环境）

```bash
# JWT密钥（请使用强随机字符串）
JWT_SECRET=your-super-secret-jwt-key-change-in-production

# 数据库密码
POSTGRES_PASSWORD=your-strong-password

# Redis密码
REDIS_PASSWORD=your-redis-password

# Dify安全密钥
DIFY_SECRET_KEY=your-dify-secret-key

# LLM API密钥（至少配置一个）
OPENAI_API_KEY=sk-your-openai-key
```

### 可选配置

```bash
# 对象存储（默认使用MinIO，也可配置阿里云OSS/AWS S3）
MINIO_ROOT_USER=minioadmin
MINIO_ROOT_PASSWORD=minioadmin123

# CORS允许的域名
CORS_ORIGIN=https://your-domain.com

# 限流配置
THROTTLE_TTL=60
THROTTLE_LIMIT=100
```

> 💡 **提示**：生成安全密钥：`openssl rand -base64 42`

---

## 💻 开发指南

### 本地开发（不使用Docker）

```bash
# 1. 克隆项目并安装依赖
git clone https://github.com/polikm/opc-platform.git
cd opc-platform
pnpm install

# 2. 启动基础设施（仅PostgreSQL + Redis + MinIO）
docker compose -f infrastructure/docker/docker-compose.yml up -d postgres redis minio

# 3. 配置环境变量
cp infrastructure/docker/.env.example infrastructure/docker/.env

# 4. 启动各服务（分别在不同终端）
pnpm dev                    # 启动所有服务（Turborepo）
# 或单独启动：
pnpm --filter @op/web dev          # Web前端 (3001)
pnpm --filter @op/api-gateway dev  # API网关 (3000)
cd apps/ai-service && uvicorn app.main:app --reload --port 8000  # AI服务

# 5. 访问开发服务
# Web前端: http://localhost:3001
# API文档: http://localhost:3000/api/docs
# AI文档:  http://localhost:8000/docs
```

### 项目结构

```
opc-platform/
├── apps/
│   ├── web/                  # 🌐 Next.js 15 Web前端
│   │   ├── app/              #    App Router 页面
│   │   │   ├── (auth)/       #    登录/注册
│   │   │   ├── (dashboard)/  #    主理人工作台
│   │   │   ├── (community)/  #    社区
│   │   │   └── (marketplace)/#    生态市场
│   │   ├── components/       #    UI组件 + 布局组件 + 聊天组件
│   │   └── lib/              #    工具函数 + API客户端
│   │
│   ├── admin/                # 🛠️ 管理后台 (Next.js)
│   │   ├── app/(admin)/      #    仪表盘/用户/智能体/内容/分析/设置
│   │   └── components/admin/ #    侧边栏/表格/图表组件
│   │
│   ├── api-gateway/          # 🔧 NestJS 业务后端
│   │   └── src/
│   │       ├── common/       #    装饰器/守卫/拦截器/过滤器/DTO
│   │       └── modules/      #    auth/user/agent/content/marketplace/community
│   │
│   └── ai-service/           # 🤖 FastAPI AI服务
│       └── app/
│           ├── api/          #    agents/chat/knowledge/workflows/mcp/models
│           ├── core/         #    langgraph工作流/MCP客户端/安全护栏
│           ├── services/     #    Dify客户端/LLM服务/记忆/成本控制
│           └── models/       #    Pydantic Schema/SQLAlchemy ORM
│
├── packages/
│   ├── shared-types/         # 📦 共享TypeScript类型定义
│   ├── api-client/           # 📦 共享API客户端（Axios）
│   └── config/               # 📦 ESLint + Prettier共享配置
│
├── infrastructure/
│   ├── docker/               # 🐳 Docker Compose + Nginx + 初始化脚本
│   └── scripts/              # 📜 一键部署/备份/开发脚本
│
├── turbo.json                # Turborepo 任务编排
├── pnpm-workspace.yaml       # pnpm 工作区配置
└── package.json              # 根 package.json
```

### 常用命令

```bash
# 安装依赖
pnpm install

# 启动所有服务（开发模式）
pnpm dev

# 构建所有服务
pnpm build

# 代码检查
pnpm lint

# 代码格式化
pnpm format

# 清理构建产物
pnpm clean

# Docker相关
cd infrastructure/docker
docker compose up -d          # 启动所有服务
docker compose logs -f        # 查看日志
docker compose down           # 停止服务
docker compose down -v        # 停止并清除数据

# 数据库备份
./infrastructure/scripts/backup.sh              # 备份所有
./infrastructure/scripts/backup.sh --main       # 仅备份主数据库
./infrastructure/scripts/backup.sh --restore <file>  # 恢复备份
```

---

## 🗺️ 路线图

- [x] **MVP** — 核心验证（用户系统 + 智能体 + 知识库 + 社区基础）
- [ ] **V1.0** — 产品完善（H5/小程序 + 支付系统 + 交易市场 + 高级工作流）
- [ ] **V2.0** — 生态繁荣（智能体市场 + MCP工具生态 + 开放API + 国际化）

---

## 🤝 贡献指南

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/amazing-feature`)
3. 提交更改 (`git commit -m 'Add some amazing feature'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 发起 Pull Request

---

## 📄 License

Private — All Rights Reserved

---

<p align="center">
  Built with ❤️ by <a href="https://github.com/polikm">OPC Community</a>
</p>
