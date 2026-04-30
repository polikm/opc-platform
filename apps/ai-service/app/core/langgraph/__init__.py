"""
LangGraph工作流定义
- OPC评估工作流（就绪度评估）
- 内容创作工作流
- 客户接待工作流
"""
import json
import logging
from typing import Any, Optional, TypedDict, Annotated
from datetime import datetime

from langgraph.graph import StateGraph, END
from langgraph.graph.message import add_messages
from langchain_core.messages import BaseMessage, HumanMessage, AIMessage, SystemMessage

from app.services.llm_service import LLMService, get_llm_service, TaskComplexity

logger = logging.getLogger(__name__)


# ============================================================
# 工作流状态定义
# ============================================================
class WorkflowState(TypedDict):
    """工作流通用状态"""
    messages: Annotated[list[BaseMessage], add_messages]
    user_input: str
    context: dict[str, Any]
    result: Optional[str]
    metadata: dict[str, Any]


class OPCAssessmentState(TypedDict):
    """OPC就绪度评估状态"""
    messages: Annotated[list[BaseMessage], add_messages]
    company_name: str
    industry: str
    company_size: str
    current_system: str
    assessment_results: dict[str, Any]
    scores: dict[str, int]
    recommendations: list[str]
    final_report: Optional[str]


class ContentCreationState(TypedDict):
    """内容创作状态"""
    messages: Annotated[list[BaseMessage], add_messages]
    product_name: str
    product_description: str
    target_audience: str
    content_type: str
    tone: str
    drafts: list[str]
    final_content: Optional[str]


class CustomerReceptionState(TypedDict):
    """客户接待状态"""
    messages: Annotated[list[BaseMessage], add_messages]
    customer_name: str
    customer_need: str
    budget_range: str
    industry: str
    needs_analysis: Optional[str]
    recommendations: list[dict[str, str]]
    proposal: Optional[str]


# ============================================================
# OPC就绪度评估工作流
# ============================================================
async def opc_assess_company_info(state: OPCAssessmentState) -> OPCAssessmentState:
    """收集并分析企业信息"""
    llm_service = get_llm_service()

    system_prompt = """你是一位专业的OPC（在线产品配置）咨询顾问。
请根据企业提供的信息，进行初步分析，识别企业的核心需求和挑战。
输出JSON格式的分析结果，包含以下维度：
- technology_readiness: 技术就绪度 (1-10)
- process_maturity: 流程成熟度 (1-10)
- team_capability: 团队能力 (1-10)
- data_readiness: 数据就绪度 (1-10)
- budget_readiness: 预算就绪度 (1-10)
- key_findings: 关键发现列表
- challenges: 主要挑战列表"""

    user_prompt = f"""企业信息：
- 企业名称: {state.get('company_name', '未知')}
- 行业: {state.get('industry', '未知')}
- 企业规模: {state.get('company_size', '未知')}
- 现有系统: {state.get('current_system', '未知')}

请分析该企业的OPC就绪程度。"""

    messages = [
        SystemMessage(content=system_prompt),
        HumanMessage(content=user_prompt),
    ]

    result = await llm_service.chat(
        messages=messages,
        complexity=TaskComplexity.COMPLEX,
    )

    # 解析评估结果
    try:
        content = result["content"]
        # 尝试提取JSON
        if "```json" in content:
            json_str = content.split("```json")[1].split("```")[0].strip()
        elif "```" in content:
            json_str = content.split("```")[1].split("```")[0].strip()
        else:
            json_str = content

        assessment = json.loads(json_str)
    except (json.JSONDecodeError, IndexError):
        assessment = {
            "technology_readiness": 5,
            "process_maturity": 5,
            "team_capability": 5,
            "data_readiness": 5,
            "budget_readiness": 5,
            "key_findings": ["需要进一步评估"],
            "challenges": ["信息不完整"],
        }

    state["assessment_results"] = assessment
    state["scores"] = {
        "技术就绪度": assessment.get("technology_readiness", 5),
        "流程成熟度": assessment.get("process_maturity", 5),
        "团队能力": assessment.get("team_capability", 5),
        "数据就绪度": assessment.get("data_readiness", 5),
        "预算就绪度": assessment.get("budget_readiness", 5),
    }

    return state


async def opc_generate_recommendations(state: OPCAssessmentState) -> OPCAssessmentState:
    """生成改进建议"""
    llm_service = get_llm_service()

    scores = state.get("scores", {})
    challenges = state.get("assessment_results", {}).get("challenges", [])

    system_prompt = """你是一位专业的OPC咨询顾问。根据评估结果，为企业提供具体的改进建议。
每条建议应包含：优先级（高/中/低）、具体行动、预期效果。"""

    user_prompt = f"""评估得分：{json.dumps(scores, ensure_ascii=False)}
主要挑战：{json.dumps(challenges, ensure_ascii=False)}

请生成3-5条改进建议，以JSON数组格式返回。每条建议格式：
{{"priority": "高/中/低", "action": "具体行动", "expected_outcome": "预期效果"}}"""

    messages = [
        SystemMessage(content=system_prompt),
        HumanMessage(content=user_prompt),
    ]

    result = await llm_service.chat(
        messages=messages,
        complexity=TaskComplexity.MODERATE,
    )

    try:
        content = result["content"]
        if "```json" in content:
            json_str = content.split("```json")[1].split("```")[0].strip()
        elif "```" in content:
            json_str = content.split("```")[1].split("```")[0].strip()
        else:
            json_str = content
        recommendations = json.loads(json_str)
    except (json.JSONDecodeError, IndexError):
        recommendations = [
            {"priority": "高", "action": "完善技术基础设施", "expected_outcome": "提升系统稳定性"},
        ]

    state["recommendations"] = recommendations
    return state


