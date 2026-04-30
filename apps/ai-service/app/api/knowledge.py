"""
知识库API路由
- 创建/查询知识库
- 上传/删除文档
- 知识库统计
"""
import logging
import uuid
from typing import Optional

from fastapi import APIRouter, HTTPException, Query, UploadFile, File

from app.models.schemas import (
    KnowledgeBaseCreate,
    KnowledgeBaseListResponse,
    KnowledgeBaseResponse,
    KnowledgeDocumentResponse,
    KnowledgeStatsResponse,
    ApiResponse,
)
from app.models.database import KnowledgeBase, KnowledgeDocument, get_db
from app.services.dify_client import get_dify_client
from app.config import get_settings

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/knowledge", tags=["知识库管理"])


@router.post("/bases", response_model=ApiResponse, summary="创建知识库")
async def create_knowledge_base(request: KnowledgeBaseCreate):
    """
    创建知识库，同时调用Dify创建对应的数据集
    """
    kb_id = str(uuid.uuid4())

    try:
        # 调用Dify创建数据集
        dify_client = get_dify_client()
        dify_result = await dify_client.create_dataset(
            name=request.name,
            description=request.description or "",
        )
        dify_dataset_id = dify_result.get("id", "")

        # 保存到本地数据库
        async with get_db()() as session:
            kb = KnowledgeBase(
                id=kb_id,
                name=request.name,
                description=request.description,
                dify_dataset_id=dify_dataset_id,
            )
            session.add(kb)
            await session.commit()
            await session.refresh(kb)

        return ApiResponse(
            code=201,
            message="知识库创建成功",
            data=KnowledgeBaseResponse.model_validate(kb).model_dump(),
        )
    except Exception as e:
        logger.error(f"创建知识库失败: {e}")
        raise HTTPException(status_code=500, detail=f"创建知识库失败: {str(e)}")


@router.get("/bases", response_model=ApiResponse, summary="获取知识库列表")
async def list_knowledge_bases(
    page: int = Query(default=1, ge=1, description="页码"),
    page_size: int = Query(default=20, ge=1, le=100, description="每页数量"),
):
    """
    获取知识库列表
    """
    from sqlalchemy import func, select

    async with get_db()() as session:
        count_query = select(func.count(KnowledgeBase.id))
        total_result = await session.execute(count_query)
        total = total_result.scalar() or 0

        offset = (page - 1) * page_size
        query = (
            select(KnowledgeBase)
            .order_by(KnowledgeBase.created_at.desc())
            .offset(offset)
            .limit(page_size)
        )
        result = await session.execute(query)
        bases = result.scalars().all()

        items = [KnowledgeBaseResponse.model_validate(b).model_dump() for b in bases]

        return ApiResponse(
            data=KnowledgeBaseListResponse(total=total, items=items).model_dump(),
        )


@router.post("/bases/{kb_id}/documents", response_model=ApiResponse, summary="上传文档")
async def upload_document(
    kb_id: str,
    file: UploadFile = File(..., description="上传文档"),
):
    """
    上传文档到知识库

    支持的文件类型: txt, pdf, md, csv, xlsx, docx等
    """
    from sqlalchemy import select

    settings = get_settings()

    # 验证知识库存在
    async with get_db()() as session:
        result = await session.execute(
            select(KnowledgeBase).where(KnowledgeBase.id == kb_id)
        )
        kb = result.scalar_one_or_none()
        if kb is None:
            raise HTTPException(status_code=404, detail="知识库不存在")

        # 验证文件大小
        content = await file.read()
        if len(content) > settings.max_upload_size:
            raise HTTPException(
                status_code=413,
                detail=f"文件大小超过限制（最大 {settings.max_upload_size // 1024 // 1024}MB）",
            )

    # 上传到Dify
    try:
        dify_client = get_dify_client()
        dify_result = await dify_client.upload_document(
            dataset_id=kb.dify_dataset_id,
            file_content=content,
            file_name=file.filename or "unknown",
        )

        dify_document_id = dify_result.get("document", {}).get("id", "")
        batch = dify_result.get("batch", "")

        # 保存到本地数据库
        doc_id = str(uuid.uuid4())
        async with get_db()() as session:
            doc = KnowledgeDocument(
                id=doc_id,
                knowledge_base_id=kb_id,
                dify_document_id=dify_document_id,
                name=file.filename or "unknown",
                file_type=file.filename.split(".")[-1] if file.filename else None,
                file_size=len(content),
                status="indexing",
            )
            session.add(doc)

            # 更新知识库文档计数
            kb.document_count = (kb.document_count or 0) + 1
            await session.commit()
            await session.refresh(doc)

        return ApiResponse(
            code=201,
            message="文档上传成功，正在索引中",
            data={
                "document_id": doc_id,
                "name": file.filename,
                "status": "indexing",
                "batch": batch,
            },
        )
    except Exception as e:
        logger.error(f"上传文档失败: {e}")
        raise HTTPException(status_code=500, detail=f"上传文档失败: {str(e)}")


