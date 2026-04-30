"""
对话API路由
- SSE流式对话
- 对话列表
- 消息历史
- 消息反馈
"""
import json
import logging
import uuid
from datetime import datetime
from typing import Optional

from fastapi import APIRouter, HTTPException, Query
from sse_starlette.sse import EventSourceResponse

from app.models.schemas import (
    ChatMessageSend,
    ConversationListResponse,
    ConversationResponse,
    MessageFeedbackRequest,
    MessageResponse,
    ApiResponse,
    SSEEvent,
)
from app.models.database import Agent, Conversation, Message, get_db
from app.services.dify_client import get_dify_client
from app.services.memory_service import get_memory_service
from app.services.cost_service import get_cost_service
from app.services.llm_service import get_llm_service

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/chat", tags=["对话管理"])


@router.post("/{agent_id}/send", summary="发送消息（SSE流式响应）")
async def send_message(agent_id: str, request: ChatMessageSend):
    """
    发送消息给智能体，支持SSE流式响应和阻塞响应。

    - response_mode=streaming: 返回SSE流式响应
    - response_mode=blocking: 返回完整响应
    """
    from sqlalchemy import select

    # 验证智能体存在
    async with get_db()() as session:
        result = await session.execute(select(Agent).where(Agent.id == agent_id))
        agent = result.scalar_one_or_none()
        if agent is None:
            raise HTTPException(status_code=404, detail="智能体不存在")

    user_id = request.user or "default-user"

    # 检查配额
    cost_service = get_cost_service()
    has_quota = await cost_service.check_quota(user_id)
    if not has_quota:
        raise HTTPException(status_code=429, detail="Token配额已用尽，请联系管理员")

    if request.response_mode == "streaming":
        return EventSourceResponse(
            _stream_chat(agent_id, request, user_id),
        )
    else:
        return await _blocking_chat(agent_id, request, user_id)


async def _stream_chat(agent_id: str, request: ChatMessageSend, user_id: str):
    """SSE流式对话生成器"""
    dify_client = get_dify_client()
    memory_service = get_memory_service()
    llm_service = get_llm_service()

    conversation_id = request.conversation_id
    full_answer = ""
    task_id = ""
    message_id = ""
    dify_conversation_id = ""

    try:
        # 如果没有对话ID，创建新对话
        if not conversation_id:
            conversation_id = str(uuid.uuid4())
            async with get_db()() as session:
                conversation = Conversation(
                    id=conversation_id,
                    agent_id=agent_id,
                    user_id=user_id,
                    status="active",
                )
                session.add(conversation)
                await session.commit()

            yield {"event": "conversation_created", "data": json.dumps({"conversation_id": conversation_id})}
        else:
            # 获取已有对话的Dify conversation_id
            from sqlalchemy import select
            async with get_db()() as session:
                result = await session.execute(
                    select(Conversation).where(Conversation.id == conversation_id)
                )
                conv = result.scalar_one_or_none()
                if conv:
                    dify_conversation_id = conv.dify_conversation_id or ""

        # 保存用户消息
        user_msg_id = str(uuid.uuid4())
        async with get_db()() as session:
            user_message = Message(
                id=user_msg_id,
                conversation_id=conversation_id,
                role="user",
                content=request.query,
                token_count=llm_service.count_tokens(request.query),
            )
            session.add(user_message)
            await session.commit()

        # 调用Dify流式API
        async for event_data in dify_client.send_message_stream(
            query=request.query,
            user=user_id,
            conversation_id=dify_conversation_id,
            inputs=request.inputs,
        ):
            event_type = event_data.get("event", "")

            if event_type == "message":
                answer_chunk = event_data.get("answer", "")
                full_answer += answer_chunk
                task_id = event_data.get("task_id", task_id)
                message_id = event_data.get("message_id", message_id)

                sse_event = SSEEvent(
                    event="message",
                    task_id=task_id,
                    message_id=message_id,
                    conversation_id=conversation_id,
                    answer=answer_chunk,
                )
                yield {"event": "message", "data": sse_event.model_dump_json()}

            elif event_type == "message_end":
                message_id = event_data.get("message_id", message_id)
                dify_conversation_id = event_data.get("conversation_id", dify_conversation_id)
                total_tokens = event_data.get("metadata", {}).get("usage", {}).get("total_tokens", 0)

                # 保存助手消息
                async with get_db()() as session:
                    assistant_message = Message(
                        id=str(uuid.uuid4()),
                        conversation_id=conversation_id,
                        role="assistant",
                        content=full_answer,
                        dify_message_id=message_id,
                        token_count=total_tokens,
                    )
                    session.add(assistant_message)

                    # 更新对话的Dify conversation_id
                    from sqlalchemy import select
                    result = await session.execute(
                        select(Conversation).where(Conversation.id == conversation_id)
                    )
                    conv = result.scalar_one_or_none()
                    if conv and dify_conversation_id:
                        conv.dify_conversation_id = dify_conversation_id

                    await session.commit()

                # 记录Token使用
                cost_service = get_cost_service()
                await cost_service.track_usage(
                    user_id=user_id,
                    model_name="dify-chat",
                    prompt_tokens=llm_service.count_tokens(request.query),
                    completion_tokens=llm_service.count_tokens(full_answer),
                    cost_usd=0.0,
                    agent_id=agent_id,
                )

                # 缓存消息到短期记忆
                memory_service = get_memory_service()
                recent = await memory_service.get_recent_messages(conversation_id)
                recent.append({"role": "user", "content": request.query})
                recent.append({"role": "assistant", "content": full_answer})
                await memory_service.cache_recent_messages(conversation_id, recent)

                sse_event = SSEEvent(
                    event="message_end",
                    task_id=task_id,
                    message_id=message_id,
                    conversation_id=conversation_id,
                    answer=full_answer,
                )
                yield {"event": "message_end", "data": sse_event.model_dump_json()}

            elif event_type == "error":
                error_msg = event_data.get("message", "未知错误")
                logger.error(f"Dify流式对话错误: {error_msg}")
                yield {"event": "error", "data": json.dumps({"message": error_msg})}
                break

    except Exception as e:
        logger.error(f"流式对话异常: {e}")
        yield {"event": "error", "data": json.dumps({"message": str(e)})}


