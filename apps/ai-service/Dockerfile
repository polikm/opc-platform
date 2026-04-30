# ============================================================
# 多阶段构建 - OPC AI Service
# ============================================================
FROM python:3.11-slim AS base

# 设置环境变量
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PIP_NO_CACHE_DIR=1 \
    PIP_DISABLE_PIP_VERSION_CHECK=1

# 安装系统依赖
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

# ============================================================
# 依赖安装阶段
# ============================================================
FROM base AS builder

WORKDIR /build

# 先复制依赖文件，利用Docker缓存层
COPY requirements.txt .

# 安装Python依赖到指定目录
RUN pip install --prefix=/install -r requirements.txt

# ============================================================
# 运行阶段
# ============================================================
FROM base AS runtime

WORKDIR /app

# 从builder阶段复制已安装的依赖
COPY --from=builder /install /usr/local

# 复制应用代码
COPY . .

# 创建非root用户
RUN groupadd -r appuser && useradd -r -g appuser appuser \
    && chown -R appuser:appuser /app

USER appuser

# 暴露端口
EXPOSE 8000

# 健康检查
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD python -c "import httpx; httpx.get('http://localhost:8000/health')" || exit 1

# 启动命令
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000", "--workers", "2"]
