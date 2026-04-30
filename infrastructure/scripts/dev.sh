#!/bin/bash
# ============================================================
# OPC智能体平台 - 开发环境启动脚本（不使用Docker）
# ============================================================
# 使用方法:
#   chmod +x scripts/dev.sh
#   ./scripts/dev.sh              # 启动所有服务
#   ./scripts/dev.sh --api        # 仅启动API网关
#   ./scripts/dev.sh --ai         # 仅启动AI服务
#   ./scripts/dev.sh --web        # 仅启动Web前端
#   ./scripts/dev.sh --stop       # 停止所有服务
# ============================================================

set -e

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# 脚本所在目录
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

# 进程PID存储目录
PID_DIR="$PROJECT_ROOT/.dev-pids"
mkdir -p "$PID_DIR"

# 加载环境变量
if [ -f "$PROJECT_ROOT/.env" ]; then
    export $(grep -v '^#' "$PROJECT_ROOT/.env" | grep -v '^$' | xargs)
elif [ -f "$PROJECT_ROOT/.env.local" ]; then
    export $(grep -v '^#' "$PROJECT_ROOT/.env.local" | grep -v '^$' | xargs)
fi

# 打印消息函数
print_info() { echo -e "${BLUE}[INFO]${NC} $1"; }
print_success() { echo -e "${GREEN}[SUCCESS]${NC} $1"; }
print_warning() { echo -e "${YELLOW}[WARNING]${NC} $1"; }
print_error() { echo -e "${RED}[ERROR]${NC} $1"; }

# ============================================================
# 前置检查
# ============================================================

