# ============================================================
# 多阶段构建 - OPC Web (Next.js 15)
# ============================================================

# ---- 依赖安装阶段 ----
FROM node:22-alpine AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# 先复制 workspace 配置和依赖文件，利用 Docker 缓存层
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml* turbo.json ./
COPY packages/shared-types/package.json ./packages/shared-types/
COPY packages/api-client/package.json ./packages/api-client/
COPY apps/web/package.json ./apps/web/

# 安装 pnpm 并安装依赖
RUN corepack enable && corepack prepare pnpm@10.28.1 --activate
RUN pnpm install --frozen-lockfile || pnpm install

# ---- 构建阶段 ----
FROM node:22-alpine AS builder
WORKDIR /app

# 从 deps 阶段复制 node_modules
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/packages/shared-types/node_modules ./packages/shared-types/node_modules
COPY --from=deps /app/packages/api-client/node_modules ./packages/api-client/node_modules
COPY --from=deps /app/apps/web/node_modules ./apps/web/node_modules

# 复制源代码
COPY . .

# 设置构建时环境变量（Next.js public 环境变量需要在构建时注入）
ARG NEXT_PUBLIC_API_URL=http://localhost:3000
ARG NEXT_PUBLIC_AI_URL=http://localhost:8000
ARG NEXT_PUBLIC_DIFY_URL=http://localhost:3002
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_AI_URL=$NEXT_PUBLIC_AI_URL
ENV NEXT_PUBLIC_DIFY_URL=$NEXT_PUBLIC_DIFY_URL
ENV NEXT_TELEMETRY_DISABLED=1

# 构建依赖的共享包
RUN pnpm --filter @op/shared-types build
RUN pnpm --filter @op/api-client build

# 构建 web 应用
RUN pnpm --filter @op/web build

# ---- 运行阶段 ----
FROM node:22-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# 创建非 root 用户
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# 仅复制运行时需要的文件
COPY --from=builder /app/apps/web/public ./public
COPY --from=builder /app/apps/web/.next/standalone ./
COPY --from=builder /app/apps/web/.next/static ./.next/static

USER nextjs

EXPOSE 3001

ENV PORT=3001
ENV HOSTNAME="0.0.0.0"

HEALTHCHECK --interval=30s --timeout=10s --start-period=30s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:3001 || exit 1

CMD ["node", "server.js"]