async def _blocking_chat(agent_id: str, request: ChatMessageSend, user_id: str) -> ApiResponse:
    """阻塞模式对话"""
    dify_client = get_dify_client()
    llm_service = get_llm_service()

    conversation_id = request.conversation_id
    dify_conversation_id = ""

    # 获取或创建对话
    if not conversation_id:
        conversation_id = str(uuid.uuid4())
        async with get_db()() as session:
            conversation = Conversation(
                id=conversation_id,
                agent_id=agent_id,
                user_id=user_id,
                status="active",
            )
            session.add(conversation)
            await session.commit()
    else:
        from sqlalchemy import select
        async with get_db()() as session:
            result = await session.execute(
                select(Conversation).where(Conversation.id == conversation_id)
            )
            conv = result.scalar_one_or_none()
            if conv:
                dify_conversation_id = conv.dify_conversation_id or ""

    # 保存用户消息
    async with get_db()() as session:
        user_message = Message(
            id=str(uuid.uuid4()),
            conversation_id=conversation_id,
            role="user",
            content=request.query,
            token_count=llm_service.count_tokens(request.query),
        )
        session.add(user_message)
        await session.commit()

    try:
        # 调用Dify阻塞API
        result = await dify_client.send_message(
            query=request.query,
            user=user_id,
            conversation_id=dify_conversation_id,
            inputs=request.inputs,
            response_mode="blocking",
        )

        answer = result.get("answer", "")
        message_id = result.get("message_id", "")
        dify_conversation_id = result.get("conversation_id", dify_conversation_id)

        # 保存助手消息
        async with get_db()() as session:
            assistant_message = Message(
                id=str(uuid.uuid4()),
                conversation_id=conversation_id,
                role="assistant",
                content=answer,
                dify_message_id=message_id,
                token_count=llm_service.count_tokens(answer),
            )
            session.add(assistant_message)

            from sqlalchemy import select
            conv_result = await session.execute(
                select(Conversation).where(Conversation.id == conversation_id)
            )
            conv = conv_result.scalar_one_or_none()
            if conv and dify_conversation_id:
                conv.dify_conversation_id = dify_conversation_id

            await session.commit()

        # 记录Token使用
        cost_service = get_cost_service()
        await cost_service.track_usage(
            user_id=user_id,
            model_name="dify-chat",
            prompt_tokens=llm_service.count_tokens(request.query),
            completion_tokens=llm_service.count_tokens(answer),
            cost_usd=0.0,
            agent_id=agent_id,
        )

        return ApiResponse(
            data={
                "conversation_id": conversation_id,
                "message_id": message_id,
                "answer": answer,
            },
        )
    except Exception as e:
        logger.error(f"阻塞对话失败: {e}")
        raise HTTPException(status_code=500, detail=f"对话失败: {str(e)}")


