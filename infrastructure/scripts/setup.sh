#!/bin/bash
# ============================================================
# OPC智能体平台 - 一键本地环境启动脚本
# ============================================================
# 使用方法:
#   chmod +x scripts/setup.sh
#   ./scripts/setup.sh
# ============================================================

set -e

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # 无颜色

# 脚本所在目录
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
DOCKER_DIR="$PROJECT_ROOT/infrastructure/docker"

# 打印带颜色的消息
print_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# 打印分隔线
print_separator() {
    echo "============================================================"
}

# ============================================================
# 步骤 1: 检查 Docker 是否安装
# ============================================================
print_separator
print_info "步骤 1/6: 检查 Docker 环境..."

# 检查 Docker
if ! command -v docker &> /dev/null; then
    print_error "Docker 未安装，请先安装 Docker"
    print_info "安装指南: https://docs.docker.com/get-docker/"
    exit 1
fi
print_success "Docker 已安装: $(docker --version)"

# 检查 Docker Compose
if docker compose version &> /dev/null; then
    COMPOSE_CMD="docker compose"
    print_success "Docker Compose V2 已安装: $(docker compose version --short)"
elif command -v docker-compose &> /dev/null; then
    COMPOSE_CMD="docker-compose"
    print_success "Docker Compose V1 已安装: $(docker-compose --version)"
else
    print_error "Docker Compose 未安装，请先安装 Docker Compose"
    print_info "安装指南: https://docs.docker.com/compose/install/"
    exit 1
fi

# 检查 Docker 守护进程是否运行
if ! docker info &> /dev/null; then
    print_error "Docker 守护进程未运行，请先启动 Docker"
    exit 1
fi
print_success "Docker 守护进程正在运行"

# ============================================================
# 步骤 2: 创建 .env 文件
# ============================================================
print_separator
print_info "步骤 2/6: 配置环境变量..."

if [ -f "$DOCKER_DIR/.env" ]; then
    print_warning ".env 文件已存在，跳过创建"
else
    if [ -f "$DOCKER_DIR/.env.example" ]; then
        cp "$DOCKER_DIR/.env.example" "$DOCKER_DIR/.env"
        print_success ".env 文件已从 .env.example 创建"
    else
        print_error ".env.example 文件不存在"
        exit 1
    fi
fi

# ============================================================
# 步骤 3: 创建必要的目录
# ============================================================
print_separator
print_info "步骤 3/6: 创建必要的目录..."

mkdir -p "$DOCKER_DIR/nginx/conf.d"
mkdir -p "$DOCKER_DIR/ssrf_proxy"
print_success "目录创建完成"

# ============================================================
# 步骤 4: 启动 Docker Compose
# ============================================================
print_separator
print_info "步骤 4/6: 启动 Docker Compose 服务..."

cd "$DOCKER_DIR"

# 拉取最新镜像
print_info "拉取最新镜像..."
$COMPOSE_CMD pull 2>/dev/null || print_warning "部分镜像拉取失败，将使用本地缓存"

# 启动所有服务
print_info "启动所有服务（后台模式）..."
$COMPOSE_CMD up -d

print_success "Docker Compose 服务启动命令已执行"

# ============================================================
# 步骤 5: 等待所有服务健康
# ============================================================
print_separator
print_info "步骤 5/6: 等待所有服务健康检查通过..."

# 定义需要等待的服务及其健康检查超时时间（秒）
declare -A SERVICES_TIMEOUT=(
    ["opc-postgres"]=120
    ["opc-redis"]=60
    ["opc-minio"]=60
    ["opc-dify-db"]=120
    ["opc-dify-redis"]=60
    ["opc-nginx"]=120
)

MAX_WAIT=180  # 最大等待时间（秒）
ELAPSED=0

