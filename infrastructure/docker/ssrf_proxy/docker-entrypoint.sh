#!/bin/bash
# ============================================================
# Dify SSRF 代理 - Docker 入口脚本
# 参考: https://github.com/langgenius/dify/tree/main/docker/ssrf_proxy
# ============================================================

set -e

# 使用 envsubst 替换模板中的环境变量
envsubst < /etc/squid/squid.conf.template > /etc/squid/squid.conf

# 初始化缓存目录并设置权限
if [ ! -d /var/spool/squid ]; then
    mkdir -p /var/spool/squid
fi
chown -R squid:squid /var/spool/squid
chmod -R 755 /var/spool/squid

# 初始化 Squid
squid -z 2>/dev/null || true

# 启动 Squid（前台运行）
exec squid -N -f /etc/squid/squid.conf