@router.get("/{agent_id}/conversations", response_model=ApiResponse, summary="获取对话列表")
async def get_conversations(
    agent_id: str,
    user: str = Query(default="default-user", description="用户标识"),
    last_id: Optional[str] = Query(default=None, description="上一页最后一条ID"),
    limit: int = Query(default=20, ge=1, le=100, description="每页数量"),
):
    """
    获取用户与指定智能体的对话列表
    """
    from sqlalchemy import func, select

    async with get_db()() as session:
        query = select(Conversation).where(
            Conversation.agent_id == agent_id,
            Conversation.user_id == user,
        )
        count_query = select(func.count(Conversation.id)).where(
            Conversation.agent_id == agent_id,
            Conversation.user_id == user,
        )

        if last_id:
            from sqlalchemy import select as sel
            last_result = await session.execute(
                sel(Conversation.created_at).where(Conversation.id == last_id)
            )
            last_created = last_result.scalar_one_or_none()
            if last_created:
                query = query.where(Conversation.created_at < last_created)

        total_result = await session.execute(count_query)
        total = total_result.scalar() or 0

        query = query.order_by(Conversation.created_at.desc()).limit(limit)
        result = await session.execute(query)
        conversations = result.scalars().all()

        items = [ConversationResponse.model_validate(c).model_dump() for c in conversations]

        return ApiResponse(
            data=ConversationListResponse(total=total, items=items).model_dump(),
        )


@router.get("/messages/{conversation_id}", response_model=ApiResponse, summary="获取消息历史")
async def get_messages(
    conversation_id: str,
    user: str = Query(default="default-user", description="用户标识"),
    first_id: Optional[str] = Query(default=None, description="起始消息ID"),
    limit: int = Query(default=20, ge=1, le=100, description="每页数量"),
):
    """
    获取对话的消息历史
    """
    from sqlalchemy import func, select

    # 验证对话存在
    async with get_db()() as session:
        conv_result = await session.execute(
            select(Conversation).where(Conversation.id == conversation_id)
        )
        conversation = conv_result.scalar_one_or_none()
        if conversation is None:
            raise HTTPException(status_code=404, detail="对话不存在")

        query = select(Message).where(Message.conversation_id == conversation_id)
        count_query = select(func.count(Message.id)).where(
            Message.conversation_id == conversation_id
        )

        if first_id:
            from sqlalchemy import select as sel
            first_result = await session.execute(
                sel(Message.created_at).where(Message.id == first_id)
            )
            first_created = first_result.scalar_one_or_none()
            if first_created:
                query = query.where(Message.created_at > first_created)

        total_result = await session.execute(count_query)
        total = total_result.scalar() or 0

        query = query.order_by(Message.created_at.asc()).limit(limit)
        result = await session.execute(query)
        messages = result.scalars().all()

        items = [MessageResponse.model_validate(m).model_dump() for m in messages]

        return ApiResponse(data={"total": total, "items": items})


@router.post("/{conversation_id}/feedback", response_model=ApiResponse, summary="消息反馈")
async def message_feedback(conversation_id: str, request: MessageFeedbackRequest):
    """
    对消息进行反馈（点赞/点踩）
    """
    from sqlalchemy import select

    # 获取对话的最后一条助手消息
    async with get_db()() as session:
        result = await session.execute(
            select(Message)
            .where(
                Message.conversation_id == conversation_id,
                Message.role == "assistant",
            )
            .order_by(Message.created_at.desc())
            .limit(1)
        )
        message = result.scalar_one_or_none()

        if message is None:
            raise HTTPException(status_code=404, detail="未找到助手消息")

        # 更新本地反馈
        message.feedback = request.rating
        await session.commit()

        # 同步反馈到Dify
        if message.dify_message_id:
            try:
                dify_client = get_dify_client()
                await dify_client.message_feedback(
                    message_id=message.dify_message_id,
                    rating=request.rating,
                    user="default-user",
                    content=request.content,
                )
            except Exception as e:
                logger.warning(f"同步Dify反馈失败: {e}")

        return ApiResponse(message="反馈提交成功")
