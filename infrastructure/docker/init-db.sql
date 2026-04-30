-- ============================================================
-- OPC智能体平台 - PostgreSQL 数据库初始化脚本
-- ============================================================
-- 此脚本在 PostgreSQL 容器首次启动时自动执行
-- 基于 packages/shared-types/src/index.ts 中的类型定义
-- ============================================================

-- 启用必要的扩展
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";     -- UUID 生成
CREATE EXTENSION IF NOT EXISTS "pgvector";       -- 向量搜索支持
CREATE EXTENSION IF NOT EXISTS "pg_trgm";        -- 模糊搜索支持
CREATE EXTENSION IF NOT EXISTS "btree_gin";      -- GIN 索引支持

-- ============================================================
-- 用户表
-- ============================================================
CREATE TABLE IF NOT EXISTS users (
    id              BIGSERIAL PRIMARY KEY,
    username        VARCHAR(50)  NOT NULL UNIQUE,
    email           VARCHAR(100) NOT NULL UNIQUE,
    password        VARCHAR(255) NOT NULL,
    phone           VARCHAR(20),
    avatar          VARCHAR(500),
    bio             VARCHAR(200),
    role            VARCHAR(20)  NOT NULL DEFAULT 'user'
                    CHECK (role IN ('admin', 'user', 'creator', 'super_admin')),
    status          VARCHAR(20)  NOT NULL DEFAULT 'active'
                    CHECK (status IN ('active', 'inactive', 'banned', 'pending_verification', 'disabled', 'deleted')),
    email_verified  BOOLEAN      NOT NULL DEFAULT FALSE,
    phone_verified  BOOLEAN      NOT NULL DEFAULT FALSE,
    last_login_ip   VARCHAR(100),
    last_login_at   TIMESTAMP,
    created_at      TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted_at      TIMESTAMP
);

