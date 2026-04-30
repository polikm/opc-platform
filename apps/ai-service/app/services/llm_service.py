"""
LLM调用服务
- 多模型路由（根据任务复杂度选择模型）
- Token计数和配额管理
- 流式响应处理
- 成本计算
"""
import logging
from dataclasses import dataclass
from enum import Enum
from typing import Any, AsyncIterator, Optional

from langchain_openai import ChatOpenAI
from langchain_core.messages import AIMessage, BaseMessage, HumanMessage, SystemMessage
from langchain_core.callbacks import AsyncCallbackHandler

from app.config import get_settings

logger = logging.getLogger(__name__)


# ============================================================
# 模型定义
# ============================================================
class TaskComplexity(str, Enum):
    """任务复杂度"""
    SIMPLE = "simple"        # 简单任务：文本分类、简单问答
    MODERATE = "moderate"    # 中等任务：内容生成、数据分析
    COMPLEX = "complex"      # 复杂任务：多步推理、代码生成
    EXPERT = "expert"        # 专家任务：深度分析、创意写作


# 模型定价信息（每1000 Token，单位：美元）
@dataclass
class ModelPricing:
    """模型定价"""
    input_price_per_1k: float
    output_price_per_1k: float


# 支持的模型及其定价
MODEL_PRICING: dict[str, ModelPricing] = {
    "gpt-4o": ModelPricing(input_price_per_1k=0.0025, output_price_per_1k=0.01),
    "gpt-4o-mini": ModelPricing(input_price_per_1k=0.00015, output_price_per_1k=0.0006),
    "gpt-4-turbo": ModelPricing(input_price_per_1k=0.01, output_price_per_1k=0.03),
    "gpt-3.5-turbo": ModelPricing(input_price_per_1k=0.0005, output_price_per_1k=0.0015),
}

# 复杂度到模型的映射
COMPLEXITY_MODEL_MAP: dict[TaskComplexity, str] = {
    TaskComplexity.SIMPLE: "gpt-4o-mini",
    TaskComplexity.MODERATE: "gpt-4o-mini",
    TaskComplexity.COMPLEX: "gpt-4o",
    TaskComplexity.EXPERT: "gpt-4o",
}

# 模型上下文窗口大小
MODEL_CONTEXT_SIZES: dict[str, int] = {
    "gpt-4o": 128000,
    "gpt-4o-mini": 128000,
    "gpt-4-turbo": 128000,
    "gpt-3.5-turbo": 16385,
}


class TokenCountingHandler(AsyncCallbackHandler):
    """Token计数回调处理器"""

    def __init__(self) -> None:
        self.prompt_tokens: int = 0
        self.completion_tokens: int = 0
        self.total_tokens: int = 0

    async def on_llm_end(self, response: Any, **kwargs: Any) -> None:
        """LLM调用结束时统计Token"""
        try:
            if hasattr(response, "llm_output") and response.llm_output:
                token_usage = response.llm_output.get("token_usage", {})
                self.prompt_tokens = token_usage.get("prompt_tokens", 0)
                self.completion_tokens = token_usage.get("completion_tokens", 0)
                self.total_tokens = self.prompt_tokens + self.completion_tokens
                logger.info(
                    f"Token使用 - 输入: {self.prompt_tokens}, "
                    f"输出: {self.completion_tokens}, "
                    f"总计: {self.total_tokens}"
                )
        except Exception as e:
            logger.error(f"Token计数失败: {e}")