async def opc_generate_report(state: OPCAssessmentState) -> OPCAssessmentState:
    """生成最终评估报告"""
    llm_service = get_llm_service()

    system_prompt = """你是一位专业的OPC咨询顾问。请根据评估结果和建议，生成一份完整的OPC就绪度评估报告。
报告格式应专业、清晰，包含：
1. 执行摘要
2. 评估概览（各维度得分）
3. 详细分析
4. 改进建议
5. 下一步行动计划"""

    user_prompt = f"""请生成评估报告：
企业名称: {state.get('company_name', '未知')}
评估结果: {json.dumps(state.get('assessment_results', {}), ensure_ascii=False)}
得分: {json.dumps(state.get('scores', {}), ensure_ascii=False)}
建议: {json.dumps(state.get('recommendations', []), ensure_ascii=False)}"""

    messages = [
        SystemMessage(content=system_prompt),
        HumanMessage(content=user_prompt),
    ]

    result = await llm_service.chat(
        messages=messages,
        complexity=TaskComplexity.EXPERT,
    )

    state["final_report"] = result["content"]
    return state


def build_opc_assessment_workflow() -> StateGraph:
    """构建OPC就绪度评估工作流"""
    workflow = StateGraph(OPCAssessmentState)

    # 添加节点
    workflow.add_node("assess_company", opc_assess_company_info)
    workflow.add_node("generate_recommendations", opc_generate_recommendations)
    workflow.add_node("generate_report", opc_generate_report)

    # 设置边
    workflow.set_entry_point("assess_company")
    workflow.add_edge("assess_company", "generate_recommendations")
    workflow.add_edge("generate_recommendations", "generate_report")
    workflow.add_edge("generate_report", END)

    return workflow.compile()


# ============================================================
# 内容创作工作流
# ============================================================
async def content_analyze_requirements(state: ContentCreationState) -> ContentCreationState:
    """分析内容需求"""
    llm_service = get_llm_service()

    system_prompt = """你是一位专业的内容策略师。请分析以下内容需求，确定内容方向和要点。"""

    user_prompt = f"""产品名称: {state.get('product_name', '')}
产品描述: {state.get('product_description', '')}
目标受众: {state.get('target_audience', '一般用户')}
内容类型: {state.get('content_type', '营销文案')}
语气风格: {state.get('tone', '专业')}

请分析内容需求，输出内容方向和要点。"""

    messages = [
        SystemMessage(content=system_prompt),
        HumanMessage(content=user_prompt),
    ]

    result = await llm_service.chat(
        messages=messages,
        complexity=TaskComplexity.MODERATE,
    )

    state["messages"] = [
        SystemMessage(content=f"内容分析结果：{result['content']}"),
    ]
    return state


async def content_generate_draft(state: ContentCreationState) -> ContentCreationState:
    """生成内容草稿"""
    llm_service = get_llm_service()

    system_prompt = f"""你是一位专业的内容创作者。请根据分析结果，创作高质量的内容。
内容类型: {state.get('content_type', '营销文案')}
语气风格: {state.get('tone', '专业')}
目标受众: {state.get('target_audience', '一般用户')}"""

    user_prompt = f"""产品信息：
名称: {state.get('product_name', '')}
描述: {state.get('product_description', '')}

请创作内容。"""

    messages = state.get("messages", []) + [
        SystemMessage(content=system_prompt),
        HumanMessage(content=user_prompt),
    ]

    result = await llm_service.chat(
        messages=messages,
        complexity=TaskComplexity.COMPLEX,
    )

    state["drafts"] = [result["content"]]
    return state


async def content_refine(state: ContentCreationState) -> ContentCreationState:
    """优化内容"""
    llm_service = get_llm_service()

    draft = state.get("drafts", [""])[-1] if state.get("drafts") else ""

    system_prompt = """你是一位资深内容编辑。请对以下内容草稿进行优化，提升质量。
优化方向：语言流畅度、说服力、SEO友好性、行动号召。"""

    messages = [
        SystemMessage(content=system_prompt),
        HumanMessage(content=f"请优化以下内容：\n\n{draft}"),
    ]

    result = await llm_service.chat(
        messages=messages,
        complexity=TaskComplexity.MODERATE,
    )

    state["final_content"] = result["content"]
    return state


