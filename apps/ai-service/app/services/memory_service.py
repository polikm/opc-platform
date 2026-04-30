"""
记忆管理服务
- 短期记忆（Redis会话缓存）
- 长期记忆（PostgreSQL + pgvector）
- 对话摘要生成
"""
import json
import logging
from datetime import datetime, timedelta
from typing import Any, Optional

import redis.asyncio as aioredis

from app.config import get_settings
from app.services.llm_service import LLMService, get_llm_service

logger = logging.getLogger(__name__)


class MemoryService:
    """记忆管理服务"""

    def __init__(self) -> None:
        settings = get_settings()
        self.redis_url = settings.redis_url
        self.cache_ttl = settings.redis_cache_ttl
        self._redis: Optional[aioredis.Redis] = None

    async def _get_redis(self) -> aioredis.Redis:
        """获取Redis连接"""
        if self._redis is None:
            self._redis = aioredis.from_url(
                self.redis_url,
                encoding="utf-8",
                decode_responses=True,
            )
        return self._redis

    async def close(self) -> None:
        """关闭Redis连接"""
        if self._redis is not None:
            await self._redis.close()
            self._redis = None

    # ============================================================
    # 短期记忆 - Redis会话缓存
    # ============================================================
    async def set_session_context(
        self,
        conversation_id: str,
        key: str,
        value: Any,
        ttl: Optional[int] = None,
    ) -> None:
        """
        设置会话上下文

        Args:
            conversation_id: 对话ID
            key: 上下文键
            value: 上下文值
            ttl: 过期时间（秒），默认使用配置值
        """
        redis = await self._get_redis()
        redis_key = f"session:{conversation_id}:{key}"
        await redis.set(redis_key, json.dumps(value, ensure_ascii=False), ex=ttl or self.cache_ttl)

    async def get_session_context(
        self,
        conversation_id: str,
        key: str,
    ) -> Optional[Any]:
        """
        获取会话上下文

        Args:
            conversation_id: 对话ID
            key: 上下文键

        Returns:
            上下文值
        """
        redis = await self._get_redis()
        redis_key = f"session:{conversation_id}:{key}"
        value = await redis.get(redis_key)
        if value is None:
            return None
        return json.loads(value)

    async def get_full_session(
        self,
        conversation_id: str,
    ) -> dict[str, Any]:
        """
        获取完整会话上下文

        Args:
            conversation_id: 对话ID

        Returns:
            完整会话上下文字典
        """
        redis = await self._get_redis()
        pattern = f"session:{conversation_id}:*"
        context: dict[str, Any] = {}

        async for key in redis.scan_iter(match=pattern):
            # 提取上下文键名
            key_str = key
            if isinstance(key, bytes):
                key_str = key.decode("utf-8")
            context_key = key_str.split(":", 2)[-1]
            value = await redis.get(key)
            if value:
                context[context_key] = json.loads(value)

        return context

    async def clear_session(self, conversation_id: str) -> None:
        """
        清除会话上下文

        Args:
            conversation_id: 对话ID
        """
        redis = await self._get_redis()
        pattern = f"session:{conversation_id}:*"
        keys = []
        async for key in redis.scan_iter(match=pattern):
            keys.append(key)
        if keys:
            await redis.delete(*keys)

    async def cache_recent_messages(
        self,
        conversation_id: str,
        messages: list[dict[str, str]],
        max_messages: int = 20,
    ) -> None:
        """
        缓存最近消息到Redis

        Args:
            conversation_id: 对话ID
            messages: 消息列表 [{"role": "user/assistant", "content": "..."}]
            max_messages: 最大缓存消息数
        """
        redis = await self._get_redis()
        redis_key = f"session:{conversation_id}:recent_messages"
        # 只保留最近N条消息
        recent = messages[-max_messages:]
        await redis.set(
            redis_key,
            json.dumps(recent, ensure_ascii=False),
            ex=self.cache_ttl,
        )

    async def get_recent_messages(
        self,
        conversation_id: str,
    ) -> list[dict[str, str]]:
        """
        获取最近缓存的消息

        Args:
            conversation_id: 对话ID

        Returns:
            最近消息列表
        """
        redis = await self._get_redis()
        redis_key = f"session:{conversation_id}:recent_messages"
        value = await redis.get(redis_key)
        if value is None:
            return []
        return json.loads(value)

    # ============================================================
    # 长期记忆 - 对话摘要
    # ============================================================
    async def generate_conversation_summary(
        self,
        messages: list[dict[str, str]],
        conversation_id: str,
    ) -> str:
        """
        生成对话摘要

        Args:
            messages: 完整消息列表
            conversation_id: 对话ID

        Returns:
            对话摘要文本
        """
        llm_service = get_llm_service()

        # 构建摘要请求
        from langchain_core.messages import SystemMessage, HumanMessage

        messages_text = "\n".join(
            f"[{msg['role']}]: {msg['content']}" for msg in messages
        )

        summary_messages = [
            SystemMessage(content=(
                "你是一个对话摘要助手。请对以下对话内容生成简洁的摘要，"
                "保留关键信息、用户意图和重要结论。摘要长度控制在200字以内。"
            )),
            HumanMessage(content=f"请总结以下对话：\n\n{messages_text}"),
        ]

        try:
            result = await llm_service.chat(
                messages=summary_messages,
                complexity="simple",
                temperature=0.3,
            )
            summary = result.get("content", "无摘要")

            # 将摘要保存到Redis
            await self.set_session_context(
                conversation_id,
                "summary",
                summary,
                ttl=self.cache_ttl * 24,  # 摘要保留更长时间
            )
            return summary
        except Exception as e:
            logger.error(f"生成对话摘要失败: {e}")
            return "摘要生成失败"

    async def get_conversation_summary(
        self,
        conversation_id: str,
    ) -> Optional[str]:
        """
        获取对话摘要

        Args:
            conversation_id: 对话ID

        Returns:
            对话摘要文本
        """
        return await self.get_session_context(conversation_id, "summary")

    # ============================================================
    # 用户画像记忆
    # ============================================================
    async def update_user_profile(
        self,
        user_id: str,
        profile_data: dict[str, Any],
    ) -> None:
        """
        更新用户画像

        Args:
            user_id: 用户ID
            profile_data: 画像数据
        """
        redis = await self._get_redis()
        redis_key = f"user_profile:{user_id}"
        # 合并现有画像
        existing = await redis.get(redis_key)
        if existing:
            existing_data = json.loads(existing)
            existing_data.update(profile_data)
            profile_data = existing_data

        # 用户画像长期保存
        await redis.set(
            redis_key,
            json.dumps(profile_data, ensure_ascii=False),
            ex=86400 * 90,  # 90天
        )

    async def get_user_profile(self, user_id: str) -> dict[str, Any]:
        """
        获取用户画像

        Args:
            user_id: 用户ID

        Returns:
            用户画像数据
        """
        redis = await self._get_redis()
        redis_key = f"user_profile:{user_id}"
        value = await redis.get(redis_key)
        if value is None:
            return {}
        return json.loads(value)

    # ============================================================
    # 记忆检索
    # ============================================================
    async def build_context_with_memory(
        self,
        conversation_id: str,
        user_id: Optional[str] = None,
        max_context_messages: int = 10,
    ) -> str:
        """
        构建包含记忆的上下文

        Args:
            conversation_id: 对话ID
            user_id: 用户ID
            max_context_messages: 最大上下文消息数

        Returns:
            构建好的上下文字符串
        """
        context_parts: list[str] = []

        # 1. 获取对话摘要
        summary = await self.get_conversation_summary(conversation_id)
        if summary:
            context_parts.append(f"[对话摘要]: {summary}")

        # 2. 获取最近消息
        recent_messages = await self.get_recent_messages(conversation_id)
        if recent_messages:
            recent = recent_messages[-max_context_messages:]
            messages_text = "\n".join(
                f"[{msg['role']}]: {msg['content']}" for msg in recent
            )
            context_parts.append(f"[最近对话]:\n{messages_text}")

        # 3. 获取用户画像
        if user_id:
            profile = await self.get_user_profile(user_id)
            if profile:
                profile_text = ", ".join(f"{k}: {v}" for k, v in profile.items())
                context_parts.append(f"[用户信息]: {profile_text}")

        return "\n\n".join(context_parts)


# 全局记忆服务实例
_memory_service: Optional[MemoryService] = None


def get_memory_service() -> MemoryService:
    """获取记忆服务单例"""
    global _memory_service
    if _memory_service is None:
        _memory_service = MemoryService()
    return _memory_service
