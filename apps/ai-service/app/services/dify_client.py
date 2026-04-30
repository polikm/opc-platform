"""
Dify API客户端封装
使用httpx异步HTTP客户端调用Dify平台API
"""
import logging
from typing import Any, AsyncIterator, Optional

import httpx

from app.config import get_settings

logger = logging.getLogger(__name__)


class DifyClient:
    """Dify API异步客户端"""

    def __init__(self) -> None:
        settings = get_settings()
        self.base_url = settings.dify_api_url.rstrip("/")
        self.api_key = settings.dify_api_key
        self.timeout = httpx.Timeout(30.0, connect=10.0)

    def _get_headers(self) -> dict[str, str]:
        """获取请求头"""
        return {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json",
        }

    async def _request(
        self,
        method: str,
        path: str,
        json_data: Optional[dict] = None,
        params: Optional[dict] = None,
        files: Optional[dict] = None,
    ) -> dict[str, Any]:
        """发送HTTP请求"""
        url = f"{self.base_url}{path}"
        headers = self._get_headers()

        # 文件上传时不设置Content-Type（让httpx自动处理multipart）
        if files:
            headers.pop("Content-Type", None)

        async with httpx.AsyncClient(timeout=self.timeout) as client:
            response = await client.request(
                method=method,
                url=url,
                headers=headers,
                json=json_data,
                params=params,
                files=files,
            )
            response.raise_for_status()
            return response.json()

    # ============================================================
    # 应用管理
    # ============================================================
    async def create_app(
        self,
        name: str,
        description: str = "",
        app_type: str = "chatbot",
        icon_type: str = "emoji",
        icon: str = "🤖",
        icon_background: str = "#FFEAD5",
    ) -> dict[str, Any]:
        """
        创建Dify应用
        注意：Dify API可能不直接支持创建应用，此处为预留接口
        实际使用中可能需要通过Dify控制台创建应用后获取app_id
        """
        return {
            "id": "pending",
            "name": name,
            "description": description,
            "app_type": app_type,
        }

    async def get_app_info(self, app_id: str) -> dict[str, Any]:
        """获取应用信息"""
        return await self._request("GET", f"/app-info")

    async def get_app_parameters(self) -> dict[str, Any]:
        """获取应用参数（用户输入变量等）"""
        return await self._request("GET", "/app/parameters")

    async def update_app_config(
        self,
        app_id: str,
        config: dict[str, Any],
    ) -> dict[str, Any]:
        """更新应用配置"""
        return await self._request("POST", f"/apps/{app_id}/configs", json_data=config)

    async def delete_app(self, app_id: str) -> dict[str, Any]:
        """删除应用"""
        return await self._request("DELETE", f"/apps/{app_id}")

    # ============================================================
    # 对话管理
    # ============================================================
    async def send_message(
        self,
        query: str,
        user: str = "default-user",
        conversation_id: str = "",
        inputs: Optional[dict[str, Any]] = None,
        response_mode: str = "blocking",
        files: Optional[list[dict]] = None,
    ) -> dict[str, Any]:
        """
        发送消息（阻塞模式）

        Args:
            query: 用户消息内容
            user: 用户标识
            conversation_id: 对话ID（为空则创建新对话）
            inputs: 额外输入参数
            response_mode: 响应模式 blocking/streaming
            files: 关联文件列表
        """
        payload: dict[str, Any] = {
            "query": query,
            "user": user,
            "response_mode": response_mode,
            "inputs": inputs or {},
        }
        if conversation_id:
            payload["conversation_id"] = conversation_id
        if files:
            payload["files"] = files

        return await self._request("POST", "/chat-messages", json_data=payload)

    async def send_message_stream(
        self,
        query: str,
        user: str = "default-user",
        conversation_id: str = "",
        inputs: Optional[dict[str, Any]] = None,
        files: Optional[list[dict]] = None,
    ) -> AsyncIterator[dict[str, Any]]:
        """
        发送消息（SSE流式模式）

        Yields:
            SSE事件字典
        """
        payload: dict[str, Any] = {
            "query": query,
            "user": user,
            "response_mode": "streaming",
            "inputs": inputs or {},
        }
        if conversation_id:
            payload["conversation_id"] = conversation_id
        if files:
            payload["files"] = files

        url = f"{self.base_url}/chat-messages"
        headers = self._get_headers()

        async with httpx.AsyncClient(timeout=httpx.Timeout(120.0, connect=10.0)) as client:
            async with client.stream(
                "POST",
                url,
                json=payload,
                headers=headers,
            ) as response:
                response.raise_for_status()
                async for line in response.aiter_lines():
                    if line.startswith("data: "):
                        import json
                        try:
                            data = json.loads(line[6:])
                            yield data
                        except json.JSONDecodeError:
                            logger.warning(f"无法解析SSE数据: {line}")
                            continue

    async def get_conversations(
        self,
        user: str,
        last_id: Optional[str] = None,
        limit: int = 20,
        sort_by: str = "-updated_at",
    ) -> dict[str, Any]:
        """获取用户的对话列表"""
        params: dict[str, Any] = {
            "user": user,
            "limit": limit,
            "sort_by": sort_by,
        }
        if last_id:
            params["last_id"] = last_id
        return await self._request("GET", "/conversations", params=params)

    async def get_messages(
        self,
        conversation_id: str,
        user: str,
        first_id: Optional[str] = None,
        limit: int = 20,
    ) -> dict[str, Any]:
        """获取对话的消息历史"""
        params: dict[str, Any] = {
            "user": user,
            "conversation_id": conversation_id,
            "limit": limit,
        }
        if first_id:
            params["first_id"] = first_id
        return await self._request("GET", "/messages", params=params)

    async def message_feedback(
        self,
        message_id: str,
        rating: str,
        user: str,
        content: Optional[str] = None,
    ) -> dict[str, Any]:
        """消息反馈（点赞/点踩）"""
        payload = {
            "message_id": message_id,
            "rating": rating,
            "user": user,
        }
        if content:
            payload["content"] = content
        return await self._request("POST", "/messages/feedbacks", json_data=payload)

    async def stop_message(self, task_id: str, user: str) -> dict[str, Any]:
        """停止生成消息"""
        return await self._request(
            "POST",
            "/chat-messages/stop",
            json_data={"task_id": task_id, "user": user},
        )

    # ============================================================
    # 工作流
    # ============================================================
    async def execute_workflow(
        self,
        inputs: dict[str, Any],
        user: str = "default-user",
        response_mode: str = "blocking",
        files: Optional[list[dict]] = None,
    ) -> dict[str, Any]:
        """
        执行工作流（阻塞模式）

        Args:
            inputs: 工作流输入参数
            user: 用户标识
            response_mode: 响应模式 blocking/streaming
            files: 关联文件列表
        """
        payload: dict[str, Any] = {
            "inputs": inputs,
            "user": user,
            "response_mode": response_mode,
        }
        if files:
            payload["files"] = files
        return await self._request("POST", "/workflows/run", json_data=payload)

    async def execute_workflow_stream(
        self,
        inputs: dict[str, Any],
        user: str = "default-user",
        files: Optional[list[dict]] = None,
    ) -> AsyncIterator[dict[str, Any]]:
        """执行工作流（SSE流式模式）"""
        payload: dict[str, Any] = {
            "inputs": inputs,
            "user": user,
            "response_mode": "streaming",
        }
        if files:
            payload["files"] = files

        url = f"{self.base_url}/workflows/run"
        headers = self._get_headers()

        async with httpx.AsyncClient(timeout=httpx.Timeout(120.0, connect=10.0)) as client:
            async with client.stream(
                "POST",
                url,
                json=payload,
                headers=headers,
            ) as response:
                response.raise_for_status()
                async for line in response.aiter_lines():
                    if line.startswith("data: "):
                        import json
                        try:
                            data = json.loads(line[6:])
                            yield data
                        except json.JSONDecodeError:
                            logger.warning(f"无法解析SSE数据: {line}")
                            continue

    async def get_workflow_run(self, workflow_run_id: str) -> dict[str, Any]:
        """获取工作流执行结果"""
        return await self._request("GET", f"/workflows/runs/{workflow_run_id}")

    # ============================================================
    # 知识库管理
    # ============================================================
    async def create_dataset(
        self,
        name: str,
        description: str = "",
        indexing_technique: str = "high_quality",
        permission: str = "only_me",
    ) -> dict[str, Any]:
        """创建知识库（数据集）"""
        payload = {
            "name": name,
            "description": description,
            "indexing_technique": indexing_technique,
            "permission": permission,
        }
        return await self._request("POST", "/datasets", json_data=payload)

    async def get_datasets(self, page: int = 1, page_size: int = 20) -> dict[str, Any]:
        """获取知识库列表"""
        params = {"page": page, "page_size": page_size}
        return await self._request("GET", "/datasets", params=params)

    async def delete_dataset(self, dataset_id: str) -> dict[str, Any]:
        """删除知识库"""
        return await self._request("DELETE", f"/datasets/{dataset_id}")

    async def upload_document(
        self,
        dataset_id: str,
        file_content: bytes,
        file_name: str,
        indexing_technique: str = "high_quality",
        process_rule: Optional[dict] = None,
    ) -> dict[str, Any]:
        """
        上传文档到知识库

        Args:
            dataset_id: 知识库ID
            file_content: 文件二进制内容
            file_name: 文件名
            indexing_technique: 索引技术
            process_rule: 文档处理规则
        """
        url = f"{self.base_url}/datasets/{dataset_id}/document-create-by-file"
        headers = self._get_headers()
        # 移除Content-Type让httpx自动设置multipart
        headers.pop("Content-Type", None)

        files = {"file": (file_name, file_content)}

        data: dict[str, Any] = {
            "indexing_technique": indexing_technique,
        }
        if process_rule:
            import json
            data["process_rule"] = json.dumps(process_rule)

        async with httpx.AsyncClient(timeout=httpx.Timeout(120.0, connect=10.0)) as client:
            response = await client.post(url, headers=headers, files=files, data=data)
            response.raise_for_status()
            return response.json()

    async def delete_document(self, dataset_id: str, document_id: str) -> dict[str, Any]:
        """删除知识库中的文档"""
        return await self._request(
            "DELETE",
            f"/datasets/{dataset_id}/documents/{document_id}",
        )

    async def get_dataset_stats(self, dataset_id: str) -> dict[str, Any]:
        """获取知识库统计信息"""
        return await self._request("GET", f"/datasets/{dataset_id}/statistics")

    async def get_dataset_documents(
        self,
        dataset_id: str,
        page: int = 1,
        page_size: int = 20,
    ) -> dict[str, Any]:
        """获取知识库文档列表"""
        params = {"page": page, "page_size": page_size}
        return await self._request(
            "GET",
            f"/datasets/{dataset_id}/documents",
            params=params,
        )

    # ============================================================
    # 文件上传
    # ============================================================
    async def upload_file(
        self,
        file_content: bytes,
        file_name: str,
        user: str = "default-user",
    ) -> dict[str, Any]:
        """
        上传文件（用于对话中关联文件）

        Args:
            file_content: 文件二进制内容
            file_name: 文件名
            user: 用户标识
        """
        url = f"{self.base_url}/files/upload"
        headers = self._get_headers()
        headers.pop("Content-Type", None)

        files = {"file": (file_name, file_content)}
        data = {"user": user}

        async with httpx.AsyncClient(timeout=httpx.Timeout(60.0, connect=10.0)) as client:
            response = await client.post(url, headers=headers, files=files, data=data)
            response.raise_for_status()
            return response.json()

    # ============================================================
    # Completion（文本补全）
    # ============================================================
    async def completion(
        self,
        inputs: dict[str, Any],
        query: str,
        user: str = "default-user",
        response_mode: str = "blocking",
    ) -> dict[str, Any]:
        """文本补全（Completion类型应用）"""
        payload = {
            "inputs": inputs,
            "query": query,
            "user": user,
            "response_mode": response_mode,
        }
        return await self._request("POST", "/completion-messages", json_data=payload)

    async def completion_stream(
        self,
        inputs: dict[str, Any],
        query: str,
        user: str = "default-user",
    ) -> AsyncIterator[dict[str, Any]]:
        """文本补全（SSE流式模式）"""
        payload = {
            "inputs": inputs,
            "query": query,
            "user": user,
            "response_mode": "streaming",
        }

        url = f"{self.base_url}/completion-messages"
        headers = self._get_headers()

        async with httpx.AsyncClient(timeout=httpx.Timeout(120.0, connect=10.0)) as client:
            async with client.stream(
                "POST",
                url,
                json=payload,
                headers=headers,
            ) as response:
                response.raise_for_status()
                async for line in response.aiter_lines():
                    if line.startswith("data: "):
                        import json
                        try:
                            data = json.loads(line[6:])
                            yield data
                        except json.JSONDecodeError:
                            logger.warning(f"无法解析SSE数据: {line}")
                            continue


# 全局Dify客户端实例
_dify_client: Optional[DifyClient] = None


def get_dify_client() -> DifyClient:
    """获取Dify客户端单例"""
    global _dify_client
    if _dify_client is None:
        _dify_client = DifyClient()
    return _dify_client