check_dependencies() {
    print_info "检查开发环境依赖..."

    local missing=()

    # 检查 Node.js
    if ! command -v node &> /dev/null; then
        missing+=("Node.js")
    else
        print_success "Node.js $(node --version)"
    fi

    # 检查 pnpm
    if ! command -v pnpm &> /dev/null; then
        missing+=("pnpm")
    else
        print_success "pnpm $(pnpm --version)"
    fi

    # 检查 PostgreSQL（可选，可使用Docker）
    if command -v psql &> /dev/null; then
        print_success "PostgreSQL 客户端已安装"
    else
        print_warning "PostgreSQL 客户端未安装（可使用Docker运行PostgreSQL）"
    fi

    # 检查 Redis（可选，可使用Docker）
    if command -v redis-cli &> /dev/null; then
        print_success "Redis 客户端已安装"
    else
        print_warning "Redis 客户端未安装（可使用Docker运行Redis）"
    fi

    if [ ${#missing[@]} -gt 0 ]; then
        print_error "缺少必要依赖: ${missing[*]}"
        print_info "请先安装缺少的依赖"
        exit 1
    fi
}

# ============================================================
# 安装依赖
# ============================================================

install_dependencies() {
    print_info "安装项目依赖..."

    if [ ! -d "$PROJECT_ROOT/node_modules" ]; then
        cd "$PROJECT_ROOT"
        pnpm install
        print_success "项目依赖安装完成"
    else
        print_success "项目依赖已存在，跳过安装"
    fi
}

# ============================================================
# 启动基础设施（PostgreSQL + Redis）
# ============================================================

start_infrastructure() {
    print_info "检查基础设施服务..."

    # 检查 PostgreSQL 是否运行
    if pg_isready -h localhost -p 5432 &> /dev/null; then
        print_success "PostgreSQL 已在运行"
    else
        print_warning "PostgreSQL 未运行"
        print_info "尝试使用 Docker 启动 PostgreSQL 和 Redis..."

        # 使用 Docker 仅启动基础设施服务
        cd "$PROJECT_ROOT/infrastructure/docker"
        docker compose up -d postgres redis minio minio-init

        # 等待 PostgreSQL 就绪
        local retries=30
        while [ $retries -gt 0 ]; do
            if pg_isready -h localhost -p 5432 &> /dev/null; then
                print_success "PostgreSQL 已启动"
                break
            fi
            sleep 2
            retries=$((retries - 1))
        done

        if [ $retries -eq 0 ]; then
            print_error "PostgreSQL 启动超时"
            exit 1
        fi
    fi

    # 检查 Redis 是否运行
    if redis-cli -a "${REDIS_PASSWORD:-redis123}" ping &> /dev/null; then
        print_success "Redis 已在运行"
    else
        print_warning "Redis 未运行，请确保 Redis 服务已启动"
    fi
}

# ============================================================
# 启动 API 网关
# ============================================================

start_api_gateway() {
    print_info "启动 API 网关..."

    cd "$PROJECT_ROOT/apps/api-gateway"

    # 复制环境变量文件
    if [ ! -f .env ] && [ -f .env.example ]; then
        cp .env.example .env
    fi

    # 启动开发服务器
    pnpm dev:start > "$PID_DIR/api-gateway.log" 2>&1 &
    local pid=$!
    echo $pid > "$PID_DIR/api-gateway.pid"

    sleep 3

    if kill -0 $pid 2>/dev/null; then
        print_success "API 网关已启动 (PID: $pid, 端口: 3000)"
    else
        print_error "API 网关启动失败，查看日志: $PID_DIR/api-gateway.log"
    fi
}

# ============================================================
# 启动 AI 服务
# ============================================================

start_ai_service() {
    print_info "启动 AI 服务..."

    cd "$PROJECT_ROOT/apps/ai-service"

    # 检查是否存在
    if [ ! -f "package.json" ]; then
        print_warning "AI 服务目录不存在，跳过"
        return 0
    fi

    # 启动开发服务器
    pnpm dev:start > "$PID_DIR/ai-service.log" 2>&1 &
    local pid=$!
    echo $pid > "$PID_DIR/ai-service.pid"

    sleep 3

    if kill -0 $pid 2>/dev/null; then
        print_success "AI 服务已启动 (PID: $pid, 端口: 8000)"
    else
        print_error "AI 服务启动失败，查看日志: $PID_DIR/ai-service.log"
    fi
}

# ============================================================
# 启动 Web 前端
# ============================================================

start_web() {
    print_info "启动 Web 前端..."

    cd "$PROJECT_ROOT/apps/web"

    # 启动开发服务器
    pnpm dev > "$PID_DIR/web.log" 2>&1 &
    local pid=$!
    echo $pid > "$PID_DIR/web.pid"

    sleep 5

    if kill -0 $pid 2>/dev/null; then
        print_success "Web 前端已启动 (PID: $pid, 端口: 3001)"
    else
        print_error "Web 前端启动失败，查看日志: $PID_DIR/web.log"
    fi
}

# ============================================================
# 停止所有服务
# ============================================================

stop_all() {
    print_info "停止所有开发服务..."

    for pid_file in "$PID_DIR"/*.pid; do
        if [ -f "$pid_file" ]; then
            local service_name=$(basename "$pid_file" .pid)
            local pid=$(cat "$pid_file")

            if kill -0 "$pid" 2>/dev/null; then
                kill "$pid" 2>/dev/null || true
                print_info "已停止 $service_name (PID: $pid)"
            fi

            rm -f "$pid_file"
        fi
    done

    # 清理日志文件
    rm -f "$PID_DIR"/*.log

    print_success "所有开发服务已停止"
}

# ============================================================
# 主逻辑
# ============================================================

case "${1:-}" in
    --api)
        check_dependencies
        start_infrastructure
        start_api_gateway
        ;;
    --ai)
        check_dependencies
        start_infrastructure
        start_ai_service
        ;;
    --web)
        check_dependencies
        start_web
        ;;
    --stop)
        stop_all
        ;;
    --logs)
        # 查看日志
        service="${2:-}"
        if [ -n "$service" ] && [ -f "$PID_DIR/${service}.log" ]; then
            tail -f "$PID_DIR/${service}.log"
        else
            print_info "可用的日志文件:"
            ls -la "$PID_DIR"/*.log 2>/dev/null || echo "  无日志文件"
            echo ""
            echo "用法: $0 --logs <service_name>"
            echo "  可选: api-gateway, ai-service, web"
        fi
        ;;
    *)
        # 启动所有服务
        echo "============================================================"
        echo "  OPC智能体平台 - 开发环境启动"
        echo "  $(date '+%Y-%m-%d %H:%M:%S')"
        echo "============================================================"
        echo ""

        check_dependencies
        install_dependencies
        start_infrastructure

        echo ""
        print_info "启动业务服务..."
        echo ""

        start_api_gateway
        start_ai_service
        start_web

        echo ""
        echo "============================================================"
        echo -e "  ${GREEN}开发环境已启动${NC}"
        echo "============================================================"
        echo ""
        echo -e "  Web 前端:  ${GREEN}http://localhost:3001${NC}"
        echo -e "  API 网关:  ${GREEN}http://localhost:3000${NC}"
        echo -e "  API 文档:  ${GREEN}http://localhost:3000/api/docs${NC}"
        echo -e "  AI 服务:   ${GREEN}http://localhost:8000${NC}"
        echo -e "  AI 文档:   ${GREEN}http://localhost:8000/docs${NC}"
        echo ""
        echo "  查看日志:  $0 --logs <service_name>"
        echo "  停止服务:  $0 --stop"
        echo ""

        # 等待用户中断
        print_info "按 Ctrl+C 停止所有服务..."
        trap stop_all EXIT INT TERM
        wait
        ;;
esac
