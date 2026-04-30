"""
MCP协议端点
- 列出可用MCP工具
- 调用MCP工具
"""
import json
import logging
from typing import Any, Optional

from fastapi import APIRouter, HTTPException

from app.models.schemas import (
    MCPToolInvokeRequest,
    MCPToolInvokeResponse,
    MCPToolListResponse,
    MCPToolResponse,
    ApiResponse,
)
from app.core.mcp.client import get_mcp_client

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/mcp", tags=["MCP协议"])


@router.get("/tools", response_model=ApiResponse, summary="列出可用MCP工具")
async def list_tools(
    server_name: Optional[str] = None,
):
    """
    列出所有可用的MCP工具

    Args:
        server_name: 可选，指定MCP Server名称进行筛选
    """
    try:
        mcp_client = get_mcp_client()
        tools = await mcp_client.list_tools(server_name=server_name)

        tool_responses = [
            MCPToolResponse(
                id=tool.get("id", tool.get("name", "")),
                name=tool.get("name", ""),
                description=tool.get("description"),
                input_schema=tool.get("inputSchema"),
                server_name=tool.get("server_name"),
            ).model_dump()
            for tool in tools
        ]

        return ApiResponse(
            data=MCPToolListResponse(tools=tool_responses).model_dump(),
        )
    except Exception as e:
        logger.error(f"获取MCP工具列表失败: {e}")
        raise HTTPException(
            status_code=503,
            detail=f"MCP服务不可用: {str(e)}",
        )


@router.post("/tools/{tool_id}/invoke", response_model=ApiResponse, summary="调用MCP工具")
async def invoke_tool(tool_id: str, request: MCPToolInvokeRequest):
    """
    调用指定的MCP工具

    Args:
        tool_id: 工具ID
        request: 工具调用参数
    """
    try:
        mcp_client = get_mcp_client()
        result = await mcp_client.invoke_tool(
            tool_id=tool_id,
            arguments=request.arguments,
        )

        response = MCPToolInvokeResponse(
            tool_id=tool_id,
            status="success",
            result=result,
        )

        return ApiResponse(data=response.model_dump())

    except Exception as e:
        logger.error(f"MCP工具调用失败: {tool_id}, 错误: {e}")
        response = MCPToolInvokeResponse(
            tool_id=tool_id,
            status="error",
            error=str(e),
        )
        return ApiResponse(
            code=500,
            message="工具调用失败",
            data=response.model_dump(),
        )
