"""
应用配置管理 - 使用Pydantic Settings
从环境变量和.env文件加载配置
"""
from functools import lru_cache
from typing import Optional

from pydantic import Field, field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """应用全局配置"""

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
        extra="ignore",
    )

    # ---- 应用基础配置 ----
    app_name: str = Field(default="opc-ai-service", alias="APP_NAME")
    app_env: str = Field(default="development", alias="APP_ENV")
    debug: bool = Field(default=False, alias="DEBUG")
    log_level: str = Field(default="INFO", alias="LOG_LEVEL")

    # ---- Dify 配置 ----
    dify_api_url: str = Field(default="http://localhost:5001/v1", alias="DIFY_API_URL")
    dify_api_key: str = Field(default="", alias="DIFY_API_KEY")

    # ---- 数据库配置 ----
    database_url: str = Field(
        default="postgresql+asyncpg://postgres:postgres@localhost:5432/opc_ai",
        alias="DATABASE_URL",
    )
    database_pool_size: int = Field(default=10, alias="DATABASE_POOL_SIZE")
    database_max_overflow: int = Field(default=20, alias="DATABASE_MAX_OVERFLOW")

    # ---- Redis 配置 ----
    redis_url: str = Field(default="redis://localhost:6379/0", alias="REDIS_URL")
    redis_cache_ttl: int = Field(default=3600, alias="REDIS_CACHE_TTL")

    # ---- JWT 认证配置 ----
    jwt_secret: str = Field(default="change-me-in-production", alias="JWT_SECRET")
    jwt_algorithm: str = Field(default="HS256", alias="JWT_ALGORITHM")
    jwt_expire_minutes: int = Field(default=1440, alias="JWT_EXPIRE_MINUTES")

    # ---- LLM 模型配置 ----
    llm_default_model: str = Field(default="gpt-4o", alias="LLM_DEFAULT_MODEL")
    llm_api_key: str = Field(default="", alias="LLM_API_KEY")
    llm_base_url: str = Field(default="https://api.openai.com/v1", alias="LLM_BASE_URL")
    llm_fallback_model: str = Field(default="gpt-4o-mini", alias="LLM_FALLBACK_MODEL")
    llm_max_tokens: int = Field(default=4096, alias="LLM_MAX_TOKENS")
    llm_temperature: float = Field(default=0.7, alias="LLM_TEMPERATURE")

    # ---- Token 配额 ----
    token_quota_per_user: int = Field(default=1_000_000, alias="TOKEN_QUOTA_PER_USER")
    token_quota_reset_days: int = Field(default=30, alias="TOKEN_QUOTA_RESET_DAYS")

    # ---- CORS 配置 ----
    cors_origins: str = Field(
        default="http://localhost:3000,http://localhost:5173",
        alias="CORS_ORIGINS",
    )

    # ---- MCP 配置 ----
    mcp_server_url: str = Field(default="http://localhost:8001", alias="MCP_SERVER_URL")
    mcp_timeout: int = Field(default=30, alias="MCP_TIMEOUT")

    # ---- 文件上传配置 ----
    max_upload_size: int = Field(default=52_428_800, alias="MAX_UPLOAD_SIZE")  # 50MB
    upload_dir: str = Field(default="/tmp/uploads", alias="UPLOAD_DIR")

    @field_validator("cors_origins", mode="before")
    @classmethod
    def parse_cors_origins(cls, v: str) -> str:
        """CORS来源列表"""
        return v

    @property
    def cors_origin_list(self) -> list[str]:
        """解析CORS来源为列表"""
        return [origin.strip() for origin in self.cors_origins.split(",") if origin.strip()]

    @property
    def is_production(self) -> bool:
        """是否为生产环境"""
        return self.app_env == "production"


@lru_cache
def get_settings() -> Settings:
    """获取全局配置单例"""
    return Settings()
