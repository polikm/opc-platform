"""
成本控制服务
- Token消耗追踪
- 用户配额管理
- 成本统计报表
"""
import json
import logging
from datetime import datetime, timedelta
from typing import Any, Optional

import redis.asyncio as aioredis

from app.config import get_settings
from app.models.database import TokenUsage, get_db

logger = logging.getLogger(__name__)


class CostService:
    """成本控制服务"""

    def __init__(self) -> None:
        settings = get_settings()
        self.redis_url = settings.redis_url
        self.token_quota_per_user = settings.token_quota_per_user
        self.token_quota_reset_days = settings.token_quota_reset_days
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
    # Token消耗追踪
    # ============================================================
    async def track_usage(
        self,
        user_id: str,
        model_name: str,
        prompt_tokens: int,
        completion_tokens: int,
        cost_usd: float,
        agent_id: Optional[str] = None,
    ) -> None:
        """
        记录Token使用情况

        Args:
            user_id: 用户ID
            model_name: 模型名称
            prompt_tokens: 输入Token数
            completion_tokens: 输出Token数
            cost_usd: 成本（美元）
            agent_id: 智能体ID
        """
        import uuid

        # 1. 写入数据库
        async with get_db()() as session:
            usage = TokenUsage(
                id=str(uuid.uuid4()),
                user_id=user_id,
                agent_id=agent_id,
                model_name=model_name,
                prompt_tokens=prompt_tokens,
                completion_tokens=completion_tokens,
                total_tokens=prompt_tokens + completion_tokens,
                cost_usd=cost_usd,
            )
            session.add(usage)
            await session.commit()

        # 2. 更新Redis中的实时计数
        redis = await self._get_redis()
        today = datetime.utcnow().strftime("%Y-%m-%d")

        # 当日用量
        daily_key = f"usage:daily:{user_id}:{today}"
        await redis.hincrby(daily_key, "total_tokens", prompt_tokens + completion_tokens)
        await redis.hincrbyfloat(daily_key, "total_cost", cost_usd)
        await redis.hincrby(daily_key, "request_count", 1)
        await redis.expire(daily_key, 86400 * 2)  # 保留2天

        # 配额周期用量
        cycle_key = f"usage:cycle:{user_id}"
        await redis.hincrby(cycle_key, "total_tokens", prompt_tokens + completion_tokens)
        await redis.hincrbyfloat(cycle_key, "total_cost", cost_usd)
        await redis.expire(cycle_key, 86400 * self.token_quota_reset_days)

        logger.info(
            f"Token使用记录 - 用户: {user_id}, 模型: {model_name}, "
            f"Token: {prompt_tokens + completion_tokens}, 成本: ${cost_usd:.6f}"
        )

    # ============================================================
    # 用户配额管理
    # ============================================================
    async def get_user_quota(self, user_id: str) -> dict[str, Any]:
        """
        获取用户配额使用情况

        Args:
            user_id: 用户ID

        Returns:
            配额信息字典
        """
        redis = await self._get_redis()
        cycle_key = f"usage:cycle:{user_id}"

        used_data = await redis.hgetall(cycle_key)
        used_tokens = int(used_data.get("total_tokens", 0))
        used_cost = float(used_data.get("total_cost", 0))
        request_count = int(used_data.get("request_count", 0))

        remaining_tokens = max(0, self.token_quota_per_user - used_tokens)
        usage_percentage = round((used_tokens / self.token_quota_per_user) * 100, 2) if self.token_quota_per_user > 0 else 0

        return {
            "user_id": user_id,
            "quota_limit": self.token_quota_per_user,
            "used_tokens": used_tokens,
            "remaining_tokens": remaining_tokens,
            "usage_percentage": usage_percentage,
            "total_cost_usd": round(used_cost, 6),
            "request_count": request_count,
            "is_quota_exceeded": used_tokens >= self.token_quota_per_user,
        }

    async def check_quota(self, user_id: str, estimated_tokens: int = 0) -> bool:
        """
        检查用户是否有足够的配额

        Args:
            user_id: 用户ID
            estimated_tokens: 预估需要的Token数

        Returns:
            True表示配额充足
        """
        quota_info = await self.get_user_quota(user_id)
        if quota_info["is_quota_exceeded"]:
            logger.warning(f"用户 {user_id} Token配额已用尽")
            return False

        remaining = quota_info["remaining_tokens"]
        if estimated_tokens > 0 and remaining < estimated_tokens:
            logger.warning(
                f"用户 {user_id} 配额不足: 需要 {estimated_tokens}, "
                f"剩余 {remaining}"
            )
            return False

        return True

    async def reset_user_quota(self, user_id: str) -> None:
        """
        重置用户配额

        Args:
            user_id: 用户ID
        """
        redis = await self._get_redis()
        cycle_key = f"usage:cycle:{user_id}"
        await redis.delete(cycle_key)
        logger.info(f"已重置用户 {user_id} 的Token配额")

    # ============================================================
    # 成本统计报表
    # ============================================================
    async def get_daily_usage(
        self,
        user_id: str,
        days: int = 7,
    ) -> list[dict[str, Any]]:
        """
        获取用户每日用量统计

        Args:
            user_id: 用户ID
            days: 统计天数

        Returns:
            每日用量列表
        """
        redis = await self._get_redis()
        daily_stats: list[dict[str, Any]] = []

        for i in range(days):
            date = (datetime.utcnow() - timedelta(days=i)).strftime("%Y-%m-%d")
            daily_key = f"usage:daily:{user_id}:{date}"
            data = await redis.hgetall(daily_key)

            daily_stats.append({
                "date": date,
                "total_tokens": int(data.get("total_tokens", 0)),
                "total_cost_usd": round(float(data.get("total_cost", 0)), 6),
                "request_count": int(data.get("request_count", 0)),
            })

        return daily_stats

    async def get_model_usage_stats(
        self,
        model_id: str,
        days: int = 30,
    ) -> dict[str, Any]:
        """
        获取模型用量统计

        Args:
            model_id: 模型ID
            days: 统计天数

        Returns:
            模型用量统计
        """
        from sqlalchemy import func, select
        from datetime import datetime, timedelta

        async with get_db()() as session:
            since_date = datetime.utcnow() - timedelta(days=days)

            # 总量统计
            stmt = select(
                func.count(TokenUsage.id).label("total_requests"),
                func.sum(TokenUsage.total_tokens).label("total_tokens"),
                func.sum(TokenUsage.cost_usd).label("total_cost_usd"),
                func.avg(TokenUsage.total_tokens).label("avg_tokens"),
            ).where(
                TokenUsage.model_name == model_id,
                TokenUsage.created_at >= since_date,
            )

            result = await session.execute(stmt)
            row = result.one()

            total_requests = row.total_requests or 0
            total_tokens = row.total_tokens or 0
            total_cost = row.total_cost_usd or 0.0
            avg_tokens = row.avg_tokens or 0.0

            # 每日统计
            daily_stmt = select(
                func.date(TokenUsage.created_at).label("date"),
                func.count(TokenUsage.id).label("requests"),
                func.sum(TokenUsage.total_tokens).label("tokens"),
                func.sum(TokenUsage.cost_usd).label("cost"),
            ).where(
                TokenUsage.model_name == model_id,
                TokenUsage.created_at >= since_date,
            ).group_by(
                func.date(TokenUsage.created_at),
            ).order_by(
                func.date(TokenUsage.created_at),
            )

            daily_result = await session.execute(daily_stmt)
            daily_stats = [
                {
                    "date": str(row.date),
                    "requests": row.requests,
                    "tokens": row.tokens or 0,
                    "cost_usd": round(row.cost or 0, 6),
                }
                for row in daily_result.all()
            ]

            return {
                "model_id": model_id,
                "model_name": model_id,
                "total_requests": total_requests,
                "total_tokens": total_tokens,
                "total_cost_usd": round(total_cost, 6),
                "avg_tokens_per_request": round(avg_tokens, 2),
                "period_days": days,
                "daily_stats": daily_stats,
            }

    async def get_agent_cost_report(
        self,
        agent_id: str,
        days: int = 30,
    ) -> dict[str, Any]:
        """
        获取智能体成本报告

        Args:
            agent_id: 智能体ID
            days: 统计天数

        Returns:
            成本报告
        """
        from sqlalchemy import func, select

        async with get_db()() as session:
            since_date = datetime.utcnow() - timedelta(days=days)

            stmt = select(
                TokenUsage.model_name,
                func.count(TokenUsage.id).label("request_count"),
                func.sum(TokenUsage.total_tokens).label("total_tokens"),
                func.sum(TokenUsage.cost_usd).label("total_cost"),
            ).where(
                TokenUsage.agent_id == agent_id,
                TokenUsage.created_at >= since_date,
            ).group_by(
                TokenUsage.model_name,
            )

            result = await session.execute(stmt)
            model_breakdown = [
                {
                    "model_name": row.model_name,
                    "request_count": row.request_count,
                    "total_tokens": row.total_tokens or 0,
                    "total_cost_usd": round(row.total_cost or 0, 6),
                }
                for row in result.all()
            ]

            total_cost = sum(item["total_cost_usd"] for item in model_breakdown)
            total_tokens = sum(item["total_tokens"] for item in model_breakdown)
            total_requests = sum(item["request_count"] for item in model_breakdown)

            return {
                "agent_id": agent_id,
                "period_days": days,
                "total_requests": total_requests,
                "total_tokens": total_tokens,
                "total_cost_usd": round(total_cost, 6),
                "model_breakdown": model_breakdown,
            }


# 全局成本服务实例
_cost_service: Optional[CostService] = None


def get_cost_service() -> CostService:
    """获取成本服务单例"""
    global _cost_service
    if _cost_service is None:
        _cost_service = CostService()
    return _cost_service