-- 用户表索引
CREATE INDEX IF NOT EXISTS idx_users_username ON users (username);
CREATE INDEX IF NOT EXISTS idx_users_email ON users (email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users (role);
CREATE INDEX IF NOT EXISTS idx_users_status ON users (status);
CREATE INDEX IF NOT EXISTS idx_users_created_at ON users (created_at);

-- 用户表注释
COMMENT ON TABLE users IS '用户表';
COMMENT ON COLUMN users.id IS '用户ID';
COMMENT ON COLUMN users.username IS '用户名';
COMMENT ON COLUMN users.email IS '邮箱';
COMMENT ON COLUMN users.password IS '密码（加密存储）';
COMMENT ON COLUMN users.role IS '用户角色: admin, user, creator, super_admin';
COMMENT ON COLUMN users.status IS '用户状态: active, inactive, banned, pending_verification';
COMMENT ON COLUMN users.deleted_at IS '软删除时间';

-- ============================================================
-- 用户资料表
-- ============================================================
CREATE TABLE IF NOT EXISTS user_profiles (
    user_id         BIGINT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    nickname        VARCHAR(50)  NOT NULL DEFAULT '',
    bio             TEXT,
    website         VARCHAR(500),
    location        VARCHAR(100),
    gender          VARCHAR(10)  NOT NULL DEFAULT 'unknown'
                    CHECK (gender IN ('male', 'female', 'other', 'unknown')),
    birthday        DATE,
    social_links    JSONB        NOT NULL DEFAULT '{}',
    tags            TEXT[]       NOT NULL DEFAULT '{}',
    created_at      TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP
);

COMMENT ON TABLE user_profiles IS '用户详细资料表';
COMMENT ON COLUMN user_profiles.social_links IS '社交媒体链接（JSON格式）';
COMMENT ON COLUMN user_profiles.tags IS '自定义标签';

-- ============================================================
-- OPC智能体/角色配置表
-- ============================================================
CREATE TABLE IF NOT EXISTS opc_profiles (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id         BIGINT       NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name            VARCHAR(100) NOT NULL,
    description     TEXT         NOT NULL DEFAULT '',
    type            VARCHAR(20)  NOT NULL DEFAULT 'assistant'
                    CHECK (type IN ('assistant', 'creative', 'analytical', 'social', 'commercial')),
    status          VARCHAR(20)  NOT NULL DEFAULT 'draft'
                    CHECK (status IN ('draft', 'active', 'inactive', 'archived')),
    avatar          VARCHAR(500),
    config          JSONB        NOT NULL DEFAULT '{}',
    capabilities    TEXT[]       NOT NULL DEFAULT '{}',
    is_public       BOOLEAN      NOT NULL DEFAULT FALSE,
    usage_count     INTEGER      NOT NULL DEFAULT 0,
    created_at      TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_opc_profiles_user_id ON opc_profiles (user_id);
CREATE INDEX IF NOT EXISTS idx_opc_profiles_type ON opc_profiles (type);
CREATE INDEX IF NOT EXISTS idx_opc_profiles_status ON opc_profiles (status);
CREATE INDEX IF NOT EXISTS idx_opc_profiles_is_public ON opc_profiles (is_public);
CREATE INDEX IF NOT EXISTS idx_opc_profiles_usage_count ON opc_profiles (usage_count DESC);
CREATE INDEX IF NOT EXISTS idx_opc_profiles_capabilities ON opc_profiles USING GIN (capabilities);

COMMENT ON TABLE opc_profiles IS 'OPC智能体/角色配置表';
COMMENT ON COLUMN opc_profiles.config IS '智能体配置（JSON格式，包含模型、温度等参数）';
COMMENT ON COLUMN opc_profiles.capabilities IS '智能体能力标签';

-- ============================================================
-- 对话表
-- ============================================================
CREATE TABLE IF NOT EXISTS conversations (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    participant_ids BIGINT[]     NOT NULL,
    agent_id        UUID         REFERENCES opc_profiles(id) ON DELETE SET NULL,
    title           VARCHAR(200) NOT NULL DEFAULT '',
    type            VARCHAR(20)  NOT NULL DEFAULT 'private'
                    CHECK (type IN ('private', 'group', 'agent')),
    status          VARCHAR(20)  NOT NULL DEFAULT 'active'
                    CHECK (status IN ('active', 'archived', 'deleted')),
    unread_count    JSONB        NOT NULL DEFAULT '{}',
    created_at      TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_conversations_participant_ids ON conversations USING GIN (participant_ids);
CREATE INDEX IF NOT EXISTS idx_conversations_agent_id ON conversations (agent_id);
CREATE INDEX IF NOT EXISTS idx_conversations_type ON conversations (type);
CREATE INDEX IF NOT EXISTS idx_conversations_status ON conversations (status);
CREATE INDEX IF NOT EXISTS idx_conversations_updated_at ON conversations (updated_at DESC);

COMMENT ON TABLE conversations IS '对话表';
COMMENT ON COLUMN conversations.participant_ids IS '参与用户ID列表';
COMMENT ON COLUMN conversations.unread_count IS '未读消息数（按用户ID索引，JSON格式）';

-- ============================================================
-- 消息表
-- ============================================================
CREATE TABLE IF NOT EXISTS messages (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    conversation_id UUID         NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
    sender_id       BIGINT       REFERENCES users(id) ON DELETE SET NULL,
    agent_id        UUID         REFERENCES opc_profiles(id) ON DELETE SET NULL,
    role            VARCHAR(20)  NOT NULL DEFAULT 'user'
                    CHECK (role IN ('user', 'assistant', 'system')),
    type            VARCHAR(20)  NOT NULL DEFAULT 'text'
                    CHECK (type IN ('text', 'image', 'file', 'audio', 'video', 'system')),
    content         TEXT         NOT NULL DEFAULT '',
    attachments     JSONB        NOT NULL DEFAULT '[]',
    status          VARCHAR(20)  NOT NULL DEFAULT 'sent'
                    CHECK (status IN ('sending', 'sent', 'delivered', 'read', 'failed')),
    reply_to_id     UUID         REFERENCES messages(id) ON DELETE SET NULL,
    token_usage     JSONB,
    embedding       vector(1536),
    created_at      TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_messages_conversation_id ON messages (conversation_id);
CREATE INDEX IF NOT EXISTS idx_messages_sender_id ON messages (sender_id);
CREATE INDEX IF NOT EXISTS idx_messages_agent_id ON messages (agent_id);
CREATE INDEX IF NOT EXISTS idx_messages_role ON messages (role);
CREATE INDEX IF NOT EXISTS idx_messages_type ON messages (type);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON messages (created_at DESC);
-- 向量搜索索引（HNSW算法，适合高维向量）
CREATE INDEX IF NOT EXISTS idx_messages_embedding ON messages USING hnsw (embedding vector_cosine_ops);

COMMENT ON TABLE messages IS '消息表';
COMMENT ON COLUMN messages.attachments IS '附件列表（JSON格式）';
COMMENT ON COLUMN messages.token_usage IS 'Token使用统计（JSON格式）';
COMMENT ON COLUMN messages.embedding IS '消息向量嵌入（用于语义搜索）';

-- ============================================================
-- 帖子表
-- ============================================================
CREATE TABLE IF NOT EXISTS posts (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    author_id       BIGINT       NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title           VARCHAR(200) NOT NULL,
    content         TEXT         NOT NULL DEFAULT '',
    excerpt         VARCHAR(500),
    cover_image     VARCHAR(500),
    tags            TEXT[]       NOT NULL DEFAULT '{}',
    category_id     UUID,
    status          VARCHAR(20)  NOT NULL DEFAULT 'draft'
                    CHECK (status IN ('draft', 'published', 'archived', 'deleted')),
    view_count      INTEGER      NOT NULL DEFAULT 0,
    like_count      INTEGER      NOT NULL DEFAULT 0,
    comment_count   INTEGER      NOT NULL DEFAULT 0,
    bookmark_count  INTEGER      NOT NULL DEFAULT 0,
    is_pinned       BOOLEAN      NOT NULL DEFAULT FALSE,
    is_featured     BOOLEAN      NOT NULL DEFAULT FALSE,
    agent_id        UUID         REFERENCES opc_profiles(id) ON DELETE SET NULL,
    published_at    TIMESTAMP,
    created_at      TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_posts_author_id ON posts (author_id);
CREATE INDEX IF NOT EXISTS idx_posts_status ON posts (status);
CREATE INDEX IF NOT EXISTS idx_posts_tags ON posts USING GIN (tags);
CREATE INDEX IF NOT EXISTS idx_posts_category_id ON posts (category_id);
CREATE INDEX IF NOT EXISTS idx_posts_view_count ON posts (view_count DESC);
CREATE INDEX IF NOT EXISTS idx_posts_like_count ON posts (like_count DESC);
CREATE INDEX IF NOT EXISTS idx_posts_created_at ON posts (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_posts_published_at ON posts (published_at DESC);
-- 全文搜索索引
CREATE INDEX IF NOT EXISTS idx_posts_content_trgm ON posts USING GIN (content gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_posts_title_trgm ON posts USING GIN (title gin_trgm_ops);

COMMENT ON TABLE posts IS '帖子表';

-- ============================================================
-- 评论表
-- ============================================================
CREATE TABLE IF NOT EXISTS comments (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    post_id         UUID         NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
    author_id       BIGINT       NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    parent_id       UUID         REFERENCES comments(id) ON DELETE CASCADE,
    reply_to_user_id BIGINT      REFERENCES users(id) ON DELETE SET NULL,
    content         TEXT         NOT NULL,
    like_count      INTEGER      NOT NULL DEFAULT 0,
    reply_count     INTEGER      NOT NULL DEFAULT 0,
    status          VARCHAR(20)  NOT NULL DEFAULT 'published'
                    CHECK (status IN ('draft', 'published', 'archived', 'deleted')),
    created_at      TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_comments_post_id ON comments (post_id);
CREATE INDEX IF NOT EXISTS idx_comments_author_id ON comments (author_id);
CREATE INDEX IF NOT EXISTS idx_comments_parent_id ON comments (parent_id);
CREATE INDEX IF NOT EXISTS idx_comments_created_at ON comments (created_at DESC);

COMMENT ON TABLE comments IS '评论表';

-- ============================================================
-- 商品分类表
-- ============================================================
CREATE TABLE IF NOT EXISTS categories (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name            VARCHAR(100) NOT NULL,
    description     TEXT         NOT NULL DEFAULT '',
    parent_id       UUID         REFERENCES categories(id) ON DELETE SET NULL,
    sort_order      INTEGER      NOT NULL DEFAULT 0,
    is_active       BOOLEAN      NOT NULL DEFAULT TRUE,
    created_at      TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_categories_parent_id ON categories (parent_id);
CREATE INDEX IF NOT EXISTS idx_categories_sort_order ON categories (sort_order);

COMMENT ON TABLE categories IS '分类表（帖子/商品共用）';

-- ============================================================
-- 商品表
-- ============================================================
CREATE TABLE IF NOT EXISTS products (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    seller_id       BIGINT       NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name            VARCHAR(200) NOT NULL,
    description     TEXT         NOT NULL DEFAULT '',
    detail          TEXT,
    type            VARCHAR(20)  NOT NULL DEFAULT 'digital'
                    CHECK (type IN ('digital', 'physical', 'service', 'subscription')),
    status          VARCHAR(20)  NOT NULL DEFAULT 'draft'
                    CHECK (status IN ('draft', 'active', 'inactive', 'out_of_stock', 'archived')),
    price           INTEGER      NOT NULL DEFAULT 0,
    original_price  INTEGER,
    stock           INTEGER      NOT NULL DEFAULT 0,
    sales_count     INTEGER      NOT NULL DEFAULT 0,
    images          TEXT[]       NOT NULL DEFAULT '{}',
    cover_image     VARCHAR(500),
    category_id     UUID         REFERENCES categories(id) ON DELETE SET NULL,
    tags            TEXT[]       NOT NULL DEFAULT '{}',
    specifications  JSONB        NOT NULL DEFAULT '[]',
    rating          NUMERIC(2,1) NOT NULL DEFAULT 0.0 CHECK (rating >= 0 AND rating <= 5),
    review_count    INTEGER      NOT NULL DEFAULT 0,
    created_at      TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_products_seller_id ON products (seller_id);
CREATE INDEX IF NOT EXISTS idx_products_type ON products (type);
CREATE INDEX IF NOT EXISTS idx_products_status ON products (status);
CREATE INDEX IF NOT EXISTS idx_products_category_id ON products (category_id);
CREATE INDEX IF NOT EXISTS idx_products_price ON products (price);
CREATE INDEX IF NOT EXISTS idx_products_sales_count ON products (sales_count DESC);
CREATE INDEX IF NOT EXISTS idx_products_rating ON products (rating DESC);
CREATE INDEX IF NOT EXISTS idx_products_tags ON products USING GIN (tags);
CREATE INDEX IF NOT EXISTS idx_products_created_at ON products (created_at DESC);

COMMENT ON TABLE products IS '商品表';
COMMENT ON COLUMN products.price IS '价格（单位：分）';
COMMENT ON COLUMN products.specifications IS '商品规格（JSON格式）';

-- ============================================================
-- 商品SKU表
-- ============================================================
CREATE TABLE IF NOT EXISTS product_skus (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id      UUID         NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    sku             VARCHAR(100) NOT NULL,
    attributes      JSONB        NOT NULL DEFAULT '{}',
    price           INTEGER      NOT NULL DEFAULT 0,
    stock           INTEGER      NOT NULL DEFAULT 0,
    created_at      TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (product_id, sku)
);

CREATE INDEX IF NOT EXISTS idx_product_skus_product_id ON product_skus (product_id);

COMMENT ON TABLE product_skus IS '商品SKU表';
COMMENT ON COLUMN product_skus.attributes IS '规格组合（JSON格式，如 {"颜色": "红色", "尺寸": "XL"}）';

-- ============================================================
-- 订单表
-- ============================================================
CREATE TABLE IF NOT EXISTS orders (
    id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_no            VARCHAR(32)  NOT NULL UNIQUE,
    buyer_id            BIGINT       NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    seller_id           BIGINT       NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    status              VARCHAR(20)  NOT NULL DEFAULT 'pending'
                        CHECK (status IN ('pending', 'paid', 'processing', 'shipped', 'delivered', 'completed', 'cancelled', 'refunded')),
    total_amount        INTEGER      NOT NULL DEFAULT 0,
    shipping_fee        INTEGER      NOT NULL DEFAULT 0,
    discount_amount     INTEGER      NOT NULL DEFAULT 0,
    paid_amount         INTEGER      NOT NULL DEFAULT 0,
    payment_method      VARCHAR(20)
                        CHECK (payment_method IN ('alipay', 'wechat', 'credit_card', 'bank_transfer')),
    paid_at             TIMESTAMP,
    shipped_at          TIMESTAMP,
    delivered_at        TIMESTAMP,
    shipping_address    JSONB,
    buyer_note          TEXT,
    seller_note         TEXT,
    created_at          TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at          TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_orders_order_no ON orders (order_no);
CREATE INDEX IF NOT EXISTS idx_orders_buyer_id ON orders (buyer_id);
CREATE INDEX IF NOT EXISTS idx_orders_seller_id ON orders (seller_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders (status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders (created_at DESC);

COMMENT ON TABLE orders IS '订单表';
COMMENT ON COLUMN orders.total_amount IS '商品总金额（单位：分）';
COMMENT ON COLUMN orders.shipping_fee IS '运费（单位：分）';
COMMENT ON COLUMN orders.paid_amount IS '实付金额（单位：分）';

-- ============================================================
-- 订单商品项表
-- ============================================================
CREATE TABLE IF NOT EXISTS order_items (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id        UUID         NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    product_id      UUID         NOT NULL REFERENCES products(id),
    product_name    VARCHAR(200) NOT NULL,
    product_image   VARCHAR(500),
    sku_id          UUID         REFERENCES product_skus(id),
    sku_attributes  JSONB,
    unit_price      INTEGER      NOT NULL DEFAULT 0,
    quantity        INTEGER      NOT NULL DEFAULT 1,
    subtotal        INTEGER      NOT NULL DEFAULT 0,
    created_at      TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items (order_id);
CREATE INDEX IF NOT EXISTS idx_order_items_product_id ON order_items (product_id);

COMMENT ON TABLE order_items IS '订单商品项表';
COMMENT ON COLUMN order_items.unit_price IS '单价（单位：分）';
COMMENT ON COLUMN order_items.sku_attributes IS 'SKU属性快照（JSON格式）';

-- ============================================================
-- 圈子/社区表
-- ============================================================
CREATE TABLE IF NOT EXISTS circles (
    id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name                VARCHAR(100) NOT NULL,
    description         TEXT         NOT NULL DEFAULT '',
    avatar              VARCHAR(500),
    cover_image         VARCHAR(500),
    status              VARCHAR(20)  NOT NULL DEFAULT 'active'
                        CHECK (status IN ('active', 'inactive', 'archived')),
    owner_id            BIGINT       NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    member_count        INTEGER      NOT NULL DEFAULT 0,
    post_count          INTEGER      NOT NULL DEFAULT 0,
    tags                TEXT[]       NOT NULL DEFAULT '{}',
    rules               TEXT,
    is_public           BOOLEAN      NOT NULL DEFAULT TRUE,
    requires_approval   BOOLEAN      NOT NULL DEFAULT FALSE,
    created_at          TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at          TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_circles_owner_id ON circles (owner_id);
CREATE INDEX IF NOT EXISTS idx_circles_status ON circles (status);
CREATE INDEX IF NOT EXISTS idx_circles_is_public ON circles (is_public);
CREATE INDEX IF NOT EXISTS idx_circles_member_count ON circles (member_count DESC);
CREATE INDEX IF NOT EXISTS idx_circles_tags ON circles USING GIN (tags);

COMMENT ON TABLE circles IS '圈子/社区表';

-- ============================================================
-- 圈子成员表
-- ============================================================
CREATE TABLE IF NOT EXISTS circle_members (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    circle_id       UUID         NOT NULL REFERENCES circles(id) ON DELETE CASCADE,
    user_id         BIGINT       NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    role            VARCHAR(20)  NOT NULL DEFAULT 'member'
                    CHECK (role IN ('owner', 'admin', 'member')),
    joined_at       TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (circle_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_circle_members_circle_id ON circle_members (circle_id);
CREATE INDEX IF NOT EXISTS idx_circle_members_user_id ON circle_members (user_id);
CREATE INDEX IF NOT EXISTS idx_circle_members_role ON circle_members (role);

COMMENT ON TABLE circle_members IS '圈子成员表';

-- ============================================================
-- 通知表
-- ============================================================
CREATE TABLE IF NOT EXISTS notifications (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    recipient_id    BIGINT       NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    sender_id       BIGINT       REFERENCES users(id) ON DELETE SET NULL,
    type            VARCHAR(20)  NOT NULL
                    CHECK (type IN ('like', 'comment', 'reply', 'follow', 'mention', 'system', 'order', 'circle')),
    title           VARCHAR(200) NOT NULL DEFAULT '',
    content         TEXT         NOT NULL DEFAULT '',
    resource_type   VARCHAR(50),
    resource_id     UUID,
    status          VARCHAR(10)  NOT NULL DEFAULT 'unread'
                    CHECK (status IN ('unread', 'read')),
    created_at      TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    read_at         TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_notifications_recipient_id ON notifications (recipient_id);
CREATE INDEX IF NOT EXISTS idx_notifications_sender_id ON notifications (sender_id);
CREATE INDEX IF NOT EXISTS idx_notifications_type ON notifications (type);
CREATE INDEX IF NOT EXISTS idx_notifications_status ON notifications (status);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON notifications (created_at DESC);

COMMENT ON TABLE notifications IS '通知表';

-- ============================================================
-- 点赞表
-- ============================================================
CREATE TABLE IF NOT EXISTS likes (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id         BIGINT       NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    target_type     VARCHAR(20)  NOT NULL
                    CHECK (target_type IN ('post', 'comment', 'product')),
    target_id       UUID         NOT NULL,
    created_at      TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (user_id, target_type, target_id)
);

CREATE INDEX IF NOT EXISTS idx_likes_user_id ON likes (user_id);
CREATE INDEX IF NOT EXISTS idx_likes_target ON likes (target_type, target_id);

COMMENT ON TABLE likes IS '点赞表';

-- ============================================================
-- 收藏表
-- ============================================================
CREATE TABLE IF NOT EXISTS bookmarks (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id         BIGINT       NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    target_type     VARCHAR(20)  NOT NULL
                    CHECK (target_type IN ('post', 'product')),
    target_id       UUID         NOT NULL,
    created_at      TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (user_id, target_type, target_id)
);

CREATE INDEX IF NOT EXISTS idx_bookmarks_user_id ON bookmarks (user_id);
CREATE INDEX IF NOT EXISTS idx_bookmarks_target ON bookmarks (target_type, target_id);

COMMENT ON TABLE bookmarks IS '收藏表';

-- ============================================================
-- 关注表
-- ============================================================
CREATE TABLE IF NOT EXISTS follows (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    follower_id     BIGINT       NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    following_id    BIGINT       NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at      TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (follower_id, following_id)
);

CREATE INDEX IF NOT EXISTS idx_follows_follower_id ON follows (follower_id);
CREATE INDEX IF NOT EXISTS idx_follows_following_id ON follows (following_id);

COMMENT ON TABLE follows IS '关注表';

-- ============================================================
-- 文件上传记录表
-- ============================================================
CREATE TABLE IF NOT EXISTS file_uploads (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id         BIGINT       NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    filename        VARCHAR(255) NOT NULL,
    mime_type       VARCHAR(100) NOT NULL,
    size            BIGINT       NOT NULL DEFAULT 0,
    url             VARCHAR(1000) NOT NULL,
    thumbnail_url   VARCHAR(1000),
    storage_type    VARCHAR(20)  NOT NULL DEFAULT 'local'
                    CHECK (storage_type IN ('local', 's3', 'minio')),
    storage_key     VARCHAR(500),
    bucket          VARCHAR(100),
    created_at      TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_file_uploads_user_id ON file_uploads (user_id);
CREATE INDEX IF NOT EXISTS idx_file_uploads_mime_type ON file_uploads (mime_type);

COMMENT ON TABLE file_uploads IS '文件上传记录表';

-- ============================================================
-- 更新时间自动触发器
-- ============================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 为所有包含 updated_at 字段的表创建触发器
DO $$
DECLARE
    table_name TEXT;
BEGIN
    FOR table_name IN SELECT tablename FROM pg_tables WHERE schemaname = 'public'
    LOOP
        IF EXISTS (
            SELECT 1 FROM information_schema.columns
            WHERE table_schema = 'public'
            AND table_name = table_name
            AND column_name = 'updated_at'
        ) THEN
            EXECUTE format(
                'CREATE TRIGGER update_%I_updated_at
                    BEFORE UPDATE ON %I
                    FOR EACH ROW
                    EXECUTE FUNCTION update_updated_at_column();',
                table_name, table_name
            );
        END IF;
    END LOOP;
END;
$$;

-- ============================================================
-- 初始数据
-- ============================================================

-- 插入默认管理员用户（密码: admin123，仅用于开发环境）
INSERT INTO users (username, email, password, role, status, email_verified)
VALUES (
    'admin',
    'admin@opc-platform.com',
    '$2b$10$K7L1OJ45/4Y2nIvhRVpCe.FSmhDdWoXehVzJptJ/op0lSsvqNu6GK',
    'super_admin',
    'active',
    TRUE
) ON CONFLICT (username) DO NOTHING;