class LLMService:
    """LLM调用服务"""

    def __init__(self) -> None:
        settings = get_settings()
        self.default_model = settings.llm_default_model
        self.fallback_model = settings.llm_fallback_model
        self.max_tokens = settings.llm_max_tokens
        self.temperature = settings.llm_temperature
        self._models: dict[str, ChatOpenAI] = {}

    def _get_model(self, model_name: Optional[str] = None) -> ChatOpenAI:
        """获取或创建LangChain ChatOpenAI实例"""
        name = model_name or self.default_model
        settings = get_settings()

        if name not in self._models:
            self._models[name] = ChatOpenAI(
                model=name,
                api_key=settings.llm_api_key,
                base_url=settings.llm_base_url,
                max_tokens=self.max_tokens,
                temperature=self.temperature,
                streaming=True,
            )
        return self._models[name]

    def select_model(self, complexity: TaskComplexity) -> str:
        """
        根据任务复杂度选择模型

        Args:
            complexity: 任务复杂度

        Returns:
            模型名称
        """
        return COMPLEXITY_MODEL_MAP.get(complexity, self.default_model)

    async def chat(
        self,
        messages: list[BaseMessage],
        model_name: Optional[str] = None,
        complexity: Optional[TaskComplexity] = None,
        temperature: Optional[float] = None,
    ) -> dict[str, Any]:
        """
        发送对话请求

        Args:
            messages: 消息列表
            model_name: 指定模型名称
            complexity: 任务复杂度（用于自动选择模型）
            temperature: 温度参数

        Returns:
            包含响应内容和Token使用信息的字典
        """
        # 确定使用的模型
        if model_name is None and complexity is not None:
            model_name = self.select_model(complexity)

        model = self._get_model(model_name)
        if temperature is not None:
            model.temperature = temperature

        # Token计数处理器
        token_handler = TokenCountingHandler()

        try:
            response = await model.ainvoke(messages, config={"callbacks": [token_handler]})
            result = {
                "content": response.content,
                "model": model_name or self.default_model,
                "prompt_tokens": token_handler.prompt_tokens,
                "completion_tokens": token_handler.completion_tokens,
                "total_tokens": token_handler.total_tokens,
                "cost_usd": self.calculate_cost(
                    model_name or self.default_model,
                    token_handler.prompt_tokens,
                    token_handler.completion_tokens,
                ),
            }
            return result
        except Exception as e:
            logger.error(f"LLM调用失败 (模型: {model_name}): {e}")
            # 尝试使用备用模型
            if model_name != self.fallback_model:
                logger.info(f"切换到备用模型: {self.fallback_model}")
                return await self.chat(
                    messages=messages,
                    model_name=self.fallback_model,
                    temperature=temperature,
                )
            raise

    async def chat_stream(
        self,
        messages: list[BaseMessage],
        model_name: Optional[str] = None,
        complexity: Optional[TaskComplexity] = None,
        temperature: Optional[float] = None,
    ) -> AsyncIterator[str]:
        """
        流式对话

        Args:
            messages: 消息列表
            model_name: 指定模型名称
            complexity: 任务复杂度
            temperature: 温度参数

        Yields:
            流式文本块
        """
        if model_name is None and complexity is not None:
            model_name = self.select_model(complexity)

        model = self._get_model(model_name)
        if temperature is not None:
            model.temperature = temperature

        try:
            async for chunk in model.astream(messages):
                if chunk.content:
                    yield chunk.content
        except Exception as e:
            logger.error(f"LLM流式调用失败: {e}")
            raise

    @staticmethod
    def calculate_cost(
        model_name: str,
        prompt_tokens: int,
        completion_tokens: int,
    ) -> float:
        """
        计算API调用成本

        Args:
            model_name: 模型名称
            prompt_tokens: 输入Token数
            completion_tokens: 输出Token数

        Returns:
            成本（美元）
        """
        pricing = MODEL_PRICING.get(model_name)
        if pricing is None:
            logger.warning(f"未知模型定价: {model_name}，使用默认定价")
            pricing = ModelPricing(input_price_per_1k=0.001, output_price_per_1k=0.002)

        input_cost = (prompt_tokens / 1000) * pricing.input_price_per_1k
        output_cost = (completion_tokens / 1000) * pricing.output_price_per_1k
        return round(input_cost + output_cost, 6)

    @staticmethod
    def count_tokens(text: str, model_name: str = "gpt-4o") -> int:
        """
        计算文本的Token数量

        Args:
            text: 输入文本
            model_name: 模型名称

        Returns:
            Token数量
        """
        try:
            import tiktoken
            # 使用cl100k_base编码（适用于GPT-4/GPT-3.5）
            encoding = tiktoken.encoding_for_model(model_name)
            return len(encoding.encode(text))
        except Exception:
            # 回退：粗略估算（中文约1.5字符/token，英文约4字符/token）
            return int(len(text) / 2)

    @staticmethod
    def get_model_context_size(model_name: str) -> int:
        """获取模型上下文窗口大小"""
        return MODEL_CONTEXT_SIZES.get(model_name, 4096)

    @staticmethod
    def estimate_complexity(query: str) -> TaskComplexity:
        """
        估算任务复杂度

        Args:
            query: 用户查询文本

        Returns:
            估算的复杂度级别
        """
        text = query.strip()
        token_count = LLMService.count_tokens(text)

        # 复杂度指标
        complexity_score = 0

        # Token数量评分
        if token_count > 500:
            complexity_score += 2
        elif token_count > 200:
            complexity_score += 1

        # 多步骤关键词
        multi_step_keywords = [
            "然后", "接着", "最后", "首先", "其次", "另外",
            "分析", "对比", "比较", "评估", "优化", "改进",
            "设计", "规划", "方案", "策略",
        ]
        for keyword in multi_step_keywords:
            if keyword in text:
                complexity_score += 1

        # 代码相关
        code_keywords = ["代码", "编程", "函数", "算法", "实现", "开发"]
        for keyword in code_keywords:
            if keyword in text:
                complexity_score += 1
                break

        # 根据评分确定复杂度
        if complexity_score >= 5:
            return TaskComplexity.EXPERT
        elif complexity_score >= 3:
            return TaskComplexity.COMPLEX
        elif complexity_score >= 1:
            return TaskComplexity.MODERATE
        else:
            return TaskComplexity.SIMPLE


# 全局LLM服务实例
_llm_service: Optional[LLMService] = None


def get_llm_service() -> LLMService:
    """获取LLM服务单例"""
    global _llm_service
    if _llm_service is None:
        _llm_service = LLMService()
    return _llm_service