@router.delete(
    "/bases/{kb_id}/documents/{doc_id}",
    response_model=ApiResponse,
    summary="删除文档",
)
async def delete_document(kb_id: str, doc_id: str):
    """
    从知识库中删除文档
    """
    from sqlalchemy import select

    async with get_db()() as session:
        # 验证文档存在
        result = await session.execute(
            select(KnowledgeDocument).where(
                KnowledgeDocument.id == doc_id,
                KnowledgeDocument.knowledge_base_id == kb_id,
            )
        )
        doc = result.scalar_one_or_none()
        if doc is None:
            raise HTTPException(status_code=404, detail="文档不存在")

        # 获取知识库信息
        kb_result = await session.execute(
            select(KnowledgeBase).where(KnowledgeBase.id == kb_id)
        )
        kb = kb_result.scalar_one_or_none()

        # 从Dify删除
        if kb and kb.dify_dataset_id and doc.dify_document_id:
            try:
                dify_client = get_dify_client()
                await dify_client.delete_document(
                    dataset_id=kb.dify_dataset_id,
                    document_id=doc.dify_document_id,
                )
            except Exception as e:
                logger.warning(f"从Dify删除文档失败: {e}")

        # 从本地数据库删除
        await session.delete(doc)
        if kb:
            kb.document_count = max(0, (kb.document_count or 0) - 1)
        await session.commit()

        return ApiResponse(message="文档删除成功")


@router.get("/bases/{kb_id}/stats", response_model=ApiResponse, summary="知识库统计")
async def get_knowledge_base_stats(kb_id: str):
    """
    获取知识库统计信息，包括文档数量、分段数、字符数等
    """
    from sqlalchemy import func, select

    async with get_db()() as session:
        # 验证知识库存在
        result = await session.execute(
            select(KnowledgeBase).where(KnowledgeBase.id == kb_id)
        )
        kb = result.scalar_one_or_none()
        if kb is None:
            raise HTTPException(status_code=404, detail="知识库不存在")

        # 获取文档列表
        doc_result = await session.execute(
            select(KnowledgeDocument)
            .where(KnowledgeDocument.knowledge_base_id == kb_id)
            .order_by(KnowledgeDocument.created_at.desc())
        )
        documents = doc_result.scalars().all()

        doc_items = [KnowledgeDocumentResponse.model_validate(d).model_dump() for d in documents]

        # 尝试从Dify获取最新统计
        dify_stats = {}
        if kb.dify_dataset_id:
            try:
                dify_client = get_dify_client()
                dify_stats = await dify_client.get_dataset_stats(kb.dify_dataset_id)
            except Exception as e:
                logger.warning(f"获取Dify统计失败: {e}")

        # 合并统计信息
        total_segments = dify_stats.get("total_segments", kb.total_segments or 0)
        total_chars = dify_stats.get("total_chars", kb.total_chars or 0)

        # 更新本地统计
        kb.total_segments = total_segments
        kb.total_chars = total_chars
        await session.commit()

        stats = KnowledgeStatsResponse(
            knowledge_base_id=kb_id,
            document_count=len(documents),
            total_segments=total_segments,
            total_chars=total_chars,
            documents=doc_items,
        )

        return ApiResponse(data=stats.model_dump())
