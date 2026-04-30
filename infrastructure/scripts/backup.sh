#!/bin/bash
# ============================================================
# OPC智能体平台 - 数据库备份脚本
# ============================================================
# 使用方法:
#   chmod +x scripts/backup.sh
#   ./scripts/backup.sh                    # 备份所有数据库
#   ./scripts/backup.sh --main             # 仅备份主数据库
#   ./scripts/backup.sh --dify             # 仅备份Dify数据库
#   ./scripts/backup.sh --restore <file>   # 从备份文件恢复
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
DOCKER_DIR="$PROJECT_ROOT/infrastructure/docker"
BACKUP_DIR="$PROJECT_ROOT/backups"

# 备份目录
BACKUP_DATE=$(date +%Y%m%d_%H%M%S)

# 加载环境变量
if [ -f "$DOCKER_DIR/.env" ]; then
    export $(grep -v '^#' "$DOCKER_DIR/.env" | grep -v '^$' | xargs)
fi

# 默认值
POSTGRES_USER=${POSTGRES_USER:-postgres}
POSTGRES_PASSWORD=${POSTGRES_PASSWORD:-postgres}
POSTGRES_DB=${POSTGRES_DB:-opc_platform}
DIFY_DB_PASSWORD=${DIFY_DB_PASSWORD:-difyai123456}
DIFY_DB_DATABASE=${DIFY_DB_DATABASE:-dify}

# 打印消息函数
print_info() { echo -e "${BLUE}[INFO]${NC} $1"; }
print_success() { echo -e "${GREEN}[SUCCESS]${NC} $1"; }
print_warning() { echo -e "${YELLOW}[WARNING]${NC} $1"; }
print_error() { echo -e "${RED}[ERROR]${NC} $1"; }

# 创建备份目录
mkdir -p "$BACKUP_DIR"

# ============================================================
# 备份函数
# ============================================================

# 备份主数据库
backup_main_db() {
    local backup_file="$BACKUP_DIR/opc_main_${BACKUP_DATE}.sql.gz"

    print_info "正在备份主数据库 ($POSTGRES_DB)..."

    docker exec opc-postgres pg_dump \
        -U "$POSTGRES_USER" \
        -d "$POSTGRES_DB" \
        --clean \
        --if-exists \
        --no-owner \
        --no-privileges \
        2>/dev/null | gzip > "$backup_file"

    if [ -f "$backup_file" ]; then
        local size=$(du -h "$backup_file" | cut -f1)
        print_success "主数据库备份完成: $backup_file ($size)"
    else
        print_error "主数据库备份失败"
        return 1
    fi
}

# 备份Dify数据库
backup_dify_db() {
    local backup_file="$BACKUP_DIR/dify_${BACKUP_DATE}.sql.gz"

    print_info "正在备份 Dify 数据库 ($DIFY_DB_DATABASE)..."

    docker exec opc-dify-db pg_dump \
        -U postgres \
        -d "$DIFY_DB_DATABASE" \
        --clean \
        --if-exists \
        --no-owner \
        --no-privileges \
        2>/dev/null | gzip > "$backup_file"

    if [ -f "$backup_file" ]; then
        local size=$(du -h "$backup_file" | cut -f1)
        print_success "Dify 数据库备份完成: $backup_file ($size)"
    else
        print_error "Dify 数据库备份失败"
        return 1
    fi
}

# 备份Redis数据
backup_redis() {
    local backup_file="$BACKUP_DIR/redis_${BACKUP_DATE}.rdb"

    print_info "正在备份 Redis 数据..."

    # 触发Redis保存
    docker exec opc-redis redis-cli -a "$REDIS_PASSWORD" BGSAVE 2>/dev/null || true
    sleep 3

    # 从容器中复制RDB文件
    docker cp opc-redis:/data/dump.rdb "$backup_file" 2>/dev/null || {
        print_warning "Redis RDB 文件不存在，跳过备份"
        return 0
    }

    if [ -f "$backup_file" ]; then
        local size=$(du -h "$backup_file" | cut -f1)
        print_success "Redis 数据备份完成: $backup_file ($size)"
    fi
}

# ============================================================
# 恢复函数
# ============================================================

restore_backup() {
    local backup_file="$1"

    if [ ! -f "$backup_file" ]; then
        print_error "备份文件不存在: $backup_file"
        exit 1
    fi

    print_warning "即将从备份文件恢复数据库: $backup_file"
    print_warning "此操作将覆盖现有数据，请确认！"
    read -p "确认恢复？(输入 yes 确认): " confirm

    if [ "$confirm" != "yes" ]; then
        print_info "恢复操作已取消"
        exit 0
    fi

    # 判断备份类型
    if echo "$backup_file" | grep -q "opc_main"; then
        print_info "恢复主数据库..."
        gunzip -c "$backup_file" | docker exec -i opc-postgres psql \
            -U "$POSTGRES_USER" \
            -d "$POSTGRES_DB" \
            2>/dev/null
        print_success "主数据库恢复完成"
    elif echo "$backup_file" | grep -q "dify"; then
        print_info "恢复 Dify 数据库..."
        gunzip -c "$backup_file" | docker exec -i opc-dify-db psql \
            -U postgres \
            -d "$DIFY_DB_DATABASE" \
            2>/dev/null
        print_success "Dify 数据库恢复完成"
    else
        print_error "无法识别备份文件类型"
        exit 1
    fi
}

# ============================================================
# 清理旧备份
# ============================================================
cleanup_old_backups() {
    local keep_days=${BACKUP_KEEP_DAYS:-30}
    local count

    count=$(find "$BACKUP_DIR" -name "*.sql.gz" -mtime +$keep_days 2>/dev/null | wc -l)

    if [ "$count" -gt 0 ]; then
        print_info "清理 ${keep_days} 天前的旧备份（共 ${count} 个文件）..."
        find "$BACKUP_DIR" -name "*.sql.gz" -mtime +$keep_days -delete
        print_success "旧备份清理完成"
    fi
}

# ============================================================
# 主逻辑
# ============================================================

case "${1:-}" in
    --main)
        # 仅备份主数据库
        backup_main_db
        ;;
    --dify)
        # 仅备份Dify数据库
        backup_dify_db
        ;;
    --redis)
        # 仅备份Redis
        backup_redis
        ;;
    --restore)
        # 恢复备份
        if [ -z "${2:-}" ]; then
            print_error "请指定备份文件路径"
            echo "用法: $0 --restore <backup_file>"
            exit 1
        fi
        restore_backup "$2"
        ;;
    --list)
        # 列出所有备份
        echo "可用备份文件:"
        ls -lh "$BACKUP_DIR"/*.sql.gz 2>/dev/null || echo "  无备份文件"
        ;;
    --cleanup)
        # 清理旧备份
        cleanup_old_backups
        ;;
    *)
        # 备份所有数据库
        echo "============================================================"
        echo "  OPC智能体平台 - 数据库备份"
        echo "  备份时间: $(date '+%Y-%m-%d %H:%M:%S')"
        echo "  备份目录: $BACKUP_DIR"
        echo "============================================================"
        echo ""

        backup_main_db
        backup_dify_db
        backup_redis
        cleanup_old_backups

        echo ""
        print_success "所有数据库备份完成！"
        echo ""
        echo "备份文件列表:"
        ls -lh "$BACKUP_DIR"/*.sql.gz 2>/dev/null || echo "  无备份文件"
        echo ""
        echo "恢复命令: $0 --restore <backup_file>"
        ;;
esac
