"""
SQLAlchemy数据库模型和异步连接管理
"""
from datetime import datetime
from typing import Optional

from sqlalchemy import (
    Boolean,
    Column,
    DateTime,
    Float,
    ForeignKey,
    Integer,
    String,
    Text,
    func,
)
from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine
from sqlalchemy.orm import DeclarativeBase, relationship, sessionmaker

from app.config import get_settings


class Base(DeclarativeBase):
    """ORM基类"""
    pass


# ============================================================
# 智能体模型
# ============================================================
class Agent(Base):
    """智能体表"""
    __tablename__ = "agents"

    id = Column(String(36), primary_key=True)
    name = Column(String(100), nullable=False, comment="智能体名称")
    description = Column(Text, nullable=True, comment="智能体描述")
    dify_app_id = Column(String(100), nullable=True, comment="Dify应用ID")
    dify_app_type = Column(String(20), default="chatbot", comment="Dify应用类型: chatbot/completion/workflow")
    system_prompt = Column(Text, nullable=True, comment="系统提示词")
    model_config = Column(Text, nullable=True, comment="模型配置JSON")
    is_published = Column(Boolean, default=False, comment="是否已发布")
    status = Column(String(20), default="draft", comment="状态: draft/published/archived")
    created_by = Column(String(36), nullable=True, comment="创建者ID")
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    # 关系
    conversations = relationship("Conversation", back_populates="agent", lazy="selectin")


# ============================================================
# 对话模型
# ============================================================
class Conversation(Base):
    """对话表"""
    __tablename__ = "conversations"

    id = Column(String(36), primary_key=True)
    agent_id = Column(String(36), ForeignKey("agents.id"), nullable=False)
    dify_conversation_id = Column(String(100), nullable=True, comment="Dify对话ID")
    user_id = Column(String(36), nullable=False, comment="用户ID")
    title = Column(String(200), nullable=True, comment="对话标题")
    status = Column(String(20), default="active", comment="状态: active/archived")
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    # 关系
    agent = relationship("Agent", back_populates="conversations")
    messages = relationship("Message", back_populates="conversation", lazy="selectin")


# ============================================================
# 消息模型
# ============================================================
class Message(Base):
    """消息表"""
    __tablename__ = "messages"

    id = Column(String(36), primary_key=True)
    conversation_id = Column(String(36), ForeignKey("conversations.id"), nullable=False)
    role = Column(String(20), nullable=False, comment="角色: user/assistant/system")
    content = Column(Text, nullable=False, comment="消息内容")
    dify_message_id = Column(String(100), nullable=True, comment="Dify消息ID")
    feedback = Column(String(20), nullable=True, comment="反馈: like/dislike/none")
    token_count = Column(Integer, default=0, comment="Token数量")
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # 关系
    conversation = relationship("Conversation", back_populates="messages")


# ============================================================
# 知识库模型
# ============================================================
class KnowledgeBase(Base):
    """知识库表"""
    __tablename__ = "knowledge_bases"

    id = Column(String(36), primary_key=True)
    name = Column(String(100), nullable=False, comment="知识库名称")
    description = Column(Text, nullable=True, comment="知识库描述")
    dify_dataset_id = Column(String(100), nullable=True, comment="Dify数据集ID")
    document_count = Column(Integer, default=0, comment="文档数量")
    total_segments = Column(Integer, default=0, comment="总分段数")
    total_chars = Column(Integer, default=0, comment="总字符数")
    created_by = Column(String(36), nullable=True, comment="创建者ID")
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    # 关系
    documents = relationship("KnowledgeDocument", back_populates="knowledge_base", lazy="selectin")


class KnowledgeDocument(Base):
    """知识库文档表"""
    __tablename__ = "knowledge_documents"

    id = Column(String(36), primary_key=True)
    knowledge_base_id = Column(String(36), ForeignKey("knowledge_bases.id"), nullable=False)
    dify_document_id = Column(String(100), nullable=True, comment="Dify文档ID")
    name = Column(String(200), nullable=False, comment="文档名称")
    file_type = Column(String(20), nullable=True, comment="文件类型")
    file_size = Column(Integer, default=0, comment="文件大小(bytes)")
    segment_count = Column(Integer, default=0, comment="分段数量")
    status = Column(String(20), default="indexing", comment="状态: indexing/completed/error")
    error_message = Column(Text, nullable=True, comment="错误信息")
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    # 关系
    knowledge_base = relationship("KnowledgeBase", back_populates="documents")


# ============================================================
# Token用量模型
# ============================================================
class TokenUsage(Base):
    """Token用量记录表"""
    __tablename__ = "token_usage"

    id = Column(String(36), primary_key=True)
    user_id = Column(String(36), nullable=False, index=True, comment="用户ID")
    agent_id = Column(String(36), nullable=True, comment="智能体ID")
    model_name = Column(String(50), nullable=False, comment="模型名称")
    prompt_tokens = Column(Integer, default=0, comment="输入Token数")
    completion_tokens = Column(Integer, default=0, comment="输出Token数")
    total_tokens = Column(Integer, default=0, comment="总Token数")
    cost_usd = Column(Float, default=0.0, comment="成本(美元)")
    created_at = Column(DateTime(timezone=True), server_default=func.now())


# ============================================================
# 数据库引擎和会话管理
# ============================================================
# 全局引擎和会话工厂（延迟初始化）
_engine = None
_async_session_factory: Optional[async_sessionmaker[AsyncSession]] = None


def init_db() -> None:
    """初始化数据库引擎和会话工厂"""
    global _engine, _async_session_factory
    settings = get_settings()

    _engine = create_async_engine(
        settings.database_url,
        echo=settings.debug,
        pool_size=settings.database_pool_size,
        max_overflow=settings.database_max_overflow,
        pool_pre_ping=True,
    )

    _async_session_factory = async_sessionmaker(
        _engine,
        class_=AsyncSession,
        expire_on_commit=False,
    )


async def close_db() -> None:
    """关闭数据库连接"""
    global _engine
    if _engine is not None:
        await _engine.dispose()
        _engine = None


def get_db() -> async_sessionmaker[AsyncSession]:
    """获取数据库会话工厂"""
    if _async_session_factory is None:
        raise RuntimeError("数据库未初始化，请先调用 init_db()")
    return _async_session_factory


async def init_tables() -> None:
    """创建所有数据库表（开发环境使用）"""
    if _engine is None:
        init_db()
    async with _engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
