"""
LangGraph工作流定义模块
"""
from app.core.langgraph.workflows import (
    WORKFLOW_REGISTRY,
    build_content_creation_workflow,
    build_customer_reception_workflow,
    build_opc_assessment_workflow,
    get_workflow,
)

__all__ = [
    "WORKFLOW_REGISTRY",
    "build_opc_assessment_workflow",
    "build_content_creation_workflow",
    "build_customer_reception_workflow",
    "get_workflow",
]