def build_content_creation_workflow() -> StateGraph:
    """构建内容创作工作流"""
    workflow = StateGraph(ContentCreationState)

    workflow.add_node("analyze_requirements", content_analyze_requirements)
    workflow.add_node("generate_draft", content_generate_draft)
    workflow.add_node("refine_content", content_refine)

    workflow.set_entry_point("analyze_requirements")
    workflow.add_edge("analyze_requirements", "generate_draft")
    workflow.add_edge("generate_draft", "refine_content")
    workflow.add_edge("refine_content", END)

    return workflow.compile()


# ============================================================
# 客户接待工作流
# ============================================================
async def customer_analyze_needs(state: CustomerReceptionState) -> CustomerReceptionState:
    """分析客户需求"""
    llm_service = get_llm_service()

    system_prompt = """你是一位专业的客户需求分析师。请分析客户的描述，提取核心需求、痛点和期望。"""

    user_prompt = f"""客户信息：
- 客户名称: {state.get('customer_name', '未知')}
- 客户需求: {state.get('customer_need', '')}
- 预算范围: {state.get('budget_range', '未指定')}
- 行业: {state.get('industry', '未知')}

请分析客户需求，输出结构化的需求分析。"""

    messages = [
        SystemMessage(content=system_prompt),
        HumanMessage(content=user_prompt),
    ]

    result = await llm_service.chat(
        messages=messages,
        complexity=TaskComplexity.MODERATE,
    )

    state["needs_analysis"] = result["content"]
    return state


async def customer_recommend(state: CustomerReceptionState) -> CustomerReceptionState:
    """生成产品推荐"""
    llm_service = get_llm_service()

    needs = state.get("needs_analysis", "")

    system_prompt = """你是一位专业的产品顾问。根据客户需求分析，推荐最合适的产品或方案。
每个推荐应包含：产品名称、推荐理由、匹配度评分。"""

    messages = [
        SystemMessage(content=system_prompt),
        HumanMessage(content=f"客户需求分析：\n{needs}\n\n预算范围：{state.get('budget_range', '未指定')}"),
    ]

    result = await llm_service.chat(
        messages=messages,
        complexity=TaskComplexity.MODERATE,
    )

    try:
        content = result["content"]
        if "```json" in content:
            json_str = content.split("```json")[1].split("```")[0].strip()
        elif "```" in content:
            json_str = content.split("```")[1].split("```")[0].strip()
        else:
            json_str = content
        recommendations = json.loads(json_str)
    except (json.JSONDecodeError, IndexError):
        recommendations = [{"product": "推荐方案", "reason": "根据需求定制", "match_score": 85}]

    state["recommendations"] = recommendations
    return state


async def customer_generate_proposal(state: CustomerReceptionState) -> CustomerReceptionState:
    """生成方案建议"""
    llm_service = get_llm_service()

    system_prompt = """你是一位专业的方案撰写人。请根据客户需求和推荐结果，生成一份完整的方案建议。
方案应包含：概述、推荐方案详情、实施计划、预期效果。"""

    user_prompt = f"""客户信息：
- 名称: {state.get('customer_name', '未知')}
- 行业: {state.get('industry', '未知')}
- 需求分析: {state.get('needs_analysis', '')}
- 推荐方案: {json.dumps(state.get('recommendations', []), ensure_ascii=False)}

请生成方案建议。"""

    messages = [
        SystemMessage(content=system_prompt),
        HumanMessage(content=user_prompt),
    ]

    result = await llm_service.chat(
        messages=messages,
        complexity=TaskComplexity.COMPLEX,
    )

    state["proposal"] = result["content"]
    return state


def build_customer_reception_workflow() -> StateGraph:
    """构建客户接待工作流"""
    workflow = StateGraph(CustomerReceptionState)

    workflow.add_node("analyze_needs", customer_analyze_needs)
    workflow.add_node("recommend_products", customer_recommend)
    workflow.add_node("generate_proposal", customer_generate_proposal)

    workflow.set_entry_point("analyze_needs")
    workflow.add_edge("analyze_needs", "recommend_products")
    workflow.add_edge("recommend_products", "generate_proposal")
    workflow.add_edge("generate_proposal", END)

    return workflow.compile()


# ============================================================
# 工作流注册表
# ============================================================
WORKFLOW_REGISTRY: dict[str, dict[str, Any]] = {
    "opc-readiness-assessment": {
        "name": "OPC就绪度评估",
        "description": "评估企业的OPC就绪程度",
        "builder": build_opc_assessment_workflow,
        "input_schema": OPCAssessmentState,
    },
    "content-creation": {
        "name": "内容创作",
        "description": "基于产品信息生成营销内容",
        "builder": build_content_creation_workflow,
        "input_schema": ContentCreationState,
    },
    "customer-reception": {
        "name": "客户接待",
        "description": "智能客户接待和方案推荐",
        "builder": build_customer_reception_workflow,
        "input_schema": CustomerReceptionState,
    },
}


def get_workflow(workflow_id: str) -> Optional[StateGraph]:
    """获取工作流实例"""
    entry = WORKFLOW_REGISTRY.get(workflow_id)
    if entry is None:
        return None
    return entry["builder"]()
