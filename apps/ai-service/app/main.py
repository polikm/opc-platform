"""
FastAPI应用入口
- CORS中间件
- 路由注册
- 全局异常处理
- 生命周期事件（startup/shutdown）
- 健康检查端点
"""
import logging
from contextlib import asynccontextmanager
from datetime import datetime
from typing import AsyncIterator

from fastapi import FastAPI, Request, status
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from app.config import get_settings
from app.models.database import close_db, init_db, init_tables
from app.models.schemas import ApiResponse, HealthResponse

# 配置日志
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
    datefmt="%Y-%m-%d %H:%M:%S",
)
logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI) -> AsyncIterator[None]:
    """应用生命周期管理"""
    settings = get_settings()
    logger.info(f"启动 {settings.app_name} (环境: {settings.app_env})")

    # ---- 启动阶段 ----
    try:
        # 初始化数据库
        init_db()
        logger.info("数据库连接初始化完成")

        # 开发环境自动创建表
        if not settings.is_production:
            await init_tables()
            logger.info("数据库表创建完成（开发模式）")
    except Exception as e:
        logger.error(f"数据库初始化失败: {e}")
        raise

    # 预热服务连接
    try:
        from app.services.memory_service import get_memory_service
        memory_service = get_memory_service()
        # 测试Redis连接
        redis = await memory_service._get_redis()
        await redis.ping()
        logger.info("Redis连接成功")
    except Exception as e:
        logger.warning(f"Redis连接失败（部分功能可能不可用）: {e}")

    logger.info(f"{settings.app_name} 启动完成")

    yield  # 应用运行中

    # ---- 关闭阶段 ----
    logger.info(f"正在关闭 {settings.app_name}...")

    try:
        # 关闭数据库连接
        await close_db()
        logger.info("数据库连接已关闭")
    except Exception as e:
        logger.error(f"关闭数据库连接失败: {e}")

    try:
        # 关闭Redis连接
        from app.services.memory_service import get_memory_service
        memory_service = get_memory_service()
        await memory_service.close()
        logger.info("Redis连接已关闭")
    except Exception as e:
        logger.error(f"关闭Redis连接失败: {e}")

    try:
        # 关闭成本服务Redis连接
        from app.services.cost_service import get_cost_service
        cost_service = get_cost_service()
        await cost_service.close()
    except Exception as e:
        logger.error(f"关闭成本服务Redis连接失败: {e}")

    logger.info(f"{settings.app_name} 已关闭")


# ============================================================
# 创建FastAPI应用
# ============================================================
app = FastAPI(
    title="OPC AI Service",
    description="OPC智能体系统 - AI服务层，负责智能体编排、Dify集成、MCP协议适配",
    version="0.1.0",
    lifespan=lifespan,
    docs_url="/docs" if not get_settings().is_production else None,
    redoc_url="/redoc" if not get_settings().is_production else None,
)


# ============================================================
# CORS中间件
# ============================================================
settings = get_settings()

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origin_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ============================================================
# 全局异常处理
# ============================================================
@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    """请求参数验证异常"""
    errors = []
    for error in exc.errors():
        errors.append({
            "field": ".".join(str(loc) for loc in error.get("loc", [])),
            "message": error.get("msg", "验证错误"),
            "type": error.get("type", ""),
        })

    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        content=ApiResponse(
            code=422,
            message="请求参数验证失败",
            data={"errors": errors},
        ).model_dump(),
    )


@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    """全局异常处理"""
    logger.error(f"未处理的异常: {exc}", exc_info=True)

    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content=ApiResponse(
            code=500,
            message="服务器内部错误",
            data={"detail": str(exc)} if settings.debug else None,
        ).model_dump(),
    )


# ============================================================
# 健康检查端点
# ============================================================
@app.get("/health", response_model=HealthResponse, tags=["系统"], summary="健康检查")
async def health_check():
    """
    健康检查端点，用于监控和负载均衡

    检查以下组件状态：
    - 数据库连接
    - Redis连接
    - Dify API连接
    """
    components: dict[str, str] = {}

    # 检查数据库
    try:
        from app.models.database import get_db
        async with get_db()() as session:
            from sqlalchemy import text
            await session.execute(text("SELECT 1"))
        components["database"] = "healthy"
    except Exception as e:
        components["database"] = f"unhealthy: {str(e)[:50]}"

    # 检查Redis
    try:
        from app.services.memory_service import get_memory_service
        memory_service = get_memory_service()
        redis = await memory_service._get_redis()
        await redis.ping()
        components["redis"] = "healthy"
    except Exception as e:
        components["redis"] = f"unhealthy: {str(e)[:50]}"

    # 检查Dify API
    try:
        from app.services.dify_client import get_dify_client
        dify_client = get_dify_client()
        await dify_client.get_app_info()
        components["dify"] = "healthy"
    except Exception as e:
        components["dify"] = f"unhealthy: {str(e)[:50]}"

    # 判断整体状态
    all_healthy = all(v == "healthy" for v in components.values())

    return HealthResponse(
        status="healthy" if all_healthy else "degraded",
        version="0.1.0",
        service="opc-ai-service",
        components=components,
        timestamp=datetime.utcnow(),
    )


# ============================================================
# 注册路由
# ============================================================
from app.api.agents import router as agents_router
from app.api.chat import router as chat_router
from app.api.knowledge import router as knowledge_router
from app.api.workflows import router as workflows_router
from app.api.mcp import router as mcp_router
from app.api.models import router as models_router

app.include_router(agents_router, prefix="/api/v1")
app.include_router(chat_router, prefix="/api/v1")
app.include_router(knowledge_router, prefix="/api/v1")
app.include_router(workflows_router, prefix="/api/v1")
app.include_router(mcp_router, prefix="/api/v1")
app.include_router(models_router, prefix="/api/v1")


# ============================================================
# 根路径
# ============================================================
@app.get("/", tags=["系统"], summary="服务信息")
async def root():
    """获取服务基本信息"""
    return {
        "service": "OPC AI Service",
        "version": "0.1.0",
        "description": "OPC智能体系统 - AI服务层",
        "docs": "/docs",
        "health": "/health",
    }
