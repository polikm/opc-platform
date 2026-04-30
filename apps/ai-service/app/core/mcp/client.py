"""
MCP客户端
- 连接外部MCP Server
- 工具发现和调用

MCP (Model Context Protocol) 是一种标准化协议，
用于AI模型与外部工具/服务的交互。
"""
import json
import logging
from typing import Any, Optional

import httpx

from app.config import get_settings

logger = logging.getLogger(__name__)


class MCPClient:
    """MCP协议客户端"""

    def __init__(self) -> None:
        settings = get_settings()
        self.server_url = settings.mcp_server_url.rstrip("/")
        self.timeout = settings.mcp_timeout
        self._tools_cache: Optional[list[dict[str, Any]]] = None
        self._tools_cache_time: Optional[float] = None
        self._cache_ttl: float = 300.0  # 工具列表缓存5分钟

    async def _request(
        self,
        method: str,
        path: str,
        json_data: Optional[dict] = None,
    ) -> dict[str, Any]:
        """发送MCP请求"""
        url = f"{self.server_url}{path}"
        headers = {
            "Content-Type": "application/json",
            "Accept": "application/json",
        }

        async with httpx.AsyncClient(timeout=self.timeout) as client:
            response = await client.request(
                method=method,
                url=url,
                headers=headers,
                json=json_data,
            )
            response.raise_for_status()
            return response.json()

    async def list_tools(
        self,
        server_name: Optional[str] = None,
    ) -> list[dict[str, Any]]:
        """
        列出所有可用的MCP工具

        Args:
            server_name: 可选，指定MCP Server名称筛选

        Returns:
            工具列表
        """
        import time

        # 检查缓存
        if (
            self._tools_cache is not None
            and self._tools_cache_time is not None
            and (time.time() - self._tools_cache_time) < self._cache_ttl
        ):
            tools = self._tools_cache
            if server_name:
                tools = [t for t in tools if t.get("server_name") == server_name]
            return tools

        try:
            result = await self._request("POST", "/mcp/tools/list", json_data={})
            tools = result.get("tools", [])

            # 缓存工具列表
            self._tools_cache = tools
            self._tools_cache_time = time.time()

            if server_name:
                tools = [t for t in tools if t.get("server_name") == server_name]

            return tools

        except httpx.HTTPError as e:
            logger.error(f"获取MCP工具列表失败: {e}")
            return []

    async def invoke_tool(
        self,
        tool_id: str,
        arguments: dict[str, Any],
    ) -> Any:
        """
        调用MCP工具

        Args:
            tool_id: 工具ID
            arguments: 工具参数

        Returns:
            工具执行结果

        Raises:
            Exception: 工具调用失败
        """
        try:
            result = await self._request(
                "POST",
                "/mcp/tools/invoke",
                json_data={
                    "tool_id": tool_id,
                    "arguments": arguments,
                },
            )

            if result.get("status") == "error":
                error_msg = result.get("error", "未知错误")
                raise RuntimeError(f"MCP工具调用失败: {error_msg}")

            return result.get("result")

        except httpx.HTTPError as e:
            logger.error(f"MCP工具调用失败: {tool_id}, 错误: {e}")
            raise RuntimeError(f"MCP服务不可用: {str(e)}")

    async def get_tool_info(self, tool_id: str) -> Optional[dict[str, Any]]:
        """
        获取指定工具的详细信息

        Args:
            tool_id: 工具ID

        Returns:
            工具信息字典
        """
        tools = await self.list_tools()
        for tool in tools:
            if tool.get("id") == tool_id or tool.get("name") == tool_id:
                return tool
        return None

    def clear_cache(self) -> None:
        """清除工具列表缓存"""
        self._tools_cache = None
        self._tools_cache_time = None


# 全局MCP客户端实例
_mcp_client: Optional[MCPClient] = None


def get_mcp_client() -> MCPClient:
    """获取MCP客户端单例"""
    global _mcp_client
    if _mcp_client is None:
        _mcp_client = MCPClient()
    return _mcp_client
