# ============================================================
# 多阶段构建 - OPC API Gateway (NestJS)
# ============================================================

# ---- 依赖安装阶段 ----
FROM node:22-alpine AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# 先复制 workspace 配置和依赖文件，利用 Docker 缓存层
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml* turbo.json ./
COPY packages/shared-types/package.json ./packages/shared-types/
COPY apps/api-gateway/package.json ./apps/api-gateway/

# 安装 pnpm 并安装依赖
RUN corepack enable && corepack prepare pnpm@10.28.1 --activate
RUN pnpm install --frozen-lockfile || pnpm install

# ---- 构建阶段 ----
FROM node:22-alpine AS builder
WORKDIR /app

# 从 deps 阶段复制 node_modules
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/packages/shared-types/node_modules ./packages/shared-types/node_modules

# 复制源代码
COPY . .

# 构建 shared-types（api-gateway 依赖它）
RUN pnpm --filter @op/shared-types build

# 构建 api-gateway
RUN pnpm --filter @op/api-gateway build

# ---- 运行阶段 ----
FROM node:22-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production

# 创建非 root 用户
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nestjs

# 仅复制运行时需要的文件
COPY --from=builder /app/apps/api-gateway/dist ./dist
COPY --from=builder /app/apps/api-gateway/package.json ./
COPY --from=builder /app/apps/api-gateway/node_modules ./node_modules

# 复制 shared-types（运行时需要）
COPY --from=builder /app/packages/shared-types/dist ./packages/shared-types/dist
COPY --from=builder /app/packages/shared-types/package.json ./packages/shared-types/

USER nestjs

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=10s --start-period=15s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:3000/api/docs || exit 1

CMD ["node", "dist/main"]
