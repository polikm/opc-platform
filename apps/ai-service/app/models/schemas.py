"""
Pydantic数据模型 - 请求/响应Schema定义
"""
from datetime import datetime
from enum import Enum
from typing import Any, Optional

from pydantic import BaseModel, Field


# ============================================================
# 通用响应模型
# ============================================================
class ApiResponse(BaseModel):
    """统一API响应格式"""
    code: int = Field(default=200, description="状态码")
    message: str = Field(default="success", description="响应消息")
    data: Optional[Any] = Field(default=None, description="响应数据")


class PaginatedResponse(BaseModel):
    """分页响应"""
    total: int = Field(default=0, description="总数")
    page: int = Field(default=1, description="当前页码")
    page_size: int = Field(default=20, description="每页数量")
    items: list[Any] = Field(default_factory=list, description="数据列表")


# ============================================================
# 智能体相关Schema
# ============================================================
class AgentCreate(BaseModel):
    """创建智能体请求"""
    name: str = Field(..., min_length=1, max_length=100, description="智能体名称")
    description: Optional[str] = Field(default=None, description="智能体描述")
    system_prompt: Optional[str] = Field(default=None, description="系统提示词")
    dify_app_type: str = Field(default="chatbot", description="Dify应用类型: chatbot/completion/workflow")
    model_config: Optional[dict[str, Any]] = Field(default=None, description="模型配置")


class AgentUpdate(BaseModel):
    """更新智能体请求"""
    name: Optional[str] = Field(default=None, min_length=1, max_length=100, description="智能体名称")
    description: Optional[str] = Field(default=None, description="智能体描述")
    system_prompt: Optional[str] = Field(default=None, description="系统提示词")
    model_config: Optional[dict[str, Any]] = Field(default=None, description="模型配置")


class AgentResponse(BaseModel):
    """智能体响应"""
    id: str
    name: str
    description: Optional[str] = None
    dify_app_id: Optional[str] = None
    dify_app_type: str = "chatbot"
    system_prompt: Optional[str] = None
    model_config: Optional[dict[str, Any]] = None
    is_published: bool = False
    status: str = "draft"
    created_by: Optional[str] = None
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}


class AgentListResponse(BaseModel):
    """智能体列表响应"""
    total: int
    items: list[AgentResponse]


# ============================================================
# 对话相关Schema
# ============================================================
class ChatMessageSend(BaseModel):
    """发送消息请求"""
    query: str = Field(..., min_length=1, description="用户消息")
    conversation_id: Optional[str] = Field(default=None, description="对话ID（为空则创建新对话）")
    user: Optional[str] = Field(default="default-user", description="用户标识")
    inputs: Optional[dict[str, Any]] = Field(default=None, description="额外输入参数")
    response_mode: str = Field(default="streaming", description="响应模式: streaming/blocking")


class ConversationResponse(BaseModel):
    """对话响应"""
    id: str
    agent_id: str
    dify_conversation_id: Optional[str] = None
    user_id: str
    title: Optional[str] = None
    status: str = "active"
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}


class ConversationListResponse(BaseModel):
    """对话列表响应"""
    total: int
    items: list[ConversationResponse]


class MessageResponse(BaseModel):
    """消息响应"""
    id: str
    conversation_id: str
    role: str
    content: str
    feedback: Optional[str] = None
    token_count: int = 0
    created_at: datetime

    model_config = {"from_attributes": True}


class MessageFeedbackRequest(BaseModel):
    """消息反馈请求"""
    rating: str = Field(..., pattern="^(like|dislike|none)$", description="评分: like/dislike/none")
    content: Optional[str] = Field(default=None, description="反馈内容")


# ============================================================
# SSE事件Schema
# ============================================================
class SSEEvent(BaseModel):
    """SSE事件"""
    event: str = Field(description="事件类型: message/message_end/message_replace/error")
    task_id: str = Field(default="", description="任务ID")
    message_id: str = Field(default="", description="消息ID")
    conversation_id: str = Field(default="", description="对话ID")
    answer: str = Field(default="", description="回答内容")
    created_at: Optional[int] = Field(default=None, description="创建时间戳")


# ============================================================
# 知识库相关Schema
# ============================================================
class KnowledgeBaseCreate(BaseModel):
    """创建知识库请求"""
    name: str = Field(..., min_length=1, max_length=100, description="知识库名称")
    description: Optional[str] = Field(default=None, description="知识库描述")


