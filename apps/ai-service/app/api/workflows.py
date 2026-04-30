"""
工作流API路由
- 获取工作流模板列表
- 执行工作流
"""
import json
import logging
from typing import Optional

from fastapi import APIRouter, HTTPException, Query
from sse_starlette.sse import EventSourceResponse

from app.models.schemas import (
    WorkflowExecuteRequest,
    WorkflowExecuteResponse,
    WorkflowListResponse,
    WorkflowTemplateResponse,
    ApiResponse,
)
from app.services.dify_client import get_dify_client

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/workflows", tags=["工作流管理"])

# 预定义的工作流模板
WORKFLOW_TEMPLATES = [
    {
        "id": "opc-readiness-assessment",
        "name": "OPC就绪度评估",
        "description": "评估企业的OPC（在线产品配置）就绪程度，分析技术、流程、人员等维度",
        "category": "assessment",
        "dify_workflow_id": None,  # 需要在Dify中创建对应工作流后填入
        "input_variables": [
            {"name": "company_name", "type": "string", "required": True, "label": "企业名称"},
            {"name": "industry", "type": "string", "required": False, "label": "行业"},
            {"name": "company_size", "type": "string", "required": False, "label": "企业规模"},
            {"name": "current_system", "type": "string", "required": False, "label": "现有系统"},
        ],
    },
    {
        "id": "content-creation",
        "name": "内容创作工作流",
        "description": "基于产品信息和目标受众，自动生成营销文案、产品描述等内容",
        "category": "content",
        "dify_workflow_id": None,
        "input_variables": [
            {"name": "product_name", "type": "string", "required": True, "label": "产品名称"},
            {"name": "product_description", "type": "string", "required": True, "label": "产品描述"},
            {"name": "target_audience", "type": "string", "required": False, "label": "目标受众"},
            {"name": "content_type", "type": "string", "required": False, "label": "内容类型"},
            {"name": "tone", "type": "string", "required": False, "label": "语气风格"},
        ],
    },
    {
        "id": "customer-reception",
        "name": "客户接待工作流",
        "description": "智能客户接待流程，包括需求分析、产品推荐、方案生成",
        "category": "customer",
        "dify_workflow_id": None,
        "input_variables": [
            {"name": "customer_name", "type": "string", "required": False, "label": "客户名称"},
            {"name": "customer_need", "type": "string", "required": True, "label": "客户需求"},
            {"name": "budget_range", "type": "string", "required": False, "label": "预算范围"},
            {"name": "industry", "type": "string", "required": False, "label": "行业"},
        ],
    },
    {
        "id": "data-analysis",
        "name": "数据分析工作流",
        "description": "对业务数据进行智能分析，生成分析报告和建议",
        "category": "analysis",
        "dify_workflow_id": None,
        "input_variables": [
            {"name": "data_source", "type": "string", "required": True, "label": "数据来源"},
            {"name": "analysis_type", "type": "string", "required": True, "label": "分析类型"},
            {"name": "time_range", "type": "string", "required": False, "label": "时间范围"},
        ],
    },
]


@router.get("", response_model=ApiResponse, summary="获取工作流模板列表")
async def list_workflows(
    category: Optional[str] = Query(default=None, description="分类筛选"),
):
    """
    获取可用的工作流模板列表
    """
    templates = WORKFLOW_TEMPLATES
    if category:
        templates = [t for t in templates if t.get("category") == category]

    items = [
        WorkflowTemplateResponse(
            id=t["id"],
            name=t["name"],
            description=t["description"],
            category=t.get("category", ""),
            dify_workflow_id=t.get("dify_workflow_id"),
            input_variables=t.get("input_variables", []),
        ).model_dump()
        for t in templates
    ]

    return ApiResponse(
        data=WorkflowListResponse(total=len(items), items=items).model_dump(),
    )


@router.post("/execute", summary="执行工作流")
async def execute_workflow(request: WorkflowExecuteRequest):
    """
    执行指定的工作流

    支持阻塞和流式两种模式。
    """
    # 查找工作流模板
    template = None
    for t in WORKFLOW_TEMPLATES:
        if t["id"] == request.workflow_id:
            template = t
            break

    if template is None:
        raise HTTPException(status_code=404, detail=f"工作流不存在: {request.workflow_id}")

    dify_client = get_dify_client()

    if request.response_mode == "streaming":
        return EventSourceResponse(
            _stream_workflow(template, request),
        )
    else:
        return await _blocking_workflow(template, request)


async def _stream_workflow(template: dict, request: WorkflowExecuteRequest):
    """SSE流式执行工作流"""
    dify_client = get_dify_client()

    try:
        async for event_data in dify_client.execute_workflow_stream(
            inputs=request.inputs,
            user=request.user or "default-user",
        ):
            event_type = event_data.get("event", "")
            yield {"event": event_type, "data": json.dumps(event_data, ensure_ascii=False)}

    except Exception as e:
        logger.error(f"工作流执行失败: {e}")
        yield {"event": "error", "data": json.dumps({"message": str(e)})}


async def _blocking_workflow(template: dict, request: WorkflowExecuteRequest) -> ApiResponse:
    """阻塞模式执行工作流"""
    dify_client = get_dify_client()

    try:
        result = await dify_client.execute_workflow(
            inputs=request.inputs,
            user=request.user or "default-user",
            response_mode="blocking",
        )

        response = WorkflowExecuteResponse(
            task_id=result.get("task_id", ""),
            workflow_run_id=result.get("workflow_run_id", ""),
            status=result.get("status", "succeeded"),
            outputs=result.get("data", {}).get("outputs"),
            total_tokens=result.get("data", {}).get("total_tokens", 0),
            total_steps=result.get("data", {}).get("total_steps", 0),
            created_at=result.get("created_at"),
        )

        return ApiResponse(data=response.model_dump())

    except Exception as e:
        logger.error(f"工作流执行失败: {e}")
        raise HTTPException(status_code=500, detail=f"工作流执行失败: {str(e)}")
