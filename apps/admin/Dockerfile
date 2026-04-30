# ============================================================
# 多阶段构建 - OPC Admin (Next.js 15)
# ============================================================

# ---- 依赖安装阶段 ----
FROM node:22-alpine AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package.json pnpm-workspace.yaml pnpm-lock.yaml* turbo.json ./
COPY packages/shared-types/package.json ./packages/shared-types/
COPY apps/admin/package.json ./apps/admin/

RUN corepack enable && corepack prepare pnpm@10.28.1 --activate
RUN pnpm install --frozen-lockfile || pnpm install

# ---- 构建阶段 ----
FROM node:22-alpine AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/packages/shared-types/node_modules ./packages/shared-types/node_modules
COPY --from=deps /app/apps/admin/node_modules ./apps/admin/node_modules

COPY . .

ENV NEXT_TELEMETRY_DISABLED=1

RUN pnpm --filter @op/shared-types build
RUN pnpm --filter @op/admin build

# ---- 运行阶段 ----
FROM node:22-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

COPY --from=builder /app/apps/admin/public ./public
COPY --from=builder /app/apps/admin/.next/standalone ./
COPY --from=builder /app/apps/admin/.next/static ./.next/static

USER nextjs

EXPOSE 3003

ENV PORT=3003
ENV HOSTNAME="0.0.0.0"

HEALTHCHECK --interval=30s --timeout=10s --start-period=30s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:3003 || exit 1

CMD ["node", "server.js"]
