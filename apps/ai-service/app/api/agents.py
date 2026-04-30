"""
智能体API路由
- 创建/查询/更新/删除/发布智能体
"""
import json
import logging
import uuid
from datetime import datetime
from typing import Optional

from fastapi import APIRouter, HTTPException, Query

from app.models.schemas import (
    AgentCreate,
    AgentListResponse,
    AgentResponse,
    AgentUpdate,
    ApiResponse,
)
from app.models.database import Agent, get_db
from app.services.dify_client import get_dify_client

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/agents", tags=["智能体管理"])


@router.post("", response_model=ApiResponse, summary="创建智能体")
async def create_agent(request: AgentCreate):
    """
    创建智能体

    通过Dify API创建应用，并在本地数据库中记录智能体信息。
    """
    agent_id = str(uuid.uuid4())

    try:
        # 调用Dify创建应用
        dify_client = get_dify_client()
        dify_result = await dify_client.create_app(
            name=request.name,
            description=request.description or "",
            app_type=request.dify_app_type,
        )
        dify_app_id = dify_result.get("id", "")

        # 保存到数据库
        async with get_db()() as session:
            agent = Agent(
                id=agent_id,
                name=request.name,
                description=request.description,
                dify_app_id=dify_app_id,
                dify_app_type=request.dify_app_type,
                system_prompt=request.system_prompt,
                model_config=json.dumps(request.model_config, ensure_ascii=False) if request.model_config else None,
                status="draft",
                is_published=False,
            )
            session.add(agent)
            await session.commit()
            await session.refresh(agent)

        return ApiResponse(
            code=201,
            message="智能体创建成功",
            data=AgentResponse.model_validate(agent).model_dump(),
        )
    except Exception as e:
        logger.error(f"创建智能体失败: {e}")
        raise HTTPException(status_code=500, detail=f"创建智能体失败: {str(e)}")


@router.get("", response_model=ApiResponse, summary="获取智能体列表")
async def list_agents(
    page: int = Query(default=1, ge=1, description="页码"),
    page_size: int = Query(default=20, ge=1, le=100, description="每页数量"),
    status: Optional[str] = Query(default=None, description="状态筛选"),
):
    """
    获取智能体列表，支持分页和状态筛选
    """
    from sqlalchemy import func, select

    async with get_db()() as session:
        # 构建查询
        query = select(Agent)
        count_query = select(func.count(Agent.id))

        if status:
            query = query.where(Agent.status == status)
            count_query = count_query.where(Agent.status == status)

        # 总数
        total_result = await session.execute(count_query)
        total = total_result.scalar() or 0

        # 分页查询
        offset = (page - 1) * page_size
        query = query.order_by(Agent.created_at.desc()).offset(offset).limit(page_size)
        result = await session.execute(query)
        agents = result.scalars().all()

        items = [AgentResponse.model_validate(a).model_dump() for a in agents]

        return ApiResponse(
            data=AgentListResponse(total=total, items=items).model_dump(),
        )


@router.get("/{agent_id}", response_model=ApiResponse, summary="获取智能体详情")
async def get_agent(agent_id: str):
    """
    根据ID获取智能体详细信息
    """
    from sqlalchemy import select

    async with get_db()() as session:
        result = await session.execute(select(Agent).where(Agent.id == agent_id))
        agent = result.scalar_one_or_none()

        if agent is None:
            raise HTTPException(status_code=404, detail="智能体不存在")

        return ApiResponse(
            data=AgentResponse.model_validate(agent).model_dump(),
        )


@router.put("/{agent_id}", response_model=ApiResponse, summary="更新智能体")
async def update_agent(agent_id: str, request: AgentUpdate):
    """
    更新智能体信息
    """
    from sqlalchemy import select

    async with get_db()() as session:
        result = await session.execute(select(Agent).where(Agent.id == agent_id))
        agent = result.scalar_one_or_none()

        if agent is None:
            raise HTTPException(status_code=404, detail="智能体不存在")

        # 更新字段
        update_data = request.model_dump(exclude_unset=True)
        for field, value in update_data.items():
            if field == "model_config" and value is not None:
                value = json.dumps(value, ensure_ascii=False)
            setattr(agent, field, value)

        agent.updated_at = datetime.utcnow()
        await session.commit()
        await session.refresh(agent)

        return ApiResponse(
            message="智能体更新成功",
            data=AgentResponse.model_validate(agent).model_dump(),
        )


@router.delete("/{agent_id}", response_model=ApiResponse, summary="删除智能体")
async def delete_agent(agent_id: str):
    """
    删除智能体（同时尝试删除Dify应用）
    """
    from sqlalchemy import select

    async with get_db()() as session:
        result = await session.execute(select(Agent).where(Agent.id == agent_id))
        agent = result.scalar_one_or_none()

        if agent is None:
            raise HTTPException(status_code=404, detail="智能体不存在")

        # 尝试删除Dify应用
        if agent.dify_app_id:
            try:
                dify_client = get_dify_client()
                await dify_client.delete_app(agent.dify_app_id)
            except Exception as e:
                logger.warning(f"删除Dify应用失败（已忽略）: {e}")

        # 从数据库删除
        await session.delete(agent)
        await session.commit()

        return ApiResponse(message="智能体删除成功")


@router.post("/{agent_id}/publish", response_model=ApiResponse, summary="发布智能体")
async def publish_agent(agent_id: str):
    """
    发布智能体，将状态从draft变为published
    """
    from sqlalchemy import select

    async with get_db()() as session:
        result = await session.execute(select(Agent).where(Agent.id == agent_id))
        agent = result.scalar_one_or_none()

        if agent is None:
            raise HTTPException(status_code=404, detail="智能体不存在")

        if agent.status == "published":
            return ApiResponse(message="智能体已发布", data=AgentResponse.model_validate(agent).model_dump())

        agent.status = "published"
        agent.is_published = True
        agent.updated_at = datetime.utcnow()
        await session.commit()
        await session.refresh(agent)

        return ApiResponse(
            message="智能体发布成功",
            data=AgentResponse.model_validate(agent).model_dump(),
        )
