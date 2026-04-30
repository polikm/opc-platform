"""
模型管理API
- 获取可用模型列表
- 获取模型用量统计
"""
import logging
from typing import Optional

from fastapi import APIRouter, HTTPException, Query

from app.models.schemas import (
    ModelInfo,
    ModelListResponse,
    ModelUsageStats,
    ApiResponse,
)
from app.services.cost_service import get_cost_service
from app.services.llm_service import MODEL_PRICING, MODEL_CONTEXT_SIZES

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/models", tags=["模型管理"])

# 预定义的可用模型列表
AVAILABLE_MODELS = [
    ModelInfo(
        id="gpt-4o",
        name="gpt-4o",
        provider="openai",
        display_name="GPT-4o",
        description="OpenAI最新多模态模型，支持文本和图像输入，性能强大",
        max_context_tokens=128000,
        max_output_tokens=4096,
        input_price_per_1k=MODEL_PRICING.get("gpt-4o").input_price_per_1k,
        output_price_per_1k=MODEL_PRICING.get("gpt-4o").output_price_per_1k,
        is_available=True,
    ),
    ModelInfo(
        id="gpt-4o-mini",
        name="gpt-4o-mini",
        provider="openai",
        display_name="GPT-4o Mini",
        description="轻量级模型，适合简单任务，性价比高",
        max_context_tokens=128000,
        max_output_tokens=4096,
        input_price_per_1k=MODEL_PRICING.get("gpt-4o-mini").input_price_per_1k,
        output_price_per_1k=MODEL_PRICING.get("gpt-4o-mini").output_price_per_1k,
        is_available=True,
    ),
    ModelInfo(
        id="gpt-4-turbo",
        name="gpt-4-turbo",
        provider="openai",
        display_name="GPT-4 Turbo",
        description="GPT-4的加速版本，支持128K上下文",
        max_context_tokens=128000,
        max_output_tokens=4096,
        input_price_per_1k=MODEL_PRICING.get("gpt-4-turbo").input_price_per_1k,
        output_price_per_1k=MODEL_PRICING.get("gpt-4-turbo").output_price_per_1k,
        is_available=True,
    ),
    ModelInfo(
        id="gpt-3.5-turbo",
        name="gpt-3.5-turbo",
        provider="openai",
        display_name="GPT-3.5 Turbo",
        description="经济型模型，适合简单对话和文本处理",
        max_context_tokens=16385,
        max_output_tokens=4096,
        input_price_per_1k=MODEL_PRICING.get("gpt-3.5-turbo").input_price_per_1k,
        output_price_per_1k=MODEL_PRICING.get("gpt-3.5-turbo").output_price_per_1k,
        is_available=True,
    ),
    ModelInfo(
        id="dify-chat",
        name="dify-chat",
        provider="dify",
        display_name="Dify Chat (自定义)",
        description="通过Dify平台配置的对话型应用，可自定义模型和提示词",
        max_context_tokens=0,
        max_output_tokens=0,
        input_price_per_1k=0.0,
        output_price_per_1k=0.0,
        is_available=True,
    ),
]


@router.get("", response_model=ApiResponse, summary="获取可用模型列表")
async def list_models(
    provider: Optional[str] = Query(default=None, description="按提供商筛选"),
):
    """
    获取所有可用的AI模型列表
    """
    models = AVAILABLE_MODELS
    if provider:
        models = [m for m in models if m.provider == provider]

    model_list = [m.model_dump() for m in models]

    return ApiResponse(
        data=ModelListResponse(models=model_list).model_dump(),
    )


@router.get("/{model_id}/usage", response_model=ApiResponse, summary="获取模型用量统计")
async def get_model_usage(
    model_id: str,
    days: int = Query(default=30, ge=1, le=365, description="统计天数"),
):
    """
    获取指定模型的用量统计信息
    """
    try:
        cost_service = get_cost_service()
        stats = await cost_service.get_model_usage_stats(
            model_id=model_id,
            days=days,
        )

        response = ModelUsageStats(
            model_id=stats["model_id"],
            model_name=stats["model_name"],
            total_requests=stats["total_requests"],
            total_tokens=stats["total_tokens"],
            total_cost_usd=stats["total_cost_usd"],
            avg_tokens_per_request=stats["avg_tokens_per_request"],
            daily_stats=stats["daily_stats"],
        )

        return ApiResponse(data=response.model_dump())

    except Exception as e:
        logger.error(f"获取模型用量统计失败: {e}")
        raise HTTPException(
            status_code=500,
            detail=f"获取用量统计失败: {str(e)}",
        )