for service in "${!SERVICES_TIMEOUT[@]}"; do
    timeout=${SERVICES_TIMEOUT[$service]}
    service_elapsed=0

    print_info "等待 $service 健康检查通过（最长 ${timeout}s）..."

    while [ $service_elapsed -lt $timeout ]; do
        # 检查容器是否存在
        if ! docker ps -a --format '{{.Names}}' | grep -q "^${service}$"; then
            print_warning "$service 容器不存在，跳过"
            break
        fi

        # 检查健康状态
        health_status=$(docker inspect --format='{{.State.Health.Status}}' "$service" 2>/dev/null || echo "unknown")

        if [ "$health_status" = "healthy" ]; then
            print_success "$service 已就绪"
            break
        elif [ "$health_status" = "unhealthy" ]; then
            print_warning "$service 健康检查失败，请查看日志: docker logs $service"
            break
        fi

        sleep 5
        service_elapsed=$((service_elapsed + 5))
        echo -ne "  已等待 ${service_elapsed}s...\r"
    done

    if [ $service_elapsed -ge $timeout ]; then
        print_warning "$service 在 ${timeout}s 内未就绪，请稍后检查"
    fi
done

echo ""

# ============================================================
# 步骤 6: 输出服务访问地址
# ============================================================
print_separator
print_info "步骤 6/6: 服务状态检查完成"
print_separator

echo ""
echo -e "${GREEN}============================================================${NC}"
echo -e "${GREEN}  OPC智能体平台 - 本地开发环境已启动${NC}"
echo -e "${GREEN}============================================================${NC}"
echo ""
echo -e "  ${BLUE}OPC 平台服务${NC}"
echo "  --------------------------------------------------------"
echo -e "  Web 前端:        ${GREEN}http://localhost:3001${NC}"
echo -e "  API 网关:        ${GREEN}http://localhost:3000${NC}"
echo -e "  API 文档:        ${GREEN}http://localhost:3000/api/docs${NC}"
echo -e "  AI 服务:         ${GREEN}http://localhost:8000${NC}"
echo -e "  AI 文档:         ${GREEN}http://localhost:8000/docs${NC}"
echo ""
echo -e "  ${BLUE}基础设施服务${NC}"
echo "  --------------------------------------------------------"
echo -e "  Nginx 代理:      ${GREEN}http://localhost:80${NC}"
echo -e "  PostgreSQL:      ${GREEN}localhost:5432${NC}"
echo -e "  Redis:           ${GREEN}localhost:6379${NC}"
echo -e "  MinIO API:       ${GREEN}http://localhost:9000${NC}"
echo -e "  MinIO Console:   ${GREEN}http://localhost:9001${NC}"
echo ""
echo -e "  ${BLUE}Dify AI 平台${NC}"
echo "  --------------------------------------------------------"
echo -e "  Dify Web:        ${GREEN}http://localhost:3002${NC}"
echo -e "  Dify API:        ${GREEN}http://localhost:5001${NC}"
echo -e "  Nginx路由:       ${GREEN}http://localhost/dify/${NC}"
echo ""
echo -e "  ${BLUE}Nginx 路由规则${NC}"
echo "  --------------------------------------------------------"
echo -e "  /         -> Web 前端 (3001)"
echo -e "  /api/     -> API 网关 (3000)"
echo -e "  /ai/      -> AI 服务 (8000)"
echo -e "  /dify/    -> Dify Web (3002)"
echo -e "  /dify-api/ -> Dify API (5001)"
echo ""
echo -e "  ${BLUE}常用命令${NC}"
echo "  --------------------------------------------------------"
echo "  查看日志:   cd infrastructure/docker && docker compose logs -f"
echo "  停止服务:   cd infrastructure/docker && docker compose down"
echo "  清除数据:   cd infrastructure/docker && docker compose down -v"
echo "  重启服务:   cd infrastructure/docker && docker compose restart"
echo ""
echo -e "  ${YELLOW}注意: 首次启动可能需要几分钟拉取镜像和初始化数据库${NC}"
echo ""