class KnowledgeBaseResponse(BaseModel):
    """知识库响应"""
    id: str
    name: str
    description: Optional[str] = None
    dify_dataset_id: Optional[str] = None
    document_count: int = 0
    total_segments: int = 0
    total_chars: int = 0
    created_by: Optional[str] = None
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}


class KnowledgeBaseListResponse(BaseModel):
    """知识库列表响应"""
    total: int
    items: list[KnowledgeBaseResponse]


class KnowledgeDocumentResponse(BaseModel):
    """知识库文档响应"""
    id: str
    knowledge_base_id: str
    dify_document_id: Optional[str] = None
    name: str
    file_type: Optional[str] = None
    file_size: int = 0
    segment_count: int = 0
    status: str = "indexing"
    error_message: Optional[str] = None
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}


class KnowledgeStatsResponse(BaseModel):
    """知识库统计响应"""
    knowledge_base_id: str
    document_count: int = 0
    total_segments: int = 0
    total_chars: int = 0
    documents: list[KnowledgeDocumentResponse] = Field(default_factory=list)


# ============================================================
# 工作流相关Schema
# ============================================================
class WorkflowExecuteRequest(BaseModel):
    """执行工作流请求"""
    workflow_id: str = Field(..., description="工作流ID")
    inputs: dict[str, Any] = Field(default_factory=dict, description="工作流输入参数")
    user: Optional[str] = Field(default="default-user", description="用户标识")
    response_mode: str = Field(default="blocking", description="响应模式: streaming/blocking")


class WorkflowTemplateResponse(BaseModel):
    """工作流模板响应"""
    id: str
    name: str
    description: Optional[str] = None
    category: str = ""
    dify_workflow_id: Optional[str] = None
    input_variables: list[dict[str, Any]] = Field(default_factory=list)
    created_at: Optional[datetime] = None


class WorkflowListResponse(BaseModel):
    """工作流列表响应"""
    total: int
    items: list[WorkflowTemplateResponse]


class WorkflowExecuteResponse(BaseModel):
    """工作流执行响应"""
    task_id: str
    workflow_run_id: str
    status: str = "running"
    outputs: Optional[dict[str, Any]] = None
    total_tokens: int = 0
    total_steps: int = 0
    created_at: Optional[int] = None


# ============================================================
# MCP相关Schema
# ============================================================
class MCPToolResponse(BaseModel):
    """MCP工具响应"""
    id: str
    name: str
    description: Optional[str] = None
    input_schema: Optional[dict[str, Any]] = None
    server_name: Optional[str] = None


class MCPToolListResponse(BaseModel):
    """MCP工具列表响应"""
    tools: list[MCPToolResponse]


class MCPToolInvokeRequest(BaseModel):
    """MCP工具调用请求"""
    arguments: dict[str, Any] = Field(default_factory=dict, description="工具参数")


class MCPToolInvokeResponse(BaseModel):
    """MCP工具调用响应"""
    tool_id: str
    status: str = "success"
    result: Optional[Any] = None
    error: Optional[str] = None


# ============================================================
# 模型管理相关Schema
# ============================================================
class ModelInfo(BaseModel):
    """模型信息"""
    id: str
    name: str
    provider: str = "openai"
    display_name: Optional[str] = None
    description: Optional[str] = None
    max_context_tokens: int = 128000
    max_output_tokens: int = 4096
    input_price_per_1k: float = 0.0
    output_price_per_1k: float = 0.0
    is_available: bool = True


class ModelListResponse(BaseModel):
    """模型列表响应"""
    models: list[ModelInfo]


class ModelUsageStats(BaseModel):
    """模型用量统计"""
    model_id: str
    model_name: str
    total_requests: int = 0
    total_tokens: int = 0
    total_cost_usd: float = 0.0
    avg_tokens_per_request: float = 0.0
    daily_stats: list[dict[str, Any]] = Field(default_factory=list)


# ============================================================
# 健康检查Schema
# ============================================================
class HealthResponse(BaseModel):
    """健康检查响应"""
    status: str = "healthy"
    version: str = "0.1.0"
    service: str = "opc-ai-service"
    components: dict[str, str] = Field(default_factory=dict)
    timestamp: datetime = Field(default_factory=datetime.utcnow)
